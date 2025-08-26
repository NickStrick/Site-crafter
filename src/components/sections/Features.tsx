'use client';
import type { FeaturesSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';

export function Features({ title, items }: FeaturesSection) {
  return (
    <AnimatedSection className="section bg-app">
      <div className="mx-auto max-w-6xl text-center">
        {title ? <h2 className="text-4xl font-bold mb-12">{title}</h2> : null}
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((f, i) => (
            <AnimatedSection
              key={i}
              delay={i * 0.1}
              className="p-6 theme-card bg-[color-mix(in_srgb,var(--fg)_5%,transparent)] shadow-lg"
            >
              <div className="text-xl font-semibold mb-2">{f.title}</div>
              {f.body ? <p className="text-muted">{f.body}</p> : null}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
