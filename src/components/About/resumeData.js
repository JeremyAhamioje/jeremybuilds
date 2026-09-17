/**
 * Résumé content — engineering-facing.
 *
 * Retargeted 2026-09-17 for full-stack roles (specifically SerpApi), replacing
 * the design-led version now in `archive/resume-2026-09-design/`. The framing
 * follows a deliberate hierarchy: full-stack development first, data
 * extraction and automation as the strong secondary, design as a
 * differentiator rather than the identity.
 *
 * THE RULE FOR EVERY LINE: it must survive being asked about in an interview.
 * "Built X using Y" is claimed only where the code exists and does that. Each
 * project below points at a public repo or a live URL; the stack lines are read
 * from the projects' own package.json files; the numbers (50 venues, 176/97/54
 * listings, 3,000+ hours) are the projects' own recorded figures. Nothing is
 * rounded up, and "I have built projects with X" is never allowed to drift into
 * "I have professional experience in X".
 *
 * Employer names for the 2021–22 and 2022–23 entries have never been supplied
 * and are omitted, not invented. `org` is optional and the component skips it.
 */
export const RESUME = {
  meta: {
    location: 'Lagos, Nigeria · Remote',
    site: { label: 'jeremybuilds.online', href: 'https://www.jeremybuilds.online/' },
    email: { label: 'ahamiojejeremy@gmail.com', href: 'mailto:ahamiojejeremy@gmail.com' },
    github: { label: 'github.com/JeremyAhamioje', href: 'https://github.com/JeremyAhamioje' },
    linkedin: {
      label: 'linkedin.com/in/jeremy-ahamioje',
      href: 'https://www.linkedin.com/in/jeremy-ahamioje-42b56725a',
    },
  },

  name: 'Jeremy Ahamioje',
  role: 'Full-Stack Developer',

  summary:
    'I build API-driven, data-heavy web applications end to end — React and TypeScript front-ends, Node and Python services, PostgreSQL underneath — and run them in production. Recent work centres on programmatic search, web scraping and data extraction, including a live platform built on SerpApi. A design background means the interfaces hold up too.',

  /**
   * Immediately after the summary, so the first concrete thing a reader sees is
   * something they can open and inspect rather than a job description to infer
   * from. Ordered by relevance to the target role, not by date.
   */
  projects: [
    {
      title: 'Opportunity Command Center',
      href: 'https://github.com/JeremyAhamioje/opportunity',
      live: 'https://opportunity-xi.vercel.app/',
      stack: 'Next.js 16 · React 19 · TypeScript · PostgreSQL / Drizzle · SerpApi · Vercel + Supabase',
      bullets: [
        'Opportunity-pipeline CRM — ten-stage pipeline, scoring, follow-up engine, analytics, daily email digest — with every figure counted from stored rows. Same schema on embedded Postgres or hosted Supabase; auth re-checked in every server action.',
        'Two SerpApi connectors (Google organic, Google Jobs) turn a query into reviewed draft records: one row per registrable domain, directories and job boards filtered out, apply links ranked employer → ATS → aggregator, provenance kept on every row.',
      ],
    },
    {
      title: 'Parking Intelligence Platform',
      href: 'https://github.com/JeremyAhamioje/parking-arbitrage',
      stack: 'Node · Express · Playwright · PostgreSQL / Supabase · Next.js · GitHub Actions · Ubuntu VPS',
      bullets: [
        'Scrapes inventory and prices across SpotHero, ParkWhiz and Way.com for 50 venues, with change detection, alerts and Ticketmaster event discovery; a REST API behind a Next.js dashboard; scrapers on a US VPS under cron plus GitHub Actions.',
        'Per-platform anti-bot strategy: a US datacenter IP for a geo-WAF, a static residential proxy for a Cloudflare challenge, stealth Chromium with session reuse. Validated at 176 / 97 / 54 listings for one event.',
      ],
    },
    {
      title: 'Evidence Engine',
      stack: 'Python · SQLite · Anthropic API / AWS Bedrock · search APIs',
      bullets: [
        'Reproducible research pipeline: search → fetch → LLM extraction (structured output) → content-based dedup → SQLite corpus. An identical re-run adds zero rows; a duplicate under a changed URL is still caught.',
        'Respects robots.txt and records every blocked fetch with its reason. Stdlib-only core.',
      ],
    },
    {
      title: 'jeremybuilds.online',
      href: 'https://github.com/JeremyAhamioje/jeremybuilds',
      stack: 'React · Vite · GSAP · sharp · Playwright · Vercel',
      bullets: [
        'This portfolio: GSAP scroll sequences, an AVIF/WebP image pipeline, a weighted loading manager, Vercel headers. Verified with Playwright; this PDF is printed from the live component.',
      ],
    },
  ],

  /**
   * Grouped so the engineering groups read first and design reads last. Each
   * item is something used in the projects above, not a wish list.
   */
  skills: [
    { group: 'Languages', items: 'TypeScript, JavaScript, Python, SQL' },
    {
      group: 'Front-end',
      items: 'React, Next.js (App Router, Server Actions), Vite, Tailwind, GSAP',
    },
    {
      group: 'Back-end & data',
      items: 'Node.js, Express, REST APIs, PostgreSQL, Drizzle ORM, Supabase, SQLite, schema migrations',
    },
    {
      group: 'Extraction & automation',
      items:
        'Playwright, web scraping, proxy and anti-bot strategy, SerpApi, LLM-assisted extraction (Anthropic, Gemini, Bedrock), data cleaning and dedup',
    },
    {
      group: 'Deployment',
      items: 'Vercel, GitHub Actions, Linux VPS and cron, Docker, Git / GitHub',
    },
    { group: 'Design', items: 'Figma, interface and interaction design, typography, motion' },
  ],

  experience: [
    {
      period: '2023 — Present',
      place: 'Independent',
      title: 'Full-Stack Developer & Designer',
      org: 'Freelance practice',
      summary:
        'Design, build and ship full-stack web applications — React and TypeScript front-ends, Node and Python services, PostgreSQL — deployed to Vercel, Render and Linux hosts. The projects above are from this period.',
    },
    {
      period: '2022 — 2023',
      place: 'Remote',
      title: 'Full-Stack Developer',
      summary:
        'Built full-stack web applications with React, TypeScript, Node.js and REST APIs, including data-heavy interfaces, integrations and backend services.',
    },
    {
      period: '2021 — 2022',
      place: 'Remote',
      title: 'Front-End Developer',
      summary:
        'Built responsive marketing and application front-ends in React, with attention to motion, accessibility and performance budgets.',
    },
  ],

  /**
   * Beneath the engineering experience, never in the headline or the skills:
   * it supports the story that the data work is understood end to end, and
   * placed anywhere higher it would pull the positioning toward data entry.
   * The hours figure is the one already published on the Upwork profile.
   */
  additional: {
    title: 'Data Research & Operations',
    meta: 'Upwork · 3,000+ hours',
    href: 'https://www.upwork.com/freelancers/~01a24ceee4a11c848d',
    summary:
      'Structured web research, data collection, validation, cleaning and deduplication across large datasets, with an emphasis on accuracy, consistency and auditable, reusable workflows.',
  },
}

/**
 * Where the download button points. Lives in `public/`, so it is served as-is
 * and keeps a stable URL someone can bookmark or paste into an email.
 *
 * A PDF, printed from this component by Chromium — so it carries REAL TEXT, not
 * a picture of it: text an applicant tracking system can extract, and a
 * recruiter can select and paste. One A4 page, 210x297mm exactly. Link
 * annotations survive the print, so the repo and profile URLs are clickable.
 *
 * REGENERATING (do this whenever the data above changes — a stale file is
 * exactly how the old placeholder org lines outlived their removal from the
 * page):
 *
 *   1. Isolate `.resume` as the only child of <body>. Every colour token is
 *      declared on `.resume` itself, so it survives the move. Drop the page's
 *      -0.5deg tilt, the radius and the shadow — screen details, not print ones.
 *   2. Set the sheet to the width where its own proportions match A4 (1.414 —
 *      measure height at a few widths and pick the crossing), then FREEZE the
 *      computed type and grid values inline. Chromium prints against a viewport
 *      of paperWidth/scale, which would otherwise trip the sheet's
 *      `max-width: 900px` rules into a single column and re-resolve every
 *      vw-based clamp against that width instead of the design's 1600px.
 *      Inline px outranks a media query and has nothing left to re-resolve.
 *   3. Force every `[data-animate]` element to its finished state (opacity 1,
 *      `--highlight-scale: 1`). The entry tweens fire on scroll and run once;
 *      anything below the fold when GSAP is paused is still invisible, and the
 *      last heading printed blank until this was added.
 *   4. `page.pdf({ width: '210mm', height: '297mm', scale: 793.7 / <width> })`.
 *      This version: 810px wide, scale 0.98, 1111px of 1123 used.
 */
export const RESUME_DOWNLOAD_URL = '/jeremy-ahamioje-resume.pdf'
