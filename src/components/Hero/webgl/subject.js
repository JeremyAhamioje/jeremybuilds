import * as THREE from 'three'

/**
 * THE SUBJECT SEAM — this is where the hero's visual concept plugs in.
 *
 * `scene.js` owns everything that holds regardless of what the hero depicts:
 * renderer, camera, lighting, background, sizing, render loop, disposal. This
 * file owns the part that changes with the creative direction.
 *
 * ---------------------------------------------------------------------------
 * TO IMPLEMENT A NEW DIRECTION
 * ---------------------------------------------------------------------------
 * Write a factory with this shape:
 *
 *   function createMySubject({ materials, config }) {
 *     return { subjectA: Object3D, subjectB: Object3D, focus: Object3D }
 *   }
 *
 * The returned KEYS are slot names. Each is matched against
 * `composition.slots.<name>` in config.js to get its position, rotation and
 * scale per breakpoint, and each is added to the scene as a named object.
 * Slots are free-form: use one, or five, or rename them entirely — just keep
 * config.js in step.
 *
 * Then pass it in from Hero.jsx:
 *
 *   createHeroScene(container, { createSubject: createMySubject })
 *
 * Anything reusable and subject-independent belongs in `src/lib/procedural/`
 * rather than here.
 *
 * A prior attempt at Renaissance hands is parked, intact and still importable,
 * in `src/experiments/renaissance-hands/` — see its README for what the
 * approach did and did not achieve.
 */

/**
 * Neutral stand-in so the scaffold renders and the shell stays verifiable
 * (lighting, composition, resize, scroll) before a direction is chosen.
 *
 * Intentionally plain: it is a placeholder, not a proposal.
 */
export function createPlaceholderSubject({ materials }) {
  return {
    subjectA: createMarker(materials.stone, 0.55),
    subjectB: createMarker(materials.stone, 0.55),
    focus: createMarker(materials.stone, 0.3),
  }
}

/** A faceted block — reads clearly under the key/rim pair without implying form. */
function createMarker(material, size) {
  const group = new THREE.Group()

  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(size, 0), material)
  mesh.castShadow = true
  mesh.receiveShadow = true

  group.add(mesh)
  return group
}
