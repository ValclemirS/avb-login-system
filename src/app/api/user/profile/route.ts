import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/auth';


// Rota GET que retorna os dados do usuário logado (perfil)
export async function GET(request: NextRequest) {
  try {
    // Extrai o token do header "Authorization"
    // Ex: "Bearer 123456" -> pega só "123456"
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    //console.log('🔐 Token recebido no profile:', token ? 'SIM' : 'NÃO'); // DEBUG
    
    // Se não houver token, o usuário não está autenticado
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 } // 401 = não autorizado
      );
    }

    // Valida e decodifica o token JWT
    const decoded = verifyToken(token);
    //console.log('🔓 Token decodificado:', decoded); // DEBUG
    
    // Se o token for inválido ou expirado
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 }
      );
    }

    // Conecta ao MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Acessa a collection "users"
    const usersCollection = db.collection('users');

    // Busca o usuário pelo email presente no token
    // "projection" remove o campo password do resultado
    const user = await usersCollection.findOne(
      { email: decoded.email },
      { projection: { password: 0 } }
    );

    //console.log('👤 Usuário encontrado no DB:', user ? 'SIM' : 'NÃO'); // DEBUG

    // Se o usuário não existe no banco
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 } // 404 = não encontrado
      );
    }

    // Retorna os dados do usuário logado
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    // Captura erros inesperados
    //console.error('❌ Erro ao buscar perfil:', error);

    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 } // 500 = falha no servidor
    );
  }
}
