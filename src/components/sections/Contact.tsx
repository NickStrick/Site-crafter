'use client';
import type { ContactSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';

export function Contact({ title = 'Contact', email, phone, address, mapEmbedUrl }: ContactSection) {
  return (
    <AnimatedSection className="section">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-3xl font-bold mb-4">{title}</h3>
          <ul className="space-y-2 text-lg">
            {email && <li>Email: <a href={`mailto:${email}`} className="underline">{email}</a></li>}
            {phone && <li>Phone: {phone}</li>}
            {address && <li>Address: {address}</li>}
          </ul>
        </div>
        {mapEmbedUrl ? (
          <div className="theme-card overflow-hidden shadow-lg">
            <iframe className="w-full min-h-72" src={mapEmbedUrl} loading="lazy" />
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}
