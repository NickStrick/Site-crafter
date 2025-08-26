// src/components/sections/Header.tsx
'use client';
import type { HeaderSection } from '@/types/site';
import Link from 'next/link';

export function Header({ logoText = 'Site-Crafter', links = [], cta }: HeaderSection) {
  return (
    <header className="section py-4">
      <nav className="mx-auto max-w-6xl flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">{logoText}</Link>
        <div className="hidden md:flex gap-6 text-muted">
          {links.map(l => <Link key={l.href} href={l.href} className="hover:text-fg">{l.label}</Link>)}
        </div>
        {cta ? <Link href={cta.href} className="btn btn-primary">{cta.label}</Link> : null}
      </nav>
    </header>
  );
}
