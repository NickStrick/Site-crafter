// src/mocks/siteConfig.ts
import type { SiteConfig } from "@/types/site";

export const mockSiteConfig: SiteConfig = {
  theme: {
    preset: "ocean",
    radius: "xl",
  },
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
      id: "hero",
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
