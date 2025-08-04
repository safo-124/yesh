import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Remember to add admin protection logic

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        ...data,
        eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      },
    });
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.event.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}