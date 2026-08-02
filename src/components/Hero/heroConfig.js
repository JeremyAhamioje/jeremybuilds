/**
 * HERO_LAYOUT — composition art direction.
 *
 * One place for every number that decides where the artwork sits. Positions are
 * percentages of the hero stage so the composition scales with the viewport
 * rather than depending on a fixed canvas size.
 *
 * COORDINATES
 *   x, y   — position of the element's anchor point, in % of stage
 *   width  — rendered width, in % of stage width
 *   rotate — baseline rotation in degrees
 *   depth  — stacking order; the symbol sits at 2, so an arm at 1 passes behind
 *            it and an arm at 3 passes in front. That asymmetry is what stops
 *            the meeting reading as two flat cut-outs on the same plane.
 *
 * ANCHORING
 *   Arms are anchored on the hand end rather than the image corner, so tuning
 *   the composition moves the fingertips — the thing the eye actually tracks —
 *   instead of an arbitrary bounding box.
 */

export const MOBILE_BREAKPOINT = 768

/**
 * Where each arm's fingertips sit inside its own trimmed artwork, as a fraction
 * of that image. Measured from the assets, not guessed — used to anchor the
 * composition on the hands. See `npm run assets` output for intrinsic sizes.
 */
export const ARM_ANCHORS = {
  // Hand at the LEFT of its image, fingers pointing left.
  'arm-a': { x: 0.06, y: 0.36 },
  // Hand at the RIGHT of its image, fingers draping down-right.
  'arm-b': { x: 0.93, y: 0.78 },
}

export const HERO_LAYOUT = {
  desktop: {
    /** Reaching right, entering from the upper left. Passes BEHIND the symbol. */
    armB: {
      asset: 'arm-b',
      width: 52,
      x: 42,
      y: 44,
      rotate: 0,
      depth: 1,
    },
    /** Reaching left, entering from the lower right. Passes IN FRONT. */
    armA: {
      asset: 'arm-a',
      width: 50,
      x: 58,
      y: 66,
      rotate: 0,
      depth: 3,
    },
    symbol: {
      x: 50,
      y: 55,
      /** Rendered width in % of stage — deliberately small next to the arms. */
      width: 5.4,
      depth: 2,
    },
  },

  /**
   * Mobile is re-composed, not scaled down. A portrait frame cannot hold two
   * horizontal arms, so the reach becomes a steep diagonal: upper-left down to
   * lower-right, with the symbol at the crossing.
   */
  mobile: {
    armB: {
      asset: 'arm-b',
      width: 104,
      x: 44,
      y: 40,
      rotate: 14,
      depth: 1,
    },
    armA: {
      asset: 'arm-a',
      width: 100,
      x: 56,
      y: 72,
      rotate: -8,
      depth: 3,
    },
    symbol: {
      x: 50,
      y: 57,
      width: 12,
      depth: 2,
    },
  },
}

export function resolveLayout(width) {
  return width < MOBILE_BREAKPOINT ? HERO_LAYOUT.mobile : HERO_LAYOUT.desktop
}

/**
 * HERO_MOTION — the scroll sequence.
 *
 * A micro animation, not a set piece. The arms begin further out, with roughly
 * a fifth of each one still outside the frame, and glide in until the
 * fingertips meet the `</>`. That arrival IS the ending — there is no exit
 * choreography. The hero simply unpins and the page carries on.
 *
 *   0.00  arms held back, partly out of frame
 *   0.86  fingertips have arrived at the symbol
 *   0.90  the symbol acknowledges it
 *   1.00  settled; hero releases
 *
 * HERO_LAYOUT is the DESTINATION, not the starting pose: the composed layout is
 * where the motion lands. `from` below is an offset back along each arm's line
 * of travel, so the composition tuned by eye is exactly what the visitor ends
 * on, and the animation cannot drift it.
 */
export const HERO_MOTION = {
  /**
   * Pin length as a multiple of viewport height. Short, because the payload is
   * small — a long pin for a subtle move just feels like the page has stalled.
   */
  scrollDistance: 1.15,

  /**
   * Scrub smoothing, in seconds of catch-up. Not a delay on the scroll itself —
   * the page still scrolls natively; this only eases the artwork toward the
   * position scroll has already reached, which removes wheel-step jitter.
   */
  scrub: 0.8,

  keyframes: {
    entryEnd: 0.86,
    contact: 0.9,
  },

  desktop: {
    /**
     * Offsets are a fraction of each arm's own rendered width (52vw and 50vw),
     * so "held back by 20%" means the same thing on any monitor. Pulled back
     * along the diagonal each arm travels: armB up-left, armA down-right.
     */
    armB: { from: { x: -10.4, y: -3.4, rotate: -0.7, scale: 0.985 } },
    armA: { from: { x: 10, y: 3.2, rotate: 0.7, scale: 0.985 } },
    symbol: { fromScale: 0.9, contactScale: 1.12 },
  },

  mobile: {
    // Vertical diagonal, so the arms are held back mostly in y.
    armB: { from: { x: -4, y: -13, rotate: -1.2, scale: 0.985 } },
    armA: { from: { x: 4, y: 13, rotate: 1.2, scale: 0.985 } },
    symbol: { fromScale: 0.9, contactScale: 1.12 },
  },
}
