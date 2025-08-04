import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);

  // Protect the route
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Prevent admin from changing their own role
  if (session.user.id === params.id) {
    return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
  }

  try {
    const { role } = await request.json();
    if (!['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
    });

    // Don't send the password back
    delete updatedUser.password;
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}