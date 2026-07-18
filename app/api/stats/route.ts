import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'agroklinik-secret-key-2024';
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    // Toplam analiz sayısı
    const totalAnalyses = await prisma.analysis.count({
      where: { userId: decoded.userId },
    });
    // Çözülen analiz sayısı
    const solvedAnalyses = await prisma.analysis.count({
      where: { userId: decoded.userId, status: 'çözüldü' },
    });
    // Devam eden analiz sayısı
    const ongoingAnalyses = await prisma.analysis.count({
      where: { userId: decoded.userId, status: 'devam ediyor' },
    });
    // Toplam yorum sayısı
    const totalComments = await prisma.comment.count({
      where: { userId: decoded.userId },
    });
    // Toplam paylaşım sayısı
    const totalPosts = await prisma.post.count({
      where: { userId: decoded.userId },
    });
    // Hastalık istatistikleri
    const diseaseStats = await prisma.analysis.groupBy({
      by: ['diagnosis'],
      where: { userId: decoded.userId },
      _count: { diagnosis: true },
      orderBy: { _count: { diagnosis: 'desc' } },
      take: 5,
    });
    // Başarı oranı
    const successRate = totalAnalyses > 0
      ? Math.round((solvedAnalyses / totalAnalyses) * 100)
      : 0;
    return NextResponse.json({
      stats: {
        totalAnalyses,
        solvedAnalyses,
        ongoingAnalyses,
        totalComments,
        totalPosts,
        successRate,
        diseaseStats: diseaseStats.map(d => ({
          name: d.diagnosis,
          count: d._count.diagnosis,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Veriler alınırken hata oluştu' }, { status: 500 });
  }
}