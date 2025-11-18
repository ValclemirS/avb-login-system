import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/auth';

/**
 * Rota GET para buscar estatísticas do sistema.
 * - Valida token
 * - Busca total de usuários
 * - Busca último usuário registrado
 * - Busca cadastros por mês (últimos 6 meses)
 */
export async function GET(request: NextRequest) {
  try {
    ////console.log('📊 Iniciando busca de estatísticas...');
    
    // Extrai o token do header "Authorization: Bearer token"
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Se não houver token → acesso negado
    if (!token) {
      ////console.log('❌ Token não fornecido');
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 }
      );
    }

    // Valida o token
    const decoded = verifyToken(token);
    if (!decoded) {
      //console.log('❌ Token inválido');
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 }
      );
    }

    // Conexão com o MongoDB
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    //console.log('🔍 Buscando dados no MongoDB...');

    /**
     * 1) TOTAL DE USUÁRIOS
     */
    const totalUsers = await usersCollection.countDocuments();
    //console.log('👥 Total de usuários:', totalUsers);

    /**
     * 2) ÚLTIMO USUÁRIO CADASTRADO
     * - Ordena por createdAt desc
     * - Pega o primeiro
     */
    const lastUser = await usersCollection
      .find({})
      .sort({ createdAt: -1 }) // mais recente primeiro
      .limit(1)
      .project({ name: 1, email: 1, createdAt: 1 }) // só os campos necessários
      .toArray();

    //console.log('👤 Último usuário:', lastUser[0] || 'Nenhum');

    /**
     * 3) CADASTROS POR MÊS (últimos 6 meses)
     * Usa agregação:
     * - Filtra documentos >= seis meses atrás
     * - Agrupa por ano/mês
     * - Conta
     */
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    //console.log('📅 Buscando dados dos últimos 6 meses...');

    const usersByMonth = await usersCollection.aggregate([
      {
        // Filtra usuários criados nos últimos 6 meses
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        // Agrupa por ano e mês
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 } // conta quantos usuários naquele mês
        }
      },
      {
        // Ordena cronologicamente
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]).toArray();

    //console.log('📊 Dados agregados:', usersByMonth);

    /**
     * 4) Formatação dos dados para exibir no gráfico
     * Ex: { month: "08/2024", usuarios: 12 }
     */
    const monthlyData = usersByMonth.map(item => ({
      month: `${item._id.month.toString().padStart(2, '0')}/${item._id.year}`,
      usuarios: item.count
    }));

    //console.log('📈 Dados formatados:', monthlyData);

    // Objeto final retornado
    const responseData = {
      totalUsers,
      lastUser: lastUser[0] || null,
      monthlyRegistrations: monthlyData
    };

    //console.log('✅ Dados finais:', responseData);

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);

    // Retorno seguro em caso de falha
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',

        // Retorna valores padrões para evitar quebra no front
        data: {
          totalUsers: 0,
          lastUser: null,
          monthlyRegistrations: []
        }
      },
      { status: 500 }
    );
  }
}
