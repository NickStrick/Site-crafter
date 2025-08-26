'use client';
import type { SchedulingSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';

export function Scheduling({ title = 'Book a call', body, calendlyUrl }: SchedulingSection) {
  const embed = `${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1`;
  return (
    <AnimatedSection className="section">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-3xl font-semibold mb-4">{title}</h3>
        {body ? <p className="text-muted mb-6">{body}</p> : null}
        <div className="theme-card overflow-hidden shadow-md">
          <iframe className="w-full min-h-96" src={embed} />
        </div>
      </div>
    </AnimatedSection>
  );
}
