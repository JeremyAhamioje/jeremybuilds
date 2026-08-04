import { useEffect, useRef } from 'react'
import { MEDIA_ASSETS } from '../../lib/assets/mediaAssets.js'
import { CONTACT_EMAIL, INTERESTS, SOCIALS, WHATSAPP_URL } from './footerData.js'
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

          {/*
            Secondary by design. Two equally-weighted buttons make a visitor
            choose before they act; outlined against the filled one keeps a
            single obvious default while still offering the faster channel to
            anyone who prefers it.
          */}
          <a
            className="footer__cta-button footer__cta-button--alt"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="footer__cta-glyph"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M12.04 2A9.9 9.9 0 0 0 2.15 11.9c0 1.75.46 3.46 1.33 4.96L2 22.5l5.77-1.5a9.86 9.86 0 0 0 4.27.97h.01a9.9 9.9 0 0 0 0-19.97Zm0 18.14h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.81.83-3.03-.2-.31a8.21 8.21 0 1 1 6.97 3.86Zm4.5-6.15c-.24-.12-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12s-.63.8-.77.96-.28.19-.53.06a6.74 6.74 0 0 1-3.37-2.95c-.25-.44.25-.4.72-1.35.08-.16.04-.3-.02-.42s-.55-1.34-.76-1.83c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.75 2.75 0 0 0-.86 2.05 4.79 4.79 0 0 0 1 2.54 10.94 10.94 0 0 0 4.19 3.7c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.67-1.18s.2-1.07.14-1.18-.22-.18-.46-.3Z"
              />
            </svg>
            WhatsApp
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
