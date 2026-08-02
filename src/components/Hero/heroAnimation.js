import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_MOTION, MOBILE_BREAKPOINT } from './heroConfig.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-driven hero sequence.
 *
 * Native scrolling is never intercepted. ScrollTrigger reads the scrollbar and
 * maps it onto a timeline; the browser keeps full control of the scroll itself,
 * so there is no wheel hijacking and no custom scroller.
 *
 * Every animated value is written straight to the DOM by GSAP. React renders
 * this component once and is not involved again — no state is touched per
 * frame, which is what keeps the sequence smooth under scrub.
 *
 * ELEMENT CONTRACT
 * The elements handed in here are the INNER nodes of each part. Their outer
 * wrappers own layout — position and the anchor offset that puts the fingertips
 * where the composition says. Splitting them means GSAP owns one transform
 * outright and never has to compose with, or clobber, a CSS one.
 *
 * @param {object} elements - { section, armA, armB, symbol }
 * @returns {() => void} cleanup
 */
export function createHeroAnimation(elements) {
  const { section, armA, armB, symbol } = elements
  if (!section || !armA || !armB || !symbol) return () => {}

  const mm = gsap.matchMedia()

  /**
   * Reduced motion: no pin, no sequence. The artwork stays in its composed
   * position and the page scrolls normally. Preserving the piece matters more
   * than showing the motion to someone who asked not to see it.
   */
  mm.add('(prefers-reduced-motion: reduce)', () => {})

  mm.add(
    {
      desktop: `(min-width: ${MOBILE_BREAKPOINT}px) and (prefers-reduced-motion: no-preference)`,
      mobile: `(max-width: ${MOBILE_BREAKPOINT - 1}px) and (prefers-reduced-motion: no-preference)`,
    },
    (context) => {
      const { desktop } = context.conditions
      const motion = desktop ? HERO_MOTION.desktop : HERO_MOTION.mobile

      const timeline = buildSequence({ section, armA, armB, symbol, motion })

      // Dev handle for inspecting the sequence from the console / automation.
      if (import.meta.env.DEV) {
        window.__heroTimeline = timeline
        return () => {
          delete window.__heroTimeline
        }
      }

      return undefined
    },
  )

  return () => mm.revert()
}

function buildSequence({ section, armA, armB, symbol, motion }) {
  const key = HERO_MOTION.keyframes

  const timeline = gsap.timeline({
    // Total duration of 1 makes timeline time and scroll progress the same
    // number, so the keyframe config reads as the storyboard it describes.
    defaults: { duration: key.entryEnd },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      // Recomputed on refresh, so a resized window re-measures rather than
      // keeping a stale pixel length.
      end: () => `+=${window.innerHeight * HERO_MOTION.scrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: HERO_MOTION.scrub,
      // Re-reads every recorded value on resize; without it the viewport-unit
      // distances stay frozen at whatever the first measurement was.
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  })

  /* ---------------------------------------------------------------- entry */

  /*
   * fromTo landing on identity. HERO_LAYOUT is the DESTINATION, so the pose
   * tuned by eye is exactly what the visitor ends on and the animation can
   * never drift it.
   *
   * `power2.out` rather than linear: the arms carry most of their travel early
   * and ease into place, which reads as arriving somewhere rather than being
   * dragged along by the scrollbar.
   */
  const arrive = { x: 0, y: 0, rotation: 0, scale: 1, ease: 'power2.out' }

  timeline
    .fromTo(armB, fromVars(motion.armB.from), { ...arrive }, 0)
    .fromTo(armA, fromVars(motion.armA.from), { ...arrive }, 0)
    .fromTo(symbol, { scale: motion.symbol.fromScale }, { scale: 1, ease: 'power2.out' }, 0)

  /* -------------------------------------------------------------- contact */

  // A brief swell as the fingertips arrive, then settle. Deliberately small —
  // the arrival is the moment; the symbol only acknowledges it.
  const pulseRise = 0.04

  timeline
    .to(symbol, { scale: motion.symbol.contactScale, duration: pulseRise }, key.contact)
    .to(symbol, { scale: 1, duration: 1 - (key.contact + pulseRise) }, key.contact + pulseRise)

  return timeline
}

/**
 * Config -> GSAP vars.
 *
 * Distances are viewport-relative so the motion scales with the frame: x tracks
 * width, y tracks height. A pixel value tuned on a laptop would send the arms
 * only a third of the way across a wide monitor.
 *
 * They are resolved by FUNCTION, not by a "54vw" string. GSAP's transform
 * channels accept px and % only — handed a viewport unit it parses the number
 * and silently drops the unit, so "54vw" animates 54 PIXELS. Function-based
 * values sidestep that and, paired with `invalidateOnRefresh`, get re-measured
 * on resize instead of freezing at their first computed value.
 */
function fromVars({ x, y, rotate, scale }) {
  return {
    x: () => (window.innerWidth * x) / 100,
    y: () => (window.innerHeight * y) / 100,
    rotation: rotate,
    scale,
  }
}
