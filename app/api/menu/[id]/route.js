import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// This assumes you have admin protection logic somewhere
// For brevity, it's omitted here but should be added

export async function PATCH(request, { params }) {
  const { id } = params;
  const data = await request.json();
  
  try {
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        price: parseFloat(data.price),
      },
    });
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}