import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a specific setting by its key
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key },
    });
    // Return the setting, or null if it doesn't exist yet
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch setting' },
      { status: 500 }
    );
  }
}

// POST to create or update a setting (upsert)
export async function POST(request) {
  try {
    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    const updatedSetting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(updatedSetting);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}