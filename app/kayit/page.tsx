'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const professions = [
  { value: 'Çiftçi', emoji: '👨‍🌾' },
  { value: 'Ziraat Mühendisi', emoji: '🌾' },
  { value: 'Botanikçi', emoji: '🌿' },
  { value: 'Hobi Bahçıvanı', emoji: '🪴' },
  { value: 'Tarım Teknisyeni', emoji: '🛠️' },
  { value: 'Veteriner', emoji: '🐄' },
  { value: 'Öğrenci', emoji: '📚' },
  { value: 'Diğer', emoji: '🌱' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedProfession = professions.find(p => p.value === formData.profession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor');
      return;
    }

    await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      profession: formData.profession,
      location: formData.location,
      avatar: avatar,
    });

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">🌱</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Agro<span className="text-green-600">Klinik</span>
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-green-100/50 p-8 border border-green-100">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Hesap Oluştur
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Topluluğumuza katılın
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-green-100 border-2 border-dashed border-green-300 hover:border-green-500 flex items-center justify-center overflow-hidden transition-colors"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : selectedProfession ? (
                    <span className="text-4xl">{selectedProfession.emoji}</span>
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl">📷</span>
                      <span className="text-xs text-green-600 mt-1 block">Fotoğraf</span>
                    </div>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Fotoğraf yüklemezseniz mesleğinize göre otomatik emoji atanır
            </p>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İsim</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  placeholder="Ahmet"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soyisim</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  placeholder="Yılmaz"
                  required
                />
              </div>
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meslek</label>
              <select
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                required
              >
                <option value="">Mesleğinizi seçin</option>
                {professions.map((p) => (
                  <option key={p.value} value={p.value}>{p.emoji} {p.value}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konum</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                placeholder="Antalya, Türkiye"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {isLoading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris" className="text-green-600 hover:text-green-700 font-semibold">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
