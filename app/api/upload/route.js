import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
     return NextResponse.json({ message: 'No file to upload.' }, { status: 400 });
  }

  // The file body is already a stream, so we can pass it directly
  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}