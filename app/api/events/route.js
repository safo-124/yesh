import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Remember to add admin protection logic

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    // Basic validation
    if (!data.title || !data.slug || !data.description || !data.imageUrl || !data.eventDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newEvent = await prisma.event.create({
      data: {
        ...data,
        eventDate: new Date(data.eventDate),
      },
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    // Handle unique slug constraint error
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json({ error: 'An event with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}