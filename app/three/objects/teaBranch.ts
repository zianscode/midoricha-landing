import * as THREE from 'three'
import { orientAlong } from '~/three/core/geometry'
import { makeRng } from '~/three/core/random'
import { type BotanicalKit, createLeaf } from '~/three/objects/matchaLeaf'

export interface BranchOptions {
  seed?: number
  length?: number
  leaves?: number
  flat?: boolean
  leafScale?: number
}

export function createTeaBranch(kit: BotanicalKit, o: BranchOptions = {}) {
  const rand = makeRng(o.seed ?? 1)
  const L = o.length ?? 1.6
  const count = o.leaves ?? 5
  const scale = o.leafScale ?? 1
  const flat = !!o.flat
  const group = new THREE.Group()

  const j = () => (rand() - 0.5) * 0.06 * L
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.03 * L + j(), L * 0.3, flat ? 0 : j()),
    new THREE.Vector3(-0.025 * L + j(), L * 0.6, flat ? 0 : j()),
    new THREE.Vector3(0.015 * L + j(), L * 0.84, flat ? 0 : j()),
    new THREE.Vector3(0, L, 0)
  ])

  const tubular = 48
  const radial = 6
  const stemGeo = new THREE.TubeGeometry(curve, tubular, 0.016 * Math.max(1, L * 0.6), radial, false)
  const pos = stemGeo.attributes.position as THREE.BufferAttribute
  const p = new THREE.Vector3()
  const c = new THREE.Vector3()
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular
    curve.getPointAt(t, c)
    const taper = 1 - 0.55 * t
    for (let k = 0; k <= radial; k++) {
      const idx = i * (radial + 1) + k
      p.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(taper).add(c)
      pos.setXYZ(idx, p.x, p.y, p.z)
    }
  }
  stemGeo.computeVertexNormals()
  const stem = new THREE.Mesh(stemGeo, kit.stem)
  stem.castShadow = true
  group.add(stem)

  const up = new THREE.Vector3(0, 1, 0)
  const faceZ = new THREE.Vector3(0, 0, 1)
  const leaves: THREE.Object3D[] = []

  const place = (t: number, phi: number, size: number, young: boolean, angle: number) => {
    const at = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)
    let out: THREE.Vector3
    if (flat) out = new THREE.Vector3(Math.sign(Math.cos(phi)) || 1, 0, 0)
    else out = new THREE.Vector3(Math.cos(phi), 0, Math.sin(phi))
    out.sub(tangent.clone().multiplyScalar(out.dot(tangent))).normalize()
    const dir = tangent.clone().multiplyScalar(angle).add(out).normalize()
    const hint = flat ? faceZ : tangent.clone().add(up.clone().multiplyScalar(0.4))

    const leaf = createLeaf(kit, {
      length: size,
      width: size * (young ? 0.36 : 0.42),
      fold: young ? 0.75 : 0.16 + rand() * 0.1,
      curl: flat ? 0.05 + rand() * 0.05 : -(0.1 + rand() * 0.12),
      twist: (rand() - 0.5) * 0.35,
      seed: rand() * 10,
      young
    })
    leaf.position.copy(at)
    orientAlong(leaf, dir, hint)
    if (!flat) leaf.rotateY((rand() - 0.5) * 0.4)
    leaf.userData.phase = rand() * Math.PI * 2
    group.add(leaf)
    leaves.push(leaf)
  }

  const bud = createLeaf(kit, { length: 0.3 * scale, width: 0.08 * scale, fold: 2.4, curl: 0.04, young: true })
  bud.position.copy(curve.getPointAt(1))
  orientAlong(bud, curve.getTangentAt(1), flat ? faceZ : new THREE.Vector3(0, 0, 1))
  group.add(bud)
  leaves.push(bud)

  place(0.95, 0.4, 0.5 * scale, true, 1.4)
  place(0.88, 0.4 + Math.PI, 0.62 * scale, true, 1.1)

  for (let i = 0; i < count; i++) {
    const t = 0.76 - i * (0.66 / Math.max(1, count))
    const phi = 0.4 + (i + 2) * 2.4
    const size = (0.9 + i * 0.07 + rand() * 0.1) * scale
    place(t, phi, size, false, 0.6)
  }

  group.userData.leaves = leaves
  return group
}
