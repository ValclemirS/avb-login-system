import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['cyrillic'], 
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'AVB - Aço Verde do Brasil',
  description: 'Sistema de autenticação AVB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
