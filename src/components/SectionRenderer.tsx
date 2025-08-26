// src/components/SectionRenderer.tsx
'use client';
import type { AnySection } from '@/types/site';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { CTA } from './sections/CTA';
import { Newsletter } from './sections/Newsletter';
import { Contact } from './sections/Contact';
import { Scheduling } from './sections/Scheduling';
import { Footer } from './sections/Footer';

const map = {
  header: Header,
  hero: Hero,
  features: Features,
  cta: CTA,
  newsletter: Newsletter,
  contact: Contact,
  scheduling: Scheduling,
  footer: Footer,
} as const;

export function SectionRenderer({ section }: { section: AnySection }) {
  if (section.visible === false) return null;
  const Cmp = map[section.type] as any;
  if (!Cmp) return null;
  return <Cmp {...section} />;
}
