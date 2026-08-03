/**
 * PLACEHOLDER CONTENT.
 *
 * Structure is real, wording is not — this exists so the layout can be judged
 * on typography and rhythm before the real history goes in. Deliberately no
 * invented employers, clients or awards: nothing here should be able to ship
 * as though it were a claim.
 *
 * The contact block below is real and live — everything above it in this file
 * is still placeholder wording.
 */
export const RESUME = {
  meta: {
    location: 'Available worldwide',
    site: 'jeremybuilds.online',
    email: 'ahamiojejeremy@gmail.com',
  },

  name: 'Jeremy Ahamioje',
  role: 'Designer & Full-Stack Developer',

  /** Left column. */
  experience: [
    {
      period: '2023 — Present',
      place: 'Independent',
      title: 'Designer & Developer',
      org: 'Freelance practice',
      summary:
        'Design and build interfaces end to end — research and art direction through to production front-end and the services behind it.',
    },
    {
      period: '2022 — 2023',
      place: 'Remote',
      title: 'Full-Stack Developer',
      org: 'Placeholder engagement',
      summary:
        'Shipped product surfaces against a design system, owning both the component layer and the API contracts feeding it.',
    },
    {
      period: '2021 — 2022',
      place: 'Remote',
      title: 'Front-End Developer',
      org: 'Placeholder engagement',
      summary:
        'Built responsive marketing and application front-ends with a focus on motion, accessibility and performance budgets.',
    },
  ],

  /**
   * Right column, split explicitly. Two headed groups rather than one list is
   * the whole point — it states the full-stack claim structurally instead of
   * burying it in prose.
   */
  capabilities: [
    {
      group: 'Design',
      items: [
        'Art direction & visual identity',
        'Interface & interaction design',
        'Typography & design systems',
        'Prototyping & motion studies',
      ],
    },
    {
      group: 'Development',
      items: [
        'React, TypeScript, modern build tooling',
        'Creative development — WebGL, GSAP, Canvas',
        'Node APIs, data modelling, integrations',
        'Performance, accessibility, CI & deployment',
      ],
    },
  ],

  /** Bottom band. */
  toolkit: [
    'Figma',
    'React',
    'Three.js',
    'GSAP',
    'Node',
    'PostgreSQL',
    'Vite',
    'Framer Motion',
  ],
}

/** Where the download button points. Drop the file in `public/` to enable it. */
export const RESUME_PDF_URL = '/jeremy-ahamioje-resume.pdf'
