import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Remember to add your admin protection logic here

export async function GET() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(sections);
}

export async function POST(request) {
  const data = await request.json();

  try {
    // 1. Count existing sections to determine the order for the new one
    const count = await prisma.homepageSection.count();

    // 2. Create the new section with the calculated order
    const newSection = await prisma.homepageSection.create({
      data: {
        ...data,
        order: count, // Set the order to be the last position
      },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Failed to create homepage section:", error);
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}