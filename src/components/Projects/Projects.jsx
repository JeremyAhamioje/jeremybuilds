import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MEDIA_ASSETS } from '../../lib/assets/mediaAssets.js'
import { useMediaQuery } from '../../lib/useMediaQuery.js'
import { CATEGORIES, countFor, filterProjects } from './projectsData.js'
import { createProjectsAnimation } from './projectsAnimation.js'
import './Projects.css'

/** Below this, or with motion reduced, the section is an ordinary list. */
const SEQUENCE_QUERY = '(min-width: 901px) and (prefers-reduced-motion: no-preference)'

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

  /*
   * Rebuilds when the filter changes or the layout mode flips — the set being
   * sequenced is different, so the pin length and cycle boundaries are too.
   */
  useLayoutEffect(() => {
    if (!canSequence) return undefined

    return createProjectsAnimation(
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
  }, [canSequence, projects, handleIndexChange])

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
    return (
      <section className="projects projects--list" id="work" ref={sectionRef}>
        <div className="projects__viewport">
          {intro}
          {filters}

          <ol className="projects__list">
            {projects.map((project, index) => (
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
        </div>
      </section>
    )
  }

  /* -------------------------------------------------------------- sequence */

  return (
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
      Visit site
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
