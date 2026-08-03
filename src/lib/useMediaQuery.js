import { useEffect, useState } from 'react'

/**
 * Subscribe to a media query.
 *
 * Legitimate React state: it changes when the viewport crosses a breakpoint,
 * not per frame. Used to choose between two different MARKUP shapes rather
 * than to restyle one — some layout differences are structural enough that CSS
 * alone would mean duplicating content into the DOM twice.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const list = window.matchMedia(query)
    const sync = (event) => setMatches(event.matches)

    setMatches(list.matches)
    list.addEventListener('change', sync)
    return () => list.removeEventListener('change', sync)
  }, [query])

  return matches
}
