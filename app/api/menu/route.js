import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
       where: { isAvailable: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

// POST a new menu item
export async function POST(request) {
  try {
    const data = await request.json();
    // Add validation here with Zod later
    const newItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        imageUrl: data.imageUrl,
      },
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}