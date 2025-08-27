// src/mocks/siteConfig.ts
import type { SiteConfig } from "@/types/site";

export const mockSiteConfig: SiteConfig = {
 theme: { preset: 'festival', radius: 'xl' },
  meta: {
    title: "Site-Crafter Demo",
    description: "Composable pages with runtime theming",
    favicon: "/favicon.ico",
  },
  sections: [
    {
      id: 'hdr',
      type: 'header',
      logoText: 'Site-Crafter',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Newsletter', href: '#newsletter' },
        { label: 'Contact', href: '#contact' },
      ],
      cta: { label: 'Book a call', href: '#sched' },
      style: {
        sticky: true,     // 👈 flip to false to test non-sticky
        blur: true,
        elevation: 'sm',
        transparent: false,
      },
    },
    {
      id: "hero1",
      type: "hero",
      eyebrow: "Freelancer-ready",
      title: "Build client sites in minutes",
      subtitle:
        "Productize 80–90% of your workflow and keep room for bespoke polish.",
      primaryCta: { label: "See pricing", href: "#cta-pricing" },
      secondaryCta: { label: "How it works", href: "#features" },
      imageUrl:
        "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
    },
    { id: 'hero2', type: 'hero',
  eyebrow: 'Freelancer-ready',
  title: 'Learning is for everyone', // try playful wording
  subtitle: 'Productize 80–90% of your build. Keep the craft where it matters.',
  primaryCta: { label: 'Book a free discovery call', href: '#sched' },
  imageUrl: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop'
},
{ id: 'cta1', type:'cta',
  title:'A festival of discovery',
  body:'Ship beautiful websites, then keep iterating with presets.',
  cta: { label:'See more', href:'#' }
},
    {
      id: "features",
      type: "features",
      title: "What you get",
      items: [
        {
          title: "Composable Sections",
          body: "Header, hero, features, CTA, contact, scheduling, footer.",
        },
        {
          title: "Live Theming",
          body: "4 presets + any color override via API/env.",
        },
        { title: "Integrations", body: "Calendly scheduling and Google Forms newsletter." },
        { title: "Typed Config", body: "Backend returns JSON that maps 1:1 to sections." },
        { title: "Runtime Edits", body: "Swap styles instantly with a small switcher." },
        { title: "Fast Shipping", body: "Reuse 80–90% across clients, customize the rest." },
      ],
    },
    {
      id: "cta-pricing",
      type: "cta",
      title: "Ready to ship faster?",
      body: "Pick a preset, tweak colors, and publish. Perfect for productized freelancing.",
      cta: { label: "Get started", href: "#newsletter" },
    },
    {
      id: "newsletter",
      type: "newsletter",
      title: "Join the newsletter",
      body: "Tips, presets, and new section drops. No spam.",
      googleFormEmbedUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSdEXAMPLE123/viewform?embedded=true",
    },
    {
      id: "contact",
      type: "contact",
      title: "Contact",
      email: "hello@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Chicago, IL",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1dChicagoDemo",
    },
    {
      id: "sched",
      type: "scheduling",
      title: "Book a demo",
      body: "Pick a time that works for you.",
      calendlyUrl: "https://calendly.com/your-handle/intro",
    },
    {
      id: "cta-bottom",
      type: "cta",
      title: "Like what you see?",
      body: "This entire page was rendered from a JSON config.",
      cta: { label: "Start a project", href: "#contact" },
    },
    {
  id: 'stats1',
  type: 'stats',
  title: 'By the numbers',
  subtitle: 'Social proof and scale, at a glance.',
  style: {
    align: 'center',
    columns: 4,
    divider: 'line',      // try 'dot' or 'line'
    color: 'accent',     // try 'accent' or 'primary'
    compact: false
  },
  items: [
    { value: 100, label: 'Users', suffix: '+', },
    { value: 845,    label: 'Happy Customers', suffix: '+', },
    { value: 8,        label: 'Offices Worldwide' },
    { value: 60,        label: 'Complete Projects', suffix: '+' },
  ],
},

    {
  id: 'testi',
  type: 'testimonials',
  title: 'Our students love us.',
  subtitle: 'Talk about how successful your students are.',
  style: {
    variant: 'card',     // try 'ink'
    columns: 3,          // try 2
    showQuoteIcon: true,
    rounded: 'xl',
    background: 'default' // or 'band'
  },
  items: [
    {
      quote:
        '“Duis blandit lectus ultrices interdum fermentum. Sed dolor metus, cursus id metus at, fermentum bibendum sapien.”',
      name: 'Mark Rosh',
      role: 'Founder of Ngma',
      avatarUrl:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=crop',
    },
    {
      quote:
        '“Vestibulum placerat diam aliquet elit hendrerit lacinia. Ut quam orci, porttitor et nunc non, ullamcorper interdum ipsum.”',
      name: 'Ameline Joy',
      role: 'Founder of Ngma',
      avatarUrl:
        'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=200&auto=format&fit=crop',
    },
    {
      quote:
        '“Mauris id tortor non leo aliquet mattis. Integer vitae nulla finibus elit convallis accumsan.”',
      name: 'Amanda Main',
      role: 'Founder of Ngma',
      avatarUrl:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop',
    },
    {
      quote:
        '“Vestibulum tincidunt nisl a lorem luctus, ut varius orci mattis. Cras vestibulum volutpat augue.”',
      name: 'Steven Rosh',
      role: 'Founder of Ngma',
      avatarUrl:
        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop',
    },
    {
      quote: '“Phasellus ac aliquet diam. Sed pellentesque mattis ultricies.”',
      name: 'Jane Cooper',
      role: 'Parent',
    },
    {
      quote:
        '“Curabitur laoreet, nulla malesuada venenatis condimentum.”',
      name: 'Tommy Parks',
      role: 'Student',
    },
  ],
},
    {
      id: "ftr",
      type: "footer",
      columns: [
        {
          title: "Company",
          links: [
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
          ],
        },
        {
          title: "Resources",
          links: [
            { label: "Docs", href: "#" },
            { label: "Blog", href: "#" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
          ],
        },
        { title: "Social", links: [{ label: "Twitter/X", href: "#" }] },
      ],
      legal: "© 2025 Site-Crafter. All rights reserved.",
    },
  ],
};
