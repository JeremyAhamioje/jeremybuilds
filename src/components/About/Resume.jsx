import { MEDIA_ASSETS } from '../../lib/assets/mediaAssets.js'
import { RESUME } from './resumeData.js'

/**
 * The resume, built as a document rather than pictured as one.
 *
 * Real markup and real type means it stays sharp at any zoom, is selectable and
 * searchable, and reads correctly to a screen reader — none of which a
 * screenshot of a CV would manage. It sits on the dark page as a cream sheet,
 * which is what makes it read as a physical object worth picking up.
 *
 * Class names carry the animation hooks; the motion itself lives in
 * aboutAnimation.js so this file stays purely structural.
 */
export default function Resume() {
  const headshot = MEDIA_ASSETS.headshot

  return (
    <article className="resume" aria-label="Résumé">
      <header className="resume__meta">
        <span>{RESUME.meta.location}</span>
        <span>{RESUME.meta.site}</span>
        <span>{RESUME.meta.email}</span>
      </header>

      <div className="resume__identity">
        <div className="resume__identity-text">
          <h3 className="resume__name" data-animate="name">
            {RESUME.name}
          </h3>
          <p className="resume__role">{RESUME.role}</p>
        </div>

        {headshot ? (
          <picture className="resume__portrait">
            {headshot.sources.map((source) => (
              <source
                key={source.type}
                type={source.type}
                srcSet={source.srcSet}
                sizes="(max-width: 900px) 34vw, 15vw"
              />
            ))}
            <img
              src={headshot.fallback}
              width={headshot.width}
              height={headshot.height}
              alt={`${RESUME.name}, ${RESUME.role}`}
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </picture>
        ) : null}
      </div>

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
                <p className="resume__org">{entry.org}</p>
                <p className="resume__summary">{entry.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="resume__column">
          {RESUME.capabilities.map((group) => (
            <div className="resume__group" key={group.group}>
              <h4 className="resume__section-title" data-animate="title">
                <span>{group.group}</span>
              </h4>
              <ul className="resume__list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      <footer className="resume__toolkit">
        <h4 className="resume__section-title" data-animate="title">
          <span>Toolkit</span>
        </h4>
        <ul className="resume__tags">
          {RESUME.toolkit.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </footer>
    </article>
  )
}
