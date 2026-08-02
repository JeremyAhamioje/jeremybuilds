/**
 * HERO_CONFIG — single source of truth for art direction.
 *
 * Everything likely to be tweaked while art-directing lives here so composition
 * can be tuned without touching scene/geometry/animation code.
 *
 * Scene units: 1 unit ~= the width of a palm. A full hand (wrist to fingertip)
 * is roughly 2.2 units long. Keep this in mind when editing positions.
 */

/** Viewport width (px) below which the mobile composition takes over. */
export const MOBILE_BREAKPOINT = 768

export const HERO_CONFIG = {
  renderer: {
    /** Cap DPR — retina phones happily render 3x and melt the frame budget. */
    maxPixelRatio: 2,
    antialias: true,
    /** ACES + exposure gives the restrained, filmic gallery response we want. */
    toneMappingExposure: 1.05,
    shadows: true,
  },

  background: {
    /** Warm off-black. Not pure #000 — pure black kills the sense of a room. */
    color: '#0a0908',
    /** Depth falloff so objects behind the composition sink into the dark. */
    fog: {
      enabled: true,
      color: '#0a0908',
      near: 8,
      far: 26,
    },
  },

  /**
   * Four lights, deliberately placed: a digital sculpture photographed in a
   * dark gallery. Intensities assume physically-correct lighting (three r155+)
   * and ACES tone mapping.
   */
  lighting: {
    key: {
      color: '#fff1dd', // warm gallery spot
      intensity: 3.4,
      position: [-4.2, 5.0, 4.4],
      castShadow: true,
      /** Tight ortho frustum keeps shadow texels dense across the hands. */
      shadow: {
        mapSize: 2048,
        near: 1,
        far: 22,
        extent: 7, // half-width of the ortho shadow camera
        bias: -0.0008,
        normalBias: 0.022,
        radius: 3,
      },
    },
    /** Cool, dim, opposite the key — keeps shadow interiors readable, not flat. */
    fill: {
      color: '#9db3cc',
      intensity: 0.55,
      position: [5.6, -1.4, 3.2],
    },
    /** Behind the subject — the silhouette separator. Does the heavy lifting. */
    rim: {
      color: '#fbf6ef',
      intensity: 2.9,
      position: [1.8, 2.6, -5.6],
    },
    /** Sky/ground gradient instead of flat ambient, for a subtle vertical shift. */
    ambient: {
      skyColor: '#2b313a',
      groundColor: '#0b0a09',
      intensity: 0.55,
    },
  },

  /** Base stone/marble treatment. Refined further in the polish phase. */
  material: {
    stone: {
      color: '#e6e0d6', // warm marble, never pure white
      roughness: 0.72,
      metalness: 0.0,
      flatShading: true, // sculptural facets participate in the visual language
    },
  },

  /**
   * Composition varies by breakpoint — mobile is deliberately re-composed on a
   * vertical diagonal rather than a squeezed-down desktop layout.
   */
  composition: {
    desktop: {
      camera: {
        fov: 32, // long lens — compressed, cinematic, minimal wide-angle distortion
        near: 0.1,
        far: 60,
        position: [0, 0.15, 9.2],
        lookAt: [0, 0.0, 0],
      },
      /**
       * Slot names must match the keys returned by the subject factory in
       * subject.js. Add, remove or rename freely — just keep the two in step.
       */
      slots: {
        // Opposing masses entering from the frame edges, converging on a
        // centrepiece, with large negative space between them.
        subjectA: {
          position: [-3.5, 0.95, 0.1],
          rotation: [0, 0, -0.2],
          scale: 1.0,
        },
        subjectB: {
          position: [3.5, -1.0, -0.1],
          rotation: [0, Math.PI, 0.2],
          scale: 0.96,
        },
        focus: {
          position: [0, 0, 0.3],
          scale: 1.0,
        },
      },
    },

    mobile: {
      camera: {
        fov: 42, // wider so a portrait frame still holds the composition
        near: 0.1,
        far: 60,
        position: [0, 0.1, 10.5],
        lookAt: [0, 0.0, 0],
      },
      // Deliberately re-composed on a vertical diagonal, not a shrunken desktop.
      slots: {
        subjectA: {
          position: [-0.95, 2.5, 0.1],
          rotation: [0, 0, -0.55],
          scale: 0.78,
        },
        subjectB: {
          position: [0.95, -2.5, -0.1],
          rotation: [0, Math.PI, 0.55],
          scale: 0.75,
        },
        focus: {
          position: [0, 0, 0.3],
          scale: 0.85,
        },
      },
    },
  },

  /**
   * Scroll timeline keyframes, as normalized scroll progress (0..1).
   * Tunable — these are art direction, not load-bearing constants.
   */
  animation: {
    approachStart: 0.18, // subjects begin moving inward
    approachEnd: 0.55, // subjects near the focus
    contactPoint: 0.7, // convergence moment
    exitStart: 0.78, // subjects push past the composition
    exitEnd: 1.0, // subjects have left the frame
  },

  /** Dev-only inspection view (`?inspect=<slot>`). Not used by the hero. */
  inspect: {
    /** Local X the pivot orbits around — offset to the subject's visual centre. */
    pivotX: 0.75,
    distance: 7,
  },
}

/**
 * Pick the composition for a viewport width.
 * Kept as a function (not a computed constant) so resize can re-resolve it.
 */
export function resolveComposition(width) {
  return width < MOBILE_BREAKPOINT
    ? HERO_CONFIG.composition.mobile
    : HERO_CONFIG.composition.desktop
}
