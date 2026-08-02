import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { buildLoftGeometry, createRing, smoothBump } from './loft.js'

/**
 * Articulated digit construction (fingers and thumb).
 *
 * A digit is a chain of phalanges. Rather than nesting Object3Ds and paying a
 * draw call per bone, the joint chain is accumulated as a Matrix4 while walking
 * the phalanges and each segment's geometry is baked into that pose. The whole
 * hand then merges into a single buffer — the pose is fixed art direction, so
 * there is nothing to gain from keeping the bones live.
 */

/**
 * Build one phalanx as a tapered, gently curved loft along local +X.
 *
 * @param {object} params
 * @param {number} params.length
 * @param {number} params.startRadiusY - half-height at the joint
 * @param {number} params.startRadiusZ - half-width at the joint
 * @param {number} params.endRadiusY
 * @param {number} params.endRadiusZ
 * @param {number} [params.curvature] - droop toward the palm across the segment
 * @param {number} [params.knuckleBulge] - swell at the base, 0 disables
 * @param {number} [params.squareness]
 * @param {number} params.radialSegments
 * @param {number} params.rings
 * @param {object} [params.irregularity] - { jitter, random }
 * @returns {THREE.BufferGeometry}
 */
export function createFingerSegment(params) {
  const {
    length,
    startRadiusY,
    startRadiusZ,
    endRadiusY,
    endRadiusZ,
    curvature = 0,
    knuckleBulge = 0,
    squareness = 2.8,
    radialSegments,
    rings: ringCount,
    // Segments start slightly behind their joint so neighbours interpenetrate.
    // Without this, a flexed joint opens a visible notch in the silhouette on
    // the outside of the bend.
    overlap = 0,
    irregularity = {},
  } = params

  const rings = []
  const span = length + overlap

  for (let i = 0; i < ringCount; i += 1) {
    const t = i / (ringCount - 1)

    // Ease the taper so the segment reads fuller mid-shaft than a straight
    // lerp would — a linear taper looks machined.
    const taper = easeTaper(t)

    // Knuckle swell, concentrated just past the joint.
    const bulge = knuckleBulge > 0 ? 1 + knuckleBulge * smoothBump(t, 0.16, 0.34) : 1

    rings.push(
      createRing(
        {
          x: -overlap + t * span,
          radiusY: THREE.MathUtils.lerp(startRadiusY, endRadiusY, taper) * bulge,
          radiusZ: THREE.MathUtils.lerp(startRadiusZ, endRadiusZ, taper) * bulge,
          squareness,
          // Quadratic droop: the bend accumulates toward the tip like a real
          // phalanx rather than pivoting only at the joint.
          offsetY: -curvature * t * t,
        },
        radialSegments,
        irregularity,
      ),
    )
  }

  return buildLoftGeometry(rings, { capStart: true, capEnd: true })
}

/**
 * Taper easing. Smoothstep holds the section near its start radius through the
 * mid-shaft before falling away, which reads as a fuller, carved form; a linear
 * interpolation gives the machined cone look we are avoiding.
 */
function easeTaper(t) {
  return t * t * (3 - 2 * t)
}

/**
 * Rounded, stylised fingertip closing the distal phalanx.
 *
 * Deliberately not a hemisphere. Width collapses faster than height so the tip
 * keeps a fleshy pad in profile, and the section drifts toward the nail side as
 * it closes. This silhouette is the single most-scrutinised detail in the hero,
 * since it is what approaches the `</>` symbol.
 *
 * @returns {THREE.BufferGeometry}
 */
export function createFingertip(params) {
  const {
    radiusY,
    radiusZ,
    length,
    rings: ringCount,
    radialSegments,
    squareness = 2.8,
    padBias = 0.16,
    irregularity = {},
  } = params

  const rings = []

  for (let i = 0; i < ringCount; i += 1) {
    const t = i / (ringCount - 1)
    const angle = t * Math.PI * 0.5

    // Separate falloffs: the pad (height) survives longer than the width.
    const widthScale = Math.cos(angle) ** 0.9
    const heightScale = Math.cos(angle) ** 0.62

    rings.push(
      createRing(
        {
          x: Math.sin(angle) * length,
          // Never fully collapse — a zero-radius ring makes degenerate faces
          // with unusable normals. A small final ring caps cleanly instead.
          radiusZ: Math.max(radiusZ * widthScale, radiusZ * 0.1),
          radiusY: Math.max(radiusY * heightScale, radiusY * 0.12),
          squareness,
          // Tip curls very slightly toward the nail side as it rounds off.
          offsetY: padBias * radiusY * Math.sin(angle) ** 2,
        },
        radialSegments,
        irregularity,
      ),
    )
  }

  return buildLoftGeometry(rings, { capStart: false, capEnd: true })
}

/**
 * Build a complete articulated digit.
 *
 * The chain is walked once, composing: joint rotation -> bake segment -> advance
 * along the segment's length. `curl` is expressed as a positive angle meaning
 * "toward the palm" and applied as a negative rotation about Z, since +X folding
 * toward -Y is a negative Z rotation.
 *
 * @param {object} params
 * @param {number[]} params.origin - knuckle position in hand space
 * @param {number} [params.splay] - fan angle about Y, + toward the thumb
 * @param {number} [params.pitch] - lift/drop about Z at the knuckle
 * @param {number} [params.roll] - twist about the digit's own axis
 * @param {number} params.length - total length, split by segment ratios
 * @param {number[]} params.segmentRatios - phalanx lengths, should sum to ~1
 * @param {number[]} params.curls - per-joint flexion, one per segment
 * @param {number} params.baseRadiusY
 * @param {number} params.baseRadiusZ
 * @param {number} params.tipRadiusScale - tip radius as a fraction of base
 * @param {number} [params.curvature] - per-segment droop
 * @param {number} [params.knuckleBulge]
 * @param {object} params.detail - { radialSegments, ringsPerPhalanx, tipRings }
 * @param {object} [params.irregularity]
 * @returns {THREE.BufferGeometry} merged, posed geometry in hand space
 */
export function createDigit(params) {
  const {
    origin,
    splay = 0,
    pitch = 0,
    roll = 0,
    length,
    segmentRatios,
    curls,
    baseRadiusY,
    baseRadiusZ,
    tipRadiusScale,
    curvature = 0,
    knuckleBulge = 0,
    squareness = 2.8,
    tipLengthScale = 0.85,
    padBias,
    /**
     * Fraction of base radius each phalanx reaches back past its joint. Also
     * buries the first phalanx into the palm so the knuckle bulge merges with
     * the metacarpal mass instead of butting against it.
     */
    jointOverlap = 0.9,
    detail,
    irregularity = {},
  } = params

  const parts = []

  // Cursor holds the accumulated joint transform as we walk out the chain.
  const cursor = new THREE.Matrix4().makeTranslation(origin[0], origin[1], origin[2])
  cursor.multiply(new THREE.Matrix4().makeRotationY(splay))
  cursor.multiply(new THREE.Matrix4().makeRotationX(roll))
  cursor.multiply(new THREE.Matrix4().makeRotationZ(-pitch))

  const tipRadiusY = baseRadiusY * tipRadiusScale
  const tipRadiusZ = baseRadiusZ * tipRadiusScale

  // Cumulative length fractions let each segment sample the digit-wide taper.
  let travelled = 0

  for (let index = 0; index < segmentRatios.length; index += 1) {
    const ratio = segmentRatios[index]
    const segmentLength = length * ratio

    const startFraction = travelled
    const endFraction = travelled + ratio

    cursor.multiply(new THREE.Matrix4().makeRotationZ(-(curls[index] ?? 0)))

    const segment = createFingerSegment({
      length: segmentLength,
      startRadiusY: THREE.MathUtils.lerp(baseRadiusY, tipRadiusY, startFraction),
      startRadiusZ: THREE.MathUtils.lerp(baseRadiusZ, tipRadiusZ, startFraction),
      endRadiusY: THREE.MathUtils.lerp(baseRadiusY, tipRadiusY, endFraction),
      endRadiusZ: THREE.MathUtils.lerp(baseRadiusZ, tipRadiusZ, endFraction),
      curvature: curvature * ratio,
      // Only the first phalanx carries a knuckle.
      knuckleBulge: index === 0 ? knuckleBulge : knuckleBulge * 0.35,
      squareness,
      // The first phalanx reaches back into the palm so the knuckle joins
      // seamlessly; later phalanges bury into the previous joint.
      overlap: baseRadiusY * jointOverlap,
      radialSegments: detail.radialSegments,
      rings: detail.ringsPerPhalanx,
      irregularity,
    })

    segment.applyMatrix4(cursor)
    parts.push(segment)

    cursor.multiply(new THREE.Matrix4().makeTranslation(segmentLength, 0, 0))
    travelled = endFraction
  }

  // Close the chain with the rounded tip, in the final joint's frame.
  const tip = createFingertip({
    radiusY: tipRadiusY,
    radiusZ: tipRadiusZ,
    length: tipRadiusZ * 2 * tipLengthScale,
    rings: detail.tipRings,
    radialSegments: detail.radialSegments,
    squareness,
    padBias,
    irregularity,
  })
  tip.applyMatrix4(cursor)
  parts.push(tip)

  return mergeGeometries(parts, false)
}
