import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rating, comment, menuItemId } = await request.json();

    if (!rating || !menuItemId || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'A rating between 1 and 5 and a menu item ID are required.' }, { status: 400 });
    }
    
    const newReview = await prisma.review.create({
      data: {
        rating: parseInt(rating, 10),
        comment,
        userId: session.user.id,
        menuItemId,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'You have already reviewed this item.' }, { status: 409 });
    }
    console.error("Review submission error:", error);
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}