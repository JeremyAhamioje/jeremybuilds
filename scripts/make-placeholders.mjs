/**
 * Generates abstract stand-in masters for projects with no capture yet.
 *
 * Three projects currently have no supplied image: Jeremy Blog, Gaming Hub and
 * the Framer project. Rather than leave holes in the sequence, each gets an
 * abstract composition in the site palette.
 *
 * Deliberately NOT fake screenshots and NOT stamped "PLACEHOLDER":
 *
 *   - a fake screenshot pretends to be work that does not exist, and has a nasty
 *     habit of shipping unnoticed;
 *   - a "PLACEHOLDER" watermark reads as a broken build if it ships.
 *
 * An abstract panel is honest either way — it is plainly not a screenshot, and
 * if it does ship it reads as a deliberate card. Each carries a different
 * geometry so the scroll transitions between them stay legible.
 *
 * Replace assets/masters/work-<id>.png with a real capture and rerun
 * `npm run assets`; nothing downstream needs to change.
 *
 * Run with: npm run placeholders
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const MASTERS = path.join(ROOT, 'assets/masters')

/** 4:3, the framing the stage crops to. */
const WIDTH = 1600
const HEIGHT = 1200

const INK = '#efe9df'
const ACCENT = '#de5a24'

/**
 * `figure` draws the distinguishing geometry over a shared ground, so the three
 * read as one family without being interchangeable.
 */
const PLACEHOLDERS = [
  {
    id: 'work-jeremy-blog',
    from: '#0b0f0c',
    to: '#1b2a20',
    // Stacked rules — a column of text, abstracted.
    figure: () => {
      const rows = Array.from({ length: 9 }, (_, i) => {
        const y = 360 + i * 62
        const w = i % 3 === 0 ? 720 : 520 - (i % 4) * 70
        return `<rect x="420" y="${y}" width="${w}" height="10" rx="5" fill="${INK}" fill-opacity="${i === 0 ? 0.9 : 0.22}"/>`
      }).join('')
      return `${rows}<rect x="420" y="300" width="150" height="10" rx="5" fill="${ACCENT}" fill-opacity="0.85"/>`
    },
  },
  {
    id: 'work-gaming-hub',
    from: '#0a0810',
    to: '#241634',
    // Concentric targets on a grid — an arcade, abstracted.
    figure: () => {
      const rings = [300, 220, 140, 60]
        .map(
          (r, i) =>
            `<circle cx="800" cy="600" r="${r}" fill="none" stroke="${i === 1 ? ACCENT : INK}" stroke-opacity="${i === 1 ? 0.9 : 0.28}" stroke-width="${i === 1 ? 14 : 8}"/>`,
        )
        .join('')
      const ticks = [0, 90, 180, 270]
        .map((deg) => {
          const rad = (deg * Math.PI) / 180
          return `<line x1="${800 + Math.cos(rad) * 340}" y1="${600 + Math.sin(rad) * 340}" x2="${800 + Math.cos(rad) * 430}" y2="${600 + Math.sin(rad) * 430}" stroke="${INK}" stroke-opacity="0.3" stroke-width="10"/>`
        })
        .join('')
      return `${rings}${ticks}`
    },
  },
  {
    id: 'work-framer-project',
    from: '#0a0a12',
    to: '#191a2e',
    // A motion path with easing handles — interaction design, abstracted.
    figure: () =>
      `<path d="M 260 840 C 560 840 520 380 800 380 C 1080 380 1040 800 1340 800"
             fill="none" stroke="${INK}" stroke-opacity="0.35" stroke-width="10" stroke-linecap="round"/>
       <path d="M 260 840 C 560 840 520 380 800 380"
             fill="none" stroke="${ACCENT}" stroke-opacity="0.95" stroke-width="14" stroke-linecap="round"/>
       <circle cx="260" cy="840" r="22" fill="${ACCENT}"/>
       <circle cx="800" cy="380" r="22" fill="${INK}" fill-opacity="0.9"/>
       <circle cx="1340" cy="800" r="16" fill="${INK}" fill-opacity="0.4"/>`,
  },
]

function svg({ from, to, figure }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.25" r="0.75">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <g stroke="${INK}" stroke-opacity="0.07" stroke-width="1">
    ${[0.25, 0.5, 0.75].map((f) => `<line x1="${WIDTH * f}" y1="0" x2="${WIDTH * f}" y2="${HEIGHT}"/>`).join('')}
    ${[0.33, 0.66].map((f) => `<line x1="0" y1="${HEIGHT * f}" x2="${WIDTH}" y2="${HEIGHT * f}"/>`).join('')}
  </g>

  ${figure()}
</svg>`
}

async function main() {
  await mkdir(MASTERS, { recursive: true })

  for (const spec of PLACEHOLDERS) {
    const buffer = await sharp(Buffer.from(svg(spec))).png().toBuffer()
    const file = path.join(MASTERS, `${spec.id}.png`)

    await writeFile(file, buffer)
    console.log(`  ${spec.id}.png  ${WIDTH}x${HEIGHT}  ${(buffer.length / 1024).toFixed(0)} KB`)
  }

  console.log('\nNow run: npm run assets')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
