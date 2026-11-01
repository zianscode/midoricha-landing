import * as THREE from 'three'
import { finishGeometry } from '~/three/core/geometry'
import { smoothstep } from '~/three/core/math'
import { makeRng } from '~/three/core/random'
import { createCeramicTextures, createFoamTextures } from '~/three/textures'
import type { GlazeName } from '~/three/textures/ceramic'

const PROFILE: [number, number][] = [
  [0.0, 0.035], [0.3, 0.035], [0.36, 0.012], [0.4, 0.0], [0.47, 0.0], [0.5, 0.025],
  [0.5, 0.09], [0.48, 0.13], [0.56, 0.17], [0.72, 0.27], [0.86, 0.43], [0.94, 0.64],
  [0.975, 0.86], [0.99, 1.03], [0.985, 1.085], [0.965, 1.1], [0.945, 1.082],
  [0.935, 1.02], [0.915, 0.84], [0.875, 0.63], [0.79, 0.43], [0.64, 0.29],
  [0.42, 0.215], [0.2, 0.19], [0.0, 0.185]
]

function chaikin(points: THREE.Vector2[], iterations: number) {
  let pts = points
  for (let k = 0; k < iterations; k++) {
    const next = [pts[0]!.clone()]
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i]!
      const b = pts[i + 1]!
      next.push(a.clone().lerp(b, 0.25), a.clone().lerp(b, 0.75))
    }
    next.push(pts[pts.length - 1]!.clone())
    pts = next
  }
  return pts
}

function radiusOnProfile(points: THREE.Vector2[], height: number) {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!
    const b = points[i + 1]!
    if ((a.y - height) * (b.y - height) <= 0) {
      const t = (height - a.y) / (b.y - a.y || 1)
      return a.x + (b.x - a.x) * t
    }
  }
  return 0
}

export interface ChawanOptions {
  glaze?: GlazeName
  seed?: number
  fill?: 'foam' | 'none'
  fillLevel?: number
}

export function createChawan(o: ChawanOptions = {}) {
  const seed = o.seed ?? 3
  const rand = makeRng(seed)
  const profile = chaikin(PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), 3)

  let rimIndex = 0
  profile.forEach((p, i) => {
    if (p.y > profile[rimIndex]!.y) rimIndex = i
  })
  const footIndex = profile.findIndex((p) => p.y > 0.16)
  const n = profile.length - 1

  const geometry = new THREE.LatheGeometry(profile, 112)

  const s = [rand() * 6, rand() * 6, rand() * 6, rand() * 6]
  const pos = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const theta = Math.atan2(z, x)
    const k = smoothstep(0.12, 1.1, y)
    const f = 1 + k * (0.013 * Math.sin(3 * theta + s[0]!) + 0.008 * Math.sin(5 * theta + s[1]!) + 0.004 * Math.sin(9 * theta + s[2]!))
    const lift = smoothstep(0.98, 1.1, y) * 0.02 * Math.sin(2 * theta + s[3]!)
    pos.setXYZ(i, x * f, y + lift, z * f)
  }
  finishGeometry(geometry)

  const tex = createCeramicTextures(o.glaze ?? 'charcoal', rimIndex / n, footIndex / n, seed + 40)
  const material = new THREE.MeshStandardMaterial({
    map: tex.map,
    roughnessMap: tex.roughness,
    bumpMap: tex.bump,
    bumpScale: 0.6,
    roughness: 1,
    metalness: 0
  })

  const bowl = new THREE.Mesh(geometry, material)
  bowl.castShadow = true
  bowl.receiveShadow = true

  const group = new THREE.Group()
  group.add(bowl)

  const innerRadiusAt = (h: number) => radiusOnProfile(profile.slice(rimIndex), h)
  const outerRadiusAt = (h: number) => radiusOnProfile(profile.slice(footIndex, rimIndex + 1), h)

  let surface: THREE.Mesh | null = null
  if (o.fill === 'foam') {
    const level = o.fillLevel ?? 0.74
    const foam = createFoamTextures(seed + 9)
    surface = new THREE.Mesh(
      new THREE.CircleGeometry(innerRadiusAt(level) * 1.02, 96),
      new THREE.MeshStandardMaterial({
        map: foam.map,
        bumpMap: foam.bump,
        bumpScale: 0.5,
        roughness: 0.62
      })
    )
    surface.rotation.x = -Math.PI / 2
    surface.position.y = level
    surface.receiveShadow = true
    group.add(surface)
  }

  return { group, bowl, surface, innerRadiusAt, outerRadiusAt, rimHeight: 1.1 }
}
