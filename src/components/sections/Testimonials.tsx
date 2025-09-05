'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import type { TestimonialsSection } from '@/types/site';
import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar } from '@fortawesome/free-solid-svg-icons';


// Small helper to render a fixed 5‑star rating
function Stars() {
return (
<div className="flex items-center gap-1 text-yellow-300" aria-label="5 out of 5 stars">
{Array.from({ length: 5 }).map((_, i) => (
<FontAwesomeIcon key={i} icon={faStar} className="w-4 h-4" aria-hidden="true" />
))}
</div>
);
}

export function Testimonials({
  title = 'Our students love us.',
  subtitle,
  items,
  style,
}: TestimonialsSection) {
  const {
    variant = 'card',
    columns = 3,
    showQuoteIcon = true,
    rounded = 'xl',
    background = 'default',
  } = style || {};

  const cardBase =
    'p-6 md:p-7 bg-accent-1 shadow-md';
  const cardInk =
    'p-6 md:p-7 text-[var(--text-1)] bg-[var(--primary)] shadow-lg';
  const radius =
    rounded === '2xl' ? 'rounded-3xl' : rounded === 'lg' ? 'rounded-xl' : 'rounded-2xl';

  const gridCols =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  // ---------- Mobile carousel state (only used when variant === 'carousel') ----------
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!trackRef.current || variant !== 'carousel') return;
    const el = trackRef.current;

    const onScroll = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / (w * 0.86)); // 86% slide width (see below)
      setActive(Math.max(0, Math.min(items.length - 1, i)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [variant, items.length]);

  return (
    <section
      className={[
        'section !pb-[6rem]',
        background === 'band'
          ? 'bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]'
          : '',
      ].join(' ')}
    >
      <AnimatedSection className="mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {title && <h2 className="text-4xl md:text-5xl font-extrabold">{title}</h2>}
          {subtitle && <p className="text-muted mt-3">{subtitle}</p>}
        </div>

        {/* ---------- MOBILE: swipeable carousel when variant === 'carousel' ---------- */}
        {variant === 'carousel' ? (
          <>
            <div
              ref={trackRef}
              className="
                md:hidden                     /* mobile only */
                hide-scrollbar
                -mx-4 px-4
                flex gap-4
                overflow-x-auto
                snap-x snap-mandatory
                scroll-smooth
              "
            >
              {items.map((t, i) => (
                <motion.figure
                  key={`${t.name}-${i}`}
                  initial={{ opacity: 1, y: 0, x: 0 }}
                  whileInView={{ opacity: 1, y: 0,x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.04 }}
                  className={`${
                    cardBase
                  } ${radius} snap-center shrink-0 w-[86%] relative`}
                >
                  {showQuoteIcon && <div className="text-2xl mb-3 opacity-70">“</div>}
                  <blockquote className="text-[1.05rem] leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="flex items-center gap-3 mt-6">
                    {t.avatarUrl ? (
                      <Image
                        src={t.avatarUrl}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-[var(--primary)" />
                    )}
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      {t.role && <div className="text-sm text-muted">{t.role}</div>}
                    </div>
                  </figcaption>
                  <div className="absolute bottom-4 right-4"><Stars /></div>
                </motion.figure>
              ))}
            </div>

            {/* mobile dots */}
            <div className="md:hidden mt-4 flex justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === active
                      ? 'bg-[var(--primary)]'
                      : 'bg-[color-mix(in_srgb,var(--fg)_25%,transparent)]'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    const el = trackRef.current;
                    if (!el) return;
                    const slideW = el.clientWidth * 0.86 + 16; // width + gap (approx)
                    el.scrollTo({ left: i * slideW, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </>
        ) : null}

        {/* ---------- DESKTOP/TABLET: grid (always) ---------- */}
        <div className={`hidden md:grid gap-6 md:gap-8 ${gridCols}`}>
          {items.map((t, i) => (
            <motion.figure
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.05 }}
              className={`relative ${variant === 'ink' ? cardInk : cardBase} ${radius}`}
            >
              {showQuoteIcon && <div className="text-2xl mb-3 opacity-70">“</div>}

              <blockquote className="text-[1.05rem] leading-relaxed">{t.quote}</blockquote>

              <figcaption className="flex items-center gap-3 mt-6">
                {t.avatarUrl ? (
                  <Image
                    src={t.avatarUrl}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="w-11 h-11 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--bg)_40%,transparent)] text-[var(--bg-2)]" />
                )} 
                {/* w-11 h-11 rounded-full bg-[color-mix(in_srgb,var(--fg)_20%,transparent)] */}
                <div>
                  <div className="font-semibold">{t.name}</div>
                  {t.role && (
                    <div
                      className={`text-sm ${
                        variant === 'ink' ? 'text-[var(--text)]/85' : 'text-muted'
                      }`}
                    >
                      {t.role}
                    </div>
                  )}
                </div>
              </figcaption>
              <div className="absolute bottom-4 right-4"><Stars /></div>
            </motion.figure>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
