import { useEffect, useRef } from 'react'
import { createHeroScene } from './scene.js'
import './Hero.css'

/**
 * Scroll-driven 3D hero.
 *
 * React's only job here is owning the mount point and the scene's lifecycle.
 * Every animated value lives in Three.js objects mutated imperatively — no
 * component state is touched per frame, so animation never triggers a render.
 *
 * The visual concept is supplied by a subject factory. To swap directions, pass
 * one as `createSubject` in the createHeroScene call below — see subject.js.
 */
export default function Hero() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const hero = createHeroScene(container)
    sceneRef.current = hero

    // Full teardown on unmount. React StrictMode double-invokes effects in dev,
    // so this must leave nothing behind or we leak a WebGL context per mount.
    return () => {
      hero.dispose()
      sceneRef.current = null
    }
  }, [])

  return (
    <div className="hero-stage">
      <div className="hero-stage__canvas" ref={containerRef} />
      {/* Gallery vignette — cheaper and softer than a postprocessing pass. */}
      <div className="hero-stage__vignette" aria-hidden="true" />
    </div>
  )
}
