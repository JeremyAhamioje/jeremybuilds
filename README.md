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
  until real URLs are supplied. LinkedIn uses a `lnkd.in` shortener — worth
  replacing with the full `/in/<vanity>` URL.
- `public/jeremy-ahamioje-resume.pdf` is referenced by the About download
  button but not yet added.
- Resume employment history is still placeholder wording; the contact block is
  real.
- Header nav links `works, about, contact`; `#services` and `#tools` exist but
  are not linked.
- Phases 4–7 of the original hero brief (responsive pass, WebGL enhancement,
  preloader integration, performance) remain paused.

## Experiments

`src/experiments/renaissance-hands/` holds the abandoned procedural-geometry
hero, with a write-up of what worked, why it failed, and what reviving it would
take. Kept because the failure is the useful part: a hand that is 90% right
reads as *wrong*, not as stylised.
