'use client';
import type { HeroSection } from '@/types/site';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

export function Hero({ eyebrow, title, subtitle, primaryCta, secondaryCta, imageUrl }: HeroSection) {
  return (
    <AnimatedSection className="section bg-app">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        <div>
          {eyebrow ? <p className="text-sm font-semibold text-primary mb-2">{eyebrow}</p> : null}
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">{title}</h1>
          {subtitle ? <p className="text-lg text-muted mb-8">{subtitle}</p> : null}
          <div className="flex gap-4">
            {primaryCta && <Link href={primaryCta.href} className="btn btn-primary">{primaryCta.label}</Link>}
            {secondaryCta && <Link href={secondaryCta.href} className="btn btn-ghost">{secondaryCta.label}</Link>}
          </div>
        </div>
        {imageUrl ? (
          <div className="theme-card overflow-hidden shadow-xl">
            <Image src={imageUrl} alt="" width={800} height={600} className="w-full h-auto rounded-2xl" />
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}
