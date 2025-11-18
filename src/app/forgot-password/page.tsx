'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen glass-card   from-gray-50 to-avb-green/5 py-12">
        <div className="container mx-auto px-4 ">
          <div className="max-w-md mx-auto card p-8 gradient-bg  rounded-2xl shadow-2xl border border-gray-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-black mb-2">Recuperar Senha</h2>
              <p className="text-black">Digite seu email para redefinir sua senha</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black mb-2"> 
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-with-label  relative border-2 border-gray-500 px-4 py-3 rounded-xl  text-black hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg block text-center hover:text-white "
                  placeholder="seu@email.com"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-500  border-2 px-4 py-3 rounded-lg input-with-label  relative border-2 border-gray-500 px-4 py-3 rounded-xl  text-black hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg block text-center hover:text-white"
              >
                {loading ? (
                  <span className="flex items-center justify-center ">
                    <i className="fas fa-spinner fa-spin mr-2 "></i>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Instruções'
                )}
              </button>

              <div className="text-center">
                <a 
                  href="/login" 
                  className="text-black hover:text-white font-semibold transition-colors text-sm"
                >
                  ← Voltar para o login
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}