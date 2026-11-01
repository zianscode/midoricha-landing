import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { makeRng } from '~/three/core/random'
import { createBambooTexture } from '~/three/textures'

export function createChasen({ seed = 4, detail = 'high' as 'high' | 'low' } = {}) {
  const rand = makeRng(seed)
  const group = new THREE.Group()
  const tex = createBambooTexture('pale', seed)

  const handleMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55 })
  const tineMat = new THREE.MeshStandardMaterial({ map: tex, color: '#fbf3df', roughness: 0.6 })

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.124, 0.78, 40, 1), handleMat)
  handle.position.y = 0.39
  handle.castShadow = true
  handle.receiveShadow = true

  const node = new THREE.Mesh(new THREE.TorusGeometry(0.122, 0.007, 8, 48), handleMat)
  node.rotation.x = Math.PI / 2
  node.position.y = 0.48

  const outerCount = detail === 'high' ? 84 : 56
  const tines: THREE.BufferGeometry[] = []
  const profile: [number, number][] = [
    [0.105, 0.74], [0.13, 0.95], [0.21, 1.22], [0.3, 1.48], [0.335, 1.66], [0.3, 1.78], [0.235, 1.81]
  ]
  for (let i = 0; i < outerCount; i++) {
    const a = (i / outerCount) * Math.PI * 2 + (rand() - 0.5) * 0.02
    const spread = 1 + (rand() - 0.5) * 0.07
    const pts = profile.map(([r, y], k) => {
      const ang = a + y * 0.03
      const rr = k === 0 ? r : r * spread
      return new THREE.Vector3(Math.cos(ang) * rr, y + (k > 3 ? (rand() - 0.5) * 0.03 : 0), Math.sin(ang) * rr)
    })
    tines.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.0075, 3, false))
  }

  const innerCount = detail === 'high' ? 26 : 16
  for (let i = 0; i < innerCount; i++) {
    const a = (i / innerCount) * Math.PI * 2
    const pts = [
      [0.05, 0.74], [0.065, 1.05], [0.09, 1.38], [0.1, 1.56]
    ].map(([r, y]) => new THREE.Vector3(Math.cos(a) * r!, y! + rand() * 0.03, Math.sin(a) * r!))
    tines.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, 0.0062, 3, false))
  }

  const merged = mergeGeometries(tines)!
  tines.forEach((g) => g.dispose())
  const tineMesh = new THREE.Mesh(merged, tineMat)
  tineMesh.castShadow = true
  tineMesh.receiveShadow = true

  const thread = new THREE.Mesh(
    new THREE.TorusGeometry(0.142, 0.011, 6, 72),
    new THREE.MeshStandardMaterial({ color: '#1e1c18', roughness: 0.85 })
  )
  thread.rotation.x = Math.PI / 2
  thread.position.y = 0.9

  group.add(handle, node, tineMesh, thread)
  return group
}
