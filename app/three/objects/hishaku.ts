import * as THREE from 'three'
import { createBambooTexture } from '~/three/textures'

const OUTER_RADIUS = 0.17
const INNER_RADIUS = 0.152
const CUP_HEIGHT = 0.24
const BASE_THICKNESS = 0.035
const HANDLE_LENGTH = 2.1
const HANDLE_RISE = 0.24
const HANDLE_RADIUS = 0.022
const HANDLE_FLATTEN = 0.5
const HANDLE_WIDEN = 1.35
const HANDLE_SEGMENTS = 64
const HANDLE_SIDES = 10
const NODE_POSITION = 0.46

const BOTTOM = -CUP_HEIGHT / 2
const TOP = CUP_HEIGHT / 2
const FLOOR = BOTTOM + BASE_THICKNESS
const WATER_FULL = FLOOR + 0.13
const WATER_EMPTY = FLOOR + 0.004

function createCupGeometry() {
  const profile: [number, number][] = [
    [0, BOTTOM],
    [OUTER_RADIUS - 0.006, BOTTOM],
    [OUTER_RADIUS, BOTTOM + 0.006],
    [OUTER_RADIUS, TOP - 0.006],
    [OUTER_RADIUS - 0.004, TOP],
    [INNER_RADIUS + 0.004, TOP],
    [INNER_RADIUS, TOP - 0.006],
    [INNER_RADIUS, FLOOR],
    [0, FLOOR]
  ]
  return new THREE.LatheGeometry(
    profile.map(([x, y]) => new THREE.Vector2(x, y)),
    48
  )
}

function createHandleGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(INNER_RADIUS, 0.02, 0),
    new THREE.Vector3(OUTER_RADIUS + HANDLE_LENGTH * 0.3, 0.02 + HANDLE_RISE * 0.42, 0),
    new THREE.Vector3(OUTER_RADIUS + HANDLE_LENGTH * 0.7, 0.02 + HANDLE_RISE * 0.82, 0),
    new THREE.Vector3(OUTER_RADIUS + HANDLE_LENGTH, 0.02 + HANDLE_RISE, 0)
  ])
  const geometry = new THREE.TubeGeometry(curve, HANDLE_SEGMENTS, HANDLE_RADIUS, HANDLE_SIDES, false)
  const position = geometry.attributes.position as THREE.BufferAttribute
  const center = new THREE.Vector3()
  const vertex = new THREE.Vector3()

  for (let i = 0; i <= HANDLE_SEGMENTS; i++) {
    const t = i / HANDLE_SEGMENTS
    curve.getPointAt(t, center)
    const node = 1 + 0.18 * Math.exp(-Math.pow((t - NODE_POSITION) / 0.012, 2))
    const taper = 0.85 + 0.15 * t
    for (let k = 0; k <= HANDLE_SIDES; k++) {
      const index = i * (HANDLE_SIDES + 1) + k
      vertex.fromBufferAttribute(position, index).sub(center)
      vertex.y *= HANDLE_FLATTEN * node * taper
      vertex.z *= HANDLE_WIDEN * node * taper
      vertex.add(center)
      position.setXYZ(index, vertex.x, vertex.y, vertex.z)
    }
  }
  geometry.computeVertexNormals()
  return geometry
}

export function createHishaku() {
  const bambooMap = createBambooTexture('pale', 17)
  bambooMap.repeat.set(2, 0.6)
  const bamboo = new THREE.MeshStandardMaterial({ map: bambooMap, roughness: 0.48, side: THREE.DoubleSide })
  const handleMaterial = new THREE.MeshStandardMaterial({ map: createBambooTexture('pale', 23), roughness: 0.42 })
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: '#b39a68', roughness: 0.5 })

  const cup = new THREE.Mesh(createCupGeometry(), bamboo)
  const node = new THREE.Mesh(new THREE.TorusGeometry(OUTER_RADIUS + 0.002, 0.006, 8, 48), nodeMaterial)
  node.rotation.x = Math.PI / 2
  node.position.y = BOTTOM + 0.028

  const handle = new THREE.Mesh(createHandleGeometry(), handleMaterial)
  const peg = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.045), nodeMaterial)
  peg.position.set(OUTER_RADIUS + 0.012, 0.02, 0)

  const water = new THREE.Mesh(
    new THREE.CircleGeometry(INNER_RADIUS, 40),
    new THREE.MeshPhysicalMaterial({
      color: '#c9d8d0',
      roughness: 0.04,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.72
    })
  )
  water.rotation.x = -Math.PI / 2
  water.position.y = WATER_FULL

  const lip = new THREE.Object3D()
  lip.position.set(-OUTER_RADIUS, TOP, 0)

  const group = new THREE.Group()
  group.add(cup, node, handle, peg, water, lip)
  for (const mesh of [cup, handle, peg]) {
    mesh.castShadow = true
    mesh.receiveShadow = true
  }

  function setWaterLevel(fraction: number) {
    water.position.y = THREE.MathUtils.lerp(WATER_EMPTY, WATER_FULL, fraction)
    water.visible = fraction > 0.02
  }

  return { group, lip, setWaterLevel }
}
