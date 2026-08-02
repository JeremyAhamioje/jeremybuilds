import * as THREE from 'three'

/**
 * TEMPORARY — Phase 1 only. Replaced by real procedural geometry in Phase 2.
 *
 * These proxies exist purely to validate the scene shell: camera framing, light
 * placement, silhouette separation against the background, shadow behaviour and
 * the stone material's facet response. They are proportionally honest stand-ins
 * for a hand's bounding volume (~2.2 long x ~1.0 wide x ~0.4 thick) so framing
 * decisions made now still hold once real hands exist.
 *
 * HAND LOCAL SPACE CONVENTION (established here, honoured by the real geometry):
 *   +X  — the reach direction (wrist at -X, fingertips at +X)
 *   +Y  — back of the hand / knuckle side
 *   +Z  — thumb side
 */
export function createHandProxy(material) {
  const group = new THREE.Group()
  group.name = 'handProxy'

  // Palm slab — broad, slightly thicker than the fingers.
  const palm = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.98, 0.4, 2, 2, 1), material)
  palm.position.set(-0.15, 0, 0)

  // Wrist — narrower, tapering away from the palm.
  const wrist = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.62, 0.34, 1, 1, 1), material)
  wrist.position.set(-1.05, -0.02, 0)

  // Index finger stub — marks the reach direction and the future focal point.
  const index = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.22, 0.22, 3, 1, 1), material)
  index.position.set(0.9, 0.22, 0.06)

  // Remaining fingers, folded — just enough mass to read as a fist-ish volume.
  const folded = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.66, 0.36, 1, 2, 1), material)
  folded.position.set(0.62, -0.24, -0.02)

  for (const mesh of [palm, wrist, index, folded]) {
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  }

  return group
}

/**
 * TEMPORARY — Phase 1 stand-in for the floating `</>` symbol.
 * Real symbol geometry arrives with the composition phase.
 */
export function createSymbolProxy(material) {
  const group = new THREE.Group()
  group.name = 'symbolProxy'

  const marker = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), material)
  marker.castShadow = true
  group.add(marker)

  return group
}
