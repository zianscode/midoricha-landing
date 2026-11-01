import type * as THREE from 'three'
import { collectTextures, texturesPainted } from '~/three/textures'

export const nextFrame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve))

function compileScene(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
  if (renderer.extensions.has('KHR_parallel_shader_compile')) return renderer.compileAsync(scene, camera)
  renderer.compile(scene, camera)
  return Promise.resolve()
}

export async function prepareScene(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  alive: () => boolean = () => true
) {
  const textures = collectTextures(scene)
  await texturesPainted(textures)
  for (const texture of textures) {
    if (!alive()) return false
    renderer.initTexture(texture)
    await nextFrame()
  }
  if (!alive()) return false
  await compileScene(renderer, scene, camera)
  return alive()
}
