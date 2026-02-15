'use client';

import { useMemo, useState } from 'react';
import type { SiteConfig } from '@/types/site';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type AdminAIChatPanelProps = {
  mode?: 'drawer' | 'panel' | 'inline';
  title?: string;
  placeholder?: string;
  config: SiteConfig;
  onApplyPatch?: (patch: Partial<SiteConfig>) => void;
  onClose?: () => void;
};

const SITE_CONFIG_SKELETON = {
  theme: {
    preset: 'ocean | sunset | forest | slate | festival | candy | neon | grove | forest-earthy | lavender | irish | splunk | sue | custom',
    colors: {
      primary: '#000000',
      accent: '#000000',
      bg: '#000000',
      bg2: '#000000',
      fg: '#000000',
      muted: '#000000',
      text1: '#000000',
      text2: '#000000',
    },
    radius: 'sm | md | lg | xl | 2xl | full',
  },
  meta: { title: '', description: '', favicon: '' },
  settings: { general: {}, payments: {} },
  sections: [{ id: '...', type: '...' }],
};

function rid() {
  return Math.random().toString(36).slice(2);
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return 'Unable to serialize config.';
  }
}

type AiResponse = {
  reply?: string;
  patch?: Partial<SiteConfig> | null;
};

export default function AdminAIChatPanel({
  mode = 'drawer',
  title = 'AI Assistant',
  placeholder = 'Describe your edit request...',
  config,
  onApplyPatch,
  onClose,
}: AdminAIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [patchText, setPatchText] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inlineExpanded, setInlineExpanded] = useState(false);

  const contextPayload = useMemo(() => {
    return {
      structure: SITE_CONFIG_SKELETON,
      current: {
        theme: config.theme,
        meta: config.meta,
        settings: config.settings,
        sections: config.sections,
      },
    };
  }, [config]);

  function addMessage(role: Message['role'], content: string) {
    setMessages((prev) => [...prev, { id: rid(), role, content }]);
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (mode === 'inline') setInlineExpanded(true);
    addMessage('user', trimmed);
    setInput('');
    setIsLoading(true);
    setError(null);
    try {
      const wireMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: trimmed },
      ];
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: wireMessages,
          context: contextPayload,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `AI request failed: ${res.status}`);
      }
      const data = (await res.json()) as AiResponse;
      if (data.reply) {
        addMessage('assistant', data.reply);
      }
      if (data.patch) {
        setPatchText(JSON.stringify(data.patch, null, 2));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'AI request failed.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function handleApplyPatch() {
    if (!onApplyPatch) return;
    setError(null);
    try {
      const parsed = JSON.parse(patchText) as Partial<SiteConfig>;
      onApplyPatch(parsed);
      setPatchText('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON.';
      setError(msg);
    }
  }

  async function copyContext() {
    const payload = safeStringify(contextPayload);
    try {
      await navigator.clipboard.writeText(payload);
      addMessage('assistant', 'Context copied to clipboard.');
    } catch {
      addMessage('assistant', 'Unable to copy context.');
    }
  }

  const shellClass =
    mode === 'drawer'
      ? 'fixed top-0 right-0 h-full w-[360px] md:w-[420px]  admin-card shadow-2xl border-l z-[12000] flex flex-col'
      : mode === 'panel'
        ? 'h-full w-full  admin-card border-l flex flex-col'
        : 'w-full admin-card border rounded-xl flex flex-col';

  const isExpanded = mode !== 'inline' ? true : inlineExpanded || messages.length > 0;

  return (
    <div className={shellClass}>
      {mode !== 'inline' && (
        <>
          <div className="flex items-center justify-between px-4 py-3 ">
            <div className="font-semibold">{title}</div>
            {onClose && (
              <button className="btn btn-ghost" onClick={onClose}>
                Close
              </button>
            )}
          </div>

          <div className="px-4 py-3 ">
            <button className="btn btn-inverted mr-2" onClick={() => setShowContext((v) => !v)}>
              {showContext ? 'Hide Context' : 'Show Context'}
            </button>
            <button className="btn btn-ghost" onClick={copyContext}>
              Copy Context
            </button>
            {isLoading && <span className="ml-2 text-xs text-muted">Thinking...</span>}
          </div>
        </>
      )}

      {mode === 'inline' && (
        <div className="px-4 py-3 ">
          <label className="block text-sm font-medium mb-1">{title}</label>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleSend();
                }
              }}
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          {mode !== 'inline' && error && <div className="text-xs text-red-600 mt-2">{error}</div>}
        </div>
      )}

      {isExpanded && mode === 'inline' && (
        <div className="px-4 py-2 border-b flex items-center gap-2">
          <button className="btn btn-inverted" onClick={() => setShowContext((v) => !v)}>
            {showContext ? 'Hide Context' : 'Show Context'}
          </button>
          <button className="btn btn-ghost" onClick={copyContext}>
            Copy Context
          </button>
          {isLoading && <span className="text-xs text-muted">Thinking...</span>}
        </div>
      )}

      {isExpanded && showContext && (
        <div className="px-4 py-3 border-b">
          <div className="text-xs text-muted mb-2">Structure + Current SiteConfig</div>
          <pre className="text-xs bg-black/5 p-3 rounded-lg max-h-[220px] overflow-auto">
            {safeStringify(contextPayload)}
          </pre>
        </div>
      )}

      {isExpanded && (
      <div
        className={[
          'px-4 py-3 overflow-auto space-y-3',
          mode === 'inline' ? 'max-h-[260px]' : 'flex-1',
        ].join(' ')}
      >
        {messages.length === 0 ? (
          <div className="text-sm text-muted">
            Ask for edits like “add an about section above the footer” or “change my colors”.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={[
                'rounded-lg px-3 py-2 text-sm',
                m.role === 'user' ? 'bg-emerald-50 text-emerald-900' : 'bg-black/5 text-black',
              ].join(' ')}
            >
              <div className="text-xs opacity-60 mb-1">{m.role === 'user' ? 'You' : 'AI'}</div>
              <div>{m.content}</div>
            </div>
          ))
        )}
      </div>
      )}

      {isExpanded && onApplyPatch && (mode !== 'inline' || patchText.trim().length > 0) && (
        <div className="px-4 py-3 border-t">
          <div className="text-sm font-semibold mb-2">Proposed Changes (JSON)</div>
          <textarea
            className="input w-full min-h-[120px]"
            value={patchText}
            onChange={(e) => setPatchText(e.target.value)}
            placeholder='{"sections":[...]}'
          />
          {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
          <div className="mt-2 flex justify-end">
            <button className="btn btn-primary" onClick={handleApplyPatch}>
              Apply to Draft
            </button>
          </div>
        </div>
      )}

      {mode !== 'inline' && (
        <div className="px-4 py-3 border-t flex gap-2">
          <input
            className="input flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleSend();
              }
            }}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
}
