import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createDigit } from './digit.js'
import { createPalm } from './palm.js'
import { createSeededRandom } from './loft.js'
import { HAND_CONFIG } from '../handConfig.js'

/**
 * Assemble a complete Renaissance hand.
 *
 * Parts are built in hand space, posed, then merged into a single buffer — the
 * pose is fixed art direction, so the whole sculpture costs one draw call.
 * Parts interpenetrate at the joints rather than forming a watertight manifold:
 * stitching a continuous surface across knuckles buys nothing at this scale and
 * costs a great deal of complexity, and the brief is explicit that silhouette
 * outranks anatomical perfection.
 *
 * The returned Group's own transform is left untouched for composition and
 * scroll animation; the presentation rotation lives on the mesh inside it.
 *
 * @param {THREE.Material} material
 * @param {object} [options]
 * @param {boolean} [options.mirror] - build a left hand (Phase 3)
 * @returns {THREE.Group}
 */
export function createHand(material, options = {}) {
  const { mirror = false } = options
  const config = HAND_CONFIG

  // One RNG for the whole hand so irregularity is deterministic but not
  // repeated identically part to part.
  const random = createSeededRandom(config.irregularity.seed)
  const irregularity = { jitter: config.irregularity.jitter, random }

  const parts = [createPalm(config.palm, irregularity)]

  for (const finger of Object.values(config.fingers)) {
    parts.push(
      createDigit({
        ...finger,
        detail: finger.detail ?? config.detail,
        irregularity,
      }),
    )
  }

  parts.push(
    createDigit({
      ...config.thumb,
      detail: config.detail,
      irregularity,
    }),
  )

  const geometry = mergeGeometries(parts, false)
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()

  // Merged copies are redundant once baked.
  parts.forEach((part) => part.dispose())

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.rotation.fromArray(config.presentation.rotation)

  if (mirror) {
    // Reflect across the thumb-side axis to produce the opposing hand.
    mesh.scale.z = -1
  }

  const group = new THREE.Group()
  group.add(mesh)

  return group
}
