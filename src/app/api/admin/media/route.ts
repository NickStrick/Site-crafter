import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/adminGuard';
import { listUnderPrefix, deleteKey } from '@/lib/s3-admin';

export async function GET(req: NextRequest) {
  try {
    assertAdmin(req);

    const bucket = req.nextUrl.searchParams.get('bucket') || process.env.S3_DEFAULT_BUCKET!;
    const prefix = req.nextUrl.searchParams.get('prefix') || '';
    const limit = Number(req.nextUrl.searchParams.get('limit') || '1000');

    if (!bucket) return NextResponse.json({ error: 'bucket required' }, { status: 400 });
    if (!prefix) return NextResponse.json({ error: 'prefix required' }, { status: 400 });

    const items = await listUnderPrefix({ bucket, prefix, maxKeys: limit });
    return NextResponse.json({ items });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || 'Server error' }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    assertAdmin(req);

    const bucket = req.nextUrl.searchParams.get('bucket') || process.env.S3_DEFAULT_BUCKET!;
    const key = req.nextUrl.searchParams.get('key') || '';

    if (!bucket) return NextResponse.json({ error: 'bucket required' }, { status: 400 });
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

    await deleteKey({ bucket, key });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || 'Server error' }, { status });
  }
}
