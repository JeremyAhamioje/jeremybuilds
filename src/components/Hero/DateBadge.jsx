import { useCurrentDate } from '../../lib/useCurrentDate.js'
import { STAR_PATH } from '../../lib/starPath.js'

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
