import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Add admin protection logic here

export async function PATCH(request, { params }) {
  const data = await request.json();
  const updatedSection = await prisma.homepageSection.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updatedSection);
}

export async function DELETE(request, { params }) {
  await prisma.homepageSection.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}