import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Autoplay for the tool carousel.
 *
 * The timer and the progress bar are the SAME GSAP timeline rather than a
 * `setInterval` alongside a separate tween. Two clocks drift, and a progress
 * bar that finishes before or after the slide actually changes reads as a bug
 * even though nothing is broken.
 *
 * Nothing here re-renders per frame: the bar is a transform on a ref.
 *
 * Gates, all of which must be open for the carousel to run:
 *
 *   - the section is on screen — otherwise you scroll down to find it already
 *     three groups in, having advanced to nobody;
 *   - the tab is visible — background tabs should not burn a timer;
 *   - the pointer is not over it, and focus is not inside it — someone reading
 *     a tool name or tabbing through should not have it move under them.
 *
 * Explicit interaction (picking a group) stops autoplay for good. Having it
 * resume and yank the visitor somewhere else after they chose is worse than
 * simply stopping.
 */
export function useToolsAutoplay({ enabled, dwellSeconds, onAdvance, sectionRef, barRef }) {
  const [surrendered, setSurrendered] = useState(false)
  const advanceRef = useRef(onAdvance)
  advanceRef.current = onAdvance

  const timelineRef = useRef(null)
  const gatesRef = useRef({ onScreen: false, tabVisible: true, engaged: false })

  const active = enabled && !surrendered

  useEffect(() => {
    if (!active) return undefined

    const section = sectionRef.current
    const bar = barRef.current
    if (!section) return undefined

    const sync = () => {
      const timeline = timelineRef.current
      if (!timeline) return
      const { onScreen, tabVisible, engaged } = gatesRef.current
      if (onScreen && tabVisible && !engaged) timeline.play()
      else timeline.pause()
    }

    const build = () => {
      const timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          advanceRef.current()
          timeline.restart()
          // restart() plays; re-close the gates if any are shut.
          sync()
        },
      })

      if (bar) timeline.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: dwellSeconds, ease: 'none' })
      else timeline.to({}, { duration: dwellSeconds })

      return timeline
    }

    timelineRef.current = build()

    // Dev handle: the dwell is wall-clock, and any environment that throttles
    // rAF makes it untestable by waiting. This lets the advance be driven.
    if (import.meta.env.DEV) window.__toolsAutoplay = timelineRef.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        gatesRef.current.onScreen = entry.isIntersecting
        sync()
      },
      { threshold: 0.25 },
    )
    observer.observe(section)

    const onVisibility = () => {
      gatesRef.current.tabVisible = !document.hidden
      sync()
    }
    const engage = () => {
      gatesRef.current.engaged = true
      sync()
    }
    const release = () => {
      gatesRef.current.engaged = false
      sync()
    }

    document.addEventListener('visibilitychange', onVisibility)
    section.addEventListener('pointerenter', engage)
    section.addEventListener('pointerleave', release)
    section.addEventListener('focusin', engage)
    section.addEventListener('focusout', release)

    sync()

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      section.removeEventListener('pointerenter', engage)
      section.removeEventListener('pointerleave', release)
      section.removeEventListener('focusin', engage)
      section.removeEventListener('focusout', release)
      timelineRef.current?.kill()
      timelineRef.current = null
    }
  }, [active, dwellSeconds, sectionRef, barRef])

  /** Reset the dwell — called when the group changes for any reason. */
  const restart = () => {
    const timeline = timelineRef.current
    if (!timeline) return
    timeline.restart()
    const { onScreen, tabVisible, engaged } = gatesRef.current
    if (!(onScreen && tabVisible && !engaged)) timeline.pause()
  }

  return { surrender: () => setSurrendered(true), surrendered, restart }
}
