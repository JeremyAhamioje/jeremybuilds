/**
 * Résumé content.
 *
 * Contact details, capabilities and toolkit are real. The employment history is
 * described by period, mode and role — with no employer named on the two
 * earlier entries, because none has been supplied.
 *
 * That omission is deliberate and should stay that way until Jeremy provides
 * the real names. An invented org on a CV is not a layout placeholder; it is a
 * false claim about who someone has worked for, and this file ships to a public
 * site that people will read as fact. `org` is therefore optional, and Resume
 * renders the entry without the line when it is absent.
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
      summary:
        'Shipped product surfaces against a design system, owning both the component layer and the API contracts feeding it.',
    },
    {
      period: '2021 — 2022',
      place: 'Remote',
      title: 'Front-End Developer',
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

/**
 * Where the download button points. Lives in `public/`, so it is served as-is
 * and keeps a stable URL someone can bookmark or paste into an email.
 *
 * RENDERED FROM THIS COMPONENT, not drawn separately — 1992x2419, captured
 * from `.resume` in a real browser at 3x. That matters for a reason beyond
 * sharpness: the file and the page cannot disagree. The version it replaced was
 * a separate 768px image, and when the two employment entries above lost their
 * placeholder org line, that file went on advertising it to anyone who
 * downloaded the CV.
 *
 * So REGENERATE IT whenever this data changes. Isolate `.resume` (detach it
 * from the scroll-driven page, drop the tilt, the radius and the shadow), pin
 * its width to the natural CSS measure inside a `zoom: 3` context, and force
 * the portrait's `sizes` up so it fetches its 900px source rather than the
 * 240px one the layout normally asks for.
 *
 * Still a picture of text. A PDF export would be selectable and parseable,
 * which is what applicant tracking systems actually read — worth doing, and
 * the only reason this is a PNG is that a PNG is what the download has always
 * been. At 241 DPI across A4 it is at least sound to print now.
 */
export const RESUME_DOWNLOAD_URL = '/jeremy-ahamioje-resume.png'
