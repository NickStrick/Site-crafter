'use client';
import type { CTASection } from '@/types/site';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

export function CTA({ title, body, cta }: CTASection) {
  return (
    <AnimatedSection className="section">
      <div className="mx-auto max-w-3xl text-center theme-card p-12 shadow-xl bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]">
        <h3 className="text-3xl font-bold mb-4">{title}</h3>
        {body ? <p className="text-lg text-muted mb-6">{body}</p> : null}
        <Link href={cta.href} className="btn btn-primary">{cta.label}</Link>
      </div>
    </AnimatedSection>
  );
}
