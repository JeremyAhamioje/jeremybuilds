import { useEffect, useRef } from 'react'
import { MEDIA_ASSETS } from '../../lib/assets/mediaAssets.js'
import { CONTACT_EMAIL, INTERESTS, SOCIALS } from './footerData.js'
import { createFooterAnimation } from './footerAnimation.js'
import './Footer.css'

/**
 * Let's connect.
 *
 * The site opens on a Renaissance fresco and closes on one — the arms at the
 * top are a detail of the same kind of ceiling this is a whole view of, so the
 * page ends where it started rather than trailing off into a dark strip.
 *
 * This also supplies `#contact`, which the header nav has been pointing at
 * since the beginning.
 */
export default function Footer() {
  const sectionRef = useRef(null)
  const pillsRef = useRef(null)

  useEffect(() => createFooterAnimation(sectionRef.current, pillsRef.current), [])

  const fresco = MEDIA_ASSETS.fresco

  return (
    <footer className="footer" id="contact" ref={sectionRef}>
      {/*
        The ground. Marked presentational: it carries mood, not information,
        and describing a ceiling fresco to a screen reader on the way to the
        contact details would be noise.
      */}
      <div className="footer__ground" aria-hidden="true">
        {fresco && (
          <picture>
            {fresco.sources.map((source) => (
              <source key={source.type} type={source.type} srcSet={source.srcSet} sizes="100vw" />
            ))}
            <img
              src={fresco.fallback}
              width={fresco.width}
              height={fresco.height}
              alt=""
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </picture>
        )}
        <div className="footer__scrim" />
      </div>

      <div className="footer__inner">
        {/*
          Set as two lines rather than wrapped, so the display face keeps its
          full height on both words instead of breaking wherever the column
          happens to end.
        */}
        <h2 className="footer__headline">
          <span>Let's</span>
          <span>connect</span>
        </h2>

        <div className="footer__interests">
          <p className="footer__lead">I'm always interested in</p>
          <ul className="footer__pills" ref={pillsRef}>
            {INTERESTS.map((interest) => (
              <li className="footer__pill" key={interest}>
                {interest}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__cta">
          <p className="footer__cta-copy">Got a project in mind?</p>
          <a className="footer__cta-button" href={`mailto:${CONTACT_EMAIL}`}>
            Contact me
          </a>
        </div>

        <div className="footer__bar">
          <ul className="footer__socials">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                {social.href ? (
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.label}
                  </a>
                ) : (
                  /* No profile URL yet — listed, not linked. See footerData.js. */
                  <span className="footer__social--pending">{social.label}</span>
                )}
              </li>
            ))}
          </ul>

          <p className="footer__colophon">
            <span>Built by Jeremy Ahamioje</span>
            <span aria-hidden="true">·</span>
            <span>{new Date().getFullYear()}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
