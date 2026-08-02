import { forwardRef } from 'react'

/**
 * The `</>` the hands reach toward.
 *
 * Drawn as stroked geometry, not text. A font would mean either a webfont
 * dependency for three glyphs or whatever monospace the OS supplies, and
 * neither gives control over stroke weight, bracket angle, or the balance
 * against the artwork — at this size a text `</>` reads as a stray character
 * rather than a mark.
 *
 * The opening bracket carries the accent. One coloured element is enough to
 * make the mark feel authored; colouring all three would turn it into a logo
 * and pull focus from the arms.
 */
const CodeSymbol = forwardRef(function CodeSymbol({ layout, className = '' }, ref) {
  return (
    // Same split as Arm: outer positions, inner is the animation target.
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
          viewBox="0 0 148 84"
          fill="none"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="code"
        >
          <polyline className="hero__symbol-bracket" points="47,17 15,42 47,67" />
          <line className="hero__symbol-slash" x1="65" y1="72" x2="83" y2="12" />
          <polyline className="hero__symbol-bracket-close" points="101,17 133,42 101,67" />
        </svg>
      </div>
    </div>
  )
})

export default CodeSymbol
