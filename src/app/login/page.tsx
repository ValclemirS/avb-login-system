'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ SALVAR TOKEN NO localStorage E sessionStorage
        if (rememberMe) {
          localStorage.setItem('token', data.token);
        }
        sessionStorage.setItem('token', data.token);
        
        // ✅ REDIRECIONAR COM TIMEOUT
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); // Forçar atualização
        }, 100);
      } else {
        setError(data.message || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen glass-card  py-8">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-avb-green/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto bg px-4 relative z-10">
          <div className="max-w-md mx-auto ">
            {/* Card Principal */}
            <div className="gradient-bg rounded-3xl p-8 mb-6">
              <div className="text-center mb-8">
                <div className="w-36 h-29  from-avb-green to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ">
                  <img src="https://avb.com.br/wp-content/uploads/2020/11/logo.png" alt="AVB Logo" className="object-contain" />
                </div>
                <h2 className="text-3xl font-bold text-black mb-2">
                  Bem-vindo de volta
                </h2>
                <p className="text-black">
                  Entre na sua conta AVB
                </p>
              </div>
                  <form onSubmit={handleSubmit} className="space-y-6">

  {/* EMAIL */}
  <div className="input-with-label  relative border-2 border-gray-500 px-4 py-3 rounded-xl  text-black hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg block text-center hover:text-white">
    <label
      className={`
        floating-label
        left-4                           /* espaçamento horizontal */
        peer-placeholder-shown:top-1/2 
        peer-placeholder-shown:text-base 
        peer-focus:floating-label-focused 
        ${formData.email ? 'floating-label-focused' : ''}
      `}
    >
      E-mail
    </label>

    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      required
      className="form-input-modern peer pl-4  "
      placeholder="Digite seu e-mail"
      
    />

    <i className="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-avb-green "></i>
  </div>


  {/* PASSWORD */}
  <div className="input-with-label relative border-2 border-gray-500 px-4 py-3 rounded-xl  text-black hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg block text-center hover:text-white">
    <label
      className={`
        floating-label
        left-4
        peer-placeholder-shown:top-1/2 
        peer-placeholder-shown:text-base 
        peer-focus:floating-label-focused 
        ${formData.password ? 'floating-label-focused' : ''}
      `}
    >
      Senha
    </label>

    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      required
      className="form-input-modern peer pl-4"
      placeholder="Digite sua senha"
    />

    <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-avb-green"></i>
  </div>


  {/* ESQUECEU SENHA */}
  <div className="flex items-center justify-between  text-black  transition-colors duration-200  block text-center hover:text-white">
    <a 
      href="/forgot-password" 
      className="text-sm text-black hover:text-white font-semibold transition-colors"
    >
      Esqueceu a senha?
    </a>
  </div>


  {/* ERRO */}
  {error && (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
      <i className="fas fa-exclamation-circle"></i>
      <span>{error}</span>
    </div>
  )}


  {/* BOTÃO */}
  <button
    type="submit"
    disabled={loading}
    className="btn-modern disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? (
      <span className="flex items-center justify-center ">
        <i className="fas fa-spinner fa-spin mr-2"></i>
        Entrando...
      </span>
    ) : (
      <span className="flex items-center justify-center border-2 border-gray-500 px-4 py-3 rounded-xl  text-black hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg block text-center hover:text-white">
        <i className="fas fa-sign-in-alt mr-2"></i>
        Entrar
      </span>
    )}
  </button>

</form>

             
            </div>

            {/* Sign Up Card */}
            <div className="gradient-bg rounded-3xl p-6 text-center">
              <p className="text-gray-600 mb-4">
                Não tem uma conta?
              </p>
              <a 
                href="/register" 
                className="inline-flex items-center justify-center w-full py-3 px-6 border-2 border-avb-green text-black font-semibold rounded-xl  transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg block text-center hover:text-white"
              >
                <i className="fas fa-user-plus mr-2 "></i>
                Criar conta 
              </a>
            </div>

            {/* Security Badge */}
            <div className="text-center mt-6">
              <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
                <i className="fas fa-shield-alt text-avb-green"></i>
                <span>Login 100% seguro e criptografado</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
