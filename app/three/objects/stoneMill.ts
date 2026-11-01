import * as THREE from 'three'
import { finishGeometry } from '~/three/core/geometry'
import { smoothstep } from '~/three/core/math'
import { noise2 } from '~/three/core/noise'
import { makeRng } from '~/three/core/random'
import { createPowderMaterial } from '~/three/objects/matchaPowder'
import { createBambooTexture } from '~/three/textures/bamboo'
import { createGraniteTextures } from '~/three/textures/granite'
import { createLeafTextures } from '~/three/textures/leaf'

function lathe(points: [number, number][], segments = 96) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments)
}

function dress(geometry: THREE.BufferGeometry, amount: number, seed: number) {
  const pos = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const theta = Math.atan2(z, x)
    const f = 1 + amount * (noise2(Math.cos(theta) * 3 + seed, pos.getY(i) * 4) - 0.5)
    pos.setX(i, x * f)
    pos.setZ(i, z * f)
  }
  return finishGeometry(geometry)
}

export function createStoneMill({ detail = 'high' as 'high' | 'low' } = {}) {
  const rand = makeRng(17)
  const group = new THREE.Group()
  const granite = createGraniteTextures()
  granite.map.repeat.set(2, 1)
  granite.bump.repeat.set(2, 1)
  const stone = new THREE.MeshStandardMaterial({
    map: granite.map,
    bumpMap: granite.bump,
    bumpScale: 0.9,
    roughness: 0.82
  })

  const tray = new THREE.Mesh(
    dress(lathe([
      [0, 0], [1.5, 0], [1.6, 0.03], [1.64, 0.16], [1.6, 0.21], [1.55, 0.2], [1.52, 0.12], [1.42, 0.085], [0, 0.085]
    ]), 0.01, 2),
    stone
  )

  const lower = new THREE.Mesh(
    dress(lathe([
      [0, 0.085], [0.94, 0.085], [0.99, 0.12], [1.0, 0.6], [0.98, 0.64], [0.9, 0.655], [0, 0.655]
    ]), 0.012, 5),
    stone
  )

  const upper = new THREE.Group()
  const upperStone = new THREE.Mesh(
    dress(lathe([
      [0, 0.665], [0.92, 0.665], [0.985, 0.69], [1.0, 0.74], [1.0, 1.25], [0.975, 1.31], [0.9, 1.33],
      [0.24, 1.33], [0.19, 1.3], [0.11, 1.17], [0, 1.15]
    ]), 0.012, 9),
    stone
  )
  const groove = new THREE.Mesh(
    new THREE.TorusGeometry(1.002, 0.012, 6, 96),
    new THREE.MeshStandardMaterial({ color: '#4a4842', roughness: 0.9 })
  )
  groove.rotation.x = Math.PI / 2
  groove.position.y = 1.0

  const wood = new THREE.MeshStandardMaterial({ map: createBambooTexture('aged', 8), color: '#6f5642', roughness: 0.7 })
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.42, 16), wood)
  arm.rotation.z = Math.PI / 2
  arm.position.set(1.18, 0.98, 0)
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.062, 0.62, 16), wood)
  grip.position.set(1.36, 1.26, 0)
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), wood)
  cap.position.set(1.36, 1.57, 0)
  upper.add(upperStone, groove, arm, grip, cap)

  for (const m of [tray, lower, upperStone, arm, grip]) {
    m.castShadow = true
    m.receiveShadow = true
  }

  const ringPts: [number, number][] = []
  const steps = 24
  for (let i = steps; i >= 0; i--) {
    const t = i / steps
    const r = 1.02 + t * 0.48
    ringPts.push([r, 0.17 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.7)), 1.2)])
  }
  const ringGeo = lathe(ringPts, 128)
  const rp = ringGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < rp.count; i++) {
    const x = rp.getX(i)
    const z = rp.getZ(i)
    const y = rp.getY(i)
    rp.setY(i, y * (0.6 + 0.8 * noise2(x * 2.4 + 4, z * 2.4)))
  }
  finishGeometry(ringGeo)
  const powderMat = createPowderMaterial(31, 6)
  const powderRing = new THREE.Mesh(ringGeo, powderMat)
  powderRing.position.y = 0.083
  powderRing.receiveShadow = true
  powderRing.scale.y = 0.001

  const flakeCount = detail === 'high' ? 54 : 32
  const leafTex = createLeafTextures(23)
  const flakeGeo = new THREE.PlaneGeometry(0.065, 0.045, 2, 2)
  const fp = flakeGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < fp.count; i++) fp.setZ(i, Math.pow(fp.getX(i) * 10, 2) * 0.004)
  finishGeometry(flakeGeo)
  const flakes = new THREE.InstancedMesh(
    flakeGeo,
    new THREE.MeshStandardMaterial({ map: leafTex.map, color: '#e4f0bf', roughness: 0.85, side: THREE.DoubleSide }),
    flakeCount
  )
  flakes.castShadow = true
  flakes.frustumCulled = false
  const flakeData = Array.from({ length: flakeCount }, () => ({
    phase: rand(),
    sx: (rand() - 0.5) * 1.6,
    sz: (rand() - 0.5) * 1.2,
    spin: new THREE.Vector3(rand() * 6, rand() * 6, rand() * 6)
  }))

  group.add(tray, lower, upper, powderRing, flakes)

  const dummy = new THREE.Object3D()
  return {
    group,
    upper,
    powderRing,
    update(p: number, time: number) {
      upper.rotation.y = p * Math.PI * 3 + time * 0.05
      powderRing.scale.y = Math.max(0.001, smoothstep(0.18, 0.9, p))

      const visible = smoothstep(0.02, 0.12, p) * (1 - smoothstep(0.8, 0.94, p))
      for (let i = 0; i < flakeCount; i++) {
        const d = flakeData[i]!
        const f = (d.phase + p * 2.4 + time * 0.035) % 1
        const ease = Math.pow(f, 1.6)
        dummy.position.set(
          THREE.MathUtils.lerp(d.sx, 0, ease),
          THREE.MathUtils.lerp(2.7, 1.22, f),
          THREE.MathUtils.lerp(d.sz, 0, ease)
        )
        dummy.rotation.set(d.spin.x * f, d.spin.y * f + i, d.spin.z * f)
        dummy.scale.setScalar(visible * smoothstep(0, 0.1, f) * (1 - smoothstep(0.86, 1, f)) + 1e-4)
        dummy.updateMatrix()
        flakes.setMatrixAt(i, dummy.matrix)
      }
      flakes.instanceMatrix.needsUpdate = true
    }
  }
}
