import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * PROJECTS_MOTION — the scroll storyboard.
 *
 * The section's pin length is measured in viewport heights and grows with the
 * project count:
 *
 *     total = introScroll + perProjectScroll * projectCount
 *
 * The opening therefore has to be a FIXED SCROLL COST, not a fixed fraction of
 * that total. Expressing it as a fraction works right up until the list grows:
 * at four projects a 0.44 fraction was 1.85vh of opening, but at twenty the
 * same fraction is 5.9vh — the intro type would take six screens to leave.
 *
 * So `opening` below is expressed as fractions OF THE OPENING, and mapped onto
 * timeline progress at build time once the real total is known. The storyboard
 * then reads the same at any project count:
 *
 *   0%    intro: headline and subtitle, image narrow and centred
 *   36%   headline releases, the frame starts opening
 *   77%   frame is wide and centred
 *   86%   frame settles left, detail column fades in
 *   100%  first project at rest — everything after is project-to-project
 */
export const PROJECTS_MOTION = {
  /** Viewport heights spent on the opening, regardless of project count. */
  introScroll: 1.5,
  /** Viewport heights each project holds before wiping to the next. */
  perProjectScroll: 0.55,
  scrub: 0.7,

  /** Fractions of the opening — see above. */
  opening: {
    introOut: 0.36,
    frameOpen: 0.77,
    frameSettle: 0.86,
  },
}

/**
 * Build the projects sequence.
 *
 * Two things happen here, and they are deliberately separate:
 *
 *  1. THE OPENING — a scrubbed timeline. The intro type leaves, the frame opens
 *     from a narrow centred crop to a full-width left-justified stage, and the
 *     detail column arrives. Scrubbed because the visitor is driving it.
 *
 *  2. THE CYCLE — discrete project-to-project transitions. NOT scrubbed. Each
 *     project holds still while it is read, then wipes to the next. Scrubbing
 *     this would mean the artwork is never at rest and the copy is never
 *     legible, which is the opposite of what a work section is for.
 *
 * @param {object} refs
 * @param {number} projectCount
 * @param {(index: number) => void} onIndexChange - discrete, for React chrome
 * @returns {() => void} cleanup
 */
export function createProjectsAnimation(refs, projectCount, onIndexChange) {
  const { section, intro, frame, detail, slides, details } = refs
  if (!section || !frame || projectCount === 0) return () => {}

  const mm = gsap.matchMedia()

  /*
   * Reduced motion: no pin, no sequence. The section falls back to a plain
   * stacked list, which the CSS already describes — so there is nothing to do
   * here beyond staying out of the way.
   */
  mm.add('(prefers-reduced-motion: reduce)', () => {
    section.dataset.static = 'true'
  })

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px)', () => {
    section.dataset.static = 'false'

    /*
     * Every project gets a full dwell, including the last — hence `* count`
     * rather than `* (count - 1)`, which used to let the final project appear
     * only at the instant the pin released.
     */
    const totalScroll =
      PROJECTS_MOTION.introScroll + PROJECTS_MOTION.perProjectScroll * projectCount

    /*
     * Where the opening ends, in timeline progress. Falls as the list grows,
     * which is the point: the opening keeps costing 1.5 viewport heights.
     */
    const openEnd = PROJECTS_MOTION.introScroll / totalScroll
    const o = PROJECTS_MOTION.opening

    const key = {
      introOut: openEnd * o.introOut,
      frameOpen: openEnd * o.frameOpen,
      frameSettle: openEnd * o.frameSettle,
      detailIn: openEnd,
    }

    /*
     * Declare the opening state rather than letting GSAP infer it from the CSS
     * `translate(-50%, -50%)` shorthand. Inference works, but it makes the
     * timeline's starting point depend on how a stylesheet happens to be
     * written — and the y centring has to survive the x tween untouched.
     */
    // Starts low, so the intro type has the upper half to itself and the frame
    // reads as waiting below the fold. It rises as it opens.
    gsap.set(frame, { left: '50%', top: '73%', width: '34%', xPercent: -50, yPercent: -50 })
    gsap.set(detail, { x: 30, yPercent: -50, autoAlpha: 0 })

    /* ------------------------------------------------------------ opening */

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * totalScroll}`,
        pin: true,
        pinSpacing: true,
        scrub: PROJECTS_MOTION.scrub,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Which project should be showing? Everything before `detailIn` is
          // the opening, so the cycle occupies the remainder.
          const cycle = (self.progress - key.detailIn) / (1 - key.detailIn)
          const index = Math.min(
            projectCount - 1,
            Math.max(0, Math.floor(cycle * projectCount + 0.0001)),
          )
          setActive(index)
        },
      },
    })

    timeline
      .to(intro, { autoAlpha: 0, y: -40, duration: key.introOut }, 0)
      /*
       * Three beats, matching the reference: narrow-centred, wide-centred,
       * then wide and justified left.
       *
       * Width is tweened rather than scaled. Scaling would blow the bitmap up
       * past its native resolution at precisely the moment it becomes the
       * largest thing on screen — the frame grows, the image inside it stays
       * pixel-for-pixel correct.
       */
      .to(
        frame,
        { width: '48%', top: '60%', duration: key.frameOpen - key.introOut, ease: 'power2.inOut' },
        key.introOut,
      )
      .to(
        frame,
        {
          width: '60%',
          left: '0%',
          top: '50%',
          xPercent: 0,
          duration: key.detailIn - key.frameOpen,
          ease: 'power2.inOut',
        },
        key.frameOpen,
      )
      .to(detail, { autoAlpha: 1, x: 0, duration: key.detailIn - key.frameSettle }, key.frameSettle)
      // Hold to the end so the pin runs the full cycle length.
      .to({}, { duration: 1 - key.detailIn }, key.detailIn)

    /* -------------------------------------------------------------- cycle */

    let active = -1

    function setActive(index) {
      if (index === active) return
      const previous = active
      active = index

      // Discrete: React re-renders the counter and dots, not the artwork.
      onIndexChange(index)

      slides.forEach((slide, i) => {
        if (!slide) return
        const isActive = i === index

        gsap.killTweensOf(slide)

        if (isActive) {
          // Wipe up from the bottom edge over whatever was there, matching the
          // reference's vertical reveal rather than a crossfade.
          const fromBelow = previous !== -1 && index > previous
          gsap.fromTo(
            slide,
            {
              autoAlpha: 1,
              clipPath: fromBelow ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.9,
              ease: 'power3.inOut',
              overwrite: 'auto',
            },
          )
          gsap.set(slide, { zIndex: 2 })
        } else {
          gsap.set(slide, { zIndex: 1 })
          gsap.to(slide, { autoAlpha: i < index ? 1 : 0, duration: 0.4, overwrite: 'auto' })
        }
      })

      details.forEach((node, i) => {
        if (!node) return
        gsap.killTweensOf(node)
        gsap.to(node, {
          autoAlpha: i === index ? 1 : 0,
          y: i === index ? 0 : 14,
          duration: 0.55,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }

    // Seed the first project so the stage is never blank before the first
    // onUpdate fires.
    setActive(0)

    // Dev handle for inspecting the sequence from automation.
    if (import.meta.env.DEV) window.__projectsTimeline = timeline

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
  })

  return () => mm.revert()
}
