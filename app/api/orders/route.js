import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/components/emails/OrderConfirmationEmail';
import { pusherServer } from '@/lib/pusher';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const itemIds = cartItems.map((item) => item.id);
    const dbItems = await prisma.menuItem.findMany({ where: { id: { in: itemIds } } });

    const dbItemMap = new Map(dbItems.map((item) => [item.id, item]));
    let total = 0;
    cartItems.forEach(cartItem => {
        const dbItem = dbItemMap.get(cartItem.id);
        if(dbItem) total += dbItem.price * cartItem.quantity;
    });

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: { userId: session.user.id, totalPrice: total },
      });

      const orderItemsData = cartItems.map((cartItem) => {
        const dbItem = dbItemMap.get(cartItem.id);
        return {
          orderId: order.id,
          menuItemId: cartItem.id,
          quantity: cartItem.quantity,
          price: dbItem.price,
        };
      });

      await tx.orderItem.createMany({ data: orderItemsData });
      return order;
    });

    // --- SEND CONFIRMATION EMAIL ---
    try {
        const orderItemsWithDetails = await prisma.orderItem.findMany({
            where: { orderId: newOrder.id },
            include: { menuItem: { select: { name: true }}}
        });

      await resend.emails.send({
        from: 'Gloryland Orders <onboarding@resend.dev>',
        to: [session.user.email],
        subject: `Your Gloryland Order Confirmation (#${newOrder.id.substring(0,8)})`,
        react: <OrderConfirmationEmail 
            orderDetails={{ name: session.user.name, orderId: newOrder.id, total }}
            orderItems={orderItemsWithDetails}
        />,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }
    
    // --- TRIGGER PUSHER EVENT ---
    try {
        await pusherServer.trigger('dashboard-channel', 'new-order', {
            message: `New order #${newOrder.id.substring(0,8)} placed by ${session.user.name}.`,
        });
    } catch (error) {
        console.error("Pusher trigger failed:", error);
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}