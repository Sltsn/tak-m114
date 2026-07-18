import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'agroklinik-secret-key-2024';
// AI Analiz Simülasyonu
function simulateAIAnalysis() {
  const diseases = [
    {
      diagnosis: 'Yaprak Yanıklığı (Fungal Enfeksiyon)',
      solutions: [
        'Enfekte yaprakları hemen budayın ve imha edin',
        'Bakır bazlı fungisit uygulayın (7-10 gün arayla 3 uygulama)',
        'Sulama sıklığını azaltın, yaprakları ıslatmaktan kaçının',
        'Hava sirkülasyonunu artırmak için bitkileri seyreltin',
      ],
    },
    {
      diagnosis: 'Yaprak Biti Enfestasyonu',
      solutions: [
        'Sabunlu su çözeltisi ile yaprakları yıkayın',
        'Doğal düşmanları (uğur böceği) teşvik edin',
        'Neem yağı spreyi uygulayın',
        'Şiddetli vakalarda insektisit kullanın',
      ],
    },
    {
      diagnosis: 'Külleme Hastalığı',
      solutions: [
        'Enfekte bitki kısımlarını kesin',
        'Kükürt bazlı fungisit uygulayın',
        'Bitkiler arasındaki mesafeyi artırın',
        'Yaprak ıslaklığını minimumda tutun',
      ],
    },
    {
      diagnosis: 'Pas Hastalığı',
      solutions: [
        'Enfekte yaprakları toplayıp imha edin',
        'Fungisit uygulaması yapın',
        'Dayanıklı çeşitleri tercih edin',
        'Düzenli gübreleme ile bitkiyi güçlendirin',
      ],
    },
  ];
  return diseases[Math.floor(Math.random() * diseases.length)];
}
// Analiz Oluştur
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const isPublic = formData.get('isPublic') === 'true';
    const plantName = formData.get('plantName') as string || 'Bilinmeyen Bitki';
    if (!image) {
      return NextResponse.json({ error: 'Görsel zorunludur' }, { status: 400 });
    }
    // Görseli base64'e çevir (gerçek projede cloud storage kullanılmalı)
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
    // AI Analizi simüle et
    const aiResult = simulateAIAnalysis();
    // Analizi kaydet
    const analysis = await prisma.analysis.create({
      data: {
        userId: decoded.userId,
        imageUrl: base64Image,
        diagnosis: aiResult.diagnosis,
        solutions: JSON.stringify(aiResult.solutions),
        isPublic,
        status: 'beklemede',
      },
    });
    // Eğer public ise post olarak da kaydet
    if (isPublic) {
      await prisma.post.create({
        data: {
          userId: decoded.userId,
          analysisId: analysis.id,
          plantName,
          description: `${plantName} bitkimde ${aiResult.diagnosis} tespit edildi.`,
          imageUrl: base64Image,
          status: 'beklemede',
        },
      });
    }
    // Benzer vakaları bul
    const similarCases = await prisma.analysis.findMany({
      where: {
        diagnosis: aiResult.diagnosis,
        isPublic: true,
        NOT: { id: analysis.id },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({
      analysis: {
        ...analysis,
        solutions: JSON.parse(analysis.solutions),
      },
      similarCases: similarCases.map(c => ({
        id: c.id,
        userName: `${c.user.firstName} ${c.user.lastName}`,
        userAvatar: c.user.avatar,
        diagnosis: c.diagnosis,
        status: c.status,
      })),
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analiz sırasında bir hata oluştu' }, { status: 500 });
  }
}
// Kullanıcının analizlerini getir
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const analyses = await prisma.analysis.findMany({
      where: { userId: decoded.userId },
      include: {
        progressLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({
      analyses: analyses.map(a => ({
        ...a,
        solutions: JSON.parse(a.solutions),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Veriler alınırken hata oluştu' }, { status: 500 });
  }
}