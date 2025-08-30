// src/mocks/siteConfig.amanda.ts
import type { SiteConfig } from "@/types/site";

export const mockSiteConfig: SiteConfig = {
  theme: { preset: "grove", radius: "xl" },
  meta: {
    title: "Amanda Grau, BCBA",
    description:
      "Guided by compassion, grounded in science. Board Certified Behavior Analyst in the Chicago suburbs.",
    favicon: "/favicon.ico",
  },
  sections: [
    {
      id: "hdr",
      type: "header",
      logoText: "Amanda Grau, BCBA",
      links: [
        { label: "About", href: "#about" },
        { label: "Book", href: "#book" },
        { label: "Services", href: "#services" },
        { label: "Contact", href: "#contact" },
      ],
      cta: {
        label: "Connect on LinkedIn",
        href: "https://www.linkedin.com/in/your-handle-here",
      },
      style: {
        sticky: true,
        blur: true,
        elevation: "sm",
        transparent: false,
      },
    },
    {
      id: "hero",
      type: "hero",
      eyebrow: "Board Certified Behavior Analyst",
      title: "Guided by compassion, grounded in science.",
      subtitle:
        "I support children with autism—and the adults who love and teach them—through compassionate, science-based strategies.",
      primaryCta: {
        label: "Connect on LinkedIn",
        href: "https://www.linkedin.com/in/your-handle-here",
      },
      secondaryCta: { label: "Get in touch", href: "#contact" },
      imageUrl: "/images/placeholders/hero-forest-light.jpg",
    },
    {
      id: "about",
      type: "about",
      title: "About Amanda",
      body: `I’m Amanda Grau, a Board Certified Behavior Analyst based in the suburbs of Chicago, Illinois. I’ve worked in home, and clinic settings, supporting children with autism and their families. My approach is rooted in compassion, science, and a trauma-informed lens, always seeking to empower parents, teachers, and professionals with strategies that create meaningful change. I hold a Master of Applied Behavior Analysis with an emphasis in Autism Spectrum Disorder from Ball State University, and I’m passionate about neurodiversity-affirming care, ACT-informed practice, and contextual behaviorism.`,
      imageUrl: "/images/placeholders/headshot.jpg",
    },
    {
      id: "book",
      type: "features",
      title: "Book & Projects",
      items: [
        {
          title: "Quote Book (Upcoming)",
          body: "A curated collection of compassionate, science-informed quotes for parents, teachers, and professionals.",
          imageUrl: "/images/placeholders/book-cover.png",
          meta: [
            { label: "Format", value: "Print & Digital (TBD)" },
            { label: "Release", value: "TBD" },
          ],
        },
      ],
    },
    {
      id: "services",
      type: "cta",
      title: "Services (Coming Soon)",
      body: "Parent consulting and CEUs are planned for the future. In the meantime, feel free to connect and follow along for updates.",
      cta: { label: "Get notified", href: "#newsletter" },
    },
    {
      id: "contact",
      type: "contact",
      title: "Contact",
      email: "hello@amandagrau.com",
      address: "Chicago Suburbs, IL",
      socials: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle-here" },
      ],
    },
    {
      id: "disclaimer",
      type: "disclaimer",
      title: "Disclaimer",
      body: "Information on this site is for educational purposes only and is not a substitute for professional advice or individualized services.",
      enabled: false,
    },
    {
      id: "ftr",
      type: "footer",
      columns: [
        {
          title: "Explore",
          links: [
            { label: "About", href: "#about" },
            { label: "Book", href: "#book" },
            { label: "Services", href: "#services" },
          ],
        },
        {
          title: "Connect",
          links: [
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/your-handle-here",
            },
            { label: "Email", href: "mailto:hello@amandagrau.com" },
          ],
        },
      ],
      legal: "© 2025 Amanda Grau. All rights reserved.",
    },
  ],
};