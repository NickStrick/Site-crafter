import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/adminGuard';
import { presignPut } from '@/lib/s3-admin';

export async function POST(req: NextRequest) {
  try {
    assertAdmin(req);
    const body = await req.json();
    const bucket = body.bucket || process.env.S3_DEFAULT_BUCKET;
    const key: string = body.key;
    const contentType: string | undefined = body.contentType;

    if (!bucket) return NextResponse.json({ error: 'bucket required' }, { status: 400 });
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 });

    const { url } = await presignPut({ bucket, key, contentType, expiresSec: 300 });
    return NextResponse.json({ url, bucket, key });
  } catch (err: any) {
    const status = err?.status || 500;
    return NextResponse.json({ error: err?.message || 'Server error' }, { status });
  }
}
