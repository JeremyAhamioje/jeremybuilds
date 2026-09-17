import { RESUME } from './resumeData.js'

/**
 * The resume, built as a document rather than pictured as one.
 *
 * Real markup and real type means it stays sharp at any zoom, is selectable and
 * searchable, and reads correctly to a screen reader — none of which a
 * screenshot of a CV would manage. It sits on the dark page as a cream sheet,
 * which is what makes it read as a physical object worth picking up.
 *
 * Engineering-facing layout. The reading order is the hierarchy the document is
 * built around: name → role → what I do → things you can open and inspect →
 * skills → history. No portrait: on this version it competed with the
 * information an engineer is looking for, and the space is spent on the summary
 * instead.
 *
 * Class names carry the animation hooks; the motion itself lives in
 * aboutAnimation.js so this file stays purely structural.
 */
export default function Resume() {
  const { meta } = RESUME

  return (
    <article className="resume" aria-label="Résumé">
      {/*
        Contact row. Real anchors, not spans: Chromium preserves link
        annotations when it prints, so the repo and profile URLs stay clickable
        in the downloaded PDF — the reader can go and look.
      */}
      <header className="resume__meta">
        <span>{meta.location}</span>
        <MetaLink item={meta.site} />
        <MetaLink item={meta.email} />
        <MetaLink item={meta.github} />
        <MetaLink item={meta.linkedin} />
      </header>

      <div className="resume__identity">
        <h3 className="resume__name" data-animate="name">
          {RESUME.name}
        </h3>
        <p className="resume__role">{RESUME.role}</p>
        <p className="resume__summary-lead">{RESUME.summary}</p>
      </div>

      <section className="resume__projects">
        <h4 className="resume__section-title" data-animate="title">
          <span>Selected projects</span>
        </h4>

        <ul className="resume__project-grid">
          {RESUME.projects.map((project) => (
            <li className="resume__project" key={project.title}>
              <h5 className="resume__project-title">
                <ProjectName project={project} />
                {project.live ? (
                  <a
                    className="resume__live"
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    live
                  </a>
                ) : null}
              </h5>
              <p className="resume__project-stack">{project.stack}</p>
              <ul className="resume__bullets">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <div className="resume__columns">
        <section className="resume__column">
          <h4 className="resume__section-title" data-animate="title">
            <span>Experience</span>
          </h4>

          <ol className="resume__entries">
            {RESUME.experience.map((entry) => (
              <li className="resume__entry" key={`${entry.period}-${entry.title}`}>
                <div className="resume__entry-head">
                  <span className="resume__period">{entry.period}</span>
                  <span className="resume__place">{entry.place}</span>
                </div>
                <h5 className="resume__title">{entry.title}</h5>
                {/* Optional: entries with no employer named omit the line
                    rather than printing an empty one. */}
                {entry.org ? <p className="resume__org">{entry.org}</p> : null}
                <p className="resume__summary">{entry.summary}</p>
              </li>
            ))}
          </ol>

          {/*
            Under the engineering history, in the same column, so it reads as
            a footnote to it rather than a parallel track — and never in the
            headline or the skills, where it would pull the positioning toward
            data entry instead of toward an engineer who understands data.
          */}
          <h4 className="resume__section-title resume__section-title--secondary" data-animate="title">
            <span>Additional experience</span>
          </h4>

          <div className="resume__entry">
            <div className="resume__entry-head">
              <span className="resume__period">
                {RESUME.additional.href ? (
                  <a href={RESUME.additional.href} target="_blank" rel="noopener noreferrer">
                    {RESUME.additional.meta}
                  </a>
                ) : (
                  RESUME.additional.meta
                )}
              </span>
            </div>
            <h5 className="resume__title">{RESUME.additional.title}</h5>
            <p className="resume__summary">{RESUME.additional.summary}</p>
          </div>
        </section>

        <section className="resume__column">
          <h4 className="resume__section-title" data-animate="title">
            <span>Technical skills</span>
          </h4>

          <dl className="resume__skills">
            {RESUME.skills.map((group) => (
              <div className="resume__skill-group" key={group.group}>
                <dt>{group.group}</dt>
                <dd>{group.items}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  )
}

function MetaLink({ item }) {
  return (
    <a href={item.href} target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">
      {item.label}
    </a>
  )
}

/** The title links to the repo when there is one; a project with no public code is plain text. */
function ProjectName({ project }) {
  if (!project.href) return <span>{project.title}</span>

  return (
    <a href={project.href} target="_blank" rel="noopener noreferrer">
      {project.title}
    </a>
  )
}
