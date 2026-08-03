import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Service illustration motion.
 *
 * Two kinds of movement per drawing, kept separate on purpose:
 *
 *   ENTER — plays once, when the row arrives. Builds the drawing.
 *   LOOP  — runs continuously while the row is on screen. Keeps it alive.
 *
 * Loops pause when the row leaves the viewport. Six illustrations idling at
 * once, five of them off screen, is a lot of main thread spent on things
 * nobody is looking at.
 *
 * Every animation moves AWAY from the state in the markup and returns to it,
 * so the finished drawing is what a visitor sees if none of this ever runs.
 */

/**
 * Travelling highlight along a path.
 *
 * Dash offset rather than a moving dot: it follows arbitrary curves for free
 * and needs no plugin. At offset 0 the dash sits at [0, d]; at -x it sits at
 * [x, x+d]. So running d -> -len carries it from just before the start to just
 * past the end.
 */
function comet(path, { duration = 2.6, delay = 0 } = {}) {
  const len = path.getTotalLength()
  if (!len) return null

  const dash = Math.max(12, len * 0.16)
  gsap.set(path, { strokeDasharray: `${dash} ${len}` })

  return gsap.fromTo(
    path,
    { strokeDashoffset: dash },
    {
      strokeDashoffset: -len,
      duration,
      delay,
      ease: 'none',
      repeat: -1,
      repeatDelay: 0.5,
    },
  )
}

/** Draw a stroke on, once. */
function draw(path, vars = {}) {
  const len = path.getTotalLength()
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
  return gsap.to(path, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', ...vars })
}

const BUILDERS = {
  /* Layers settle into depth, then the page fills in. */
  web(q, enter, loops) {
    enter
      .from(q('[data-art="layer"]'), { x: 22, y: 14, autoAlpha: 0, duration: 0.7, stagger: 0.09 }, 0)
      .from(q('[data-art="frame"]'), { y: 18, autoAlpha: 0, duration: 0.6 }, 0.1)
      .from(
        q('[data-art="row"]'),
        { scaleX: 0, transformOrigin: '0% 50%', duration: 0.5, stagger: 0.08 },
        0.4,
      )
      .from(q('[data-art="block"]'), { autoAlpha: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.5 }, 0.55)

    loops.push(
      gsap.to(q('[data-art="pulse"]'), {
        opacity: 0.25,
        duration: 1.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
      // The stack breathes, so the depth stays legible while it sits still.
      gsap.to(q('[data-art="layer"]'), {
        y: '-=4',
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
      }),
    )
  },

  /* Bars grow, the trend draws itself, then data starts moving between panels. */
  saas(q, enter, loops) {
    enter
      .from(
        q('[data-art="bar"]'),
        { scaleY: 0, transformOrigin: '50% 100%', duration: 0.55, ease: 'back.out(1.6)', stagger: 0.07 },
        0,
      )
      .add(draw(q('[data-art="spark"]')[0]), 0.3)

    q('[data-art="comet"]').forEach((path, i) => {
      const tween = comet(path, { duration: 2.4, delay: i * 0.8 })
      if (tween) loops.push(tween)
    })

    loops.push(
      gsap.to(q('[data-art="ring"]'), {
        rotation: 360,
        transformOrigin: '50% 50%',
        duration: 7,
        ease: 'none',
        repeat: -1,
      }),
    )
  },

  /* The device arrives, then the services wire themselves in. */
  mobile(q, enter, loops) {
    enter
      .from(q('[data-art="screen"] rect'), { autoAlpha: 0, x: -8, duration: 0.45, stagger: 0.06 }, 0.25)
      .from(q('[data-art="node"]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2)', stagger: 0.08 }, 0.1)

    q('[data-art="comet"]').forEach((path, i) => {
      const tween = comet(path, { duration: 2.2, delay: i * 0.45 })
      if (tween) loops.push(tween)
    })

    loops.push(
      gsap.to(q('[data-art="node"]'), {
        scale: 1.12,
        transformOrigin: '50% 50%',
        duration: 1.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.35, from: 'random' },
      }),
    )
  },

  /*
   * The wipe. Width and guide position are driven off ONE proxy value rather
   * than two tweens, because a guide line that drifts a few pixels out of step
   * with the edge it is supposed to mark looks like a rendering bug.
   */
  design(q, enter, loops) {
    const wipe = q('[data-art="wipe"]')[0]
    const guide = q('[data-art="guide"]')[0]
    if (!wipe) return

    const LEFT = 40
    const FULL = 240
    const state = { w: FULL }

    const apply = () => {
      wipe.setAttribute('width', String(state.w))
      if (guide) {
        guide.setAttribute('x1', String(LEFT + state.w))
        guide.setAttribute('x2', String(LEFT + state.w))
      }
    }

    enter.fromTo(
      state,
      { w: 0 },
      { w: FULL, duration: 1.2, ease: 'power2.inOut', onUpdate: apply },
      0.15,
    )

    loops.push(
      gsap
        .timeline({ repeat: -1, repeatDelay: 2.6 })
        .to(state, { w: 132, duration: 1.3, ease: 'power2.inOut', onUpdate: apply }, 1.4)
        .to(state, { w: FULL, duration: 1.3, ease: 'power2.inOut', onUpdate: apply }, '+=0.9'),
      gsap.to(guide, { opacity: 0.35, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true }),
    )
  },

  /* The ring turns, the tiles stay upright, signal runs down the spokes. */
  ai(q, enter, loops) {
    enter
      .from(q('[data-art="orbit"]'), { scale: 0.86, autoAlpha: 0, transformOrigin: '160px 100px', duration: 0.8, ease: 'power3.out' }, 0)
      .from(q('[data-art="core-dot"]'), { scale: 0, transformOrigin: '160px 100px', duration: 0.5, ease: 'back.out(2.2)' }, 0.45)

    const ORBIT = 26

    loops.push(
      gsap.to(q('[data-art="orbit"]'), {
        rotation: 360,
        svgOrigin: '160 100',
        duration: ORBIT,
        ease: 'none',
        repeat: -1,
      }),
      // Counter-rotation, same duration: the tiles ride the ring without
      // tumbling. Any mismatch here and they slowly spin relative to it.
      gsap.to(q('[data-art="satellite"]'), {
        rotation: -360,
        duration: ORBIT,
        ease: 'none',
        repeat: -1,
      }),
      gsap.to(q('[data-art="core"]'), {
        rotation: -360,
        svgOrigin: '160 100',
        duration: 9,
        ease: 'none',
        repeat: -1,
      }),
      gsap.to(q('[data-art="core-dot"]'), {
        scale: 1.35,
        transformOrigin: '50% 50%',
        duration: 1.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      }),
    )

    q('[data-art="spoke-pulse"]').forEach((line, i) => {
      const tween = comet(line, { duration: 1.9, delay: i * 0.32 })
      if (tween) loops.push(tween)
    })
  },

  /*
   * Wireframe rotation done properly: each meridian's rx tracks |cos| of its
   * own phase, which is what a rotating sphere actually projects to. Spinning
   * the group instead would read as a disc turning on the page.
   */
  interactive(q, enter, loops) {
    enter
      .from(q('[data-art="plane"]'), { y: 26, autoAlpha: 0, duration: 0.65, ease: 'power3.out', stagger: 0.1 }, 0)
      .from(q('[data-art="globe"]'), { scale: 0.85, autoAlpha: 0, transformOrigin: '160px 72px', duration: 0.7, ease: 'power3.out' }, 0.2)

    const meridians = q('[data-art="meridian"]')
    meridians.forEach((ellipse, i) => {
      const phase = (Math.PI * i) / meridians.length
      const state = { t: phase }

      loops.push(
        gsap.to(state, {
          t: phase + Math.PI * 2,
          duration: 11,
          ease: 'none',
          repeat: -1,
          onUpdate: () => {
            ellipse.setAttribute('rx', (40 * Math.abs(Math.cos(state.t))).toFixed(2))
          },
        }),
      )
    })

    loops.push(
      gsap.to(q('[data-art="plane"]'), {
        y: '-=6',
        duration: 2.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      }),
    )

    q('[data-art="comet"]').forEach((path) => {
      const tween = comet(path, { duration: 3.4 })
      if (tween) loops.push(tween)
    })

    /*
     * The cursor rides the same curve the comet does, sampled with
     * getPointAtLength. MotionPathPlugin would do this, but it is a paid
     * plugin and this is nine lines.
     */
    const track = q('#interactive-track')[0]
    const cursor = q('[data-art="cursor"]')[0]

    if (track && cursor) {
      const len = track.getTotalLength()
      const state = { p: 0 }

      loops.push(
        gsap.to(state, {
          p: 1,
          duration: 3.4,
          ease: 'none',
          repeat: -1,
          repeatDelay: 0.5,
          onUpdate: () => {
            const point = track.getPointAtLength(state.p * len)
            gsap.set(cursor, { x: point.x, y: point.y })
          },
        }),
      )
    }
  },
}

/**
 * Wire one illustration.
 *
 * @param {SVGElement} svg
 * @returns {{ play: () => void, pause: () => void, kill: () => void }}
 */
export function createServiceArt(svg) {
  const key = svg?.dataset.artKey
  const build = BUILDERS[key]
  if (!build) return { play() {}, pause() {}, kill() {} }

  const q = gsap.utils.selector(svg)
  const enter = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
  const loops = []

  build(q, enter, loops)
  loops.forEach((tween) => tween.pause())

  let entered = false

  return {
    play() {
      if (!entered) {
        entered = true
        enter.play()
      }
      loops.forEach((tween) => tween.play())
    },
    pause() {
      loops.forEach((tween) => tween.pause())
    },
    kill() {
      enter.kill()
      loops.forEach((tween) => tween.kill())
    },
  }
}

/**
 * Row reveals, and the on-screen gating for the illustrations.
 *
 * @param {HTMLElement} section
 * @param {Array<{ row: HTMLElement, art: SVGElement }>} entries
 */
export function createServicesScroll(section, entries) {
  if (!section) return () => {}

  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const controllers = []
    const triggers = []

    entries.forEach(({ row, art }) => {
      if (!row) return

      const heading = row.querySelectorAll('[data-reveal]')
      gsap.set(heading, { autoAlpha: 0, y: 26 })

      triggers.push(
        ScrollTrigger.create({
          trigger: row,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(heading, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.08,
            })
          },
        }),
      )

      if (!art) return

      const controller = createServiceArt(art)
      controllers.push(controller)

      // Loops only run while the drawing is actually on screen.
      triggers.push(
        ScrollTrigger.create({
          trigger: row,
          start: 'top 92%',
          end: 'bottom 8%',
          onEnter: () => controller.play(),
          onEnterBack: () => controller.play(),
          onLeave: () => controller.pause(),
          onLeaveBack: () => controller.pause(),
        }),
      )
    })

    return () => {
      triggers.forEach((trigger) => trigger.kill())
      controllers.forEach((controller) => controller.kill())
    }
  })

  return () => mm.revert()
}
