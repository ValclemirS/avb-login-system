'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  month: string;
  usuarios: number;
}

interface DashboardChartProps {
  data: ChartData[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  // Proteger contra data undefined ou null
  const chartData = {
    labels: (data || []).map(item => item.month),
    datasets: [
      {
        label: 'Usuários Cadastrados',
        data: (data || []).map(item => item.usuarios),
        backgroundColor: 'rgba(91, 156, 114, 0.8)',
        borderColor: 'rgba(91, 156, 114, 1)',
        borderWidth: 1,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false ,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Se não houver dados, mostrar mensagem
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <i className="fas fa-chart-bar text-4xl mb-4"></i>
          <p>Nenhum dado disponível para o gráfico</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}