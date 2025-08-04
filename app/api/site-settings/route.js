import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Add admin protection

// GET multiple settings by keys
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keys = searchParams.getAll('key'); // e.g., ?key=footer_location&key=footer_hours
  
  const settings = await prisma.siteSettings.findMany({
    where: { key: { in: keys } },
  });
  
  // Convert array to a key-value object
  const settingsObj = settings.reduce((obj, item) => {
    obj[item.key] = item.value;
    return obj;
  }, {});

  return NextResponse.json(settingsObj);
}


// POST (upsert) multiple settings
export async function POST(request) {
  const settings = await request.json(); // Expects { key1: value1, key2: value2 }

  try {
    const upsertPromises = Object.entries(settings).map(([key, value]) => 
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );
    await prisma.$transaction(upsertPromises);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}