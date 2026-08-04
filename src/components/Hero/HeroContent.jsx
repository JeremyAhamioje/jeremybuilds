import DateBadge from './DateBadge.jsx'
import { WHATSAPP_URL } from '../Footer/footerData.js'

/**
 * The typographic layer over the artwork.
 *
 * Sits above the arms and is laid out on a grid that fills the corners the
 * composition deliberately leaves empty: eyebrow top-left, date top-right,
 * headline bottom-left, intro bottom-right. The centre stays clear for the
 * hands and the `</>`.
 *
 * Purely presentational — it holds no scroll state and is never re-rendered by
 * the sequence.
 */
export default function HeroContent() {
  return (
    <div className="hero__content">
      <header className="site-header">
        <div className="site-header__identity">
          <span className="site-header__name">Jeremy Ahamioje</span>
          <span className="site-header__role">Web Developer</span>
        </div>

        {/*
          Every section in page order. `services` and `tools` existed as
          anchors for a while without being reachable from here, which is the
          kind of gap nobody notices until someone goes looking for the thing
          they half-remember seeing.
        */}
        <nav className="site-header__nav" aria-label="Primary">
          <a href="#work">works</a>
          <a href="#about">about</a>
          <a href="#services">services</a>
          <a href="#tools">tools</a>
          <a href="#contact">contact</a>

          {/*
            Set apart from the anchors on purpose. Every other item scrolls the
            page; this one leaves the site. Styling it identically would make
            an outbound jump look like a section link — the rule and the accent
            are what mark the change of kind.

            The label collapses on narrow screens, where six words of nav will
            not fit beside the name; the glyph and its accessible name stay.
          */}
          <a
            className="site-header__whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M12.04 2A9.9 9.9 0 0 0 2.15 11.9c0 1.75.46 3.46 1.33 4.96L2 22.5l5.77-1.5a9.86 9.86 0 0 0 4.27.97h.01a9.9 9.9 0 0 0 0-19.97Zm0 18.14h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.81.83-3.03-.2-.31a8.21 8.21 0 1 1 6.97 3.86Zm4.5-6.15c-.24-.12-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12s-.63.8-.77.96-.28.19-.53.06a6.74 6.74 0 0 1-3.37-2.95c-.25-.44.25-.4.72-1.35.08-.16.04-.3-.02-.42s-.55-1.34-.76-1.83c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.75 2.75 0 0 0-.86 2.05 4.79 4.79 0 0 0 1 2.54 10.94 10.94 0 0 0 4.19 3.7c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.67-1.18s.2-1.07.14-1.18-.22-.18-.46-.3Z"
              />
            </svg>
            <span className="site-header__whatsapp-label">whatsapp</span>
          </a>
        </nav>
      </header>

      <DateBadge />

      {/*
        Eyebrow and headline are one block. Floating the eyebrow at the top of
        the frame put it straight over arm-b's forearm, where it was unreadable;
        tucked against the headline it reads as a single line of thought —
        "creative web developer" — and sits in clear space.
      */}
      <div className="hero__title">
        <p className="hero__eyebrow">creative</p>
        <h1 className="hero__headline">
          <span className="hero__headline-line">WEB</span>
          <span className="hero__headline-line">DEVELOPER</span>
        </h1>
      </div>

      <div className="hero__intro">
        <p className="hero__intro-copy">
          I build interactive experiences for the web, where interface, motion and code
          meet. I care about craft, typography, art and the details most people only feel.
        </p>

        <a className="hero__cta" href="#contact">
          <span>Contact me</span>
        </a>
      </div>
    </div>
  )
}
