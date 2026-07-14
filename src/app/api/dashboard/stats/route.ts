import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/auth';

/
export async function GET(request: NextRequest) {
  try {

    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    // Se não houver token → acesso negado
    if (!token)
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 }
      );
  }

    // Valida o token
    const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { success: false, message: 'Token inválido' },
      { status: 401 }
    );
  }

  // Conexão com o MongoDB
  const client = await clientPromise;
  const db = client.db();
  const usersCollection = db.collection('users');

  const totalUsers = await usersCollection.countDocuments();

  const lastUser = await usersCollection
    .find({})
    .sort({ createdAt: -1 }) // mais recente primeiro
    .limit(1)
    .project({ name: 1, email: 1, createdAt: 1 }) // só os campos necessários
    .toArray();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);


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

  const monthlyData = usersByMonth.map(item => ({
    month: `${item._id.month.toString().padStart(2, '0')}/${item._id.year}`,
    usuarios: item.count
  }));

  const responseData = {
    totalUsers,
    lastUser: lastUser[0] || null,
    monthlyRegistrations: monthlyData
  };


  return NextResponse.json({
    success: true,
    data: responseData
  });

} catch (error) {
  console.error(' Erro ao buscar estatísticas:', error);

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
