import * as THREE from 'three'
import { HERO_CONFIG } from './config.js'

/**
 * Material library for the hero.
 *
 * Materials are created once and shared across every mesh in the scene — the
 * hands are built from many small meshes, and sharing one material keeps the
 * renderer to a single compiled shader program for the whole sculpture.
 */
export function createMaterials() {
  const { stone } = HERO_CONFIG.material

  /**
   * The marble/stone treatment. Restrained monochrome — the facets and the
   * lighting do the work, not the colour.
   */
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(stone.color),
    roughness: stone.roughness,
    metalness: stone.metalness,
    flatShading: stone.flatShading,
  })
  stoneMaterial.name = 'stone'

  return { stone: stoneMaterial }
}
