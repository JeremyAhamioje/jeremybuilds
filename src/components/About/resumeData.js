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
 * A PDF, printed from this component by Chromium — so it carries REAL TEXT, not
 * a picture of it: 1035 characters an applicant tracking system can extract, and
 * a recruiter can select and paste. One A4 page, 210x297mm exactly.
 *
 * `jeremy-ahamioje-resume.png` sits beside it, generated from the same render at
 * 1992x2419 for anyone holding the older link. BOTH come from this component, so
 * both go stale together — see below.
 *
 * REGENERATING (do this whenever the data above changes, or the file starts
 * claiming things the page no longer does — that is exactly how the placeholder
 * org lines outlived their removal from the page):
 *
 *   1. Isolate `.resume` as the only child of <body>. Every colour token is
 *      declared on `.resume` itself, so it survives the move. Drop the page's
 *      -0.5deg tilt, the radius and the shadow — screen details, not print ones.
 *   2. Force the portrait's `sizes` to 900px, or it prints the 240px source the
 *      layout normally asks for.
 *   3. For the PDF, set the sheet to 582px wide and FREEZE the computed type and
 *      grid values inline. Chromium prints against a viewport of paperWidth/scale
 *      — 582px — which would otherwise trip the sheet's own `max-width: 900px`
 *      rules into a single column and re-resolve every vw-based clamp against
 *      582px instead of the design's 1600px. Inline px has nothing left to
 *      re-resolve, and outranks a media query.
 *      Then `page.pdf({ width: '210mm', height: '297mm', scale: 793.7 / 582 })`.
 *      582 is not arbitrary: it is the width at which the content's own
 *      proportions (823/582 = 1.4146) match A4's 1.4142, so one page fills
 *      without either cropping or a blank lower third.
 *   4. For the PNG, pin the width to its natural CSS measure inside a `zoom: 3`
 *      context and screenshot the element.
 */
export const RESUME_DOWNLOAD_URL = '/jeremy-ahamioje-resume.pdf'
