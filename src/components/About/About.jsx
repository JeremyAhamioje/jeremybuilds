import { useLayoutEffect, useRef } from 'react'
import Resume from './Resume.jsx'
import { RESUME_DOWNLOAD_URL } from './resumeData.js'
import { createAboutAnimation } from './aboutAnimation.js'
import './About.css'
import './Resume.css'

/**
 * About — introduction on the left, the resume as an object on the right.
 *
 * The sheet is the counterweight to the hero's arms: one light form on a dark
 * field, given room. Where the hero is sculpture, this is a document, and the
 * contrast is the point — the artwork says what the work feels like, the sheet
 * says what it is.
 */
export default function About() {
  const rootRef = useRef(null)

  useLayoutEffect(() => createAboutAnimation(rootRef.current), [])

  return (
    <section className="about" id="about" ref={rootRef}>
      <div className="about__inner">
        <div className="about__intro">
          <h2 className="about__headline" data-animate="intro">
            <span className="about__headline-line">HELLO,</span>
            <span className="about__headline-line">I AM JEREMY</span>
            {/* Signature tucked under the last line, as a handwritten aside. */}
            <span className="about__signature">Jeremy Ahamioje</span>
          </h2>

          <p className="about__copy" data-animate="intro">
            I design and build for the web — the whole way through. Interface, motion
            and identity on one side; the components, services and infrastructure that
            carry them on the other. I work best where those two stop being separate
            jobs.
          </p>

          <p className="about__copy about__copy--dim" data-animate="intro">
            Most of what I care about lives in the details: how type sits, how a
            transition resolves, how fast a page becomes useful. The rest is craft
            applied patiently.
          </p>
        </div>

        <div className="about__document">
          <div className="about__sheet" data-animate="sheet">
            <Resume />
          </div>

          <div className="about__actions">
            <a
              className="about__download"
              href={RESUME_DOWNLOAD_URL}
              download
            >
              <span className="about__download-label">Download résumé</span>
              <svg
                className="about__download-icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 2v9" />
                <path d="M4.5 7.5 8 11l3.5-3.5" />
                <path d="M2.5 13.5h11" />
              </svg>
            </a>

            <p className="about__actions-note">PDF · updated monthly</p>
          </div>
        </div>
      </div>
    </section>
  )
}
