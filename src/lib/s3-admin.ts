import { S3Client, ListObjectsV2Command, DeleteObjectCommand, _Object, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION || 'us-east-1';

export const s3 = new S3Client({ region: REGION });

export async function listUnderPrefix(opts: {
  bucket: string;
  prefix: string;
  maxKeys?: number;
}) {
  const { bucket, prefix, maxKeys = 1000 } = opts;
  const res = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
    MaxKeys: maxKeys,
  }));
  const contents = (res.Contents || []) as _Object[];
  return contents
    .filter(o => !!o.Key && !o.Key.endsWith('/'))
    .map(o => ({
      key: o.Key as string,
      size: o.Size || 0,
      lastModified: o.LastModified?.toISOString() || '',
      etag: o.ETag || '',
    }));
}

export async function presignPut(opts: {
  bucket: string;
  key: string;
  contentType?: string;
  expiresSec?: number; // default 300
}) {
  const { bucket, key, contentType, expiresSec = 300 } = opts;
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    // Optional: ACL if needed, but prefer bucket policy/OAC
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expiresSec });
  return { url, bucket, key };
}

export async function deleteKey(opts: { bucket: string; key: string }) {
  const { bucket, key } = opts;
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
