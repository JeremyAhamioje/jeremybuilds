import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { LoadingState } from '../../lib/loading/LoadingManager.js'
import { useLoadingManager, useLoadingSnapshot } from '../../lib/loading/LoadingContext.jsx'
import { PRELOADER_CONFIG } from './preloaderConfig.js'
import './Preloader.css'

/**
 * Preloader presentation.
 *
 * Strictly a view over the LoadingManager. It reads snapshots and plays
 * transitions; it never decides what "loaded" means. That separation is what
 * lets the eventual art-directed preloader replace this file wholesale without
 * touching the loading system.
 *
 * The percentage and bar are written directly to the DOM by GSAP rather than
 * held in React state. Progress arrives as a handful of discrete events, but
 * the number is *smoothed* toward its target every frame — routing that through
 * setState would mean a React render per frame for a piece of text.
 *
 * @param {object} props
 * @param {() => void} [props.onRevealed] - fired once the curtain is gone.
 */
export default function Preloader({ onRevealed }) {
  const manager = useLoadingManager()
  const snapshot = useLoadingSnapshot()

  const rootRef = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)
  /** Tweened stand-in for the real progress value. */
  const displayedRef = useRef({ value: 0 })
  const mountedAtRef = useRef(performance.now())
  const revealStartedRef = useRef(false)
  const revealTimelineRef = useRef(null)

  const [dismissed, setDismissed] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ------------------------------------------------- smooth the counter/bar */

  useEffect(() => {
    const catchUp = prefersReducedMotion
      ? PRELOADER_CONFIG.reducedMotion.counterCatchUp
      : PRELOADER_CONFIG.counterCatchUp

    const write = () => {
      const value = displayedRef.current.value
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(value * 100)).padStart(2, '0')
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${value})`
      }
    }

    const tween = gsap.to(displayedRef.current, {
      value: snapshot.progress,
      duration: catchUp,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: write,
      onComplete: write,
    })

    return () => tween.kill()
  }, [snapshot.progress, prefersReducedMotion])

  /* ------------------------------------------------------------ the reveal */

  useEffect(() => {
    // Latch: the sequence below drives manager state, which feeds back into
    // snapshot.state and re-runs this effect. Without the latch the effect
    // tears down its own reveal the instant prepareReveal() lands, and the
    // preloader sits at 100% forever.
    if (revealStartedRef.current) return

    const ready =
      snapshot.state === LoadingState.CRITICAL_READY || snapshot.state === LoadingState.DEGRADED

    if (!ready) return

    revealStartedRef.current = true
    manager.prepareReveal()

    // Respect the minimum display window so a warm cache does not flash.
    const elapsed = performance.now() - mountedAtRef.current
    const wait = Math.max(0, PRELOADER_CONFIG.minimumDisplayMs - elapsed) / 1000

    // Let the counter land on 100 before the curtain moves.
    const hold = prefersReducedMotion ? 0 : PRELOADER_CONFIG.reveal.holdMs / 1000
    const duration = prefersReducedMotion
      ? PRELOADER_CONFIG.reducedMotion.duration
      : PRELOADER_CONFIG.reveal.duration

    revealTimelineRef.current = gsap
      .timeline({ delay: wait })
      .call(() => manager.markReady())
      .to({}, { duration: hold })
      .call(() => manager.beginReveal())
      .to(rootRef.current, {
        autoAlpha: 0,
        duration,
        ease: PRELOADER_CONFIG.reveal.ease,
        onComplete: () => {
          setDismissed(true)
          manager.completeReveal()
          onRevealed?.()
        },
      })
  }, [snapshot.state, manager, onRevealed, prefersReducedMotion])

  // Only a genuine unmount cancels the reveal — never a state change.
  useEffect(() => () => revealTimelineRef.current?.kill(), [])

  // Unmounted only after the transition finishes — never display:none'd away.
  if (dismissed) return null

  const statusText = snapshot.degraded && snapshot.criticalReady ? 'ready' : snapshot.label

  return (
    <div className="preloader" ref={rootRef}>
      <div className="preloader__inner">
        {/*
          One live region for the whole status. aria-live is polite so it does
          not interrupt, and the percentage is not announced on every tick —
          only the stage label changes text often enough to matter.
        */}
        <p className="preloader__counter" aria-hidden="true">
          <span ref={counterRef}>00</span>
          <span className="preloader__percent">%</span>
        </p>

        <div className="preloader__track" aria-hidden="true">
          <div className="preloader__bar" ref={barRef} />
        </div>

        <p
          className="preloader__status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusText ? `Loading ${statusText}` : 'Loading'}
        </p>
      </div>
    </div>
  )
}
