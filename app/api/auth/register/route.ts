import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'agroklinik-secret-key-2024';
const professionEmojis: Record<string, string> = {
  'Çiftçi': '👨‍🌾',
  'Ziraat Mühendisi': '🌾',
  'Botanikçi': '🌿',
  'Hobi Bahçıvanı': '🪴',
  'Tarım Teknisyeni': '🛠️',
  'Veteriner': '🐄',
  'Öğrenci': '📚',
  'Diğer': '🌱',
};
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, firstName, lastName, profession, location, avatar } = body;
    // Validasyon
    if (!username || !email || !password || !firstName || !lastName || !profession || !location) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }
    // Kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı veya email zaten kullanılıyor' },
        { status: 400 }
      );
    }
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    // Avatar yoksa mesleğe göre emoji ata
    const userAvatar = avatar || professionEmojis[profession] || '🌱';
    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profession,
        location,
        avatar: userAvatar,
      },
    });
    // Token oluştur
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Şifreyi response'dan çıkar
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Kayıt sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}