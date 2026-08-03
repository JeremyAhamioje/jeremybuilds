import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Footer reveal.
 *
 * The pills arrive one after another, which is the whole gag — a list of
 * interests landing all at once is a paragraph, landing in sequence is someone
 * thinking of things.
 *
 * As everywhere else on this site, the CSS resting state is the finished
 * state: these tween FROM an offset, so with motion reduced or the trigger
 * never firing, the footer is simply already there.
 */
export function createFooterAnimation(section, pills) {
  if (!section) return () => {}

  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const items = pills ? Array.from(pills.children) : []
    const headline = section.querySelectorAll('.footer__headline span')
    const tail = section.querySelectorAll('.footer__cta, .footer__bar')

    const tween = gsap.from([...headline, ...items, ...tail], {
      autoAlpha: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.045,
      scrollTrigger: { trigger: section, start: 'top 72%', once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  })

  return () => mm.revert()
}
