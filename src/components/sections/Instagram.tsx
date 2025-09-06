'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import type { InstagramSection } from '@/types/site';

/**
 * Instagram component
 * - Animates in using <AnimatedSection />
 * - Supports single post or a small grid of posts
 * - Responsive width with configurable max sizes
 * - Re-uses the existing Instagram embed.js (loaded once)
 * - Typed via InstagramSection in src/types/site.ts
 * - NEW: orientation option ('profile' | 'landscape') to adjust sizing/shadows
 */

const ensureEmbedScript = () => {
  if (typeof window === 'undefined') return;
  const existing = document.querySelector("script[src='https://www.instagram.com/embed.js']");
  if (!existing) {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  } else if ((window as any).instgrm?.Embeds?.process) {
    (window as any).instgrm.Embeds.process();
  }
};
function fitInstagramIframes(root?: HTMLElement | null) {
  if (!root) return;
  const frames = root.querySelectorAll<HTMLIFrameElement>("blockquote.instagram-media iframe");
  frames.forEach((f) => {
    // Strip inline sizes set by IG
    f.removeAttribute("width");
    f.removeAttribute("height");
    // Force-fill our aspect box
    Object.assign(f.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
    });
  });
}

// Helper: compute aspect string
function getAspect(orientation: 'profile' | 'landscape') {
  return orientation === 'landscape' ? '16 / 9' : '4 / 5';
}

export default function Instagram({
  id = 'instagram',
  title,
  subtitle,
  items,
  align = 'center',
  maxWidth = 640,
  rounded = 'xl',
  columns = 2,
  orientation = 'profile',
}: InstagramSection) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureEmbedScript();
    const iv = setInterval(() => {
      if ((window as any).instgrm?.Embeds?.process) {
        clearInterval(iv);
        setReady(true);
        (window as any).instgrm.Embeds.process();
      }
    }, 200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
  if (!ready) return;

  (window as any).instgrm?.Embeds?.process?.();

  // 1) Immediate pass
  fitInstagramIframes(containerRef.current);

  // 2) Observe new/updated iframes (IG reflows asynchronously)
  const obs = new MutationObserver(() => fitInstagramIframes(containerRef.current));
  if (containerRef.current) {
    obs.observe(containerRef.current, { childList: true, subtree: true });
  }

  // 3) A couple of delayed passes for good measure
  const t1 = setTimeout(() => fitInstagramIframes(containerRef.current), 250);
  const t2 = setTimeout(() => fitInstagramIframes(containerRef.current), 1000);

  return () => {
    obs.disconnect();
    clearTimeout(t1);
    clearTimeout(t2);
  };
}, [ready, items]);

  const roundedCls = rounded === '2xl' ? 'rounded-3xl' : rounded === 'lg' ? 'rounded-xl' : 'rounded-2xl';

  // Orientation-aware defaults
  const isLandscape = orientation === 'landscape';
  const effectiveMax = maxWidth ?? (isLandscape ? 800 : 640);
  const aspect = getAspect(orientation);

  const gridCols =
    columns === 1
      ? 'grid-cols-1'
      : columns === 3
      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2';

  return (
    <section id={id} className="section bg-gradient-2-top">
      <AnimatedSection className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <div className={[align === 'center' ? 'text-center' : 'text-left', 'max-w-3xl mx-auto mb-8'].join(' ')}>
            {title && <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>}
            {subtitle && <p className="text-muted mt-2">{subtitle}</p>}
          </div>
        )}

        <div ref={containerRef} className={items.length > 1 ? `grid gap-6 ${gridCols}` : 'flex justify-center'}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`mx-auto w-full ${roundedCls} shadow-[0_10px_30px_rgba(0,0,0,.15)] relative overflow-hidden`}
              style={{ maxWidth: effectiveMax, aspectRatio: aspect, minHeight: 400 }}
            >
              <blockquote
                className={`instagram-media absolute inset-0`}
                data-instgrm-permalink={item.url}
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: 0,
                  margin: 0,
                  padding: 0,
                  width: '100%',
                  height: '100%',
                  boxShadow: isLandscape ? '0 12px 36px rgba(0,0,0,.22)' : '0 10px 30px rgba(0,0,0,.15)',
                }}
              />
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
