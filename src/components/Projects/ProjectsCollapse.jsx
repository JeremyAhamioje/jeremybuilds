import './ProjectsCollapse.css'

/**
 * The escape hatch for the work section.
 *
 * Selected work is the longest thing on the page by a wide margin, and in both
 * of its shapes it asks for a scroll commitment the visitor never agreed to:
 * twenty cards is roughly fourteen screens on a phone, and the desktop pin runs
 * 12.5 viewport heights. Neither offers a way out except scrolling to the end.
 *
 * So this is one control with one idea behind it — "stop giving projects my
 * screen" — and the action it takes depends on which shape is on screen:
 *
 *   LIST      toggles between a short preview and the full set. Collapsing
 *             also returns the visitor to the top of the section, because the
 *             cards they were reading are the ones being removed.
 *
 *   SEQUENCE  there is no list to shorten; the length IS the pin. So it closes
 *             the section up and hands the visitor to whatever follows.
 *
 * Deliberately a sibling of the section rather than a child. `position: fixed`
 * resolves against the nearest transformed ancestor, and a pinned ScrollTrigger
 * is exactly that kind of ancestor — parented inside, this would ride the pin
 * instead of the viewport.
 */
export default function ProjectsCollapse({ visible, expanded, sequence, total, onToggle }) {
  // Rendered unconditionally so it can transition out; `visible` drives both
  // the animation and the pointer/tab affordances, so a hidden control is never
  // clickable and never focusable.
  // Both shapes say "Collapse" when the press shortens the section; only the
  // collapsed list has an inverse, and it names the payoff.
  const collapsing = sequence || expanded
  const label = collapsing ? 'Collapse' : 'Show all'

  return (
    <div
      className="projects-collapse"
      data-visible={visible ? 'true' : 'false'}
      data-collapsing={collapsing ? 'true' : 'false'}
    >
      <button
        type="button"
        className="projects-collapse__button"
        onClick={onToggle}
        tabIndex={visible ? 0 : -1}
        aria-hidden={visible ? undefined : 'true'}
        /*
         * Only the list variant is a disclosure. In the sequence the button
         * navigates rather than reveals, and claiming otherwise would have a
         * screen reader announce a collapsed region that does not exist.
         */
        aria-expanded={sequence ? undefined : expanded}
        aria-controls={sequence ? undefined : 'projects-list'}
      >
        <span className="projects-collapse__label">{label}</span>

        {/* The payoff, but only when there is something still hidden. */}
        {!sequence && !expanded && <span className="projects-collapse__count">{total}</span>}

        <svg
          className="projects-collapse__chevron"
          viewBox="0 0 12 12"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
