'use client';

import type {
  AnySection,
} from '@/types/site';

import { EditTestimonials } from './fields/TestimonialEditor';
import { EditHero } from './fields/HeroEditor';
import { EditHeader } from './fields/HeaderEditor';
import { EditSectional } from './fields/SectionalEditor';
import { EditAbout } from './fields/AboutEditor';
import { EditCTA } from './fields/CTAEditor';
import { EditVideo } from './fields/VideoEditor';
import  EditGallery  from './fields/GalleryEditor';
import EditFeatures from './fields/FeaturesEditor';
import EditContact from './fields/ContactEditor';
import EditFooter from './fields/FooterEditor';
import EditStats from './fields/StatsEditor';   
import EditInstagram from './fields/InstagramEditor';
import EditPricing from './fields/PricingEditor';
import EditPartners from './fields/PartnersEditor';
import EditShare from './fields/ShareEditor';
import EditScheduling from './fields/SchedulingEditor';
import EditNewsletter from './fields/NewsletterEditor';
import EditDisclaimer from './fields/DisclaimerEditor';

// -----------------------------
// Shared types & helpers
// -----------------------------
export type EditorSharedProps = {
  /** Promise-based bridge into your MediaPicker modal */
  openMediaPicker: (prefix: string) => Promise<string | null>;
  /** Current site namespace (e.g., "carole") */
  siteId: string;
};

export type EditorProps<T extends AnySection> = EditorSharedProps & {
  section: T;
  onChange: (next: T) => void;
};

// function deepClone<T>(obj: T): T {
//   return JSON.parse(JSON.stringify(obj)) as T;
// }
// -----------------------------
// Registry
// -----------------------------
export type EditorComponent<T extends AnySection = AnySection> = (
  props: EditorProps<T>
) => JSX.Element;

export const SECTION_EDITORS: Partial<Record<AnySection['type'], EditorComponent<any>>> = {
  hero: EditHero,
  gallery: EditGallery,
  video: EditVideo,

  // Starter extra editors
  cta: EditCTA,
  about: EditAbout,
  header: EditHeader,
  sectional: EditSectional,
  testimonials: EditTestimonials,
  features: EditFeatures,
  contact: EditContact,
  footer: EditFooter,
  stats: EditStats,
  instagram: EditInstagram, 
  pricing: EditPricing,
  partners: EditPartners,
  share: EditShare,
  scheduling: EditScheduling,
  newsletter: EditNewsletter,
  disclaimer: EditDisclaimer,

  // Add more as you implement them…
};

export function getEditorForSection(section: AnySection) {
  return SECTION_EDITORS[section.type];
}
