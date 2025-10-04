'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adminFetch } from '@/lib/adminClient';

type MediaItem = { key: string; size: number; lastModified: string; etag?: string };

export default function MediaPicker({
  bucket = process.env.NEXT_PUBLIC_S3_DEFAULT_BUCKET,
  prefix,
  onPick,
}: {
  bucket?: string;
  prefix: string;               // e.g., "configs/carole/assets/" or "gallery/"
  onPick: (key: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cdnBase = process.env.NEXT_PUBLIC_S3_CDN_BASE || process.env.NEXT_PUBLIC_S3_GALLERY_CDN_BASE || '';

  const toUrl = useCallback((key: string) => {
    if (!cdnBase) return key; // fallback (not ideal)
    return `${cdnBase.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
  }, [cdnBase]);

  const list = useCallback(async () => {
    setLoading(true); setErr(null);
    try {
      const qs = new URLSearchParams({ prefix, ...(bucket ? { bucket } : {}) });
      const res = await adminFetch(`/api/admin/media?${qs.toString()}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [prefix, bucket]);

  useEffect(() => { list(); }, [list]);

  const onDelete = async (key: string) => {
    if (!confirm('Delete this file?')) return;
    const qs = new URLSearchParams({ key, ...(bucket ? { bucket } : {}) });
    const res = await adminFetch(`/api/admin/media?${qs.toString()}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Delete failed');
      return;
    }
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const onUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const key = `${prefix}${file.name}`; // simple; add collision handling later
      // 1) presign
      const res = await adminFetch('/api/admin/media/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket, key, contentType: file.type || 'application/octet-stream' }),
      });
      if (!res.ok) {
        console.error(await res.text());
        alert('Presign failed');
        return;
      }
      const { url } = await res.json();

      // 2) upload to S3 (PUT)
      const up = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!up.ok) {
        console.error(await up.text());
        alert('Upload failed');
        return;
      }
    }
    await list(); // refresh
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onUploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4 w-fit ">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-eyebrow">Media</div>
          <div className="font-bold text-xl">Prefix: <code>{prefix}</code></div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-inverted" onClick={() => inputRef.current?.click()}>Upload</button>
          <button className="btn btn-primary" onClick={list}>Refresh</button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => onUploadFiles(e.target.files)}
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-xl p-6 text-center text-muted"
      >
        Drag & drop files here or use the Upload button.
      </div>

      {err ? <div className="text-red-600">{err}</div> : null}
      {loading ? <div>Loading…</div> : null}

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.key} className="relative card p-2 ">
            {/* Image preview (best effort). For non-images it will still show broken preview—fine for MVP */}
            <img
              src={toUrl(i.key)}
              alt={i.key}
              className="w-full h-40 object-cover rounded-[var(--round-xl)]"
            />
            <div className="mt-2 text-sm break-all">{i.key.replace(prefix, '')}</div>
            <div className="flex justify-end gap-2 mt-2">
              <button className="btn btn-inverted" onClick={() => onPick(i.key)}>Pick</button>
              <button className="btn btn-ghost" onClick={() => onDelete(i.key)}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading ? (
          <div className="text-muted">No files in this prefix yet.</div>
        ) : null}
      </div>
    </div>
  );
}
