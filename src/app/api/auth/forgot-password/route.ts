import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import crypto from 'crypto';


export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Se o email não foi enviado → erro
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'E-mail é obrigatório' },
        { status: 400 }
      );
    }

    
    //CONECTAR AO MONGO
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Instruções de redefinição de senha enviadas para seu email' 
      });
    }

  
    const resetToken = crypto.randomBytes(32).toString('hex');

  
    const resetTokenExpiry = new Date(Date.now() + 3600000); 

    
    await usersCollection.updateOne(
      { email },
      { 
        $set: { 
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry
        } 
      }
    );

    
    console.log(`Token de reset para ${email}: ${resetToken}`);

    
    return NextResponse.json({
      success: true,
      message: 'Instruções de redefinição de senha enviadas para seu email' // mensagem genérica 
    });

  } catch (error) {
    
    console.error('Erro no forgot password:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
