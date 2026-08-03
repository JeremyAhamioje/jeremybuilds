/**
 * Services.
 *
 * Capabilities and outcomes, not implementation technologies. "Next.js /
 * Prisma / MongoDB" answers a question nobody browsing a portfolio is asking;
 * the tool stack section already carries that, and carrying it twice would
 * turn the offer into a CV.
 *
 * Six is deliberate — enough to show range across design, build and AI without
 * the list reading as "anything you like, really", which reads as nothing.
 *
 * `art` keys an illustration in ServiceArt.jsx.
 */
export const SERVICES = [
  {
    id: 'web-development',
    number: '01',
    title: 'Web Development',
    blurb: 'Fast, responsive websites built for real-world use.',
    art: 'web',
  },
  {
    id: 'web-apps',
    number: '02',
    title: 'Web Apps & SaaS',
    blurb: 'From MVPs to full-stack applications and internal tools.',
    art: 'saas',
  },
  {
    id: 'mobile',
    number: '03',
    title: 'Mobile Applications',
    blurb: 'Cross-platform mobile experiences from concept to deployment.',
    art: 'mobile',
  },
  {
    id: 'design',
    number: '04',
    title: 'UI/UX & Product Design',
    blurb: 'Interfaces that balance aesthetics, usability and product goals.',
    art: 'design',
  },
  {
    id: 'ai',
    number: '05',
    title: 'AI Integration & Automation',
    blurb: 'AI-powered features and workflows that eliminate repetitive work.',
    art: 'ai',
  },
  {
    id: 'interactive',
    number: '06',
    title: 'Interactive Experiences',
    blurb: 'Motion, 3D and interactive interfaces that make products memorable.',
    art: 'interactive',
  },
]
