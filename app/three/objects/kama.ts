import * as THREE from 'three'
import { createIronTextures } from '~/three/textures/iron'

const BODY_PROFILE: [number, number][] = [
  [0, 0.02], [0.55, 0.02], [0.82, 0.12], [1.02, 0.36], [1.06, 0.55], [0.98, 0.78],
  [0.78, 0.94], [0.6, 1.0], [0.56, 1.06], [0.54, 1.06], [0.52, 0.98], [0, 0.98]
]

const LID_PROFILE: [number, number][] = [[0.6, 1.04], [0.5, 1.1], [0.3, 1.14], [0, 1.15]]

function lathe(points: [number, number][], segments = 96) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments)
}

export function createKama() {
  const iron = createIronTextures()
  iron.map.repeat.set(4, 2)
  iron.bump.repeat.set(4, 2)
  const material = new THREE.MeshStandardMaterial({
    map: iron.map,
    bumpMap: iron.bump,
    bumpScale: 1.4,
    roughness: 0.78,
    metalness: 0.45
  })

  const body = new THREE.Mesh(lathe(BODY_PROFILE), material)
  const lid = new THREE.Mesh(lathe(LID_PROFILE, 64), material)
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), material)
  knob.position.y = 1.18

  const ears = [-1, 1].map((side) => {
    const ear = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 24), material)
    ear.position.set(side * 1.0, 0.82, 0)
    ear.rotation.y = Math.PI / 2
    return ear
  })

  const group = new THREE.Group()
  group.add(body, lid, knob, ...ears)
  group.traverse((object) => {
    object.castShadow = true
    object.receiveShadow = true
  })

  return { group, mouth: new THREE.Vector3(0, 1.18, 0) }
}
