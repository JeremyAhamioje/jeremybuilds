import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMediaQuery } from '../../lib/useMediaQuery.js'
import { TOOLS_DWELL, TOOL_GROUPS, TOTAL_TOOLS, logoSrcSet, sizedLogo } from './toolsData.js'
import { createToolsEntrance, fanTransform, primeGroups, transitionGroups } from './toolsAnimation.js'
import { useToolsAutoplay } from './useToolsAutoplay.js'
import './Tools.css'

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'
/** Below this the fan has nowhere to spread, so the cards go to a plain grid. */
const COMPACT_QUERY = '(max-width: 860px)'

/**
 * Tool stack.
 *
 * A carousel of grouped fans: five or six logos held like a hand of cards,
 * labelled by the job they do, advancing group by group.
 *
 * The grouping is the whole point. Twenty-eight logos in a grid is a list of
 * things owned; five named groups that each resolve is a claim about being
 * able to take work end to end.
 *
 * React state here is the active group — five values, changing every five
 * seconds. The fan itself is animated by GSAP off refs, so a transition never
 * re-renders a card.
 */
export default function Tools() {
  const canAnimate = useMediaQuery(MOTION_QUERY)
  const compact = useMediaQuery(COMPACT_QUERY)
  const [active, setActive] = useState(0)

  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const titleRef = useRef(null)
  const barRef = useRef(null)
  const panelRefs = useRef([])
  const previousRef = useRef(null)

  const advance = useCallback(() => {
    setActive((current) => (current + 1) % TOOL_GROUPS.length)
  }, [])

  const { surrender, restart } = useToolsAutoplay({
    enabled: canAnimate,
    dwellSeconds: TOOLS_DWELL,
    onAdvance: advance,
    sectionRef,
    barRef,
  })

  /*
   * First paint: put every panel where it belongs without animating.
   *
   * Re-runs when `compact` flips, because crossing the breakpoint rewrites
   * every card's resting rotate and scale — without this, cards keep the
   * inline transform GSAP left from the other layout until the next
   * transition, which is a fan of rotated cards inside a mobile grid.
   */
  useLayoutEffect(() => {
    if (!canAnimate) return
    primeGroups({ panels: panelRefs.current, active })
    previousRef.current = active
    // `active` deliberately omitted: changes to it are transitions, below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAnimate, compact])

  /* Group changed: crossfade. */
  useEffect(() => {
    if (!canAnimate) return
    const from = previousRef.current
    if (from === active) return

    const total = TOOL_GROUPS.length
    // Shortest way round the loop, so wrapping 4 -> 0 still reads as forward.
    const forward = (active - from + total) % total <= total / 2

    transitionGroups({
      panels: panelRefs.current,
      from,
      to: active,
      direction: forward ? 1 : -1,
    })

    previousRef.current = active
  }, [active, canAnimate])

  useEffect(() => {
    if (!canAnimate) return undefined
    return createToolsEntrance(sectionRef.current, [headRef.current, titleRef.current])
  }, [canAnimate])

  const pick = (index) => {
    if (index === active) return
    surrender()
    setActive(index)
  }

  // Any programmatic advance also resets the dwell, so a group never gets a
  // short turn because the timer was mid-cycle when it arrived.
  useEffect(() => {
    restart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  /* ------------------------------------------------------- reduced motion */

  /*
   * No carousel: everything on screen at once, grouped. A visitor who has asked
   * for less motion should not have to wait through five timed rotations to
   * see the last group — and must never be shown less content than everyone
   * else as the price of that preference.
   */
  if (!canAnimate) {
    return (
      <section className="tools tools--static" id="tools" ref={sectionRef}>
        <div className="tools__inner">
          <ToolsHead />
          {TOOL_GROUPS.map((group) => (
            <div className="tools__static-group" key={group.id}>
              <h3 className="tools__static-title">
                {group.label}
                <span className="tools__static-count">{group.tools.length}</span>
              </h3>
              <ul className="tools__static-list">
                {group.tools.map((tool) => (
                  <li className="tools__card tools__card--flat" key={tool.name}>
                    <ToolCardBody tool={tool} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )
  }

  /* -------------------------------------------------------------- carousel */

  const current = TOOL_GROUPS[active]

  return (
    <section className="tools" id="tools" ref={sectionRef}>
      <div className="tools__inner">
        <div ref={headRef}>
          <ToolsHead />
        </div>

        <div className="tools__title-block" ref={titleRef}>
          {/*
            aria-live so the group name is announced when the carousel advances
            on its own — the visible change is otherwise silent to a screen
            reader parked in this section.
          */}
          <h3 className="tools__title" aria-live="polite">
            {current.label}
          </h3>
          <p className="tools__caption">{current.caption}</p>
        </div>

        <div className="tools__stage">
          {TOOL_GROUPS.map((group, index) => (
            <div
              className="tools__panel"
              key={group.id}
              id={`tools-panel-${group.id}`}
              role="tabpanel"
              aria-labelledby={`tools-tab-${group.id}`}
              aria-hidden={index !== active}
              inert={index === active ? undefined : ''}
              ref={(node) => {
                panelRefs.current[index] = node
              }}
            >
              <ul className="tools__fan" data-count={group.tools.length}>
                {group.tools.map((tool, position) => {
                  const fan = fanTransform(position, group.tools.length, compact)

                  return (
                    <li
                      className="tools__card"
                      key={tool.name}
                      data-tool-card
                      data-rotate={fan.rotate}
                      data-scale={fan.scale}
                      style={{ zIndex: fan.zIndex, '--fan-lift': `${fan.lift}px` }}
                    >
                      <ToolCardBody tool={tool} />
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="tools__controls">
          <div className="tools__tabs" role="tablist" aria-label="Tool categories">
            {TOOL_GROUPS.map((group, index) => (
              <button
                key={group.id}
                type="button"
                id={`tools-tab-${group.id}`}
                className="tools__tab"
                role="tab"
                aria-selected={index === active}
                aria-controls={`tools-panel-${group.id}`}
                tabIndex={index === active ? 0 : -1}
                onClick={() => pick(index)}
                onKeyDown={(event) => {
                  const total = TOOL_GROUPS.length
                  if (event.key === 'ArrowRight') pick((index + 1) % total)
                  else if (event.key === 'ArrowLeft') pick((index - 1 + total) % total)
                  else return
                  event.preventDefault()
                }}
              >
                {group.label}
                <sup className="tools__tab-count">{group.tools.length}</sup>
              </button>
            ))}
          </div>

          <div className="tools__progress" aria-hidden="true">
            <span className="tools__progress-fill" ref={barRef} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ToolsHead() {
  return (
    <header className="tools__head">
      <p className="tools__eyebrow">
        Tool stack
        <span className="tools__eyebrow-count">{TOTAL_TOOLS}</span>
      </p>
      <h2 className="tools__headline">
        What I build <em>with</em>
      </h2>
    </header>
  )
}

/**
 * The logo sits on its own light tile.
 *
 * These logos arrive as JPEGs with baked-in white backgrounds, so dropping
 * them straight onto the near-black section would show twenty-eight white
 * rectangles. A deliberate light tile makes that background look intentional
 * and, more usefully, means a logo with a transparent PNG and one with a white
 * JPEG render identically.
 */
function ToolCardBody({ tool }) {
  return (
    <>
      <span className="tools__logo">
        {tool.src ? (
          <img
            src={sizedLogo(tool.src, 160)}
            srcSet={logoSrcSet(tool.src)}
            sizes="130px"
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        ) : (
          /*
           * No correct logo exists in the supplied set for this tool. A
           * wordmark is a deliberate-looking tile; the alternative was showing
           * another product's logo under this name, which is worse than
           * showing none. Swap `src` back in and this disappears on its own.
           */
          <span className="tools__wordmark">{tool.name}</span>
        )}
      </span>
      <span className="tools__name">{tool.name}</span>
      <span className="tools__desc">{tool.desc}</span>
    </>
  )
}
