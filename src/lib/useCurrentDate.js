import { useEffect, useState } from 'react'

/**
 * The current date, rolling over at local midnight.
 *
 * A page left open overnight would otherwise show yesterday until reloaded —
 * which is exactly the kind of small wrongness that undermines a detail like
 * this. Rather than polling on an interval, it schedules a single timeout for
 * the next local midnight and reschedules from there: one timer, no drift, and
 * nothing running while the page is idle.
 */
export function useCurrentDate() {
  const [date, setDate] = useState(() => new Date())

  useEffect(() => {
    let timeoutId

    const scheduleNextRollover = () => {
      const now = new Date()
      const midnight = new Date(now)
      // Local midnight, so it matches what the visitor's clock says.
      midnight.setHours(24, 0, 0, 0)

      timeoutId = setTimeout(() => {
        setDate(new Date())
        scheduleNextRollover()
      }, midnight.getTime() - now.getTime())
    }

    scheduleNextRollover()
    return () => clearTimeout(timeoutId)
  }, [])

  return {
    date,
    /** Zero-padded, so single digits keep the two-figure composition. */
    day: String(date.getDate()).padStart(2, '0'),
    month: date.toLocaleString('en-US', { month: 'short' }).toLowerCase(),
    /** Machine-readable YYYY-MM-DD for <time datetime>. */
    iso: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`,
  }
}
