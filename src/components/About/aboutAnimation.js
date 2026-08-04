import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * About-section micro animations.
 *
 * Deliberately small: type rises a few pixels, a highlight wipes under each
 * section title. The resume has to read as a document that settled onto the
 * page, not as a slide deck building itself.
 *
 * Everything plays ONCE on entry rather than scrubbing with scroll. Scrubbed
 * micro-motion means the sheet is never at rest while the visitor reads it,
 * which is actively worse for something they are meant to actually read.
 *
 * @param {HTMLElement} root - the About section
 * @returns {() => void} cleanup
 */
export function createAboutAnimation(root) {
  if (!root) return () => {}

  let disposed = false

  /*
   * Re-measure once the page stops moving underneath us.
   *
   * Triggers are built during useLayoutEffect, which is before the webfonts
   * have swapped in. Fallback metrics are not the real metrics, so the sheet's
   * height changes afterwards and every start position below it is stale — the
   * symptom is a title that scrolls well past its trigger line and never fires
   * because ScrollTrigger still thinks it is somewhere else.
   */
  const refresh = () => {
    if (!disposed) ScrollTrigger.refresh()
  }

  if (document.fonts?.ready) document.fonts.ready.then(refresh)
  // Belt and braces for anything that lands after fonts (late images, etc.).
  window.addEventListener('load', refresh)

  const mm = gsap.matchMedia()

  // Reduced motion: everything is already in its final state in CSS, so there
  // is simply nothing to do.
  mm.add('(prefers-reduced-motion: reduce)', () => {})

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const intro = root.querySelectorAll('[data-animate="intro"]')
    const name = root.querySelector('[data-animate="name"]')
    const titles = root.querySelectorAll('[data-animate="title"]')
    const sheet = root.querySelector('[data-animate="sheet"]')

    /* --------------------------------------------------------- left column */

    if (intro.length) {
      gsap.from(intro, {
        y: 26,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: 'top 72%', once: true },
      })
    }

    /* --------------------------------------------------------- the sheet */

    /*
     * The sheet does not animate. It used to rise 40px and fade in on entry;
     * the résumé should read as a physical document already on the page, and
     * a card that slides in undercuts that every time you reach it.
     *
     * The micro-animations INSIDE it stay — the name fading in and the skill
     * titles' highlights wiping across are the detail this section was asked
     * for. Ink arriving on paper is a different thing from the paper moving.
     */

    /* ----------------------------------------------------------- the name */

    if (name) {
      gsap.from(name, {
        y: 14,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        // A beat after the sheet comes into view. The sheet itself no longer
        // animates, so this is what makes the name read as ink arriving on
        // paper that was already there.
        delay: 0.18,
        // Still triggered off the sheet: the name sits high in it, and keying
        // off the name alone would fire before the document is really on screen.
        scrollTrigger: { trigger: sheet ?? name, start: 'top 85%', once: true },
      })
    }

    /* ------------------------------------------------- title highlights */

    if (titles.length) {
      // Collapse the highlights up front, not on entry. Setting the start state
      // inside onEnter would leave them drawn at full width until the moment
      // they scroll in, then visibly snap to zero before wiping.
      gsap.set(titles, { '--highlight-scale': 0, autoAlpha: 0, y: 8 })

      // Batched so a column of titles wipes in sequence as it enters, rather
      // than all firing at once when the sheet's top edge crosses the line.
      ScrollTrigger.batch(titles, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.08,
          })

          gsap.to(batch, {
            // Drives the ::before highlight, since pseudo-elements cannot be
            // tweened directly. GSAP interpolates the numeric custom property.
            '--highlight-scale': 1,
            duration: 0.65,
            ease: 'power2.inOut',
            stagger: 0.08,
            delay: 0.14,
          })
        },
      })
    }
  })

  return () => {
    disposed = true
    window.removeEventListener('load', refresh)
    mm.revert()
  }
}
