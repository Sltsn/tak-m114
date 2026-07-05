'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🌱</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Agro<span className="text-green-600">Klinik</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link href="/sorun-ekle" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                  Sorun Ekle
                </Link>
                <Link href="/gecmis" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                  Geçmiş
                </Link>
                <Link href="/paylasim" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                  Paylaşımlar
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 bg-green-50 hover:bg-green-100 rounded-full pl-2 pr-4 py-1.5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-lg">
                      {user?.avatar}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                      <Link
                        href="/hesabim"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-lg">👤</span>
                        Hesabım
                      </Link>
                      <Link
                        href="/yorumlarim"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-lg">💬</span>
                        Yorumlarım
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <span className="text-lg">🚪</span>
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                >
                  Hesap Oluştur
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
          {isAuthenticated ? (
            <div className="space-y-2">
              <Link href="/sorun-ekle" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                🔬 Sorun Ekle
              </Link>
              <Link href="/gecmis" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                📊 Geçmiş
              </Link>
              <Link href="/paylasim" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                🌐 Paylaşımlar
              </Link>
              <Link href="/hesabim" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                👤 Hesabım
              </Link>
              <Link href="/yorumlarim" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                💬 Yorumlarım
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                🚪 Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/giris" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                Giriş Yap
              </Link>
              <Link href="/kayit" className="block px-4 py-2 bg-green-600 text-white rounded-lg text-center" onClick={() => setIsMenuOpen(false)}>
                Hesap Oluştur
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
