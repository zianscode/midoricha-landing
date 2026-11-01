import * as THREE from 'three'
import { finishGeometry } from '~/three/core/geometry'
import { smoothstep } from '~/three/core/math'
import { createLeafTextures } from '~/three/textures'

export interface LeafShape {
  length?: number
  width?: number
  fold?: number
  curl?: number
  twist?: number
  wave?: number
  serration?: boolean
  rows?: number
  cols?: number
  seed?: number
}

export function createLeafGeometry(o: LeafShape = {}) {
  const L = o.length ?? 1
  const W = o.width ?? 0.4
  const rows = o.rows ?? 84
  const cols = o.cols ?? 12
  const fold = o.fold ?? 0.18
  const curl = o.curl ?? -0.12
  const twist = o.twist ?? 0
  const wave = o.wave ?? 0.6
  const seed = o.seed ?? 0
  const teeth = 28

  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let r = 0; r <= rows; r++) {
    const t = r / rows
    let half = (W / 2) * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.92)), 0.82)
    half *= 1 - 0.32 * smoothstep(0.68, 1, t)
    half *= 0.6 + 0.4 * smoothstep(0, 0.28, t)
    if (o.serration !== false) {
      const saw = (t * teeth) % 1
      const fade = smoothstep(0.1, 0.22, t) * (1 - smoothstep(0.93, 1, t))
      half *= 1 - 0.03 * Math.pow(1 - saw, 1.6) * fade
    }

    const ang = twist * t
    const cosA = Math.cos(ang)
    const sinA = Math.sin(ang)

    for (let c = 0; c <= cols; c++) {
      const u = (c / cols) * 2 - 1
      const x = u * half
      const y = t * L
      let z = fold * Math.pow(Math.abs(x), 1.15) * (0.7 + 0.3 * t)
      z += curl * t * t * L
      z += wave * 0.012 * L * Math.sin(t * 19 + seed * 3.7 + (u > 0 ? 0 : 1.9)) * u * u
      positions.push(x * cosA - z * sinA, y, x * sinA + z * cosA)
      uvs.push(u * 0.5 + 0.5, t)
    }
  }

  const stride = cols + 1
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * stride + c
      const b = a + 1
      const d = a + stride
      const e = d + 1
      indices.push(a, b, d, b, e, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  return finishGeometry(geometry)
}

function tintBackFaces(material: THREE.Material) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
       if (!gl_FrontFacing) diffuseColor.rgb = diffuseColor.rgb * vec3(1.32, 1.36, 1.08) + vec3(0.025, 0.03, 0.0);`
    )
  }
  return material
}

export interface BotanicalKit {
  leaf: THREE.MeshPhysicalMaterial
  young: THREE.MeshPhysicalMaterial
  stem: THREE.MeshStandardMaterial
}

export function createBotanicalKit(seed = 7): BotanicalKit {
  const tex = createLeafTextures(seed)
  const leaf = new THREE.MeshPhysicalMaterial({
    map: tex.map,
    bumpMap: tex.bump,
    bumpScale: 1.4,
    roughness: 0.48,
    clearcoat: 0.32,
    clearcoatRoughness: 0.5,
    side: THREE.DoubleSide
  })
  tintBackFaces(leaf)

  const young = new THREE.MeshPhysicalMaterial({
    map: tex.map,
    bumpMap: tex.bump,
    bumpScale: 0.8,
    color: new THREE.Color('#d9f0a6'),
    roughness: 0.6,
    sheen: 0.7,
    sheenColor: new THREE.Color('#f2f6e2'),
    sheenRoughness: 0.45,
    side: THREE.DoubleSide
  })
  tintBackFaces(young)

  const stem = new THREE.MeshStandardMaterial({ color: '#5f6b33', roughness: 0.7 })
  return { leaf, young, stem }
}

export function createLeaf(kit: BotanicalKit, shape: LeafShape & { young?: boolean } = {}) {
  const group = new THREE.Group()
  const petiole = 0.05 * (shape.length ?? 1)
  const blade = new THREE.Mesh(createLeafGeometry(shape), shape.young ? kit.young : kit.leaf)
  blade.position.y = petiole * 0.9
  blade.castShadow = true
  blade.receiveShadow = true

  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, petiole, 6), kit.stem)
  stalk.position.y = petiole / 2
  stalk.castShadow = true

  group.add(blade, stalk)
  group.userData.blade = blade
  return group
}
