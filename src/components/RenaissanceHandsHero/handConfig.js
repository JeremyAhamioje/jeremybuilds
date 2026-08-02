/**
 * HAND_CONFIG — anatomy and pose.
 *
 * Kept separate from HERO_CONFIG: that file is about where things sit in the
 * frame, this one is about how the hand itself is built. Every number here is
 * art direction and safe to tune.
 *
 * HAND SPACE:
 *   +X — wrist -> fingertips
 *   +Y — back of the hand (the palm faces -Y)
 *   +Z — thumb side
 * The forearm runs back to x = -2.2 so it exits the frame, matching the way the
 * arms enter from outside the canvas in the source composition.
 */

/** Shared phalanx length split: proximal, intermediate, distal. */
const PHALANX_RATIOS = [0.45, 0.31, 0.24]

export const HAND_CONFIG = {
  /**
   * Presentation rotation, applied to the mesh inside the hand group so the
   * group's own transform stays free for composition and scroll animation.
   *
   * ~57 deg about X is a true three-quarter: enough to show the back of the
   * hand and the thumb, while keeping the fingers' curl across the view rather
   * than into it. At a flat 90 deg the curl points straight away from camera and
   * the fingers foreshorten into stacked slats.
   */
  presentation: {
    rotation: [1.0, 0, 0],
  },

  /**
   * Seeded surface irregularity. Small enough to read as chisel work rather
   * than noise; deterministic so the sculpture never reshapes on reload.
   */
  irregularity: {
    jitter: 0.012,
    seed: 20260802,
  },

  palm: {
    detail: {
      rings: 26,
      radialSegments: 14,
    },

    /**
     * Swept profile: (x, half-height, half-width, squareness).
     *
     * Proportions follow the hand rather than the eye: palm length (wrist
     * crease ~ -0.15 to the knuckle line at 0.92) lands close to the middle
     * finger's 1.02, which is the real relationship. Letting the palm run
     * longer than the fingers is what makes a procedural hand read as a paddle.
     *
     * Note the wrist is markedly wider than it is thick — that flattening is
     * what stops the forearm reading as a tube.
     */
    profile: [
      { x: -2.2, radiusY: 0.3, radiusZ: 0.335, squareness: 2.4 }, // forearm, exits frame
      { x: -1.4, radiusY: 0.265, radiusZ: 0.295, squareness: 2.4 },
      { x: -0.7, radiusY: 0.2, radiusZ: 0.235, squareness: 2.5 },
      { x: -0.3, radiusY: 0.16, radiusZ: 0.225, squareness: 2.6 }, // narrowest: the wrist
      { x: -0.05, radiusY: 0.172, radiusZ: 0.285, squareness: 2.7 }, // palm opens out
      { x: 0.25, radiusY: 0.188, radiusZ: 0.38, squareness: 2.8 },
      { x: 0.55, radiusY: 0.192, radiusZ: 0.445, squareness: 2.85 },
      { x: 0.78, radiusY: 0.182, radiusZ: 0.46, squareness: 2.9 }, // broadest
      { x: 0.92, radiusY: 0.162, radiusZ: 0.45, squareness: 2.8 }, // knuckle line
    ],

    /**
     * Rounds the knuckle edge over rather than ending on a flat disc.
     * Spread across enough rings and distance to avoid a shading crease — a
     * short roll swings the normals too fast and reads as a chopped edge, which
     * is the exact box tell it exists to remove.
     */
    knuckleRoll: {
      rings: 5,
      length: 0.24,
      maxAngle: Math.PI * 0.38,
      thicknessFalloff: 0.45,
      widthFalloff: 0.2,
    },

    /** Muscular pad at the thumb base. Positions are normalised along the sweep. */
    thenar: {
      centre: 0.74,
      width: 0.15,
      amount: 0.115,
      palmBias: 0.6,
    },

    /** The cup of the hand, hollowing the -Y face. */
    concavity: {
      centre: 0.85,
      width: 0.11,
      amount: 0.05,
      lateralFalloff: 0.32,
    },

    /** Knuckle line swept back toward the little finger. */
    knuckleArch: {
      width: 0.1,
      sweep: 0.12,
      arch: 0.05,
    },
  },

  /** Default digit detail. The index overrides these — see below. */
  detail: {
    radialSegments: 9,
    ringsPerPhalanx: 5,
    tipRings: 5,
  },

  /**
   * Fingers, ordered from the thumb side. Lengths, widths, splay and curl all
   * differ per finger — identical fingers are the fastest way to make a
   * procedural hand look fake.
   *
   * The pose is the reaching gesture: the index is nearly straight while the
   * remaining fingers relax progressively into the palm. The curls stay gentle
   * on purpose — the Creation of Adam hands are languid and open, and anything
   * approaching a fist both loses the gesture and hides the fingers behind the
   * palm when viewed from the back.
   */
  fingers: {
    index: {
      origin: [0.8, 0.028, 0.315],
      splay: 0.28,
      pitch: -0.06, // lifted very slightly
      length: 0.95,
      segmentRatios: PHALANX_RATIOS,
      curls: [0.04, 0.07, 0.05], // the reaching finger — almost straight
      baseRadiusY: 0.105,
      baseRadiusZ: 0.098,
      tipRadiusScale: 0.63,
      curvature: 0.012,
      knuckleBulge: 0.22,
      padBias: 0.18,
      /** Focal point of the whole hero — carries roughly double the geometry. */
      detail: {
        radialSegments: 12,
        ringsPerPhalanx: 7,
        tipRings: 7,
      },
    },

    middle: {
      origin: [0.845, 0.048, 0.108],
      splay: 0.06,
      pitch: -0.02,
      length: 1.02,
      segmentRatios: PHALANX_RATIOS,
      curls: [0.14, 0.22, 0.15],
      baseRadiusY: 0.108,
      baseRadiusZ: 0.101,
      tipRadiusScale: 0.63,
      curvature: 0.02,
      knuckleBulge: 0.22,
      padBias: 0.16,
    },

    ring: {
      origin: [0.82, 0.038, -0.102],
      splay: -0.16,
      pitch: 0.01,
      length: 0.96,
      segmentRatios: PHALANX_RATIOS,
      curls: [0.22, 0.32, 0.2],
      baseRadiusY: 0.1,
      baseRadiusZ: 0.094,
      tipRadiusScale: 0.63,
      curvature: 0.02,
      knuckleBulge: 0.21,
      padBias: 0.16,
    },

    pinky: {
      origin: [0.735, 0.012, -0.292],
      splay: -0.36,
      pitch: 0.04,
      length: 0.76,
      segmentRatios: PHALANX_RATIOS,
      curls: [0.3, 0.42, 0.26],
      baseRadiusY: 0.087,
      baseRadiusZ: 0.081,
      tipRadiusScale: 0.64,
      curvature: 0.022,
      knuckleBulge: 0.2,
      padBias: 0.16,
    },
  },

  /**
   * The thumb is not a fifth finger. It springs from the thenar mass low on the
   * palm, opposes the fingers via a large splay plus an axial roll, and its
   * visible length includes the metacarpal — which is why it gets three
   * segments but sits far back and reads shorter and thicker.
   */
  thumb: {
    origin: [0.12, -0.05, 0.24],
    splay: 0.72, // swings wide of the palm
    roll: 0.6, // the opposition twist
    pitch: 0.25,
    length: 0.86,
    segmentRatios: [0.42, 0.32, 0.26], // metacarpal, proximal, distal
    curls: [0.1, 0.28, 0.2],
    baseRadiusY: 0.135,
    baseRadiusZ: 0.125, // noticeably heavier than any finger
    tipRadiusScale: 0.72,
    curvature: 0.02,
    knuckleBulge: 0.1,
    padBias: 0.2,
    squareness: 2.9,
  },
}
