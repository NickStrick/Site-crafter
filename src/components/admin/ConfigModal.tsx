'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  SiteConfig,
  AnySection,
  HeroSection,
  GallerySection,
  GalleryItem,
  VideoSection,
  VideoSource,
} from '@/types/site';
import { useSite } from '@/context/SiteContext';
import { getSiteId } from '@/lib/siteId';
import MediaPicker from './MediaPicker';
import VideoSourceEditor from './fields/VideoSourceEditor';

// -----------------------------
// Utilities
// -----------------------------
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

function isHero(s: AnySection): s is HeroSection {
  return s.type === 'hero';
}
function isGallery(s: AnySection): s is GallerySection {
  return s.type === 'gallery';
}
function isVideo(s: AnySection): s is VideoSection {
  return s.type === 'video';
}

// -----------------------------
// Props
// -----------------------------
export type ConfigModalProps = {
  onClose: () => void;
};

// -----------------------------
// Component
// -----------------------------
export default function ConfigModal({ onClose }: ConfigModalProps) {
  const { config, setConfig } = useSite();
  const siteId = getSiteId();

  // Working copy (nullable until config is ready)
  const [draft, setDraft] = useState<SiteConfig | null>(null);

  useEffect(() => {
    if (config) setDraft(deepClone(config));
  }, [config]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------
  // MediaPicker bridge (Promise-based)
  // ---------------------------
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPrefix, setPickerPrefix] = useState<string>(`configs/${siteId}/assets/`);
  const pickerResolveRef = useRef<((key: string | null) => void) | null>(null);

  const bucket = process.env.NEXT_PUBLIC_S3_DEFAULT_BUCKET;

  /**
   * Open the MediaPicker modal and resolve with the selected key (or null if canceled).
   */
  const openMediaPicker = useCallback((prefix: string): Promise<string | null> => {
    setPickerPrefix(prefix);
    setPickerOpen(true);

    return new Promise<string | null>((resolve) => {
      pickerResolveRef.current = resolve;
    });
  }, []);

  const handlePick = useCallback((key: string) => {
    if (pickerResolveRef.current) {
      pickerResolveRef.current(key);
      pickerResolveRef.current = null;
    }
    setPickerOpen(false);
  }, []);

  const handleCancelPick = useCallback(() => {
    if (pickerResolveRef.current) {
      pickerResolveRef.current(null);
      pickerResolveRef.current = null;
    }
    setPickerOpen(false);
  }, []);

  // ---------------------------
  // Section editing
  // ---------------------------
  const updateSection = useCallback((index: number, next: AnySection) => {
    setDraft(prev => {
      if (!prev) return prev;
      const copy = deepClone(prev);
      copy.sections[index] = next;
      return copy;
    });
  }, []);

  const removeSection = useCallback((index: number) => {
    setDraft(prev => {
      if (!prev) return prev;
      const copy = deepClone(prev);
      copy.sections.splice(index, 1);
      return copy;
    });
  }, []);

  const addSection = useCallback((type: AnySection['type']) => {
    setDraft(prev => {
      if (!prev) return prev;
      const copy = deepClone(prev);
      const id = `${type}-${Math.random().toString(36).slice(2, 7)}`;
      const base = {
        id,
        type,
        visible: true,
      } as AnySection;

      let next: AnySection = base;
      if (type === 'hero') {
        next = { ...base, type: 'hero', title: 'New Hero', subtitle: '' } as HeroSection;
      } else if (type === 'gallery') {
        next = {
          ...base,
          type: 'gallery',
          title: 'Gallery',
          items: [],
          style: { columns: 3, rounded: 'xl', gap: 'md' },
        } as GallerySection;
      } else if (type === 'video') {
        next = {
          ...base,
          type: 'video',
          title: 'Video',
          source: { type: 'url', href: '' },
          controls: true,
          style: { aspect: '16/9', rounded: 'xl', shadow: 'md', background: 'default' },
        } as VideoSection;
      }
      // Extend defaults for other types as needed.

      copy.sections.push(next);
      return copy;
    });
  }, []);

  // ---------------------------
  // Save
  // ---------------------------
  const canSave = useMemo(() => !!draft && Array.isArray(draft.sections), [draft]);

  const onSave = useCallback(async () => {
  if (!draft) return;
  setSaving(true);
  setError(null);

  try {
    const variant = (process.env.NEXT_PUBLIC_CONFIG_VARIANT ?? 'draft') as 'draft' | 'published';
    const url = `/api/admin/config/${encodeURIComponent(siteId)}?variant=${variant}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-local-admin': '1',
      },
      body: JSON.stringify(draft),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Save failed with HTTP ${res.status}`);
    }

    const saved: SiteConfig = await res.json();
    setConfig(saved); // keep UI in sync with the just-saved variant
    onClose();
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to save.';
    setError(msg);
  } finally {
    setSaving(false);
  }
}, [draft, onClose, setConfig, siteId]);


  // ---------------------------
  // Editors per section type
  // ---------------------------
  function EditHero({ section, onChange }: { section: HeroSection; onChange: (s: HeroSection) => void }) {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Eyebrow</label>
          <input
            className="input w-full"
            value={section.eyebrow ?? ''}
            onChange={(e) => onChange({ ...section, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="input w-full"
            value={section.title}
            onChange={(e) => onChange({ ...section, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subtitle</label>
          <textarea
            className="textarea w-full"
            value={section.subtitle ?? ''}
            onChange={(e) => onChange({ ...section, subtitle: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Image URL</label>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              value={section.imageUrl ?? ''}
              onChange={(e) => onChange({ ...section, imageUrl: e.target.value })}
              placeholder="https://… or configs/{siteId}/assets/hero.jpg"
            />
            <button
              type="button"
              className="btn btn-inverted"
              onClick={async () => {
                const picked = await openMediaPicker(`configs/${siteId}/assets/`);
                if (picked) {
                  onChange({ ...section, imageUrl: picked });
                }
              }}
            >
              Pick…
            </button>
          </div>
        </div>
      </div>
    );
  }

  function EditGallery({ section, onChange }: { section: GallerySection; onChange: (s: GallerySection) => void }) {
    const items = section.items ?? [];

    const addFromPicker = async () => {
      const picked = await openMediaPicker('gallery/');
      if (!picked) return;
      const alt = picked.split('/').pop() ?? 'Image';
      const nextItem: GalleryItem = { imageUrl: picked, alt };
      onChange({ ...section, items: [...items, nextItem] });
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Images ({items.length})</div>
          <div className="flex gap-2">
            <button className="btn btn-inverted" onClick={addFromPicker}>Add from S3</button>
          </div>
        </div>

        <div className="grid gap-2">
          {items.map((it, i) => (
            <div key={`${it.imageUrl}-${i}`} className="flex items-center gap-2">
              <input
                className="input flex-1"
                value={it.imageUrl}
                onChange={(e) => {
                  const next = deepClone(section);
                  if (!next.items) next.items = [];
                  next.items[i] = { ...next.items[i], imageUrl: e.target.value };
                  onChange(next);
                }}
              />
              <input
                className="input flex-[0.7]"
                placeholder="alt"
                value={it.alt ?? ''}
                onChange={(e) => {
                  const next = deepClone(section);
                  if (!next.items) next.items = [];
                  next.items[i] = { ...next.items[i], alt: e.target.value };
                  onChange(next);
                }}
              />
              <button
                className="btn btn-ghost"
                onClick={() => {
                  const next = deepClone(section);
                  next.items = (next.items ?? []).filter((_, idx) => idx !== i);
                  onChange(next);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-muted">No images yet.</div>}
        </div>
      </div>
    );
  }

  function EditVideo({
    section,
    onChange,
  }: {
    section: VideoSection;
    onChange: (s: VideoSection) => void;
  }) {
    const setSource = (next: VideoSource) => onChange({ ...section, source: next });

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="input w-full"
            value={section.title ?? ''}
            onChange={(e) => onChange({ ...section, title: e.target.value })}
          />
        </div>

        <VideoSourceEditor
          value={section.source}
          onChange={setSource}
          onPickS3Key={async (apply) => {
            const picked = await openMediaPicker(`configs/${siteId}/videos/`);
            if (picked) apply(picked);
          }}
          onPickPoster={async (apply) => {
            const picked = await openMediaPicker(`configs/${siteId}/assets/`);
            if (picked) {
              onChange({ ...section, posterUrl: picked });
              apply(picked);
            }
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!section.controls}
              onChange={(e) => onChange({ ...section, controls: e.target.checked })}
            />
            <span>Controls</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!section.autoplay}
              onChange={(e) => onChange({ ...section, autoplay: e.target.checked })}
            />
            <span>Autoplay</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!section.muted}
              onChange={(e) => onChange({ ...section, muted: e.target.checked })}
            />
            <span>Muted</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!section.loop}
              onChange={(e) => onChange({ ...section, loop: e.target.checked })}
            />
            <span>Loop</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium">Poster URL (optional)</label>
          <input
            className="input w-full"
            value={section.posterUrl ?? ''}
            onChange={(e) => onChange({ ...section, posterUrl: e.target.value })}
            placeholder="configs/{siteId}/assets/poster.jpg or full URL"
          />
        </div>
      </div>
    );
  }

  function renderEditor(
    section: AnySection,
    index: number,
    onChange: (next: AnySection) => void
  ) {
    return (
      <div className="space-y-4">
        {/* Common fields */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">ID</label>
            <input
              className="input w-full"
              value={section.id}
              onChange={(e) => onChange({ ...section, id: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <input className="input w-full" value={section.type} readOnly />
          </div>
          <label className="flex items-end gap-2">
            <input
              type="checkbox"
              checked={section.visible !== false}
              onChange={(e) => onChange({ ...section, visible: e.target.checked })}
            />
            <span>Visible</span>
          </label>
        </div>

        {/* Type-specific */}
        {isHero(section) && (
          <EditHero section={section} onChange={(s) => onChange(s)} />
        )}
        {isGallery(section) && (
          <EditGallery section={section} onChange={(s) => onChange(s)} />
        )}
        {isVideo(section) && (
          <EditVideo section={section} onChange={(s) => onChange(s)} />
        )}

        {/* Remove */}
        <div className="pt-2">
          <button className="btn btn-ghost" onClick={() => removeSection(index)}>
            Remove section
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------
  // UI
  // ---------------------------

  // Guard until we have a working draft
  if (!draft) {
    return (
      <div className="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center p-4">
        <div className="card p-6">
          <div className="text-sm text-muted">Loading config…</div>
          <div className="mt-4 text-right">
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1200] bg-black/50 flex items-center justify-center p-4">
      <div className="card p-4 relative w-fit !max-w-full pr-[70px] overflow-hidden card-screen-height">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold text-lg">Edit Site Config</div>
          <div className="flex items-center gap-2">
            {error && <div className="text-red-600 text-sm mr-3">{error}</div>}
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={onSave}
              disabled={!canSave || saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid md:grid-cols-3 gap-0">
          {/* Left: Sections list */}
          <div className="border-r p-4 space-y-3">
            <div className="text-sm opacity-70">Sections</div>
            <div className="space-y-2">
              {draft.sections.map((s) => (
                <div key={s.id} className="card p-3">
                  <div className="font-medium">{s.type}</div>
                  <div className="text-xs text-muted break-all">{s.id}</div>
                </div>
              ))}
              {draft.sections.length === 0 && (
                <div className="text-muted text-sm">No sections yet.</div>
              )}
            </div>

            {/* Quick add */}
            <div className="pt-4 border-t">
              <div className="text-sm opacity-70 mb-2">Add section</div>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-inverted" onClick={() => addSection('hero')}>Hero</button>
                <button className="btn btn-inverted" onClick={() => addSection('gallery')}>Gallery</button>
                <button className="btn btn-inverted" onClick={() => addSection('video')}>Video</button>
              </div>
            </div>
          </div>

          {/* Right: Editors (all, simple MVP) */}
          <div className="md:col-span-2 p-4 space-y-4">
            {draft.sections.map((section, index) => (
              <div key={section.id} className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{section.type.toUpperCase()}</div>
                </div>
                {renderEditor(section, index, (next) => updateSection(index, next))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Picker Overlay */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[1300] bg-black/60 flex items-center justify-center p-4">
          <div className="card p-4 relative w-fit max-w-[95vw] pr-[70px]">
            <button
              onClick={handleCancelPick}
              className="absolute right-3 top-3 btn btn-ghost"
              aria-label="Close media picker"
            >
              ✕
            </button>
            <MediaPicker
              bucket={bucket}
              prefix={pickerPrefix}
              onPick={(key) => {
                // key is a strict string
                handlePick(key);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
