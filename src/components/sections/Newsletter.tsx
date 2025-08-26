'use client';
import type { NewsletterSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';

export function Newsletter({ title = 'Join the newsletter', body, googleFormEmbedUrl }: NewsletterSection) {
  return (
    <AnimatedSection className="section">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-2xl font-semibold mb-3">{title}</h3>
        {body ? <p className="text-muted mb-6">{body}</p> : null}
        <div className="theme-card overflow-hidden aspect-video shadow-md">
          <iframe className="w-full h-full" src={googleFormEmbedUrl} />
        </div>
      </div>
    </AnimatedSection>
  );
}
