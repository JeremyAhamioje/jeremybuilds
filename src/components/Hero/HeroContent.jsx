import DateBadge from './DateBadge.jsx'

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
