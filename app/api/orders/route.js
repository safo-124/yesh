import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cartItems = await request.json();

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  try {
    // SECURITY: Fetch the actual prices from the database to prevent client-side price tampering.
    const itemIds = cartItems.map((item) => item.id);
    const dbItems = await prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
      },
    });

    const dbItemMap = new Map(dbItems.map((item) => [item.id, item]));

    let total = 0;
    for (const cartItem of cartItems) {
      const dbItem = dbItemMap.get(cartItem.id);
      if (!dbItem) {
        throw new Error(`Item with ID ${cartItem.id} not found.`);
      }
      total += dbItem.price * cartItem.quantity;
    }

    // Use a Prisma transaction to ensure all or nothing is written to the database.
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          totalPrice: total,
        },
      });

      const orderItemsData = cartItems.map((cartItem) => {
        const dbItem = dbItemMap.get(cartItem.id);
        return {
          orderId: order.id,
          menuItemId: cartItem.id,
          quantity: cartItem.quantity,
          price: dbItem.price, // Use the server-verified price
        };
      });

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}