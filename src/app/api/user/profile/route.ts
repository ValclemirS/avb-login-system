import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/auth';


export async function GET(request: NextRequest) {
  try {

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 } // 401 = não autorizado
      );
    }

    // Valida e decodifica o token JWT
    const decoded = verifyToken(token);

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
    const user = await usersCollection.findOne(
      { email: decoded.email },
      { projection: { password: 0 } }
    );

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
    //console.error(' Erro ao buscar perfil:', error);

    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
