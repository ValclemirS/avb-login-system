import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { rateLimit, resetAttempts } from '../../../../lib/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET || 'teste' ;

// Delay artificial para dificultar força bruta
const artificialDelay = () => new Promise(resolve => 
  setTimeout(resolve, 500 + Math.random() * 1000)
);

export async function POST(request: NextRequest) {
  try {
    // Aplicar rate limiting
    const limitResult = rateLimit(request);
    if (!limitResult.allowed) {
      await artificialDelay(); // Delay mesmo para requisições bloqueadas
      return NextResponse.json(
        { 
          success: false, 
          message: 'Muitas tentativas de login. Tente novamente mais tarde.' 
        },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Validações básicas
    if (!email || !password) {
      await artificialDelay();
      return NextResponse.json(
        { success: false, message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    const normalizedEmail = email.toLowerCase();
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await artificialDelay();
      return NextResponse.json(
        { success: false, message: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Conectar ao banco
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Buscar usuário
    const user = await usersCollection.findOne({ email });

    // SEMPRE aplicar delay, mesmo se usuário não existir
    await artificialDelay();

    if (!user) {
      // Não revelar que o usuário não existe
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar se a conta está bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { 
          success: false, 
          message: `Conta temporariamente bloqueada. Tente novamente em ${remainingTime} minutos.` 
        },
        { status: 423 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Registrar tentativa falha
      await usersCollection.updateOne(
        { email },
        { 
          $inc: { failedAttempts: 1 },
          $set: { lastFailedAttempt: new Date() }
        }
      );

      // Bloquear conta após 5 tentativas falhas
      const updatedUser = await usersCollection.findOne({ email });
      if (updatedUser && updatedUser.failedAttempts >= 5) {
        const lockDuration = 30 * 60 * 1000; // 30 minutos
        await usersCollection.updateOne(
          { email },
          { 
            $set: { 
              lockedUntil: new Date(Date.now() + lockDuration),
              failedAttempts: 0 
            }
          }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Login bem-sucedido - resetar contadores
    await usersCollection.updateOne(
      { email },
      { 
        $set: { 
          failedAttempts: 0,
          lockedUntil: null,
          lastLogin: new Date()
        }
      }
    );

    // Resetar rate limiting do IP
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    resetAttempts(clientIP);

    // Gerar token
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no login:', error);
    await artificialDelay(); // Delay mesmo em caso de erro
    
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
