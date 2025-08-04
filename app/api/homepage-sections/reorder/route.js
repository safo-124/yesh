import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Add admin protection logic here

export async function POST(request) {
  const sections = await request.json();
  
  try {
    await prisma.$transaction(
      sections.map((section, index) =>
        prisma.homepageSection.update({
          where: { id: section.id },
          data: { order: index },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder sections' }, { status: 500 });
  }
}