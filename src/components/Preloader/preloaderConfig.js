/**
 * Preloader presentation config.
 *
 * Timings and easing only — no loading logic. The visual design here is
 * deliberately minimal; this is the architecture the eventual art-directed
 * preloader will hang off, not the final look.
 */
export const PRELOADER_CONFIG = {
  /**
   * Hard ceiling on critical work before we degrade and let the visitor in.
   * Generous enough for a slow phone on a bad connection, short enough that a
   * genuinely broken load does not read as a hang.
   */
  criticalTimeoutMs: 12000,

  /**
   * Minimum time the preloader stays on screen.
   *
   * NOT a fake progress delay — real progress runs underneath and finishes when
   * it finishes. This only prevents a sub-100ms flash on a warm cache, which
   * reads as a glitch rather than as a load.
   */
  minimumDisplayMs: 700,

  /** Seconds the displayed number takes to chase the real value. */
  counterCatchUp: 0.55,

  reveal: {
    duration: 0.9,
    ease: 'power3.inOut',
    /** Hold on 100% before the curtain moves, so completion registers. */
    holdMs: 240,
  },

  /** Everything collapses to a quick fade when motion is reduced. */
  reducedMotion: {
    duration: 0.25,
    counterCatchUp: 0,
  },
}
