import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  // Protect the route - only admins or cashiers can create walk-in orders
  if (!session || !['ADMIN', 'CASHIER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const orderItems = await request.json();

  if (!orderItems || orderItems.length === 0) {
    return NextResponse.json({ error: 'Order is empty' }, { status: 400 });
  }

  try {
    const itemIds = orderItems.map((item) => item.id);
    const dbItems = await prisma.menuItem.findMany({ where: { id: { in: itemIds } } });

    const dbItemMap = new Map(dbItems.map((item) => [item.id, item]));
    let total = 0;
    orderItems.forEach(item => {
        const dbItem = dbItemMap.get(item.id);
        if(dbItem) total += dbItem.price * item.quantity;
    });

    // Create the order without a userId
    const newOrder = await prisma.order.create({
      data: {
        totalPrice: total,
        status: 'COMPLETED', // Walk-in orders are typically completed immediately
        items: {
          create: orderItems.map(item => ({
            quantity: item.quantity,
            price: dbItemMap.get(item.id).price,
            menuItem: {
              connect: { id: item.id }
            }
          }))
        }
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("POS Order creation error:", error);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}