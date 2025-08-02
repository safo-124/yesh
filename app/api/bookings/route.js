import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // <-- CORRECTED IMPORT
import prisma from '@/lib/prisma';

/**
 * Handles GET requests to fetch bookings.
 * Used by the admin dashboard. Supports filtering by status and searching by user name.
 */
export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let whereClause = {};

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.user = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to create a new booking.
 * Used by the customer booking form.
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to book.' }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.bookingType || !data.eventDate || !data.partySize) {
        return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // 👇 THIS IS THE CORRECTED SECTION 👇
    const newBooking = await prisma.booking.create({
      data: {
        bookingType: data.bookingType,
        eventDate: new Date(data.eventDate),
        partySize: parseInt(data.partySize, 10),
        notes: data.notes || null,
        status: 'PENDING',
        // Connect the booking to the logged-in user
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    // END of corrected section

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}