import * as THREE from 'three'
import { HERO_CONFIG, resolveComposition } from './config.js'
import { createMaterials } from './materials.js'
import { createPlaceholderSubject } from './subject.js'
import { disposeObject3D } from '../../lib/disposal.js'

/**
 * Builds the hero's Three.js scene and owns its whole lifecycle.
 *
 * Framework-agnostic on purpose: it takes a DOM element, appends a canvas, and
 * returns a handle with a `dispose()`. Nothing in here knows about React.
 *
 * This module is deliberately SUBJECT-AGNOSTIC. It owns the renderer, camera,
 * lighting, background, sizing, render loop and teardown — the parts that hold
 * regardless of what the hero actually depicts. The visual concept plugs in
 * through `createSubject`; see subject.js.
 *
 * @param {HTMLElement} container - element the canvas fills; drives sizing.
 * @param {object} [options]
 * @param {Function} [options.createSubject] - returns { slotName: Object3D }.
 *   Slot names are matched against `composition.slots` in config.js.
 * @returns {object} handle exposing scene objects plus `dispose()`.
 */
export function createHeroScene(container, options = {}) {
  const { createSubject = createPlaceholderSubject } = options
  const { renderer: rendererConfig, background, lighting, inspect } = HERO_CONFIG

  /* ---------------------------------------------------------------- renderer */

  const renderer = new THREE.WebGLRenderer({
    antialias: rendererConfig.antialias,
    powerPreference: 'high-performance',
    // Opaque canvas — the background colour is rendered, not composited.
    alpha: false,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, rendererConfig.maxPixelRatio))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = rendererConfig.toneMappingExposure

  if (rendererConfig.shadows) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  container.appendChild(renderer.domElement)

  /* ------------------------------------------------------------------- scene */

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(background.color)

  if (background.fog.enabled) {
    scene.fog = new THREE.Fog(background.fog.color, background.fog.near, background.fog.far)
  }

  /* ------------------------------------------------------------------ camera */

  // Values are overwritten immediately by applyComposition(); this just gets a
  // valid camera on the books before the first layout read.
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60)

  /* ------------------------------------------------------------------ lights */

  const lights = createLighting(lighting)
  lights.forEach((light) => scene.add(light))

  /* ---------------------------------------------------------------- subject */

  const materials = createMaterials()

  /** @type {Record<string, THREE.Object3D>} */
  const slots = createSubject({ materials, config: HERO_CONFIG })

  for (const [name, object] of Object.entries(slots)) {
    object.name = name
    scene.add(object)
  }

  /* -------------------------------------------------------- inspection mode */

  /**
   * DEV ONLY — `?inspect=<slot>&yaw=<deg>&pitch=<deg>&dist=<units>` isolates a
   * single slot at a FIXED angle so its silhouette can be judged reproducibly.
   *
   * Angles are explicit rather than animated on purpose: a turntable makes every
   * screenshot a different view, which is useless for comparing one revision of
   * the geometry against the next.
   */
  const searchParams = new URLSearchParams(window.location.search)
  const inspectSlot = searchParams.get('inspect')
  const isInspecting = Boolean(inspectSlot && slots[inspectSlot])
  const inspectPivot = new THREE.Group()

  if (isInspecting) {
    for (const [name, object] of Object.entries(slots)) {
      object.visible = name === inspectSlot
    }

    inspectPivot.rotation.y = THREE.MathUtils.degToRad(Number(searchParams.get('yaw') ?? 0))
    inspectPivot.rotation.x = THREE.MathUtils.degToRad(Number(searchParams.get('pitch') ?? 0))

    scene.add(inspectPivot)
    inspectPivot.add(slots[inspectSlot])
  }

  /* ------------------------------------------------------------- composition */

  /** Tracks which breakpoint composition is currently applied. */
  let activeComposition = null

  /**
   * Apply the breakpoint-appropriate composition to camera and subject slots.
   *
   * The resolved transform is also stashed on each object's `userData.base`.
   * Scroll animation reads from that base rather than from the object's live
   * transform, so a mid-scroll resize can re-compose without the animation and
   * the layout fighting over the same values.
   */
  function applyComposition(width) {
    const composition = resolveComposition(width)
    activeComposition = composition

    const { camera: cameraConfig } = composition
    camera.fov = cameraConfig.fov
    camera.near = cameraConfig.near
    camera.far = cameraConfig.far
    camera.position.fromArray(cameraConfig.position)
    camera.lookAt(new THREE.Vector3().fromArray(cameraConfig.lookAt))
    camera.updateProjectionMatrix()

    camera.userData.base = {
      position: [...cameraConfig.position],
      lookAt: [...cameraConfig.lookAt],
      fov: cameraConfig.fov,
    }

    for (const [name, object] of Object.entries(slots)) {
      const transform = composition.slots[name]
      if (transform) applyTransform(object, transform)
    }

    if (isInspecting) {
      // Offset the subject inside the pivot so rotation orbits its visual
      // centre rather than its origin, keeping it framed at every angle.
      const subject = slots[inspectSlot]
      subject.position.set(-inspect.pivotX, 0, 0)
      subject.rotation.set(0, 0, 0)
      subject.scale.setScalar(1)
      camera.position.set(0, 0.15, Number(searchParams.get('dist') ?? inspect.distance))
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
  }

  /* ------------------------------------------------------------------ sizing */

  function resize() {
    // Fall back to window size on the first tick, before layout has settled.
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, rendererConfig.maxPixelRatio))
    renderer.setSize(width, height, false)

    applyComposition(width)

    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  /* -------------------------------------------------------------- render loop */

  const clock = new THREE.Clock()
  /** Per-frame hook for scroll-driven motion and subject reactions. */
  let onFrame = null

  function renderFrame() {
    // Order matters: getElapsedTime() calls getDelta() internally, so reading
    // delta second would always yield ~0. Pull delta first, then the accumulator.
    const delta = clock.getDelta()
    const elapsed = clock.elapsedTime

    if (onFrame) onFrame({ elapsed, delta })

    renderer.render(scene, camera)
  }

  renderer.setAnimationLoop(renderFrame)

  // Stop burning frames on a backgrounded tab.
  function handleVisibilityChange() {
    renderer.setAnimationLoop(document.hidden ? null : renderFrame)
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  /* ----------------------------------------------------------------- teardown */

  function dispose() {
    renderer.setAnimationLoop(null)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    resizeObserver.disconnect()

    disposeObject3D(scene)
    scene.clear()

    renderer.dispose()
    renderer.domElement.remove()
  }

  return {
    scene,
    camera,
    renderer,
    slots,
    materials,
    getComposition: () => activeComposition,
    setFrameCallback: (callback) => {
      onFrame = callback
    },
    dispose,
  }
}

/**
 * Copy a config transform onto an object and record it as the animation base.
 *
 * Transforms are partial by design — a slot may have no authored rotation — so
 * anything omitted falls back to identity.
 */
function applyTransform(object, transform) {
  const position = transform.position ?? [0, 0, 0]
  const rotation = transform.rotation ?? [0, 0, 0]
  const scale = transform.scale ?? 1

  object.position.fromArray(position)
  object.rotation.fromArray(rotation)
  object.scale.setScalar(scale)

  object.userData.base = {
    position: [...position],
    rotation: [...rotation],
    scale,
  }
}

/**
 * Four lights, no more: key, fill, rim, and a hemisphere ambient.
 * Sculptural modelling comes from the key/rim pair; fill only keeps the shadow
 * side from going fully black.
 */
function createLighting(config) {
  const key = new THREE.DirectionalLight(config.key.color, config.key.intensity)
  key.position.fromArray(config.key.position)
  key.castShadow = config.key.castShadow

  if (key.castShadow) {
    const { shadow } = config.key
    key.shadow.mapSize.set(shadow.mapSize, shadow.mapSize)
    key.shadow.camera.near = shadow.near
    key.shadow.camera.far = shadow.far
    // Tight ortho frustum around the composition keeps shadow texels dense.
    key.shadow.camera.left = -shadow.extent
    key.shadow.camera.right = shadow.extent
    key.shadow.camera.top = shadow.extent
    key.shadow.camera.bottom = -shadow.extent
    key.shadow.bias = shadow.bias
    key.shadow.normalBias = shadow.normalBias
    key.shadow.radius = shadow.radius
  }

  const fill = new THREE.DirectionalLight(config.fill.color, config.fill.intensity)
  fill.position.fromArray(config.fill.position)

  const rim = new THREE.DirectionalLight(config.rim.color, config.rim.intensity)
  rim.position.fromArray(config.rim.position)

  const ambient = new THREE.HemisphereLight(
    config.ambient.skyColor,
    config.ambient.groundColor,
    config.ambient.intensity,
  )

  return [key, fill, rim, ambient]
}
