# Jeremy Ahamioje — Portfolio

Design and full-stack development portfolio. React + Vite, plain JavaScript,
plain CSS, self-hosted fonts.

The visual premise is a Renaissance fresco: the hero is two sculpted arms
reaching toward a `</>`, and the footer closes on the ceiling those arms came
from. Terracotta is the only accent on a near-black page, and it is spent
sparingly — one bracket, one star, one element per illustration.

---

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the built output
```

## Other scripts

| Command | What it does |
| --- | --- |
| `npm run assets` | Rebuilds every image derivative from `assets/masters/` |
| `npm run placeholders` | Regenerates the abstract stand-in project panels |
| `npm run test:loading` | 25 tests over the loading manager, no test runner needed |

---

## Page order

| Section | Notes |
| --- | --- |
| Hero | Two arm images + `</>`, scroll-driven. WebGL was scoped as an optional layer and never became load-bearing. |
| Projects | 20 projects. Pinned sequence on desktop, list on mobile. |
| About | Resume, headshot, download button. |
| Services | Six capabilities, custom SVG illustrations. |
| Tools | 28 tools in five groups, self-advancing carousel. |
| Footer | `#contact`. Fresco ground, interests, contact. |

---

## Deployment

Vercel, configured by `vercel.json`. Framework preset `vite`, build
`npm run build`, output `dist`. Domain: **jeremybuilds.online**.

JSON takes no comments, so the reasoning lives here:

**`/assets/*` is cached for a year, immutable.** Vite content-hashes
everything it emits, so a changed file gets a changed filename — the old URL
can never serve stale content, which is exactly the condition `immutable` is
for. `index.html` is deliberately *not* in that rule; it must revalidate every
time or a deploy would never reach anyone holding a cached copy.

**Files in `public/` get a day, plus a week of stale-while-revalidate.** They
keep stable URLs by design (`/jeremy-ahamioje-resume.png` is meant to be
pasteable), so they cannot be cached immutably — replacing the résumé must
actually reach people.

**There is no SPA catch-all rewrite**, on purpose. This is one page with anchor
links and no client-side router, so rewriting every unmatched path to
`index.html` would turn genuine 404s into soft 200s: search engines index them,
and a typo'd URL renders the homepage instead of saying it is wrong.

**No Content-Security-Policy header.** It would need to allow the inline styles
GSAP writes and the Cloudinary origin serving the tool logos, and a CSP written
without testing every one of those is a policy that silently breaks the site
for visitors while looking fine locally. Worth adding deliberately, not as a
default.

---

## Architecture, and the rules it follows

**DOM first, enhancement second.** Nothing that carries content depends on
WebGL, GSAP, or anything that can fail to initialise. Animation layers on top
of a page that already works.

**The markup is the finished state.** Every animation departs from what is
written in the DOM and returns to it. With JavaScript off, motion reduced, or a
scroll trigger that never fires, the page is complete — not blank. The service
illustrations are the clearest case: the drawing in the SVG *is* the final
frame, and the timelines only move away from it.

**Reduced motion gets the same information.** Never a shorter version as the
price of the preference. The tool carousel becomes all five groups at once; the
projects sequence becomes a list.

**Derive, don't restate.** Project filter counts, pin lengths and category
totals are computed from the data. Writing them by hand is how a filter row
ends up claiming five and showing three.

**Two shapes, not one restyled.** Where a layout difference is structural
(projects sequence vs. list), the markup differs. Restyling one DOM to do both
meant hiding the copy column on mobile, which silently stripped every project
title.

### Loading

`src/lib/loading/` is a framework-agnostic task registry. Progress reflects
work that has actually settled — never a timer — is monotonic, and always has a
path to ready. The full critical set is declared up front in `bootstrap.js` so
the percentage cannot depend on React effect ordering.

### Images

`assets/masters/` holds sources, which are never modified and never shipped.
`npm run assets` emits AVIF / WebP / JPEG-or-PNG derivatives into
`src/assets/media/`, where Vite content-hashes them. The pipeline **never
upscales**: a small master emits fewer rungs rather than an invented one.

> **Known limitation.** The 17 supplied project captures are 800–1157px wide
> against a frame that renders ~796 CSS px, so they are upscaled 1.38×–1.99× on
> a retina display. Replace the masters with wider captures and rerun
> `npm run assets`; nothing else changes.

### Type

Three families, self-hosted via Fontsource: **Big Shoulders Display**
(condensed display), **Instrument Serif** (editorial), **Archivo Variable**
(UI). Archivo's `wdth` axis is used for real wide and narrow cuts — not
horizontally stretched normals, which thin the horizontals and thicken the
verticals.

Font imports in `main.jsx` are extensionless JS imports, not CSS `@import`.
PostCSS resolves bare specifiers against the project root and 500s.

---

## Outstanding

- Four tools have no correct logo in the supplied set and render a wordmark:
  **TypeScript**, **Node.js**, **Express**, **Git**. Four images went unused
  and are real tools — PostgreSQL, Firebase, MySQL, Spline — which suggests
  those were separate entries whose labels drifted.
- Twitter and Instagram are `null` in `footerData.js` and render as plain text
  until real URLs are supplied.
- The résumé download is a 768px-wide PNG — about 93 DPI across A4, so it is
  fine on screen and soft in print. A PDF export would fix that and would be
  selectable text rather than a picture of text, which matters to anything
  that parses a CV.
- Résumé employment history is still placeholder wording ("Placeholder
  engagement" appears twice, in the app and in the downloadable image). The
  contact block is real.
- Phases 4–7 of the original hero brief (responsive pass, WebGL enhancement,
  preloader integration, performance) remain paused.

## Experiments

`src/experiments/renaissance-hands/` holds the abandoned procedural-geometry
hero, with a write-up of what worked, why it failed, and what reviving it would
take. Kept because the failure is the useful part: a hand that is 90% right
reads as *wrong*, not as stylised.
