// src/app/api/admin/config/[siteId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  NoSuchKey,
} from '@aws-sdk/client-s3';

// --- super lightweight "admin" guard (same header you've been using) ---
function assertAdmin(req: NextRequest): NextResponse | null {
  if (req.headers.get('x-local-admin') !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// --- envs / S3 client ---
const REGION = process.env.AWS_REGION || 'us-east-2';
const BUCKET =
  process.env.NEXT_PUBLIC_S3_DEFAULT_BUCKET ||
  process.env.S3_GALLERY_BUCKET ||
  '';

const s3 = new S3Client({ region: REGION });

function keyFor(siteId: string) {
  // where we store the config JSON
  return `configs/${siteId}/site.json`;
}

// Helper for AWS SDK v3 body -> string
async function streamToString(stream: any): Promise<string> {
  if (!stream) return '';
  // Node.js Readable
  if (typeof stream.on === 'function') {
    return await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
  }
  // Web ReadableStream
  if (typeof stream.getReader === 'function') {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const merged = new Uint8Array(chunks.reduce((a, b) => a + b.length, 0));
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
    return new TextDecoder().decode(merged);
  }
  // Fallback
  return String(stream);
}

// GET -> read the current config from S3
export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const guard = assertAdmin(req);
  if (guard) return guard;

  if (!BUCKET) {
    return NextResponse.json({ error: 'Missing bucket' }, { status: 500 });
  }
  const siteId = params.siteId;
  const Key = keyFor(siteId);

  try {
    const out = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key })
    );
    const text = await streamToString(out.Body as any);
    // validate it’s JSON
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: 200 });
  } catch (err: any) {
    // If not found, return 404
    if (err?.name === 'NoSuchKey' || err?.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: err?.message || 'Read failed' },
      { status: 500 }
    );
  }
}

// PUT -> write the config JSON to S3
export async function PUT(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const guard = assertAdmin(req);
  if (guard) return guard;

  if (!BUCKET) {
    return NextResponse.json({ error: 'Missing bucket' }, { status: 500 });
  }

  const siteId = params.siteId;
  const Key = keyFor(siteId);

  try {
    const body = await req.text(); // accept raw text
    // Make sure it's valid JSON (and return parsed version)
    const parsed = JSON.parse(body);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key,
        Body: JSON.stringify(parsed, null, 2),
        ContentType: 'application/json; charset=utf-8',
        CacheControl: 'no-store',
      })
    );

    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    // bad JSON?
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Body must be valid JSON' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: err?.message || 'Write failed' },
      { status: 500 }
    );
  }
}
