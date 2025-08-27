'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import type { TestimonialsSection } from '@/types/site';

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
    'p-6 md:p-7 bg-[color-mix(in_srgb,var(--fg)_5%,transparent)] shadow-md';
  const cardInk =
    'p-6 md:p-7 text-white bg-[color-mix(in_srgb,var(--primary)_80%,transparent)] shadow-lg';
  const radius =
    rounded === '2xl' ? 'rounded-3xl' : rounded === 'lg' ? 'rounded-xl' : 'rounded-2xl';

  const gridCols =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  return (
    <section
      className={[
        'section',
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

        <div className={`grid gap-6 md:gap-8 ${gridCols}`}>
          {items.map((t, i) => (
            <motion.figure
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.05 }}
              className={`${variant === 'ink' ? cardInk : cardBase} ${radius}`}
            >
              {showQuoteIcon && (
                <div className="text-2xl mb-3 opacity-70">“</div>
              )}

              <blockquote className="text-[1.05rem] leading-relaxed">
                {t.quote}
              </blockquote>

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
                  <div className="w-11 h-11 rounded-full bg-[color-mix(in_srgb,var(--fg)_20%,transparent)]" />
                )}
                <div>
                  <div className="font-semibold">{t.name}</div>
                  {t.role && (
                    <div
                      className={`text-sm ${
                        variant === 'ink' ? 'text-white/85' : 'text-muted'
                      }`}
                    >
                      {t.role}
                    </div>
                  )}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
