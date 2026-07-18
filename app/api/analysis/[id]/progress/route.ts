import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'agroklinik-secret-key-2024';
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await request.json();
    const { status, note } = body;
    // Analizin bu kullanıcıya ait olduğunu kontrol et
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: params.id,
        userId: decoded.userId,
      },
    });
    if (!analysis) {
      return NextResponse.json({ error: 'Analiz bulunamadı' }, { status: 404 });
    }
    // İlerleme kaydı oluştur
    const progressLog = await prisma.progressLog.create({
      data: {
        analysisId: params.id,
        status,
        note,
      },
    });
    // Analiz durumunu güncelle
    await prisma.analysis.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ progressLog });
  } catch (error) {
    return NextResponse.json({ error: 'Kayıt sırasında hata oluştu' }, { status: 500 });
  }
}