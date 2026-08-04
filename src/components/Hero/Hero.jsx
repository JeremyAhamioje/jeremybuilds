import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Arm from './Arm.jsx'
import CodeSymbol from './CodeSymbol.jsx'
import HeroContent from './HeroContent.jsx'
import { createHeroAnimation } from './heroAnimation.js'
import { HERO_LAYOUT, MOBILE_BREAKPOINT, resolveLayout } from './heroConfig.js'
import { buildSizes } from '../../lib/assets/mediaAssets.js'
import { useLoadingManager } from '../../lib/loading/LoadingContext.jsx'
import './Hero.css'
import './HeroContent.css'

/**
 * Renaissance arms hero — DOM composition.
 *
 * The artwork is plain DOM: two `<picture>` elements and an SVG. It does not
 * depend on WebGL, GSAP, or anything that can fail to initialize. Scroll
 * animation (Phase 3) and the optional WebGL treatment (Phase 5) layer on top
 * of this, never underneath it.
 *
 * The two arm assets are declared as critical work in the loading bootstrap;
 * this component only reports when each one has actually decoded.
 */
export default function Hero() {
  const manager = useLoadingManager()
  const layout = useResponsiveLayout()

  const sectionRef = useRef(null)
  const armARef = useRef(null)
  const armBRef = useRef(null)
  const symbolRef = useRef(null)

  const completeArm = useCallback((id) => () => manager.completeTask(id), [manager])
  const failArm = useCallback((id) => (error) => manager.failTask(id, error), [manager])

  /*
   * The arms are marked in flight by the loading bootstrap, not here.
   *
   * This component used to call startTask for both, and it never once worked:
   * child effects run before parent effects, so this fired before the manifest
   * existed and startTask on an unknown id returns silently. The hero still
   * owns completion below — only it knows when an image has actually decoded.
   */

  /*
   * Build the scroll sequence after layout, before paint, so the pin spacer is
   * in place on the first frame the visitor sees. gsap.matchMedia handles the
   * breakpoint swap and reverts everything it created on cleanup.
   */
  useLayoutEffect(
    () =>
      createHeroAnimation({
        section: sectionRef.current,
        armA: armARef.current,
        armB: armBRef.current,
        symbol: symbolRef.current,
      }),
    [],
  )

  // Per-arm `sizes`: the two arms render at different widths, and describing
  // both with one string makes the browser pick the wrong file for whichever
  // arm is wider. Derived from the layout so it cannot drift from it.
  const sizesFor = (key) =>
    buildSizes(
      Math.ceil(HERO_LAYOUT.mobile[key].width),
      Math.ceil(HERO_LAYOUT.desktop[key].width),
      MOBILE_BREAKPOINT,
    )

  return (
    // The section is the pin target, so the hero owns its own scroll behaviour
    // rather than depending on a wrapper the page happens to provide.
    <section className="hero" ref={sectionRef}>
      <div className="hero__stage">
        <Arm
          ref={armBRef}
          assetId="arm-b"
          layout={layout.current.armB}
          sizes={sizesFor('armB')}
          onReady={completeArm('arm-b')}
          onFail={failArm('arm-b')}
          alt="A sculpted arm reaching outward, after Michelangelo's Creation of Adam"
        />

        <CodeSymbol ref={symbolRef} layout={layout.current.symbol} />

        <Arm
          ref={armARef}
          assetId="arm-a"
          layout={layout.current.armA}
          sizes={sizesFor('armA')}
          onReady={completeArm('arm-a')}
          onFail={failArm('arm-a')}
          alt=""
        />
      </div>

      <HeroContent />
    </section>
  )
}

/**
 * Resolve the breakpoint composition.
 *
 * This is the one piece of hero state that legitimately belongs in React: it
 * changes on resize, not per frame. Scroll-driven values never come through
 * here — they are written straight to the DOM in Phase 3.
 */
function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  )

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const sync = (event) => setIsMobile(event.matches)

    setIsMobile(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const current = resolveLayout(isMobile ? 0 : MOBILE_BREAKPOINT)

  return {
    isMobile,
    current,
  }
}
