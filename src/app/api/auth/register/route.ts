import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';


// Função que será executada quando a rota receber um POST
export async function POST(request: NextRequest) {
  try {
    // Recebe os dados enviados pelo Front-end
    const { email, password, name } = await request.json();

    // Validação: campos obrigatórios
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Todos os campos são obrigatórios' },
        { status: 400 } // 400 = erro de requisição inválida
      );
    }

    // Validação: senha mínima de segurança
   
    if (password.length < 6) { //  mínimo 6 caracteres
      return NextResponse.json(
        { success: false, message: `A senha deve ter pelo menos 6 caracteres` },
        { status: 400 }
      );
    }

    // Conecta no banco de dados
    const client = await clientPromise;
    const db = client.db();

    // Acessa a collection (tabela) "users"
    const usersCollection = db.collection('users');

    // Verifica se já existe um usuário com o mesmo e-mail
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'E-mail já cadastrado' },
        { status: 409 } // 409 = conflito (já existe registro)
      );
    }

    // Criptografa a senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria o objeto do novo usuário
    const newUser = {
      email,
      password: hashedPassword, // nunca salvar senha pura e sim o  hash de segurança
      name,
      createdAt: new Date(), // data do cadastro
    };

    // Insere o usuário no MongoDB
    await usersCollection.insertOne(newUser);

    // Retorna mensagem de sucesso
    return NextResponse.json({
      success: true,
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    // Tratamento de erro geral
    console.error('Erro no registro:', error);

    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 } // 500 = erro no servidor
    );
  }
}
