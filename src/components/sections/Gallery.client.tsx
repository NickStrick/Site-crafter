// src/components/sections/Gallery.client.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Gallery from './Gallery';
import type { GalleryItem, GallerySection, GallerySource } from '@/types/site';

type Props = Omit<GallerySection, 'items'> & { items?: GalleryItem[] };

// Type guard: narrows GallerySource to the 's3' variant
function isS3Source(src?: GallerySource): src is Extract<GallerySource, { type: 's3' }> {
  return !!src && src.type === 's3';
}

export default function GalleryClient({ source, items: initialItems, ...rest }: Props) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems ?? []);
  const [error, setError] = useState<string | null>(null);

  // Narrow once and memoize
  const s3 = useMemo(() => (isS3Source(source) ? source : undefined), [source]);
  const [loading, setLoading] = useState<boolean>(!!s3);

  useEffect(() => {
    if (!s3) return; // static/manual mode → nothing to fetch

    const controller = new AbortController();
    const qs = new URLSearchParams();
    if (s3.prefix) qs.set('prefix', s3.prefix);
    if (typeof s3.limit === 'number') qs.set('limit', String(s3.limit));
    if (s3.recursive === false) qs.set('recursive', 'false');

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/gallery?${qs.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { items: GalleryItem[] } = await res.json();
        setItems(data.items ?? []);
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') {
          setError((e as Error).message ?? 'Failed to load gallery');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [s3?.prefix, s3?.limit, s3?.recursive, s3 ? 's3' : 'static']);

  // Optional: loading/error UI (simple)
  if (error) {
    return (
      <section className="section">
        <div className="mx-auto max-w-6xl text-red-600">Could not load gallery: {error}</div>
      </section>
    );
  }

  return <Gallery {...(rest as GallerySection)} items={items} />;
}
