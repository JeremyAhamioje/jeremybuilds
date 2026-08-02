import { useCurrentDate } from '../../lib/useCurrentDate.js'

/**
 * Eight-point burst, generated rather than hand-plotted so the geometry is
 * exact and the spike ratio stays tunable. A small inner radius is what makes
 * it read as a sparkle instead of a cog.
 */
const STAR_PATH = (() => {
  const points = 8
  const outer = 12
  const inner = 3.4
  const centre = 12
  const coords = []

  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI * i) / points - Math.PI / 2
    coords.push(
      `${(centre + radius * Math.cos(angle)).toFixed(2)},${(centre + radius * Math.sin(angle)).toFixed(2)}`,
    )
  }

  return `M${coords.join('L')}Z`
})()

/**
 * The live date mark.
 *
 * The numerals are the point: Archivo pushed to the far end of its width axis
 * (125%) at weight 900, with tight negative tracking so the two figures nearly
 * touch. That is a real wide cut of the typeface, not a horizontally stretched
 * normal one — stretching would thin the horizontals and thicken the verticals,
 * which is exactly what makes faked display type look cheap.
 *
 * A hairline runs behind them, echoing the rule under the header.
 */
export default function DateBadge() {
  const { day, month, iso } = useCurrentDate()

  return (
    <div className="date-badge">
      <svg className="date-badge__star" viewBox="0 0 24 24" aria-hidden="true">
        <path d={STAR_PATH} />
      </svg>

      <time className="date-badge__figure" dateTime={iso}>
        {day}
      </time>

      <div className="date-badge__meta">
        <span className="date-badge__month">{month}</span>
        <span className="date-badge__status">
          available
          <br />
          for work
        </span>
      </div>
    </div>
  )
}
