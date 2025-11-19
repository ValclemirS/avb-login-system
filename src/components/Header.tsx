'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);


  return (
    <header className="bg-GREEN-900 shadow-lg">
      {/* Top Bar */}
      <div className="bg-avb-dark text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="https://boletos.avb.com.br" target="_blank" className="hover:text-avb-light transition-colors">
                PORTAL DE BOLETOS
              </Link>
              <span>|</span>
              <Link href="https://www.contatoseguro.com.br/ferroeste" target="_blank" className="hover:text-avb-light transition-colors">
                CANAL DE DENÚNCIAS
              </Link>
              <span>|</span>
              <Link href="https://ri.avb.com.br" target="_blank" className="hover:text-avb-light transition-colors">
                RELAÇÕES COM INVESTIDORES
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/AVBAcoVerdedoBrasil" target="_blank" className="hover:text-avb-light transition-colors">
                <i className="fab fa-facebook-f">Facebook</i>
              </Link>
              <Link href="https://www.linkedin.com/company/avbacoverdedobrasil" target="_blank" className="hover:text-avb-light transition-colors">
                <i className="fab fa-linkedin-in">Linkedin</i>
              </Link>
              <Link href="https://www.instagram.com/avb_acoverdedobrasil" target="_blank" className="hover:text-avb-light transition-colors">
                <i className="fab fa-instagram">Instagram</i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-39 h-20 bg-black-900 rounded flex items-center justify-center">
              <img src="https://avb.com.br/wp-content/uploads/2020/11/logo.png" alt="AVB Logo" className="object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="font-semibold text-white hover:text-avb-green transition-colors">
              A AVB
            </Link>
            
            <div className="relative group">
              <button className="font-semibold text-white hover:text-white transition-colors flex items-center">
                Produtos
                <i className="ml-1 fas fa-chevron-down text-xs"></i>
              </button>
              <div className="absolute text-green-700 top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link href="/fio-maquina" className="block px-4 py-3 hover:bg-black-50 border-b border-gray-100">
                  Fio Máquina
                </Link>
                <Link href="/vergalhao-avb-50-barra" className="block px-4 py-3 hover:bg-black-50 border-b border-gray-100">
                  Vergalhão CA-50 AVB
                </Link>
                <Link href="/vergalhao-ca-60-avb" className="block px-4 py-3 hover:bg-black-50 border-b border-gray-100">
                  Vergalhão AVB 60
                </Link>
              </div>
            </div>

            <Link href="/certificacoes" className="font-semibold text-white hover:text-avb-green transition-colors">
              Certificações
            </Link>
            <Link href="/sustentabilidade" className="font-semibold text-white-900 hover:text-avb-green transition-colors">
              Sustentabilidade
            </Link>
            
            <Link href="/login" className="btn-primary">
              Acessar
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-avb-dark`} aria-hidden="true"></i>
          </button>
        </div>

        {/* Mobile Navigation */}
      {/* Mobile Navigation */}
{isMenuOpen && (
  <div className="lg:hidden bg-white shadow-md border-t border-gray-200">
    <nav className="flex flex-col py-4 px-4 space-y-3">

      <Link 
        href="/" 
        className="text-gray-800 font-medium hover:text-avb-green transition"
      >
        A AVB
      </Link>

      {/* Produtos com submenu */}
      <div className="flex flex-col">
        <button
          onClick={() => setProductsOpen(!productsOpen)}
          className="text-gray-800 font-medium flex justify-between items-center"
        >
          Produtos
          <i className={`fas fa-chevron-${productsOpen ? 'up' : 'down'}`}></i>
        </button>

        {productsOpen && (
          <div className="ml-3 mt-2 flex flex-col space-y-2 text-gray-700">
            <Link href="/fio-maquina" className="hover:text-avb-green transition">
              Fio Máquina
            </Link>
            <Link href="/vergalhao-avb-50-barra" className="hover:text-avb-green transition">
              Vergalhão CA-50 AVB
            </Link>
            <Link href="/vergalhao-ca-60-avb" className="hover:text-avb-green transition">
              Vergalhão AVB 60
            </Link>
          </div>
        )}
      </div>

      <Link 
        href="/certificacoes" 
        className="text-gray-800 font-medium hover:text-avb-green transition"
      >
        Certificações
      </Link>

      <Link 
        href="/sustentabilidade" 
        className="text-gray-800 font-medium hover:text-avb-green transition"
      >
        Sustentabilidade
      </Link>

      <Link 
        href="/login" 
        className="btn-primary text-center"
      >
        Acessar
      </Link>
    </nav>
  </div>
    </header>
  );
}
