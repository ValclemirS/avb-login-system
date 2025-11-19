import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import crypto from 'crypto';

/**
 * Rota POST para iniciar o fluxo de "Esqueci minha senha".
 * Essa rota:
 * 1. Recebe o email do usuário
 * 2. Gera um token único de recuperação
 * 3. Salva esse token no banco
 * 4. simula o envio de um e-mail
 */

 /*
    Função assíncrona que lida com requisições POST para o endpoint de esqueci minha senha.
    primeiro verifica se o email foi enviado no corpo da requisição.
  */
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

    /**
     *  VERIFICAR SE O USUÁRIO EXISTE
     */
    const user = await usersCollection.findOne({ email });

    /**
     * Por segurança:
     * Importante vamos dizer se o email existe ou não.
     * Assim, ninguém consegue testar emails e descobrir usuários do sistema.
     *  RESPOSTA PADRÃO (mesmo se o email não existir)
     * Objetivo: prevenir ataques de enumeração de email.
     */
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Instruções de redefinição de senha enviadas para seu email' // mensagem genérica
      });
    }

    /**
     *  GERAR TOKEN DE RESET 
     * crypto.randomBytes → cria bytes aleatórios de alta entropia
     * toString('hex') → transforma em texto
     */
    const resetToken = crypto.randomBytes(32).toString('hex');

    /**
     *  DEFINIR VALIDADE DO TOKEN
     * Aqui é definido para expirar em 1 hora
     */
    const resetTokenExpiry = new Date(Date.now() + 3600000); 

    /**
     *  SALVAR TOKEN NO BANCO
     * Agora o usuário terá:
     * resetPasswordToken: "xxxx"
     * resetPasswordExpires: data
     */
    await usersCollection.updateOne(
      { email },
      { 
        $set: { 
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry
        } 
      }
    );

    /**
     *  ENVIO do email com o token de reset
      * Por simplicidade, vamos apenas logar no console
     */
    console.log(`Token de reset para ${email}: ${resetToken}`);

    /**
     *  RESPOSTA PADRÃO (mesmo se o email não existir)
     * Isso impede ataques de enumeração de email.
     */
    return NextResponse.json({
      success: true,
      message: 'Instruções de redefinição de senha enviadas para seu email' // mensagem genérica 
    });

  } catch (error) {
    /**
     *  ERRO INTERNO DO SERVIDOR
     */
    console.error('Erro no forgot password:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
