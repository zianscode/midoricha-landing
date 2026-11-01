import * as THREE from 'three'
import { createPowderMaterial } from '~/three/objects/matchaPowder'

const BODY_RADIUS = 0.4
const BODY_HEIGHT = 0.52
const POWDER_DEPTH = 0.06

export function createNatsume() {
  const lacquer = new THREE.MeshPhysicalMaterial({
    color: '#0d0d0b',
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    side: THREE.DoubleSide
  })

  const body = new THREE.Mesh(new THREE.CylinderGeometry(BODY_RADIUS, BODY_RADIUS - 0.03, BODY_HEIGHT, 64, 1, true), lacquer)
  body.position.y = BODY_HEIGHT / 2

  const floor = new THREE.Mesh(new THREE.CircleGeometry(BODY_RADIUS - 0.03, 64), lacquer)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0.01

  const powder = new THREE.Mesh(new THREE.CircleGeometry(BODY_RADIUS - 0.01, 64), createPowderMaterial(17, 1.5))
  powder.rotation.x = -Math.PI / 2
  powder.position.y = BODY_HEIGHT - POWDER_DEPTH

  const lid = new THREE.Mesh(new THREE.SphereGeometry(BODY_RADIUS + 0.005, 64, 16, 0, Math.PI * 2, 0, Math.PI / 2), lacquer)
  lid.scale.y = 0.42
  lid.position.y = BODY_HEIGHT

  for (const mesh of [body, lid]) mesh.castShadow = true

  const group = new THREE.Group()
  group.add(body, floor, powder, lid)

  return { group, lid, mouthHeight: BODY_HEIGHT }
}
