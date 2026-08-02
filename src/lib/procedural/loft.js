import * as THREE from 'three'

/**
 * Lofting core — the single geometry primitive the whole hand is built from.
 *
 * Every part (forearm, palm, phalanx, thumb) is a chain of cross-section rings
 * swept along the local +X axis and stitched into a surface. Working this way
 * rather than assembling primitives is what gives the hand a coherent,
 * continuously tapering silhouette instead of a pile of boxes and cylinders.
 *
 * LOCAL CONVENTION for every loft:
 *   +X — sweep direction (base -> tip)
 *   +Y — back / knuckle side (palm faces -Y)
 *   +Z — thumb side
 * Rings therefore lie in the YZ plane and orientation is handled by the caller's
 * transform, which keeps this module free of frame/Frenet math.
 */

/**
 * Deterministic PRNG (mulberry32).
 *
 * Irregularity has to be identical on every page load — a hand that subtly
 * reshapes itself on refresh reads as a bug, not as hand-carved stone.
 */
export function createSeededRandom(seed) {
  let state = seed >>> 0
  return function random() {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A superellipse cross-section.
 *
 * `squareness` 2 is a true ellipse; higher values flatten the sides toward a
 * rounded rectangle. Real fingers and palms are closer to a squircle than a
 * circle, and the flatter faces also catch the key light as broad planes —
 * which is where the sculptural facet reading comes from.
 *
 * @param {number} t - angle in radians around the section
 * @param {number} radiusY - half-height (back-to-palm)
 * @param {number} radiusZ - half-width (side-to-side)
 * @param {number} squareness - 2 = ellipse, ~4 = rounded rectangle
 */
export function superellipseOffset(t, radiusY, radiusZ, squareness) {
  const exponent = 2 / squareness
  const cos = Math.cos(t)
  const sin = Math.sin(t)

  return {
    y: Math.sign(cos) * Math.abs(cos) ** exponent * radiusY,
    z: Math.sign(sin) * Math.abs(sin) ** exponent * radiusZ,
  }
}

/**
 * Build one cross-section ring.
 *
 * @param {object} section
 * @param {number} section.x - position along the sweep axis
 * @param {number} section.radiusY - half-height
 * @param {number} section.radiusZ - half-width
 * @param {number} [section.squareness]
 * @param {number} [section.offsetY] - lateral centre shift (used for curvature)
 * @param {number} [section.offsetZ]
 * @param {number} radialSegments - vertices around the ring
 * @param {object} [options]
 * @param {number} [options.jitter] - fraction of radius of seeded irregularity
 * @param {Function} [options.random] - seeded RNG, required when jitter > 0
 * @param {Function} [options.modulate] - per-vertex hook (vertex, angle, section)
 * @returns {THREE.Vector3[]}
 */
export function createRing(section, radialSegments, options = {}) {
  const {
    x,
    radiusY,
    radiusZ,
    squareness = 2.6,
    offsetY = 0,
    offsetZ = 0,
  } = section
  const { jitter = 0, random, modulate } = options

  const ring = []

  for (let i = 0; i < radialSegments; i += 1) {
    const angle = (i / radialSegments) * Math.PI * 2
    const { y, z } = superellipseOffset(angle, radiusY, radiusZ, squareness)

    // Seeded radial wobble — reads as chisel irregularity, not as noise.
    const wobble = jitter > 0 && random ? 1 + (random() - 0.5) * 2 * jitter : 1

    const vertex = new THREE.Vector3(x, y * wobble + offsetY, z * wobble + offsetZ)

    if (modulate) modulate(vertex, angle, section)

    ring.push(vertex)
  }

  return ring
}

/**
 * Stitch an ordered list of rings into a surface.
 *
 * Rings must all share the same vertex count and run base -> tip. Winding is
 * chosen so face normals point outward (verified against the +Y seam vertex).
 *
 * @param {THREE.Vector3[][]} rings
 * @param {object} [options]
 * @param {boolean} [options.capStart] - flat fan cap at the first ring
 * @param {boolean} [options.capEnd] - flat fan cap at the last ring
 * @returns {THREE.BufferGeometry}
 */
export function buildLoftGeometry(rings, options = {}) {
  const { capStart = true, capEnd = true } = options

  if (rings.length < 2) {
    throw new Error(`buildLoftGeometry needs at least 2 rings, received ${rings.length}`)
  }

  const radialSegments = rings[0].length
  const positions = []
  const indices = []

  for (const ring of rings) {
    if (ring.length !== radialSegments) {
      throw new Error('buildLoftGeometry requires every ring to share a vertex count')
    }
    for (const vertex of ring) positions.push(vertex.x, vertex.y, vertex.z)
  }

  // Sleeve: one quad (two triangles) per radial step between adjacent rings.
  for (let r = 0; r < rings.length - 1; r += 1) {
    const base = r * radialSegments
    const next = (r + 1) * radialSegments

    for (let i = 0; i < radialSegments; i += 1) {
      const iNext = (i + 1) % radialSegments

      const a = base + i
      const b = base + iNext
      const c = next + iNext
      const d = next + i

      indices.push(a, b, c)
      indices.push(a, c, d)
    }
  }

  if (capStart) {
    const centre = ringCentroid(rings[0])
    const centreIndex = positions.length / 3
    positions.push(centre.x, centre.y, centre.z)

    // Reversed winding — this cap faces -X.
    for (let i = 0; i < radialSegments; i += 1) {
      const iNext = (i + 1) % radialSegments
      indices.push(centreIndex, iNext, i)
    }
  }

  if (capEnd) {
    const lastBase = (rings.length - 1) * radialSegments
    const centre = ringCentroid(rings[rings.length - 1])
    const centreIndex = positions.length / 3
    positions.push(centre.x, centre.y, centre.z)

    for (let i = 0; i < radialSegments; i += 1) {
      const iNext = (i + 1) % radialSegments
      indices.push(centreIndex, lastBase + i, lastBase + iNext)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

function ringCentroid(ring) {
  const centre = new THREE.Vector3()
  for (const vertex of ring) centre.add(vertex)
  return centre.divideScalar(ring.length)
}

/**
 * Sample a smooth profile through control points.
 *
 * Control points are packed into a Catmull-Rom curve as
 * (axial position, half-height, half-width), which buys smooth interpolation of
 * both radii at once — a linear table would produce visible creases where the
 * taper rate changes.
 *
 * @param {Array<{x:number, radiusY:number, radiusZ:number, squareness?:number}>} controlPoints
 * @param {number} sampleCount
 * @returns {Array<{x:number, radiusY:number, radiusZ:number, squareness:number}>}
 */
export function sampleProfile(controlPoints, sampleCount) {
  const curve = new THREE.CatmullRomCurve3(
    controlPoints.map((point) => new THREE.Vector3(point.x, point.radiusY, point.radiusZ)),
    false,
    'catmullrom',
    0.5,
  )

  const samples = curve.getSpacedPoints(sampleCount - 1)

  return samples.map((sample, index) => {
    const t = index / (sampleCount - 1)
    return {
      x: sample.x,
      radiusY: Math.max(sample.y, 0.001),
      radiusZ: Math.max(sample.z, 0.001),
      squareness: interpolateSquareness(controlPoints, t),
    }
  })
}

/** Linear blend of the `squareness` channel across control points. */
function interpolateSquareness(controlPoints, t) {
  const scaled = t * (controlPoints.length - 1)
  const index = Math.min(Math.floor(scaled), controlPoints.length - 2)
  const local = scaled - index

  const from = controlPoints[index].squareness ?? 2.6
  const to = controlPoints[index + 1].squareness ?? 2.6

  return from + (to - from) * local
}

/**
 * Smooth 0..1..0 bump, used for localised anatomical swells (knuckles, thenar).
 * Returns 0 outside `centre ± width`, peaking at 1 in the middle.
 */
export function smoothBump(value, centre, width) {
  const distance = Math.abs(value - centre) / width
  if (distance >= 1) return 0
  return Math.cos(distance * Math.PI * 0.5) ** 2
}
