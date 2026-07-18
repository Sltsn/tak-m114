import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'agroklinik-secret-key-2024';
// Tüm public postları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'newest';
    const status = searchParams.get('status');
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'popular') {
      orderBy = { likes: 'desc' };
    }
    const where: any = {};
    if (status) {
      where.status = status;
    }
    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profession: true,
            avatar: true,
          },
        },
        analysis: {
          select: {
            diagnosis: true,
          },
        },
        comments: {
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
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy,
    });
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Veriler alınırken hata oluştu' }, { status: 500 });
  }
}