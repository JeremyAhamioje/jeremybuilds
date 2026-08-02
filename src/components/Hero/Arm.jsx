import { forwardRef, useEffect, useRef } from 'react'
import { ARM_ASSETS } from '../../lib/assets/armAssets.js'
import { ARM_ANCHORS } from './heroConfig.js'

/**
 * One arm of the composition.
 *
 * Readiness is reported from the real `<img>` in the document rather than from
 * a separate preload. The browser's own srcset selection is therefore the
 * authority on which file counts as loaded, and nothing is fetched twice.
 *
 * The element is positioned by its HAND, not its bounding box: the wrapper is
 * placed at the configured point and then shifted by the anchor so the
 * fingertips land where the layout says. Art direction happens in fingertip
 * space, which is where the eye is.
 */
const Arm = forwardRef(function Arm(
  { assetId, layout, sizes, onReady, onFail, alt },
  ref,
) {
  const imgRef = useRef(null)
  const asset = ARM_ASSETS[assetId]
  const anchor = ARM_ANCHORS[assetId] ?? { x: 0.5, y: 0.5 }

  useEffect(() => {
    const img = imgRef.current
    if (!img) return undefined

    let cancelled = false

    const settle = () => {
      if (cancelled) return
      // decode() guarantees the bitmap is ready to paint, not merely fetched —
      // without it the reveal can hand over to a frame that still has to decode.
      if (typeof img.decode === 'function') {
        img
          .decode()
          .then(() => !cancelled && onReady?.())
          // A decode rejection on an image that did load is not a real failure.
          .catch(() => !cancelled && onReady?.())
      } else {
        onReady?.()
      }
    }

    const handleError = (event) => {
      if (!cancelled) onFail?.(event)
    }

    if (img.complete) {
      if (img.naturalWidth > 0) settle()
      else handleError(new Error(`Arm asset "${assetId}" failed to load`))
      return () => {
        cancelled = true
      }
    }

    img.addEventListener('load', settle)
    img.addEventListener('error', handleError)

    return () => {
      cancelled = true
      img.removeEventListener('load', settle)
      img.removeEventListener('error', handleError)
    }
  }, [assetId, onReady, onFail])

  if (!asset) return null

  const origin = `${anchor.x * 100}% ${anchor.y * 100}%`

  return (
    /*
     * Two nodes on purpose. The outer owns LAYOUT — where the arm sits and the
     * anchor shift that puts the fingertips there. The inner is the ANIMATION
     * target and nothing else touches its transform. One element carrying both
     * would mean GSAP parsing and overwriting the CSS transform, which loses
     * the anchor the moment the sequence starts.
     */
    <div
      className="hero__arm"
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: `${layout.width}%`,
        zIndex: layout.depth,
        '--arm-anchor-x': `${-anchor.x * 100}%`,
        '--arm-anchor-y': `${-anchor.y * 100}%`,
        '--arm-rotate': `${layout.rotate}deg`,
        transformOrigin: origin,
      }}
    >
      <div className="hero__arm-inner" ref={ref} style={{ transformOrigin: origin }}>
        <picture>
          {asset.sources.map((source) => (
            <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
          ))}
          <img
            ref={imgRef}
            src={asset.fallback}
            sizes={sizes}
            width={asset.width}
            height={asset.height}
            alt={alt}
            decoding="async"
            // The hero is the LCP element — never lazy, and fetched at high priority.
            loading="eager"
            // Lowercase: React 18 passes unknown attributes through verbatim, and
            // only React 19 maps the camelCase `fetchPriority` prop.
            fetchpriority="high"
            draggable="false"
          />
        </picture>
      </div>
    </div>
  )
})

export default Arm
