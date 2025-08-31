// src/components/SectionRenderer.tsx
'use client';
import type { AnySection } from '@/types/site';
import  Navbar  from './sections/Navbar';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { CTA } from './sections/CTA';
import { Newsletter } from './sections/Newsletter';
import { Contact } from './sections/Contact';
import { Scheduling } from './sections/Scheduling';
import { Footer } from './sections/Footer';
import { Testimonials } from './sections/Testimonials';
import  Sectional  from './sections/Sectional';
import Skills from './sections/Skills';
import { Disclaimer } from './sections/Disclaimer';
import { About } from './sections/About';

import { Stats } from './sections/Stats';
const map = {
  header: Navbar,
  hero: Hero,
  features: Features,
  cta: CTA,
  newsletter: Newsletter,
  contact: Contact,
  scheduling: Scheduling,
  footer: Footer,
  testimonials: Testimonials, 
  stats: Stats, 
  disclaimer: Disclaimer,
  about: About,
  sectional: Sectional,
  skills: Skills,
} as const;

export function SectionRenderer({ section }: { section: AnySection }) {
  if (section.visible === false) return null;
  const Cmp = map[section.type] as any;
  if (!Cmp) return null;
  return <Cmp {...section} />;
}
