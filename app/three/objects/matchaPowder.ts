import * as THREE from 'three'
import { finishGeometry } from '~/three/core/geometry'
import { noise2 } from '~/three/core/noise'
import { makeRng } from '~/three/core/random'
import { createPowderTextures } from '~/three/textures/matcha'

export function createPowderMaterial(seed = 13, repeat = 3) {
  const tex = createPowderTextures(seed)
  tex.map.repeat.set(repeat, repeat)
  tex.bump.repeat.set(repeat, repeat)
  return new THREE.MeshStandardMaterial({
    map: tex.map,
    color: '#d6dcc2',
    bumpMap: tex.bump,
    bumpScale: 1.2,
    roughness: 1,
    metalness: 0
  })
}

export function createPowderMound({
  radius = 0.5,
  height = 0.26,
  seed = 2,
  dust = true,
  material
}: { radius?: number; height?: number; seed?: number; dust?: boolean; material?: THREE.Material } = {}) {
  const rand = makeRng(seed)
  const steps = 36
  const pts: THREE.Vector2[] = []
  for (let i = steps; i >= 0; i--) {
    const r = (i / steps) * radius
    const y = height * Math.pow(Math.max(0, 1 - Math.pow(r / radius, 1.7)), 1.25)
    pts.push(new THREE.Vector2(Math.max(r, 0.0001), y))
  }
  pts.push(new THREE.Vector2(0, height))
  const geometry = new THREE.LatheGeometry(pts, 72)
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const o = rand() * 50
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const theta = Math.atan2(z, x)
    const edge = 1 + 0.12 * (noise2(Math.cos(theta) * 2.2 + o, Math.sin(theta) * 2.2 + o) - 0.5)
    const lump = (noise2(x * 9 + o, z * 9 - o) - 0.5) * height * 0.12
    pos.setXYZ(i, x * edge, y > 0.002 ? y + lump * (y / height + 0.2) : y, z * edge)
  }
  finishGeometry(geometry)

  const mound = new THREE.Mesh(geometry, material ?? createPowderMaterial(seed + 5))
  mound.castShadow = true
  mound.receiveShadow = true

  const group = new THREE.Group()
  group.add(mound)

  if (dust) {
    const count = 900
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2
      const d = radius * (0.85 + Math.pow(rand(), 2.4) * 0.9)
      positions.set([Math.cos(a) * d, 0.004, Math.sin(a) * d], i * 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: '#6f8f35', size: 0.012, sizeAttenuation: true, transparent: true, opacity: 0.85 })
    )
    group.add(points)
  }

  return group
}
