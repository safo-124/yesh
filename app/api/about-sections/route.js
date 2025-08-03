import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Add admin protection as in other routes

export async function GET() {
  const sections = await prisma.aboutSection.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(sections);
}

export async function POST(request) {
  const data = await request.json();
  const newSection = await prisma.aboutSection.create({ data });
  return NextResponse.json(newSection, { status: 201 });
}