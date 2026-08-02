/**
 * Three.js resource disposal helpers.
 *
 * Three does not garbage-collect GPU resources when an object leaves the scene
 * graph — geometries, materials and textures must be released explicitly or the
 * WebGL context leaks across hot-reloads and React StrictMode double-mounts.
 */

function disposeMaterial(material) {
  // Any texture-ish property on a material holds a GPU resource.
  for (const value of Object.values(material)) {
    if (value && value.isTexture) value.dispose()
  }
  material.dispose()
}

/**
 * Recursively dispose every geometry and material under `root`.
 * Safe to call on a scene, a group, or a single mesh.
 */
export function disposeObject3D(root) {
  root.traverse((object) => {
    if (object.geometry) object.geometry.dispose()

    const { material } = object
    if (!material) return

    if (Array.isArray(material)) material.forEach(disposeMaterial)
    else disposeMaterial(material)
  })
}
