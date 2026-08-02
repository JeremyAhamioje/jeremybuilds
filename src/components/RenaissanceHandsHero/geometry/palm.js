import * as THREE from 'three'
import { buildLoftGeometry, createRing, sampleProfile, smoothBump } from './loft.js'

/**
 * Palm, wrist and forearm as ONE continuous loft.
 *
 * Building these as separate parts is what makes procedural hands read as
 * assembled primitives — the wrist ends up looking like a peg pushed into a
 * box. Sweeping a single profile from the forearm cut through the narrow wrist
 * and out to the knuckle line makes the transition structural rather than
 * cosmetic, and the taper does the anatomical work on its own.
 *
 * On top of the swept profile, three per-vertex modulations add the anatomy a
 * radially symmetric loft cannot express:
 *   - thenar eminence : the muscular pad at the base of the thumb
 *   - palm concavity  : the cupped hollow on the -Y face
 *   - knuckle arch    : the knuckle line curving back toward the little finger
 */
export function createPalm(config, irregularity = {}) {
  const { profile, detail, thenar, concavity, knuckleArch, knuckleRoll } = config

  const sections = sampleProfile(profile, detail.rings)
  const knuckleX = profile[profile.length - 1].x
  const wristX = profile[0].x
  const span = knuckleX - wristX

  /**
   * Shared per-vertex anatomy pass.
   *
   * The knuckle-roll rings MUST run through this too. The arch displaces the
   * final profile ring in x by up to its full sweep; leaving the roll rings
   * unmodulated puts a step between a swept ring and a flat one, which tears
   * into visible shards along the knuckle line.
   */
  const modulateSection = (section, t) => (vertex) => {
    applyThenarEminence(vertex, t, thenar)
    applyPalmConcavity(vertex, t, concavity)
    applyKnuckleArch(vertex, t, knuckleArch, section.radiusZ)
  }

  const rings = sections.map((section) => {
    // Normalised position along the whole sweep, 0 at forearm, 1 at knuckles.
    const t = (section.x - wristX) / span

    return createRing(section, detail.radialSegments, {
      ...irregularity,
      modulate: modulateSection(section, t),
    })
  })

  if (knuckleRoll) {
    rings.push(
      ...createKnuckleRoll(
        sections[sections.length - 1],
        knuckleRoll,
        detail,
        irregularity,
        modulateSection,
      ),
    )
  }

  return buildLoftGeometry(rings, { capStart: true, capEnd: true })
}

/**
 * Roll the knuckle line over instead of ending on a flat cap.
 *
 * A loft terminated square leaves a disc facing down the sweep axis, and that
 * hard chopped edge is the single strongest "assembled from boxes" tell. Here
 * the thickness falls away quickly while the width barely changes, which is how
 * the back of the hand actually turns over into the fingers.
 */
function createKnuckleRoll(lastSection, config, detail, irregularity, modulateSection) {
  const rings = []

  for (let i = 1; i <= config.rings; i += 1) {
    const angle = (i / config.rings) * config.maxAngle

    const section = {
      x: lastSection.x + Math.sin(angle) * config.length,
      // Thickness rolls off fast, width persists — the knuckle edge.
      radiusY: lastSection.radiusY * Math.cos(angle) ** config.thicknessFalloff,
      radiusZ: lastSection.radiusZ * Math.cos(angle) ** config.widthFalloff,
      squareness: lastSection.squareness,
    }

    rings.push(
      createRing(section, detail.radialSegments, {
        ...irregularity,
        // t = 1: the roll is the far end of the sweep, so it inherits the same
        // knuckle arch displacement as the last profile ring.
        modulate: modulateSection(section, 1),
      }),
    )
  }

  return rings
}

/**
 * Thenar eminence — the fleshy mass at the thumb base.
 *
 * Swells the thumb side (+Z) of the lower palm outward and toward the palm
 * face. This is the detail that most separates a hand from a tapered slab: it
 * breaks the left/right symmetry and gives the silhouette a readable thumb root.
 */
function applyThenarEminence(vertex, t, config) {
  if (!config) return

  const { centre, width, amount, palmBias } = config

  const along = smoothBump(t, centre, width)
  if (along <= 0) return

  // Only the thumb half of the section participates, fading across the middle.
  const lateral = THREE.MathUtils.smoothstep(vertex.z, -0.05, 0.28)
  const influence = along * lateral

  vertex.z += amount * influence
  // Bulges toward the palm face, not the back of the hand.
  if (vertex.y < 0) vertex.y -= amount * palmBias * influence
}

/**
 * Palm concavity — the cup of the hand.
 *
 * Lifts the centre of the -Y face toward the back, hollowing the palm. Edges
 * are untouched so the silhouette keeps its full width.
 */
function applyPalmConcavity(vertex, t, config) {
  if (!config || vertex.y >= 0) return

  const { centre, width, amount } = config

  const along = smoothBump(t, centre, width)
  if (along <= 0) return

  // Strongest at the middle of the palm face, zero at the edges.
  const across = 1 - Math.min(Math.abs(vertex.z) / config.lateralFalloff, 1)

  vertex.y += amount * along * across * across
}

/**
 * Knuckle arch — the knuckle line is not square to the hand.
 *
 * The index knuckle sits further forward than the little finger's, so the
 * leading edge is swept back toward -Z. Without this the hand ends in a flat
 * chopped-off face that reads as a box.
 */
function applyKnuckleArch(vertex, t, config, radiusZ) {
  if (!config) return

  const along = smoothBump(t, 1, config.width)
  if (along <= 0) return

  // Normalised across the section: +1 thumb side, -1 little-finger side.
  const lateral = radiusZ > 0 ? THREE.MathUtils.clamp(vertex.z / radiusZ, -1, 1) : 0

  // Sweep back toward the little finger, plus a gentle arch over the top.
  vertex.x += config.sweep * lateral * along
  vertex.x -= config.arch * lateral * lateral * along
}
