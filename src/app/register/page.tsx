'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/login?message=Conta criada com sucesso!');
      } else {
        setError(data.message);
      }
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen glass-card flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="gradient-bg rounded-2xl shadow-lg p-8 border border-gray-500">
            <img src="https://avb.com.br/wp-content/uploads/2020/11/logo.png" alt="AVB Logo" className="object-contain mx-auto mb-6" />
            {/* Título */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Criar Conta</h2>
              <p className="text-gray-500 mt-1">Preencha seus dados abaixo</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Input genérico */}
              {[
                { id: 'name', label: 'Nome Completo', type: 'text' },
                { id: 'email', label: 'E-mail', type: 'email' },
                { id: 'password', label: 'Senha', type: 'password' },
                { id: 'confirmPassword', label: 'Confirmar Senha', type: 'password' },
              ].map(({ id, label, type }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <label htmlFor={id} className="text-sm font-medium text-black">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    required
                    className="
            
                      w-full
                      px-4 
                      py-3 
                      rounded-xl 
                      border border-gray-600 
                      focus:border-avb-green 
                      focus:ring-2 
                      focus:ring-avb-green/40 
                      transition-all
                      outline-none
                      text-black
                      hover:border-white
                      hover:shadow-lg
                      hover:bg-green-600
                      hover:text-white
                    "
                    placeholder={label}
                  />
                </div>
              ))}

              {/* Erro */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 py-2 px-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full 
                  bg-avb-green 
                  hover:bg-avb-dark
                  text-black
                  font-medium 
                  py-3 
                  rounded-xl 
                  shadow 
                  transition-all
                  disabled:opacity-60
                  border border-gray-500
                   
                      hover:border-white
                      hover:shadow-lg
                      hover:bg-green-600
                      hover:text-white
                "
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </button>

              {/* Link login */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Já tem uma conta?{' '}
                <a
                  href="/login"
                  className="text-avb-green font-semibold hover:text-avb-dark"
                >
                  Fazer login
                </a>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
