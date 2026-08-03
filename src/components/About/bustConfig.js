/**
 * BUST_CONFIG — art direction and interaction tuning for the About portrait.
 *
 * The bust is a sculpture, not a character: it rotates as one object toward the
 * pointer. There is no rig, no bones, no blendshapes — which is why a
 * photogrammetry scan works here at all.
 */

/**
 * Where the scan goes once it exists. Until then the viewport falls back to a
 * placeholder volume, so framing and lighting can be judged before the real
 * asset lands.
 *
 * Set to the public URL of the processed GLB, e.g. '/models/bust.glb'.
 */
export const BUST_MODEL_URL = null

export const BUST_CONFIG = {
  renderer: {
    /** Retina phones will happily render 3x and melt the frame budget. */
    maxPixelRatio: 2,
    toneMappingExposure: 1.05,
  },

  camera: {
    /**
     * Long lens. Portraits shot wide distort the face outward at the nose —
     * the same reason photographers shoot headshots at 85mm, not 24mm.
     */
    fov: 30,
    near: 0.1,
    far: 40,
    position: [0, 0.02, 4.1],
    lookAt: [0, 0, 0],
  },

  /** Same gallery rig as the hero, angled for a portrait rather than a frieze. */
  lighting: {
    key: {
      color: '#fff1dd',
      intensity: 3.1,
      position: [-2.4, 2.6, 3.2],
      castShadow: true,
      shadow: { mapSize: 1024, near: 0.5, far: 14, extent: 3, bias: -0.0009, normalBias: 0.02 },
    },
    fill: { color: '#9db3cc', intensity: 0.5, position: [3.0, -0.4, 2.2] },
    /** Behind, separating the silhouette from the near-black field. */
    rim: { color: '#fbf6ef', intensity: 2.4, position: [1.4, 1.8, -3.4] },
    ambient: { skyColor: '#2b313a', groundColor: '#0b0a09', intensity: 0.5 },
  },

  material: {
    color: '#e6e0d6',
    roughness: 0.74,
    metalness: 0.0,
  },

  /**
   * The look-at.
   *
   * Clamps are deliberately tight. The effect only works while it reads as a
   * sculpture noticing you; past roughly 20 degrees it stops being uncanny in
   * the good way and starts looking like a bobblehead.
   */
  interaction: {
    maxYaw: 15,
    maxPitch: 8,
    /**
     * Exponential smoothing constant, in units of 1/second. Higher tracks the
     * pointer more eagerly. Applied against frame delta so the feel is
     * identical at 60Hz and 120Hz.
     */
    damping: 3.2,

    /**
     * Idle drift, so the bust is alive when nobody is moving the pointer —
     * a frozen head reads as a broken asset rather than a still one.
     */
    idle: {
      /** Seconds of pointer stillness before drift takes over. */
      delay: 2.2,
      yawAmplitude: 4.5,
      pitchAmplitude: 2.2,
      /** Radians per second. Deliberately slow and non-repeating. */
      yawSpeed: 0.18,
      pitchSpeed: 0.13,
    },
  },
}
