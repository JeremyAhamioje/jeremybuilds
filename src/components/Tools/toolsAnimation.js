import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fan geometry.
 *
 * Computed rather than written into CSS because the groups hold five or six
 * tools and the spread has to close up accordingly — a fan tuned for six looks
 * gap-toothed at five. Deterministic, so a re-render never reshuffles the
 * arrangement under the visitor.
 *
 * The middle card sits highest, largest and on top; cards fall away and rotate
 * further out from the centre, which is what makes the row read as a fan of
 * held cards rather than a carousel of tiles.
 */
export function fanTransform(index, count, compact = false) {
  const centre = (count - 1) / 2
  const t = index - centre
  const distance = Math.abs(t)

  // Narrow screens lay the cards out as a plain wrapped grid: a fan needs
  // horizontal room to overlap into, and rotated cards in a 3-up grid just
  // look like a broken layout.
  if (compact) return { rotate: 0, lift: 0, scale: 1, zIndex: 1 }

  return {
    rotate: t * 4.2,
    /*
     * Applied as margin-top, NOT a transform. GSAP owns the transform channel
     * on these cards, so a CSS `translateY` here would be overwritten the
     * moment the group animates — the fan would flatten on first transition.
     */
    lift: distance ** 1.6 * 10,
    scale: 1 - distance * 0.03,
    zIndex: Math.round(100 - distance * 10),
  }
}

/** Resting rotate/scale live on the element, so the tweens can read them back. */
const restRotate = (i, el) => Number(el.dataset.rotate)
const restScale = (i, el) => Number(el.dataset.scale)

const ENTER = { duration: 0.55, ease: 'power3.out' }
const EXIT = { duration: 0.32, ease: 'power2.in' }

/**
 * Crossfade one group out and the next in.
 *
 * Panels are stacked, so both are in the DOM at once and the outgoing set has
 * to be pushed behind the incoming one — otherwise the group leaving still
 * catches pointer events over the group arriving.
 *
 * `direction` is +1 advancing and -1 going back, so cards enter from the side
 * the movement came from rather than always from the same edge.
 */
export function transitionGroups({ panels, from, to, direction = 1 }) {
  const incoming = panels[to]
  if (!incoming) return

  const cards = incoming.querySelectorAll('[data-tool-card]')
  const outgoing = from == null ? null : panels[from]

  if (outgoing && outgoing !== incoming) {
    const leaving = outgoing.querySelectorAll('[data-tool-card]')

    gsap.killTweensOf(leaving)
    gsap.set(outgoing, { zIndex: 1, pointerEvents: 'none' })
    gsap.to(leaving, {
      autoAlpha: 0,
      y: -18,
      scale: 0.97,
      ...EXIT,
      stagger: { each: 0.02, from: direction > 0 ? 'start' : 'end' },
    })
  }

  gsap.killTweensOf(cards)
  gsap.set(incoming, { zIndex: 2, pointerEvents: 'auto', autoAlpha: 1 })
  gsap.fromTo(
    cards,
    {
      autoAlpha: 0,
      y: 34,
      scale: 0.94,
      // Enter under-rotated and settle into the fan, so the spread reads as
      // the cards being laid down rather than sliding in already arranged.
      rotate: (i, el) => Number(el.dataset.rotate) * 0.4,
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: restScale,
      rotate: restRotate,
      ...ENTER,
      stagger: { each: 0.045, from: direction > 0 ? 'start' : 'end' },
      delay: 0.06,
    },
  )
}

/** Put every panel in its resting state without animating — for first paint. */
export function primeGroups({ panels, active }) {
  panels.forEach((panel, index) => {
    if (!panel) return
    const cards = panel.querySelectorAll('[data-tool-card]')
    const isActive = index === active

    gsap.set(panel, { zIndex: isActive ? 2 : 1, pointerEvents: isActive ? 'auto' : 'none' })
    gsap.set(cards, { autoAlpha: isActive ? 1 : 0, y: 0, scale: restScale, rotate: restRotate })
  })
}

/**
 * Reveal the section heading on scroll.
 *
 * Separate from the carousel: the carousel is a loop that runs while the
 * section is on screen, this fires once. Returns a cleanup.
 */
export function createToolsEntrance(section, elements) {
  if (!section) return () => {}

  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const targets = elements.filter(Boolean)
    if (!targets.length) return undefined

    gsap.set(targets, { autoAlpha: 0, y: 22 })

    const tween = gsap.to(targets, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  })

  return () => mm.revert()
}
