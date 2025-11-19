import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-avb-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Redes Sociais */}
          <div className="lg:col-span-1">
            <div className="w-40 h-10  rounded mb-4 flex items-center justify-center">
              <img src="https://avb.com.br/wp-content/uploads/2020/11/logo.png" alt="AVB Logo" className="object-contain mx-auto mb-6" />
            </div>
            <div className="flex space-x-4 mb-6">
              <Link href="#" target="_blank" className="hover:text-avb-light transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </Link>
              <Link href="#" target="_blank" className="hover:text-avb-light transition-colors">
                <i className="fab fa-linkedin-in text-xl"></i>
              </Link>
              <Link href="#" target="_blank" className="hover:text-avb-light transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </Link>
            </div>
          </div>

          {/* Mapa do Site */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MAPA DO SITE</h3>
            <ul className="space-y-2">
              <li><Link href="/a-avb" className="hover:text-avb-light transition-colors">A AVB</Link></li>
              <li><Link href="/certificacoes" className="hover:text-avb-light transition-colors">Certificações</Link></li>
              <li><Link href="/ouvidoria" className="hover:text-avb-light transition-colors">Ouvidoria</Link></li>
              <li><Link href="/cotacao" className="hover:text-avb-light transition-colors">Faça uma cotação</Link></li>
            </ul>
          </div>

          {/* Produtos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">PRODUTOS</h3>
            <ul className="space-y-2">
              <li><Link href="/fio-maquina" className="hover:text-avb-light transition-colors">Fio Máquina</Link></li>
              <li><Link href="/vergalhao-avb-50-barra" className="hover:text-avb-light transition-colors">Vergalhão CA-50</Link></li>
              <li><Link href="/vergalhao-ca-60-avb" className="hover:text-avb-light transition-colors">Vergalhão CA-60</Link></li>
              <li><Link href="/tarugo-de-aco" className="hover:text-avb-light transition-colors">Tarugo de Aço</Link></li>
            </ul>
          </div>

          {/* Localizações */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CONTATO</h3>
            <div className="space-y-2">
              <p className="text-sm">Sede Administrativa:</p>
              <p className="text-sm text-gray-300">Av. do Contorno, 3800 - Belo Horizonte/MG</p>
              <p className="text-sm mt-4">Sede Usina:</p>
              <p className="text-sm text-gray-300">Açailândia - MA</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p>&copy; 2025 AVB - Aço Verde do Brasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
