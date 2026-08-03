/**
 * Generates placeholder project masters.
 *
 * Temporary: replace assets/masters/project-*.png with real captures and rerun
 * `npm run assets`. Nothing downstream cares which they are.
 *
 * Deliberately abstract rather than fake screenshots — a placeholder that
 * pretends to be a project makes it hard to see what is still missing, and has
 * a nasty habit of shipping. Each carries a distinct hue so the scroll
 * transitions between them are unmistakable while the motion is being tuned.
 *
 * Run with: npm run placeholders
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const MASTERS = path.join(ROOT, 'assets/masters')

/** 4:3, matching the framing the real project captures will use. */
const WIDTH = 1600
const HEIGHT = 1200

const PLACEHOLDERS = [
  { id: 'project-01', from: '#2f3a34', to: '#8a9a86', tint: '#d8c9a8' },
  { id: 'project-02', from: '#3a3230', to: '#9c8878', tint: '#e0cdb6' },
  { id: 'project-03', from: '#2c3440', to: '#7f8fa3', tint: '#c7d3dd' },
  { id: 'project-04', from: '#3d3230', to: '#a8836c', tint: '#e6cdb8' },
]

function svg({ index, from, to, tint }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.68" cy="0.28" r="0.7">
      <stop offset="0%" stop-color="${tint}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${tint}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Faint structural rules, so scaling and cropping are legible while tuning. -->
  <g stroke="${tint}" stroke-opacity="0.16" stroke-width="1">
    ${[0.25, 0.5, 0.75].map((f) => `<line x1="${WIDTH * f}" y1="0" x2="${WIDTH * f}" y2="${HEIGHT}"/>`).join('')}
    ${[0.33, 0.66].map((f) => `<line x1="0" y1="${HEIGHT * f}" x2="${WIDTH}" y2="${HEIGHT * f}"/>`).join('')}
  </g>

  <text x="96" y="${HEIGHT - 110}" font-family="Helvetica, Arial, sans-serif"
        font-size="240" font-weight="700" fill="${tint}" fill-opacity="0.9">${index}</text>
  <text x="100" y="${HEIGHT - 60}" font-family="Helvetica, Arial, sans-serif"
        font-size="30" letter-spacing="10" fill="${tint}" fill-opacity="0.65">PLACEHOLDER</text>
</svg>`
}

async function main() {
  await mkdir(MASTERS, { recursive: true })

  for (const [i, spec] of PLACEHOLDERS.entries()) {
    const index = String(i + 1).padStart(2, '0')
    const buffer = await sharp(Buffer.from(svg({ ...spec, index }))).png().toBuffer()
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
