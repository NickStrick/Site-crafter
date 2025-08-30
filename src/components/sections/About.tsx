// src/sections/About.tsx
import type { AboutSection } from '@/types/site';

export function About({ title = 'About', body, imageUrl, bullets, align = 'left' }: AboutSection) {
  const imageFirst = align === 'left';
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto grid gap-10 md:grid-cols-2 items-center">
        {imageUrl && imageFirst && (
          <img src={imageUrl} alt={title} className="w-full rounded-xl object-cover" />
        )}
        <div>
          {title && <h2 className="text-3xl font-semibold mb-4">{title}</h2>}
          <p className="text-lg leading-relaxed">{body}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-6 space-y-2 list-disc pl-5">
              {bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </div>
        {imageUrl && !imageFirst && (
          <img src={imageUrl} alt={title} className="w-full rounded-xl object-cover" />
        )}
      </div>
    </section>
  );
}
