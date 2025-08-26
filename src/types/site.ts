// src/types/site.ts
export type ThemePreset = 'ocean' | 'sunset' | 'forest' | 'slate';

export type SiteStyle = {
  preset: ThemePreset;
  primary?: string;   // optional overrides, e.g. '#7c3aed'
  accent?: string;
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

export type SectionBase = {
  id: string;
  type:
    | 'header'
    | 'hero'
    | 'features'
    | 'cta'
    | 'newsletter'
    | 'contact'
    | 'scheduling'
    | 'footer';
  // visible/editable flags to support your builder UI
  visible?: boolean;
  editable?: boolean;
};

// add this near other shared types
export type HeaderStyle = {
  sticky?: boolean;                // default: true
  blur?: boolean;                  // default: true (backdrop blur)
  elevation?: 'none' | 'sm' | 'md';// shadow strength
  transparent?: boolean;           // if true, no solid bg (uses transparent/overlay)
};

// update HeaderSection
export type HeaderSection = SectionBase & {
  type: 'header';
  logoText?: string;
  links?: { label: string; href: string }[];
  cta?: { label: string; href: string };
  style?: HeaderStyle; // 👈 new
};


export type HeroSection = SectionBase & {
  type: 'hero';
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl?: string;
};

export type FeaturesSection = SectionBase & {
  type: 'features';
  title?: string;
  items: { icon?: string; title: string; body?: string }[];
};

export type CTASection = SectionBase & {
  type: 'cta';
  title: string;
  body?: string;
  cta: { label: string; href: string };
};

export type NewsletterSection = SectionBase & {
  type: 'newsletter';
  title?: string;
  body?: string;
  googleFormEmbedUrl: string; // prefill URL
};

export type ContactSection = SectionBase & {
  type: 'contact';
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapEmbedUrl?: string;
};

export type SchedulingSection = SectionBase & {
  type: 'scheduling';
  title?: string;
  body?: string;
  calendlyUrl: string; // https://calendly.com/username
};

export type FooterSection = SectionBase & {
  type: 'footer';
  columns?: { title?: string; links: { label: string; href: string }[] }[];
  legal?: string;
};

export type AnySection =
  | HeaderSection
  | HeroSection
  | FeaturesSection
  | CTASection
  | NewsletterSection
  | ContactSection
  | SchedulingSection
  | FooterSection;

export type SiteConfig = {
  theme: SiteStyle;
  sections: AnySection[];
  meta?: { title?: string; description?: string; favicon?: string };
};
