import { forwardRef } from 'react'

/**
 * The `</>` the hands reach toward.
 *
 * Drawn as stroked SVG geometry rather than text. A font would mean either a
 * webfont dependency for three glyphs, or accepting whatever monospace the OS
 * happens to supply — and neither gives control over the weight, the bracket
 * angle, or the balance against the artwork. Geometry stays razor sharp at any
 * size, costs nothing to load, and is tunable to the last unit.
 *
 * Kept deliberately understated: the arms are the artwork, this is the object
 * of their attention.
 */
const CodeSymbol = forwardRef(function CodeSymbol({ layout, className = '' }, ref) {
  return (
    // Same split as Arm: outer centres it, inner is the animation target.
    <div
      className={`hero__symbol ${className}`.trim()}
      style={{
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        width: `${layout.width}%`,
        zIndex: layout.depth,
      }}
    >
      <div className="hero__symbol-inner" ref={ref}>
        <svg
          viewBox="0 0 132 72"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="code"
        >
          <polyline points="41,13 12,36 41,59" />
          <line x1="57" y1="63" x2="75" y2="9" />
          <polyline points="91,13 120,36 91,59" />
        </svg>
      </div>
    </div>
  )
})

export default CodeSymbol
