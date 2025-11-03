'use client';

import { useCallback } from 'react';
import type { FooterSection } from '@/types/site';
import type { EditorProps } from './types';

// tiny immutable helper (kept consistent with other editors)
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export default function EditFooter({
  section,
  onChange,
}: EditorProps<FooterSection>) {
  const columns = section.columns ?? [];

  const setField = useCallback(
    <K extends keyof FooterSection>(key: K, value: FooterSection[K]) => {
      onChange({ ...section, [key]: value });
    },
    [onChange, section]
  );

  const addColumn = useCallback(() => {
    const next = deepClone(section);
    next.columns = [
      ...(next.columns ?? []),
      { title: '', links: [{ label: '', href: '' }] },
    ];
    onChange(next);
  }, [onChange, section]);

  const removeColumn = useCallback(
    (idx: number) => {
      const next = deepClone(section);
      next.columns = (next.columns ?? []).filter((_, i) => i !== idx);
      onChange(next);
    },
    [onChange, section]
  );

  const moveColumn = useCallback(
    (from: number, to: number) => {
      const next = deepClone(section);
      const arr = next.columns ?? [];
      if (to < 0 || to >= arr.length) return;
      const [spliced] = arr.splice(from, 1);
      arr.splice(to, 0, spliced);
      next.columns = arr;
      onChange(next);
    },
    [onChange, section]
  );

  const setColumnTitle = useCallback(
    (idx: number, title: string) => {
      const next = deepClone(section);
      const arr = next.columns ?? [];
      arr[idx] = { ...(arr[idx] ?? { links: [] }), title };
      next.columns = arr;
      onChange(next);
    },
    [onChange, section]
  );

  const addLink = useCallback(
    (colIdx: number) => {
      const next = deepClone(section);
      const arr = next.columns ?? [];
      const col = arr[colIdx] ?? { title: '', links: [] };
      col.links = [...(col.links ?? []), { label: '', href: '' }];
      arr[colIdx] = col;
      next.columns = arr;
      onChange(next);
    },
    [onChange, section]
  );

  const updateLink = useCallback(
    (
      colIdx: number,
      linkIdx: number,
      patch: Partial<NonNullable<FooterSection['columns']>[number]['links'][number]>
    ) => {
      const next = deepClone(section);
      const col = (next.columns ?? [])[colIdx];
      if (!col) return;
      const links = col.links ?? [];
      links[linkIdx] = { ...(links[linkIdx] ?? { label: '', href: '' }), ...patch };
      col.links = links;
      (next.columns ?? [])[colIdx] = col;
      onChange(next);
    },
    [onChange, section]
  );

  const removeLink = useCallback(
    (colIdx: number, linkIdx: number) => {
      const next = deepClone(section);
      const col = (next.columns ?? [])[colIdx];
      if (!col) return;
      col.links = (col.links ?? []).filter((_, i) => i !== linkIdx);
      (next.columns ?? [])[colIdx] = col;
      onChange(next);
    },
    [onChange, section]
  );

  const moveLink = useCallback(
    (colIdx: number, from: number, to: number) => {
      const next = deepClone(section);
      const col = (next.columns ?? [])[colIdx];
      if (!col) return;
      const arr = col.links ?? [];
      if (to < 0 || to >= arr.length) return;
      const [spliced] = arr.splice(from, 1);
      arr.splice(to, 0, spliced);
      col.links = arr;
      (next.columns ?? [])[colIdx] = col;
      onChange(next);
    },
    [onChange, section]
  );

  return (
    <div className="space-y-6">
      {/* Legal line */}
      <div>
        <label className="block text-sm font-medium">Legal Text</label>
        <input
          className="input w-full"
          value={section.legal ?? ''}
          onChange={(e) => setField('legal', e.target.value)}
          placeholder="© 2025 Your Company. All rights reserved."
        />
      </div>

      {/* Columns */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Columns</div>
        <button className="btn btn-ghost" onClick={addColumn}>
          Add column
        </button>
      </div>

      <div className="space-y-4">
        {columns.map((col, ci) => {
          const links = col.links ?? [];
          return (
            <div key={`footer-col-${ci}`} className="card p-3 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  className="input flex-1"
                  placeholder="Column title (optional)"
                  value={col.title ?? ''}
                  onChange={(e) => setColumnTitle(ci, e.target.value)}
                />
                <button
                  className="btn btn-ghost"
                  onClick={() => moveColumn(ci, ci - 1)}
                  disabled={ci === 0}
                  title="Move column up"
                >
                  ↑
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => moveColumn(ci, ci + 1)}
                  disabled={ci === columns.length - 1}
                  title="Move column down"
                >
                  ↓
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => removeColumn(ci)}
                  title="Remove column"
                >
                  Remove
                </button>
              </div>

              {/* Links */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs opacity-70">Links</div>
                  <button className="btn btn-ghost" onClick={() => addLink(ci)}>
                    Add link
                  </button>
                </div>

                {links.map((lnk, li) => (
                  <div
                    key={`footer-col-${ci}-link-${li}`}
                    className="grid md:grid-cols-[1fr_1fr_auto_auto_auto] gap-2"
                  >
                    <input
                      className="input"
                      placeholder="Label"
                      value={lnk.label}
                      onChange={(e) => updateLink(ci, li, { label: e.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Href (/about, https://, mailto:, tel:)"
                      value={lnk.href}
                      onChange={(e) => updateLink(ci, li, { href: e.target.value })}
                    />
                    <button
                      className="btn btn-ghost"
                      onClick={() => moveLink(ci, li, li - 1)}
                      disabled={li === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => moveLink(ci, li, li + 1)}
                      disabled={li === links.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => removeLink(ci, li)}
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {links.length === 0 && (
                  <div className="text-sm text-muted">No links yet. Click “Add link”.</div>
                )}
              </div>
            </div>
          );
        })}

        {columns.length === 0 && (
          <div className="text-sm text-muted">No columns yet. Click “Add column”.</div>
        )}
      </div>
    </div>
  );
}
