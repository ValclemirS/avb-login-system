import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 glass-card  from-green-50 to-blue-50">
      <div className="gradient-bg  rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Cabeçalho */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-39 h-20 bg-black-900 rounded flex items-center justify-center">
              <img src="https://avb.com.br/wp-content/uploads/2020/11/logo.png" alt="AVB Logo" className="object-contain" />
            </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          AÇO VERDE
        </h1>
        <h2 className="text-xl text-gray-600 mb-6">
          DO BRASIL
        </h2>
        
        <p className="text-gray-600 mb-8">
          Sistema de autenticação
        </p>

        {/* Botões de Navegação */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-avb-green text-black py-3 px-4 border border-gray-550 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg block text-center hover:text-white"
          >
            Fazer Login
          </Link>
          
          <Link
            href="/register"
            className=" border border-gray-550 w-full bg-avb-green text-black py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg block text-center hover:text-white"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}