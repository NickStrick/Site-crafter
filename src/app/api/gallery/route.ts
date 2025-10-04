// src/app/api/gallery/route.ts
import { NextResponse } from 'next/server';
import { getGalleryFromS3 } from '@/lib/s3';

// Optional: validate search params if you want
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get('prefix') ?? undefined;
  const limit  = Number(searchParams.get('limit') ?? '200');
  const recursive = searchParams.get('recursive') !== 'false';

  // Uses env defaults unless overridden
  const items = await getGalleryFromS3({
    type: 's3',
    prefix,
    limit,
    recursive,
  });

  return NextResponse.json({ items });
}
