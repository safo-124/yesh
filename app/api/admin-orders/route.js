import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  // Protect the route - only admins can access
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true }
        },
        items: {
          include: {
            menuItem: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}