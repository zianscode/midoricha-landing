import * as THREE from 'three'
import { finishGeometry } from '~/three/core/geometry'
import { smoothstep } from '~/three/core/math'
import { createBambooTexture } from '~/three/textures/bamboo'

export function createChashaku() {
  const length = 1.9
  const geometry = new THREE.BoxGeometry(length, 0.018, 0.1, 96, 1, 6)
  const pos = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i)
    let y = pos.getY(i)
    let z = pos.getZ(i)
    const s = (x + length / 2) / length
    const tip = smoothstep(0.78, 1, s)
    z *= 0.85 + 0.35 * tip
    const end = smoothstep(0.96, 1, s)
    z *= 1 - end * 0.55
    y += Math.pow(Math.abs(z) / 0.06, 2) * 0.014 * tip
    y += tip * tip * 0.11
    y += 0.01 * Math.exp(-Math.pow((s - 0.48) / 0.02, 2))
    x -= end * 0.004
    pos.setXYZ(i, x, y, z)
  }
  finishGeometry(geometry)
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ map: createBambooTexture('aged', 12), roughness: 0.5 })
  )
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.position.y = 0.012
  const group = new THREE.Group()
  group.add(mesh)
  return group
}
