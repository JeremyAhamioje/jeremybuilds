/**
 * Service illustrations.
 *
 * Six abstract visual metaphors rather than icons. A set of stock glyphs would
 * say nothing a one-word label doesn't already say, and next to the rest of
 * this site it would look borrowed.
 *
 * Rules the set holds to, so six separate drawings still read as one family:
 *
 *   - one shared 320x200 stage, so every panel crops and scales identically;
 *   - line weight and palette come from CSS classes, never inline fills, so
 *     retuning the section does not mean editing six files;
 *   - exactly ONE accent element each. The terracotta is the eye's entry point
 *     into the drawing; spend it twice and it stops being a signal;
 *   - the markup is the FINISHED state. Every animation moves away from what
 *     is written here and back, so with JavaScript off, motion reduced, or the
 *     timeline never firing, the drawing is still complete and correct.
 *
 * `data-art` attributes are the animation's only handles — see
 * servicesAnimation.js. Nothing here knows how it will move.
 */

/* -------------------------------------------------------------- 01 — web */

/**
 * Floating website: three frames stacked into depth, the front one resolving
 * into a real page. Depth rather than a single browser chrome, because the
 * claim is "built", not "a website exists".
 */
function WebArt() {
  return (
    <>
      <rect data-art="layer" x="30" y="24" width="212" height="130" rx="7" className="art-ghost" />
      <rect data-art="layer" x="48" y="37" width="212" height="130" rx="7" className="art-faint" />

      <g data-art="frame">
        <rect x="66" y="50" width="212" height="130" rx="7" className="art-panel" />
        <line x1="66" y1="72" x2="278" y2="72" className="art-line" />

        <circle data-art="pulse" cx="80" cy="61" r="3.2" className="art-accent" />
        <circle cx="91" cy="61" r="3.2" className="art-dim" />
        <circle cx="102" cy="61" r="3.2" className="art-dim" />

        <rect data-art="row" x="82" y="88" width="88" height="10" rx="2" className="art-fill" />
        <rect data-art="row" x="82" y="107" width="122" height="6" rx="3" className="art-dim" />
        <rect data-art="row" x="82" y="121" width="96" height="6" rx="3" className="art-dim" />
        <rect data-art="row" x="82" y="142" width="58" height="17" rx="8.5" className="art-hollow" />

        <rect data-art="block" x="198" y="88" width="62" height="71" rx="5" className="art-hollow" />
        <path data-art="block" d="M198 140 L219 118 L236 135 L248 126 L260 137" className="art-line" />
      </g>
    </>
  )
}

/* ------------------------------------------------------------- 02 — saas */

/**
 * Connected panels: a metrics panel feeding two others. The wires carry the
 * meaning — this is the service where things talk to each other, so the data
 * is shown moving rather than sitting.
 */
function SaasArt() {
  return (
    <>
      <rect x="26" y="40" width="120" height="122" rx="7" className="art-panel" />
      <line x1="26" y1="60" x2="146" y2="60" className="art-line" />
      <rect x="38" y="49" width="34" height="4" rx="2" className="art-dim" />

      {[
        { x: 42, h: 30 },
        { x: 61, h: 54 },
        { x: 80, h: 38 },
        { x: 99, h: 70 },
        { x: 118, h: 48 },
      ].map((bar) => (
        <rect
          key={bar.x}
          data-art="bar"
          x={bar.x}
          y={150 - bar.h}
          width="12"
          height={bar.h}
          rx="2.5"
          className={bar.h === 70 ? 'art-accent' : 'art-dim'}
        />
      ))}

      <path id="saas-wire-a" d="M146 84 C 170 84 170 66 194 66" className="art-line" />
      <path id="saas-wire-b" d="M146 120 C 170 120 170 138 194 138" className="art-line" />
      <path data-art="comet" d="M146 84 C 170 84 170 66 194 66" className="art-comet" />
      <path data-art="comet" d="M146 120 C 170 120 170 138 194 138" className="art-comet" />

      <rect x="194" y="40" width="100" height="52" rx="7" className="art-panel" />
      <path
        data-art="spark"
        d="M206 78 L220 66 L232 72 L246 54 L260 62 L282 50"
        className="art-line-strong"
      />

      <rect x="194" y="110" width="100" height="52" rx="7" className="art-panel" />
      <circle cx="220" cy="136" r="15" className="art-hollow" />
      <circle data-art="ring" cx="220" cy="136" r="15" className="art-ring" />
      <rect x="248" y="128" width="34" height="5" rx="2.5" className="art-dim" />
      <rect x="248" y="140" width="22" height="5" rx="2.5" className="art-dim" />
    </>
  )
}

/* ----------------------------------------------------------- 03 — mobile */

/**
 * A handset with services wired into it. The device is deliberately plain and
 * the traffic is what moves — a phone drawn on its own is a picture of a
 * phone, not of building for one.
 */
function MobileArt() {
  const nodes = [
    { cx: 32, cy: 52 },
    { cx: 32, cy: 148 },
    { cx: 288, cy: 44 },
    { cx: 288, cy: 156 },
  ]

  const wires = [
    'M39 52 C 78 52 92 72 120 72',
    'M39 148 C 78 148 92 128 120 128',
    'M281 44 C 240 44 228 68 200 68',
    'M281 156 C 240 156 228 132 200 132',
  ]

  return (
    <>
      {wires.map((d) => (
        <path key={d} d={d} className="art-line" />
      ))}
      {wires.map((d) => (
        <path key={`c${d}`} data-art="comet" d={d} className="art-comet" />
      ))}

      {nodes.map((node) => (
        <g key={`${node.cx}-${node.cy}`} data-art="node">
          <circle cx={node.cx} cy={node.cy} r="8" className="art-hollow" />
          <circle cx={node.cx} cy={node.cy} r="2.6" className="art-fill" />
        </g>
      ))}

      <rect x="120" y="18" width="80" height="164" rx="14" className="art-panel" />
      <rect x="128" y="30" width="64" height="140" rx="7" className="art-hollow" />
      <rect x="150" y="23" width="20" height="3.5" rx="1.75" className="art-dim" />

      <g data-art="screen">
        <rect x="136" y="40" width="30" height="6" rx="3" className="art-fill" />
        <rect x="136" y="56" width="48" height="20" rx="4" className="art-accent" />
        <rect x="136" y="84" width="48" height="12" rx="3" className="art-dim" />
        <rect x="136" y="102" width="48" height="12" rx="3" className="art-dim" />
        <rect x="136" y="120" width="48" height="12" rx="3" className="art-dim" />
        <rect x="136" y="138" width="48" height="12" rx="3" className="art-dim" />
      </g>
    </>
  )
}

/* ----------------------------------------------------------- 04 — design */

/**
 * The same screen twice: wireframe underneath, resolved on top, with a wipe
 * running between them. Design shown as a transformation rather than as a
 * picture of Figma — the tool is not the service.
 *
 * The polished version is clipped by a rect the timeline widens, so the wipe
 * is a real reveal of a second drawing, not a crossfade.
 */
function DesignArt() {
  return (
    <>
      <defs>
        <clipPath id="design-wipe">
          <rect data-art="wipe" x="40" y="0" width="240" height="200" />
        </clipPath>
      </defs>

      {/* Wireframe: dashed, unresolved, everything the same weight. */}
      <g>
        <rect x="40" y="26" width="240" height="148" rx="6" className="art-dash" />
        <rect x="56" y="44" width="60" height="60" rx="2" className="art-dash" />
        <rect x="128" y="44" width="136" height="9" rx="2" className="art-dash" />
        <rect x="128" y="61" width="106" height="9" rx="2" className="art-dash" />
        <rect x="128" y="78" width="120" height="9" rx="2" className="art-dash" />
        <rect x="56" y="118" width="98" height="38" rx="2" className="art-dash" />
        <rect x="166" y="118" width="98" height="38" rx="2" className="art-dash" />
      </g>

      {/* Resolved: hierarchy, radius, one accent. */}
      <g clipPath="url(#design-wipe)">
        <rect x="40" y="26" width="240" height="148" rx="6" className="art-panel" />
        <circle cx="86" cy="74" r="30" className="art-fill-soft" />
        <rect x="128" y="44" width="136" height="11" rx="5.5" className="art-fill" />
        <rect x="128" y="63" width="106" height="7" rx="3.5" className="art-dim" />
        <rect x="128" y="79" width="120" height="7" rx="3.5" className="art-dim" />
        <rect x="56" y="118" width="98" height="38" rx="8" className="art-accent" />
        <rect x="166" y="118" width="98" height="38" rx="8" className="art-hollow" />
      </g>

      {/*
        The edge of the wipe, drawn as an alignment guide. Parked at the full
        width (40 + 240) so that with motion reduced it sits on the frame edge
        instead of stranding an accent line down the middle of a finished
        drawing.
      */}
      <line data-art="guide" x1="280" y1="14" x2="280" y2="186" className="art-guide" />
    </>
  )
}

/* --------------------------------------------------------------- 05 — ai */

/**
 * A core with services in orbit, and signal running both ways along the
 * spokes. The point of the drawing is the wiring, not the brain: this is
 * integration, so the interesting part is what the model is attached to.
 */
function AiArt() {
  const count = 6
  const radius = 66
  const satellites = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    return {
      i,
      x: 160 + radius * Math.cos(angle),
      y: 100 + radius * Math.sin(angle),
    }
  })

  return (
    <>
      <g data-art="orbit">
        <circle cx="160" cy="100" r={radius} className="art-orbit" />

        {satellites.map((s) => (
          <g key={s.i}>
            <line x1="160" y1="100" x2={s.x} y2={s.y} className="art-line" />
            {/* Counter-rotated so the tiles stay upright as the ring turns. */}
            <g data-art="satellite" style={{ transformOrigin: `${s.x}px ${s.y}px` }}>
              <rect
                x={s.x - 11}
                y={s.y - 11}
                width="22"
                height="22"
                rx="6"
                className="art-panel"
              />
              <circle cx={s.x} cy={s.y} r="3" className="art-dim" />
            </g>
          </g>
        ))}
      </g>

      {satellites.map((s) => (
        <line
          key={`p${s.i}`}
          data-art="spoke-pulse"
          x1="160"
          y1="100"
          x2={s.x}
          y2={s.y}
          className="art-comet"
        />
      ))}

      <circle cx="160" cy="100" r="27" className="art-panel" />
      <g data-art="core">
        <path d="M160 79 A 21 21 0 0 1 181 100" className="art-accent-stroke" />
        <path d="M160 121 A 21 21 0 0 1 139 100" className="art-accent-stroke" />
      </g>
      <circle data-art="core-dot" cx="160" cy="100" r="6" className="art-fill" />
    </>
  )
}

/* ------------------------------------------------------ 06 — interactive */

/**
 * Layers in isometric with a wireframe form above them and a cursor tracking
 * through. The one drawing in the set that is allowed to be showing off,
 * because that is what the service is.
 */
function InteractiveArt() {
  /** Isometric plane, drawn from a centre point. */
  const plane = (cx, cy, w = 78, h = 34) =>
    `M${cx} ${cy - h} L${cx + w} ${cy} L${cx} ${cy + h} L${cx - w} ${cy} Z`

  return (
    <>
      <path data-art="plane" d={plane(160, 158)} className="art-faint" />
      <path data-art="plane" d={plane(160, 138)} className="art-hollow" />
      <path data-art="plane" d={plane(160, 118)} className="art-panel" />

      <g data-art="globe">
        <circle cx="160" cy="72" r="40" className="art-hollow" />
        <ellipse data-art="meridian" cx="160" cy="72" rx="40" ry="40" className="art-faint" />
        <ellipse data-art="meridian" cx="160" cy="72" rx="27" ry="40" className="art-faint" />
        <ellipse data-art="meridian" cx="160" cy="72" rx="12" ry="40" className="art-faint" />
        <line x1="120" y1="72" x2="200" y2="72" className="art-faint" />
        <ellipse cx="160" cy="72" rx="40" ry="14" className="art-faint" />
      </g>

      <path
        id="interactive-track"
        d="M54 150 C 82 96 118 168 160 118 C 202 68 238 140 268 88"
        className="art-track"
      />
      <path
        data-art="comet"
        d="M54 150 C 82 96 118 168 160 118 C 202 68 238 140 268 88"
        className="art-comet"
      />

      {/* Parked on the start of the track, so it is in a sensible place before
          anything animates rather than in the corner at 0,0. */}
      <g data-art="cursor" transform="translate(54 150)">
        <path d="M0 0 L0 15 L4 11.4 L6.6 16.6 L9.4 15.2 L6.8 10.2 L11.6 10 Z" className="art-cursor" />
      </g>
    </>
  )
}

const ART = {
  web: WebArt,
  saas: SaasArt,
  mobile: MobileArt,
  design: DesignArt,
  ai: AiArt,
  interactive: InteractiveArt,
}

/**
 * One stage for all six, so every panel crops and scales identically and the
 * animation module has a single root to query.
 */
export default function ServiceArt({ art, artRef }) {
  const Drawing = ART[art]
  if (!Drawing) return null

  return (
    <svg
      className="service__art"
      viewBox="0 0 320 200"
      role="presentation"
      aria-hidden="true"
      ref={artRef}
      data-art-key={art}
    >
      <Drawing />
    </svg>
  )
}
