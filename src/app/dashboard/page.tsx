'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DashboardChart from '../../components/dashboardChart';
import { User } from '../../types/index';
import { DashboardStats } from '../../types/index';


// COMPONENTE PRINCIPAL
export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const userResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!userResponse.ok) {
          throw new Error(`Erro HTTP: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        if (userData.success) {
          setUser(userData.user);
          const statsResponse = await fetch('/api/dashboard/stats', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.success) {
              setStats(statsData.data);
            } else {
              setStats({
                totalUsers: 1,
                lastUser: {
                  name: userData.user.name,

                  createdAt: new Date().toISOString()
                },
                monthlyRegistrations: [
                  { month: '01/2024', usuarios: 1 },
                  { month: '02/2024', usuarios: 0 },
                  { month: '03/2024', usuarios: 0 },
                  { month: '04/2024', usuarios: 0 },
                  { month: '05/2024', usuarios: 0 },
                  { month: '06/2024', usuarios: 1 }
                ]
              });
            }
          } else {
            setStats({
              totalUsers: 1,
              lastUser: {
                name: userData.user.name
                createdAt: new Date().toISOString()
              },
              monthlyRegistrations: [
                { month: '01/2024', usuarios: 1 },
                { month: '02/2024', usuarios: 0 },
                { month: '03/2024', usuarios: 0 },
                { month: '04/2024', usuarios: 0 },
                { month: '05/2024', usuarios: 0 },
                { month: '06/2024', usuarios: 1 }
              ]
            });
          }
        } else {
          throw new Error('Falha ao carregar perfil: ' + userData.message);
        }

      } catch (error) {
        console.error('❌ Erro de autenticação:', error);    
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setError('Sessão expirada. Faça login novamente.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-avb-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header do Dashboard */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-6 bg-white rounded-xl shadow-sm">
            <div>
              <h1 className="text-3xl font-bold text-gray-600 mb-2">
                Bem-vindo, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Painel administrativo - Aço Verde do Brasil
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 lg:mt-0 px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Sair
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total de Usuários */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-avb-green">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-3xl font-bold text-gray-600 mt-2">
                    {stats?.totalUsers || 0}
                  </p>
                </div>
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <img src="https://img.icons8.com/?size=50&id=38510&format=png" alt="Total Users" className="object-contain" />

                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <i className="fas fa-arrow-up mr-1"></i>
                <span>Crescimento contínuo</span>
              </div>
            </div>

            {/* Último Cadastro */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Último Cadastro</p>
                  <p className="text-lg font-semibold text-gray-600 mt-2 truncate">
                    {stats?.lastUser ? stats.lastUser.name : 'Nenhum'}
                  </p>
                  /
                </div>
                <div className="w-15 h-15 bg-white rounded-lg flex items-center justify-center">
                  <img src="https://img.icons8.com/?size=24&id=7847&format=png" alt="Last User" className="object-contain" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {stats?.lastUser ? formatDate(stats.lastUser.createdAt) : '-'}
              </div>
            </div>

            {/* Taxa de Crescimento */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cadastros/Mês</p>
                  <p className="text-3xl font-bold text-gray-600 mt-2">
                    {stats?.monthlyRegistrations && stats.monthlyRegistrations.length > 0
                      ? stats.monthlyRegistrations[stats.monthlyRegistrations.length - 1].usuarios
                      : 0
                    }
                  </p>
                </div>
                <div className="w-6 h-9 bg-white rounded-lg flex items-center justify-center">
                  <img src="https://img.icons8.com/?size=50&id=2957&format=png" alt="register" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <i className="fas fa-chart-bar mr-1"></i>
                <span>Evolução mensal</span>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-avb-dark">
                Cadastros por Mês
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <i className="fas fa-calendar"></i>
                <span>Últimos 6 meses</span>
              </div>
            </div>
            <DashboardChart data={stats?.monthlyRegistrations || []} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}