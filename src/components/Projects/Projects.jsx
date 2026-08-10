import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MEDIA_ASSETS } from '../../lib/assets/mediaAssets.js'
import { useMediaQuery } from '../../lib/useMediaQuery.js'
import { CATEGORIES, countFor, filterProjects } from './projectsData.js'
import { createProjectsAnimation } from './projectsAnimation.js'
import ProjectsCollapse from './ProjectsCollapse.jsx'
import './Projects.css'

/** Below this, or with motion reduced, the section is an ordinary list. */
const SEQUENCE_QUERY = '(min-width: 901px) and (prefers-reduced-motion: no-preference)'

/**
 * How many cards the list shows before asking.
 *
 * The list is the phone's shape, and at twenty projects it runs to roughly
 * fourteen screens of nothing but work — long enough that the sections after it
 * may as well not exist. Four is a browsable sample: enough to show range and
 * to make the case for pressing, short enough to scroll past.
 */
const PREVIEW_COUNT = 4

/**
 * Selected work.
 *
 * Two genuinely different shapes, not one shape restyled:
 *
 *   SEQUENCE — pinned. Intro type gives way to a frame that opens from a narrow
 *   centred crop to a wide left-justified stage, the detail column arrives, and
 *   projects then wipe one to the next.
 *
 *   LIST — every project as a card, image above its own title and summary.
 *
 * The split is structural. In the sequence the artwork and the copy live in
 * separate columns; in the list they belong together. Forcing one DOM to do
 * both would mean either CSS contortions or the same copy twice in the
 * document, and the mobile fallback would lose every project title.
 *
 * The only React state is the filter and the active index — a handful of
 * changes, never per frame.
 */
export default function Projects() {
  const canSequence = useMediaQuery(SEQUENCE_QUERY)
  const [category, setCategory] = useState('all')
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [inView, setInView] = useState(false)

  const projects = useMemo(() => filterProjects(category), [category])

  const sectionRef = useRef(null)
  const introRef = useRef(null)
  const frameRef = useRef(null)
  const detailRef = useRef(null)
  const slideRefs = useRef([])
  const detailRefs = useRef([])

  slideRefs.current.length = projects.length
  detailRefs.current.length = projects.length

  const handleIndexChange = useCallback((index) => setActiveIndex(index), [])

  const animationRef = useRef(null)

  /*
   * Rebuilds when the filter changes or the layout mode flips — the set being
   * sequenced is different, so the pin length and cycle boundaries are too.
   */
  useLayoutEffect(() => {
    if (!canSequence) {
      animationRef.current = null
      return undefined
    }

    const animation = createProjectsAnimation(
      {
        section: sectionRef.current,
        intro: introRef.current,
        frame: frameRef.current,
        detail: detailRef.current,
        slides: slideRefs.current,
        details: detailRefs.current,
      },
      projects.length,
      handleIndexChange,
    )

    animationRef.current = animation
    return animation.destroy
  }, [canSequence, projects, handleIndexChange])

  /*
   * Choosing a filter puts you on that set's first project.
   *
   * Not cosmetic. The pin length is a function of how many projects are in the
   * set, so a scroll position two-thirds through twenty projects is beyond the
   * END of a five-project section — without this, filtering from deep in the
   * sequence skipped the whole thing and landed on About.
   *
   * Runs as an effect rather than in the click handler because it has to
   * happen AFTER the layout effect above has rebuilt the sequence and the new
   * pin exists; seeking against the old trigger would just move to the wrong
   * place. Skipped on mount — arriving at the page should not scroll anyone.
   */
  const mountedRef = useRef(false)

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }

    if (canSequence) {
      animationRef.current?.scrollToFirst()
    } else {
      // List mode has no pin, but the list still gets shorter — bring the top
      // of the section back into view rather than leaving a stale offset.
      sectionRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }, [category, canSequence])

  /* ------------------------------------------------------- collapse control */

  /*
   * Is the section on screen? This is the whole gate for the floating control —
   * it must not hover over the hero or the footer.
   *
   * An observer rather than a scroll listener because the section's geometry is
   * not stable: while pinned it is `position: fixed`, so a measured top would be
   * meaningless. Intersection reports what is actually visible either way.
   *
   * Re-runs on the breakpoint flip: the two shapes are different markup, so the
   * node being watched is genuinely a different element.
   */
  useEffect(() => {
    const node = sectionRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      /*
       * Inset root, NOT a ratio threshold.
       *
       * `threshold` measures how much of the ELEMENT is showing, and the
       * expanded list is around fourteen screens tall — a full viewport of it
       * is a ratio of about 0.07, so any threshold meaningful for the pinned
       * section would keep the control hidden for the entire list, which is
       * exactly where it is needed most.
       *
       * Shrinking the root asks a question that means the same thing at both
       * heights: is the section anywhere in the middle 60% of the screen? A
       * sliver at the seam between two sections is not, so it still cannot
       * flicker there.
       */
      { threshold: 0, rootMargin: '-20% 0px -20% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [canSequence])

  /*
   * Restoring position after a collapse.
   *
   * Removing sixteen cards from under someone reading card eighteen shortens
   * the document below their scroll offset, and the browser's own response is
   * to clamp them to the new maximum — which is the FOOTER. So the section has
   * to be brought back deliberately, and only on a collapse: expanding adds
   * content below the visitor, where it belongs, and moving them then would
   * undo the press they just made.
   *
   * Layout effect, not effect: this has to land before paint, or the clamped
   * position is visible for a frame as a lurch to the bottom of the page.
   */
  const collapsingRef = useRef(false)

  useLayoutEffect(() => {
    if (!collapsingRef.current) return
    collapsingRef.current = false
    sectionRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [expanded])

  const handleToggle = useCallback(() => {
    // The sequence has no list to shorten — leaving it IS the collapse.
    if (canSequence) {
      animationRef.current?.scrollPastEnd()
      return
    }

    if (expanded) collapsingRef.current = true
    setExpanded(!expanded)
  }, [canSequence, expanded])

  /*
   * In the list, there is nothing to collapse until the set is longer than the
   * preview. In the sequence, the control waits until the visitor is genuinely
   * into the work — offering an exit during the opening would undercut the
   * reveal before it has said anything.
   */
  const controlVisible =
    inView && (canSequence ? activeIndex >= 1 : projects.length > PREVIEW_COUNT)

  const collapseControl = (
    <ProjectsCollapse
      visible={controlVisible}
      expanded={expanded}
      sequence={canSequence}
      total={projects.length}
      onToggle={handleToggle}
    />
  )

  const total = String(projects.length).padStart(2, '0')

  const filters = (
    <div className="projects__filters" role="group" aria-label="Filter work by type">
      {CATEGORIES.map((cat) => {
        const count = countFor(cat.id)

        return (
          <button
            key={cat.id}
            type="button"
            className="projects__filter"
            aria-pressed={category === cat.id}
            disabled={count === 0}
            onClick={() => {
              setCategory(cat.id)
              setActiveIndex(0)
            }}
          >
            <span>{cat.label}</span>
            <sup className="projects__filter-count">{count}</sup>
          </button>
        )
      })}
    </div>
  )

  const intro = (
    <div className="projects__intro" ref={canSequence ? introRef : null}>
      <h2 className="projects__headline">Selected work</h2>
      <p className="projects__subtitle">
        Every project is shaped around the client — not a template — with a focus on
        clarity, character and craft.
      </p>
    </div>
  )

  /* ------------------------------------------------------------------ list */

  if (!canSequence) {
    // Only the preview is mounted while collapsed. Rendering all twenty and
    // hiding the tail with CSS would still download every image and still cost
    // the layout, which is most of what makes the section expensive on a phone.
    const shown = expanded ? projects : projects.slice(0, PREVIEW_COUNT)

    return (
      <>
        <section className="projects projects--list" id="work" ref={sectionRef}>
          <div className="projects__viewport">
            {intro}
            {filters}

            <ol className="projects__list" id="projects-list">
              {shown.map((project, index) => (
                <li className="projects__card" key={project.id}>
                  <ProjectImage project={project} eager={index === 0} sizes="92vw" />
                  <ProjectMeta project={project} />
                  <h3 className="projects__title">{project.title}</h3>
                  <ProjectTags project={project} />
                  <p className="projects__summary">{project.summary}</p>
                  <ProjectLink project={project} />
                </li>
              ))}
            </ol>

            {/*
              Announced rather than shown. The floating control is the visible
              affordance, but a screen reader user moving through the list by
              heading gets no hint that it stops early, and the count is the
              part that makes the control worth pressing.
            */}
            {projects.length > PREVIEW_COUNT && (
              <p className="projects__truncation" role="status">
                {expanded
                  ? `Showing all ${projects.length} projects.`
                  : `Showing ${shown.length} of ${projects.length} projects.`}
              </p>
            )}
          </div>
        </section>

        {collapseControl}
      </>
    )
  }

  /* -------------------------------------------------------------- sequence */

  return (
    <>
      <section className="projects" id="work" ref={sectionRef}>
        <div className="projects__viewport">
          {intro}
          {filters}

          <div className="projects__stage">
            <div className="projects__frame" ref={frameRef}>
              {projects.map((project, index) => (
                <figure
                  className="projects__slide"
                  key={project.id}
                  ref={(node) => {
                    slideRefs.current[index] = node
                  }}
                >
                  <ProjectImage project={project} eager={index === 0} sizes="62vw" />
                </figure>
              ))}
            </div>

            <div className="projects__detail" ref={detailRef}>
              <p className="projects__counter">
                <span className="projects__counter-current">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="projects__counter-total">/ {total}</span>
              </p>

              <div className="projects__detail-stack">
                {projects.map((project, index) => (
                  <div
                    className="projects__detail-item"
                    key={project.id}
                    ref={(node) => {
                      detailRefs.current[index] = node
                    }}
                    aria-hidden={index !== activeIndex}
                  >
                    <ProjectMeta project={project} />
                    <h3 className="projects__title">{project.title}</h3>
                    <ProjectTags project={project} />
                    <p className="projects__summary">{project.summary}</p>
                    <ProjectLink project={project} tabIndex={index === activeIndex ? 0 : -1} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ol className="projects__dots" aria-hidden="true">
            {projects.map((project, index) => (
              <li
                key={project.id}
                className="projects__dot"
                data-active={index === activeIndex ? 'true' : 'false'}
              />
            ))}
          </ol>
        </div>
      </section>

      {collapseControl}
    </>
  )
}

function ProjectMeta({ project }) {
  return (
    <p className="projects__meta">
      <span>{project.year}</span>
      <span className="projects__meta-rule" aria-hidden="true" />
      <span>{project.role}</span>
    </p>
  )
}

function ProjectTags({ project }) {
  return (
    <ul className="projects__tags">
      {project.tags.map((tag) => (
        <li className="projects__tag" key={tag}>
          {tag}
        </li>
      ))}
    </ul>
  )
}

/**
 * Live projects get a link; the rest get a status.
 *
 * Three entries have nothing to link to yet — a Figma proposal, a concept and a
 * build in progress. Pointing a "visit site" button at `#` or `/wip` for those
 * would cost more trust than saying so, and the label is more informative than
 * the dead button would have been anyway.
 *
 * Live links open in a new tab: the sequence is a pinned scroll position that a
 * back button restores badly.
 */
function ProjectLink({ project, tabIndex = 0 }) {
  if (!project.href) {
    return <p className="projects__status">{project.status ?? 'In development'}</p>
  }

  return (
    <a
      className="projects__cta"
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabIndex}
    >
      {project.cta ?? 'Visit site'}
      <span className="projects__cta-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  )
}

function ProjectImage({ project, eager, sizes }) {
  const asset = MEDIA_ASSETS[project.asset]
  if (!asset) return null

  return (
    <picture>
      {asset.sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      <img
        src={asset.fallback}
        width={asset.width}
        height={asset.height}
        alt={project.title}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable="false"
      />
    </picture>
  )
}
