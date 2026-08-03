/**
 * Selected work.
 *
 * Ordered newest first — the sequence is the portfolio's argument, so the
 * strongest and most recent work leads.
 *
 * `asset` is a slug, matching `assets/masters/work-<slug>.png`. Slugs rather
 * than indices: reordering this list or dropping a project can then never
 * silently repoint an image at the wrong write-up.
 *
 * `href` is null where there is nothing to link to yet. The UI renders a status
 * label instead of a dead "view" button — a CTA that goes nowhere costs more
 * trust than an honest "in development".
 *
 * `cta` overrides the default "Visit site" where that would be wrong. A Figma
 * prototype is not a site, and telling someone they are about to visit one
 * sets them up to think the link is broken when a prototype opens instead.
 *
 * Three entries currently use abstract stand-ins rather than real captures:
 * jeremy-blog, gaming-hub, framer-project. Drop a real capture at the matching
 * master path and rerun `npm run assets`; nothing here needs to change.
 */

export const PROJECTS = [
  {
    id: 'operatorstudio',
    asset: 'work-operatorstudio',
    title: 'operatorstudio.ai',
    summary:
      'AI implementation measured in business outcomes. Positioning, site and design system for a consultancy that helps companies choose, implement and build AI systems that create measurable value — not demos.',
    categories: ['ai', 'design'],
    year: '2026',
    role: 'Design & Dev',
    tags: ['Next.js', 'Design System', 'Motion'],
    href: 'https://www.operatorstudio.ai/',
  },
  {
    id: 'testedtools',
    asset: 'work-testedtools',
    title: 'testedtools.ai',
    summary:
      'A research-led directory that recommends AI tools by fit rather than hype — matching a business to what it actually needs, across healthcare, construction, retail and education.',
    categories: ['ai', 'design'],
    year: '2026',
    role: 'Design & Dev',
    tags: ['Next.js', 'Research', 'Editorial'],
    href: 'https://www.testedtools.ai/',
  },
  {
    id: 'parking-arbitrage',
    asset: 'work-parking-arbitrage',
    title: 'Parking Arbitrage',
    summary:
      'Real-time parking price intelligence across SpotHero, ParkWhiz and Way.com. Scrapers write to Supabase; an Express API serves a Next.js dashboard that surfaces live prices and arbitrage signals.',
    categories: ['platform'],
    year: '2026',
    role: 'Full-Stack Dev',
    tags: ['Next.js', 'Supabase', 'Playwright'],
    href: 'https://parking-arbitrage-ui.vercel.app/',
  },
  {
    id: 'sinoth-farms',
    asset: 'work-sinoth-farms',
    title: 'Sinoth Farms',
    summary:
      'Storefront for a Nigerian farm supplier — live and processed chicken, eggs, turkeys and peppers, catalogued for restaurants, distributors and bulk buyers with WhatsApp ordering.',
    categories: ['commerce'],
    year: '2026',
    role: 'Design & Dev',
    tags: ['Web Design', 'Cloudinary', 'WhatsApp'],
    href: 'https://sinothfarms.store/',
  },
  {
    id: 'sendy',
    asset: 'work-sendy',
    title: 'Sendy',
    summary:
      'A logistics app proposal built in Figma — ordering, checkout, live rider tracking and settings across a full screen set, with a pink identity carried through every state.',
    categories: ['design'],
    year: '2026',
    role: 'Product Design',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    href: 'https://www.figma.com/proto/oYGvbzLwfgwOqxRKzoxBWn/sendy?node-id=199-1828&viewport=75%2C142%2C0.81&t=AFAKBBKmYeAdJESN-1&scaling=min-zoom&content-scaling=fixed&page-id=185%3A2&starting-point-node-id=194%3A59&show-proto-sidebar=1',
    cta: 'View prototype',
  },
  {
    id: 'framer-project',
    asset: 'work-framer-project',
    title: 'Framer Project',
    summary:
      'An interactive build crafted in Framer — motion, layout and micro-interactions. Currently in development.',
    categories: ['experiment'],
    year: '2026',
    role: 'Design & Dev',
    tags: ['Framer', 'Interaction', 'Motion'],
    href: null,
    status: 'In development',
  },
  {
    id: 'shredded',
    asset: 'work-shredded',
    title: 'Shredded',
    summary:
      'Modern sportswear e-commerce platform. Full shopping experience — product catalog, cart, checkout and admin.',
    categories: ['commerce', 'platform'],
    year: '2025',
    role: 'Full-Stack Dev',
    tags: ['Next.js', 'MongoDB', 'Paystack'],
    href: 'https://www.shreddedcollective.store',
  },
  {
    id: 'jeremy-ai',
    asset: 'work-jeremy-ai',
    title: 'Jeremy AI',
    summary:
      'AI productivity assistant powered by the Gemini API — chat alongside DOCX conversion, file merging and a set of everyday utilities.',
    categories: ['ai'],
    year: '2025',
    role: 'Frontend Dev',
    tags: ['Vite', 'Gemini API', 'TypeScript'],
    href: 'https://jeremyaiassistant.vercel.app/',
  },
  {
    id: 'maison-jeremy',
    asset: 'work-maison-jeremy',
    title: 'Maison Jeremy',
    summary:
      'Luxury watch brand concept where Swiss horology meets brutalist geometry — high-end branding, visual storytelling and a premium UI language.',
    categories: ['design', 'immersive'],
    year: '2025',
    role: 'Design & Dev',
    tags: ['Next.js', 'GSAP', 'Framer Motion'],
    href: 'https://maison-jeremy.vercel.app/',
  },
  {
    id: 'nightshift',
    asset: 'work-nightshift',
    title: 'Nightshift Observatory',
    summary:
      'Astronomy e-learning platform with interactive Three.js visuals, educational simulations and immersive space environments.',
    categories: ['immersive'],
    year: '2024',
    role: 'Creative Dev',
    tags: ['React', 'Three.js', 'WebGL'],
    href: 'https://nightshift-observatory.vercel.app/',
  },
  {
    id: 'jeremy-blog',
    asset: 'work-jeremy-blog',
    title: 'Jeremy Blog',
    summary:
      'Custom Strapi-powered blog with bespoke admin logic, a flexible content architecture and full CMS integration.',
    categories: ['platform'],
    year: '2024',
    role: 'Full-Stack Dev',
    tags: ['Strapi', 'React', 'PostgreSQL'],
    href: 'https://blog-strapi-x61r.vercel.app/',
  },
  {
    id: 'windows-portfolio',
    asset: 'work-windows-portfolio',
    title: 'Windows Portfolio',
    summary:
      'Experimental OS-inspired portfolio — a desktop you can rearrange, with wallpaper switching, a calculator, a Spotify widget and a mini browser.',
    categories: ['experiment'],
    year: '2024',
    role: 'Creative Dev',
    tags: ['React', 'CSS', 'Experimental'],
    href: 'https://folk-grip-43835807.figma.site/',
  },
  {
    id: 'orbita',
    asset: 'work-orbita',
    title: 'Orbita',
    summary:
      'Humanity’s journey to space, told as a scroll — the milestones that define the quest for the stars, from first launch to the far reaches of the solar system.',
    categories: ['immersive'],
    year: '2024',
    role: 'Creative Dev',
    tags: ['React', 'Three.js', 'GSAP'],
    href: 'https://humanity-kappa.vercel.app/',
  },
  {
    id: 'engineering',
    asset: 'work-engineering',
    title: 'The Build Log',
    summary:
      'Robotics and engineering write-ups — low-cost automation, hydroponics and experimental systems, documented where hardware meets software.',
    categories: ['experiment'],
    year: '2023',
    role: 'Engineering',
    tags: ['React', 'Three.js', 'ROS2'],
    href: 'https://portfolio-pa3u.vercel.app/',
  },
  {
    id: 'pagani',
    asset: 'work-pagani',
    title: 'Pagani Experience',
    summary:
      'Motion-heavy automotive tribute built on GSAP ScrollTrigger — cinematic scrolling as a storytelling device.',
    categories: ['immersive'],
    year: '2023',
    role: 'Motion Dev',
    tags: ['GSAP', 'React', 'ScrollTrigger'],
    href: 'https://paganiscroll.vercel.app/',
  },
  {
    id: 'gaming-hub',
    asset: 'work-gaming-hub',
    title: 'Gaming Hub',
    summary:
      'Gaming platform with custom browser-based games, leaderboards and interactive entertainment.',
    categories: ['experiment'],
    year: '2023',
    role: 'Frontend Dev',
    tags: ['React', 'Canvas API', 'WebSockets'],
    href: 'https://crater-tame-79467474.figma.site/',
  },
  {
    id: 'trippit',
    asset: 'work-trippit',
    title: 'Trippit',
    summary:
      'AI-powered travel planning — a smart itinerary builder with real-time suggestions and community reviews.',
    categories: ['ai', 'platform'],
    year: '2023',
    role: 'Full-Stack Dev',
    tags: ['React', 'AI API', 'Maps'],
    href: 'https://trippit-pi-drab.vercel.app/',
  },
  {
    id: 'retro-spins',
    asset: 'work-retro-spins',
    title: 'Retro Spins',
    summary:
      'Retro-inspired vinyl music player. Nostalgic aesthetic meets modern audio engineering.',
    categories: ['experiment'],
    year: '2023',
    role: 'Creative Dev',
    tags: ['React', 'Web Audio API', 'CSS'],
    href: 'https://pound-city-70607657.figma.site/',
  },
  {
    id: 'museum-hub',
    asset: 'work-museum-hub',
    title: 'Global Museum Hub',
    summary:
      'Interactive world museum concept — 3D artifacts, maps and historical context, from Renaissance masterpieces to Ancient Egypt.',
    categories: ['immersive'],
    year: '2023',
    role: 'Creative Dev',
    tags: ['React', 'Three.js', 'GIS'],
    href: 'https://dingy-wiry-12631115.figma.site/',
  },
  {
    id: 'food-delivery',
    asset: 'work-food-delivery',
    title: 'Food Delivery App',
    summary:
      'Figma food and grocery delivery concept — user flows, components and high-fidelity prototypes across the full ordering journey.',
    categories: ['design'],
    year: '2022',
    role: 'UI/UX Design',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    href: null,
    status: 'Concept',
  },
]

/**
 * Filter definitions. `all` is synthetic and always first.
 *
 * Cut by what the deliverable actually was, not by tech stack — a visitor
 * filtering this row is asking "have you done work like mine?", and "React" is
 * not an answer to that question.
 */
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'design', label: 'Design' },
  { id: 'ai', label: 'AI' },
  { id: 'immersive', label: 'Immersive' },
  { id: 'platform', label: 'Platform' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'experiment', label: 'Experiment' },
]

/**
 * Counts, derived from the list. Writing these by hand is how a filter row ends
 * up claiming five projects and showing three.
 */
export function countFor(categoryId) {
  if (categoryId === 'all') return PROJECTS.length
  return PROJECTS.filter((project) => project.categories.includes(categoryId)).length
}

export function filterProjects(categoryId) {
  if (categoryId === 'all') return PROJECTS
  return PROJECTS.filter((project) => project.categories.includes(categoryId))
}
