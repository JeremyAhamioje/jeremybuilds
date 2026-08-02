/**
 * Asset pipeline: masters -> optimized, responsive derivatives.
 *
 *   assets/masters/*.png   (source of truth, never modified, not shipped)
 *          |
 *          v  alpha clean -> trim -> resize -> AVIF / WebP / PNG
 *          |
 *   src/assets/arms/       (imported by the app, hashed by Vite)
 *
 * Run with: npm run assets
 *
 * Why alpha cleaning exists
 * -------------------------
 * arm-a's background was not fully removed: ~73% of its canvas sits at alpha
 * 1-31, a faint grey film that is invisible on a white page but composites to a
 * visible rectangular box over our near-black hero. Its genuine antialiased
 * edge occupies only ~1.4% of pixels spread across alpha 32-239, so flooring
 * below 32 and rescaling the remainder removes the film while leaving the edge
 * intact. This is a levels adjustment on one channel, not a segmentation pass.
 *
 * Both masters also top out at alpha 254 rather than 255 (a quirk of whatever
 * removed the background). The rescale lifts them to true opacity for free.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const MASTERS = path.join(ROOT, 'assets/masters')
const OUT = path.join(ROOT, 'src/assets/arms')

/**
 * Per-asset preparation settings.
 *
 * `alphaFloor` is chosen from each master's alpha histogram — high enough to
 * kill the background film, low enough to preserve the real edge ramp.
 *
 * `tone` is a linear map `out = slope * in + offset` used to harmonise the two
 * arms, which were rendered under different lighting (mean luminance 129 vs
 * 148 after cleaning — a visible mismatch once they share a frame). A plain
 * brightness multiply would blow arm-a's highlights out to clipping; a slope
 * below 1 with a positive offset lifts the midtones while pinning the white
 * point where it already sits. Null leaves the artwork untouched.
 */
const ASSETS = [
  {
    id: 'arm-a',
    file: 'arm-a.png',
    /** Reaching left — sits on the RIGHT of the composition. */
    alphaFloor: 32,
    alphaCeil: 254,
    // Maps mean 129 -> ~142 while holding 254 -> 254.
    tone: { slope: 0.896, offset: 26.4 },
  },
  {
    id: 'arm-b',
    file: 'arm-b.png',
    /** Reaching right — sits on the LEFT of the composition. The brighter of
     * the two, so it is the reference the other is matched to. */
    alphaFloor: 8,
    alphaCeil: 254,
    tone: null,
  },
]

/**
 * Target widths. Never upscale — a derivative wider than the master's content
 * is invented detail and pure transfer cost, so the native width is the cap.
 */
const TARGET_WIDTHS = [480, 720, 1024, 1440, 1920]

/**
 * Second cap, on top of native width.
 *
 * The widest the artwork is ever asked to render is a 16" retina laptop:
 * ~52vw of 1728 CSS px at DPR 2 ~= 1800 device px. arm-a's master is 3492 px
 * of content, so without this it would emit a ~3500 px derivative nothing can
 * ever select — megabytes of transfer for zero visible gain. Downscaling from
 * an oversized master with lanczos also yields a sharper 1920 than a native
 * 1920 capture would.
 */
const MAX_OUTPUT_WIDTH = 1920

const ENCODERS = {
  // Quality tuned to keep fingertip contours and marble gradients clean.
  avif: (pipeline) => pipeline.avif({ quality: 62, effort: 6 }),
  webp: (pipeline) => pipeline.webp({ quality: 82, effort: 5, alphaQuality: 90 }),
  png: (pipeline) => pipeline.png({ compressionLevel: 9, palette: false }),
}

/**
 * Remap the alpha channel: floor the background film away, rescale the rest to
 * full range. Operates on raw RGBA bytes so the curve is exact.
 */
function cleanAlpha(data, channels, floor, ceil) {
  const span = ceil - floor

  for (let i = 3; i < data.length; i += channels) {
    const normalised = (data[i] - floor) / span
    data[i] = Math.round(Math.min(1, Math.max(0, normalised)) * 255)
  }
}

/** Bounding box of everything not fully transparent. */
function contentBounds(data, width, height, channels) {
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * channels + 3] === 0) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }

  if (maxX < 0) throw new Error('Asset is entirely transparent')

  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

/** Mean luminance of meaningfully-opaque pixels — used to compare the two arms. */
function meanLuminance(data, channels) {
  let sum = 0
  let count = 0

  for (let i = 0; i < data.length; i += channels) {
    if (data[i + 3] < 128) continue
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
    count += 1
  }

  return count === 0 ? 0 : sum / count
}

async function prepare(asset) {
  const source = path.join(MASTERS, asset.file)

  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  cleanAlpha(data, channels, asset.alphaFloor, asset.alphaCeil)

  const bounds = contentBounds(data, width, height, channels)
  const luminance = meanLuminance(data, channels)

  // Rebuild from the cleaned bytes, then trim to content so position maths is
  // expressed against the artwork rather than an arbitrary canvas.
  let base = sharp(data, { raw: { width, height, channels } }).extract(bounds)

  if (asset.tone) base = base.linear(asset.tone.slope, asset.tone.offset)

  const cleaned = await base.png().toBuffer()

  // Report the post-adjustment luminance so the two arms can be compared on
  // the numbers rather than by eye alone.
  const adjusted = await sharp(cleaned).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const adjustedLuminance = meanLuminance(adjusted.data, adjusted.info.channels)

  // Cap at whichever is smaller: the content width (never invent pixels) or the
  // largest size anything can actually select.
  const maxWidth = Math.min(bounds.width, MAX_OUTPUT_WIDTH)
  const widths = [...new Set(TARGET_WIDTHS.filter((w) => w < maxWidth).concat(maxWidth))].sort(
    (a, b) => a - b,
  )

  const outputs = []

  for (const targetWidth of widths) {
    for (const [format, encode] of Object.entries(ENCODERS)) {
      const pipeline = sharp(cleaned).resize({ width: targetWidth, kernel: 'lanczos3' })
      const buffer = await encode(pipeline).toBuffer()
      const name = `${asset.id}-${targetWidth}.${format}`

      await writeFile(path.join(OUT, name), buffer)
      outputs.push({ name, format, width: targetWidth, bytes: buffer.length })
    }
  }

  const aspectRatio = bounds.width / bounds.height

  return {
    id: asset.id,
    master: { width, height },
    content: { width: bounds.width, height: bounds.height },
    intrinsicWidth: bounds.width,
    intrinsicHeight: bounds.height,
    aspectRatio: Number(aspectRatio.toFixed(6)),
    widths,
    luminance: Math.round(luminance),
    adjustedLuminance: Math.round(adjustedLuminance),
    outputs,
  }
}

async function main() {
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const manifest = {}

  for (const asset of ASSETS) {
    const result = await prepare(asset)
    manifest[asset.id] = {
      intrinsicWidth: result.intrinsicWidth,
      intrinsicHeight: result.intrinsicHeight,
      aspectRatio: result.aspectRatio,
      widths: result.widths,
    }

    const trimmed =
      100 - (result.content.width * result.content.height * 100) / (result.master.width * result.master.height)

    console.log(`\n${result.id}`)
    console.log(`  master        ${result.master.width} x ${result.master.height}`)
    console.log(
      `  trimmed to    ${result.content.width} x ${result.content.height}  (-${trimmed.toFixed(1)}% area)`,
    )
    console.log(`  mean luminance ${result.luminance} -> ${result.adjustedLuminance}`)
    console.log(`  widths        ${result.widths.join(', ')}`)

    for (const format of Object.keys(ENCODERS)) {
      const row = result.outputs
        .filter((o) => o.format === format)
        .map((o) => `${o.width}px ${(o.bytes / 1024).toFixed(0)}KB`)
        .join('   ')
      console.log(`  ${format.padEnd(5)} ${row}`)
    }
  }

  await writeFile(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  const files = await readdir(OUT)
  console.log(`\nwrote ${files.length} files to src/assets/arms/`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
