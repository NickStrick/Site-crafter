// src/sections/About.tsx
import type { AboutSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';

export function About({ id, title = 'About', body, imageUrl, bullets, align = 'left' }: AboutSection) {
  const imageFirst = align === 'left';
  return (
    <section id="about" className="section !py-6 !pt-2">
      <div className={`container mx-auto px-4 grid gap-10 ${imageUrl?'md:grid-cols-2':'md:grid-cols-1'} items-center`}>
        {imageUrl && imageFirst && (
          <AnimatedSection><img src={imageUrl} alt={title} className="w-full rounded-xl object-cover" /></AnimatedSection>
        )}
        <AnimatedSection className="mx-auto max-w-6xl">
          {title && <h2 className="text-3xl font-semibold mb-4 text-center text-muted">{title}</h2>}
          <p className="text-lg leading-relaxed indent-[50px]">{body}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-6 space-y-2 list-disc pl-5">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </AnimatedSection>
        {imageUrl && !imageFirst && (
          <img src={imageUrl} alt={title} className="w-full rounded-xl object-cover" />
        )}
      </div>
    </section>
  );
}
