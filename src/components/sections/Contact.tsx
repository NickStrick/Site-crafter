'use client';
import type { ContactSection } from '@/types/site';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';


export function Contact({
  id,
  title = 'Contact',
  email,
  phone,
  address,
  mapEmbedUrl,
  socials,
  backgroundUrl,
}: ContactSection) {

  return (
    <section
      id={id}
      className="relative bg-fixed bg-cover bg-center py-[10rem]"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
      }}
    >
      {/* optional overlay for contrast */}
      <div className="absolute inset-0 bg-black/50" aria-hidden />

      <AnimatedSection
        className={`relative z-10 max-w-6xl mx-auto grid ${mapEmbedUrl?'md:grid-cols-2':'md:grid-cols-1'} gap-8 px-4`}
      >
        <div>
          <h3 className="text-4xl font-bold mb-4 text-white w-fit m-auto">{title}</h3>
          <ul className="space-y-3 text-xl text-white/90 w-fit m-auto">
            {email && (
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
                <a href={`mailto:${email}`} className="underline">
                  {email}
                </a>
              </li>
            )}
            {phone && <li>Phone: {phone}</li>}
            {address && (
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5" />
                <span>{address}</span>
              </li>
            )}
            {socials &&
              socials.map((s, i) =>
                s.label.toLowerCase().includes('linkedin') ? (
                  <li key={i} className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className='underline'>
                      {s.label}
                    </a>
                  </li>
                ) : null
              )}
          </ul>
        </div>
        {mapEmbedUrl ? (
          <motion.div
            className="theme-card overflow-hidden shadow-lg relative z-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <iframe
              className="w-full min-h-72"
              src={mapEmbedUrl}
              loading="lazy"
            />
          </motion.div>
        ) : null}
      </AnimatedSection>
    </section>
  );
}