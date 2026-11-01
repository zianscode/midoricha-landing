import * as THREE from 'three'
import { orientAlong } from '~/three/core/geometry'
import { fbm2 } from '~/three/core/noise'
import { makeRng } from '~/three/core/random'
import { createLeafGeometry } from '~/three/objects/matchaLeaf'
import { createFoliageTexture, createLeafTextures, createNetAlpha } from '~/three/textures'

export interface FieldOptions {
  rows?: number
  spacing?: number
  length?: number
  leaves?: number
}

export function createTeaField(o: FieldOptions = {}) {
  const rows = o.rows ?? 15
  const spacing = o.spacing ?? 1.5
  const length = o.length ?? 46
  const leafCount = o.leaves ?? 9000
  const rand = makeRng(5)
  const group = new THREE.Group()

  const radiusX = 0.56
  const radiusY = 0.62
  const segL = 90
  const segT = 18

  const pathX = (row: number, z: number) => (row - (rows - 1) / 2) * spacing + Math.sin(z * 0.11 + 0.6) * 1.1

  function hedgeGeometry(row: number, inflate = 1) {
    const positions: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    for (let i = 0; i <= segL; i++) {
      const z = 8 - (i / segL) * length
      const cx = pathX(row, z)
      for (let j = 0; j <= segT; j++) {
        const th = -Math.PI / 2 + (j / segT) * Math.PI
        const bump = 1 + 0.06 * (fbm2(z * 0.6 + row * 10, j * 0.4) - 0.5)
        positions.push(
          cx + Math.sin(th) * radiusX * inflate * bump,
          Math.max(0, Math.cos(th) * radiusY * inflate * bump + 0.08),
          z
        )
        uvs.push((j / segT) * 1.4, (i / segL) * length * 0.7)
      }
    }
    const stride = segT + 1
    for (let i = 0; i < segL; i++) {
      for (let j = 0; j < segT; j++) {
        const a = i * stride + j
        indices.push(a, a + 1, a + stride, a + 1, a + stride + 1, a + stride)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    g.setIndex(indices)
    g.computeVertexNormals()
    return g
  }

  const foliage = new THREE.MeshStandardMaterial({ map: createFoliageTexture(), roughness: 0.9, side: THREE.DoubleSide })
  const net = createNetAlpha()
  net.repeat.set(10, 70)
  const netMaterial = new THREE.MeshStandardMaterial({
    color: '#131512',
    alphaMap: net,
    transparent: true,
    opacity: 0,
    roughness: 0.95,
    side: THREE.DoubleSide,
    depthWrite: false
  })

  const hedges = new THREE.Group()
  const nets = new THREE.Group()
  for (let r = 0; r < rows; r++) {
    const hedge = new THREE.Mesh(hedgeGeometry(r), foliage)
    hedge.receiveShadow = true
    hedge.castShadow = true
    hedges.add(hedge)
    const shade = new THREE.Mesh(hedgeGeometry(r, 1.12), netMaterial)
    shade.renderOrder = 2
    nets.add(shade)
  }

  const soil = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ color: '#4b4433', roughness: 1 })
  )
  soil.rotation.x = -Math.PI / 2
  soil.position.z = -20
  soil.receiveShadow = true

  const leafTex = createLeafTextures(41)
  const leafMaterial = new THREE.MeshStandardMaterial({
    map: leafTex.map,
    roughness: 0.5,
    side: THREE.DoubleSide
  })
  const leafGeo = createLeafGeometry({ length: 0.15, width: 0.065, rows: 6, cols: 2, serration: false, fold: 0.2, curl: -0.03 })
  const leaves = new THREE.InstancedMesh(leafGeo, leafMaterial, leafCount)
  leaves.castShadow = true
  leaves.receiveShadow = true

  const dummy = new THREE.Object3D()
  const normal = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const color = new THREE.Color()
  const deep = new THREE.Color('#355a26')
  const mid = new THREE.Color('#4f7a33')
  const fresh = new THREE.Color('#a9cc6a')
  const centre = (rows - 1) / 2
  for (let i = 0; i < leafCount; i++) {
    const row = Math.round(centre + (rand() - 0.5) * 2 * Math.pow(rand(), 0.7) * (centre + 0.49))
    const z = 7 - Math.pow(rand(), 2.2) * 24
    const th = (rand() - 0.5) * Math.PI * 0.9
    const cx = pathX(row, z)
    normal.set(Math.sin(th) / radiusX, Math.cos(th) / radiusY, 0).normalize()
    dummy.position.set(cx + Math.sin(th) * radiusX * 0.97, Math.cos(th) * radiusY * 0.97 + 0.08, z)
    const tangent = new THREE.Vector3(-normal.y, normal.x, 0).multiplyScalar(rand() > 0.5 ? 1 : -1)
    dir.copy(tangent).multiplyScalar(rand() * 0.8)
      .add(new THREE.Vector3(0, 0, rand() > 0.5 ? 1 : -1))
      .add(normal.clone().multiplyScalar(0.25 + rand() * 0.35))
      .normalize()
    orientAlong(dummy, dir, normal.clone().add(new THREE.Vector3((rand() - 0.5) * 0.6, 0.2, (rand() - 0.5) * 0.6)))
    dummy.scale.setScalar(0.75 + rand() * 0.6)
    dummy.updateMatrix()
    leaves.setMatrixAt(i, dummy.matrix)
    const top = Math.cos(th)
    const isShoot = top > 0.75 && rand() > 0.55
    color.copy(isShoot ? fresh : rand() > 0.5 ? mid : deep).offsetHSL(0, 0, (rand() - 0.5) * 0.06)
    leaves.setColorAt(i, color)
  }
  leaves.instanceMatrix.needsUpdate = true
  if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true

  const hills = new THREE.Group()
  const hillDefs = [
    { z: -34, h: 7, color: '#8ea181', seed: 1 },
    { z: -48, h: 11, color: '#a8b49c', seed: 2 }
  ]
  for (const def of hillDefs) {
    const geo = new THREE.PlaneGeometry(200, def.h * 2, 160, 1)
    const p = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < p.count; i++) {
      if (p.getY(i) > 0) p.setY(i, def.h * (0.35 + fbm2(p.getX(i) * 0.03 + def.seed * 9, def.seed) * 0.9))
      else p.setY(i, -2)
    }
    const hill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: def.color }))
    hill.position.z = def.z
    hills.add(hill)
  }

  group.add(soil, hedges, leaves, nets, hills)

  return { group, leafMaterial, foliage, netMaterial, pathX }
}
