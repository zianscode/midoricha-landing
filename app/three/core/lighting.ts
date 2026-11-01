import * as THREE from 'three'
import type { Stage } from '~/three/core/Stage'

export interface StudioOptions {
  key?: number
  keyColor?: THREE.ColorRepresentation
  keyPosition?: [number, number, number]
  rim?: number
  rimColor?: THREE.ColorRepresentation
  ambient?: number
  sky?: THREE.ColorRepresentation
  groundColor?: THREE.ColorRepresentation
  shadowArea?: number
  shadowRadius?: number
}

export function addStudioLights(stage: Stage, o: StudioOptions = {}) {
  const hemi = new THREE.HemisphereLight(o.sky ?? 0xfffbf2, o.groundColor ?? 0xb7b19c, o.ambient ?? 0.55)

  const key = new THREE.DirectionalLight(o.keyColor ?? 0xfff3e0, o.key ?? 2.2)
  key.position.set(...(o.keyPosition ?? [-4.5, 7.5, 4.5]))
  if (stage.renderer.shadowMap.enabled) {
    const area = o.shadowArea ?? 4
    key.castShadow = true
    key.shadow.mapSize.setScalar(stage.shadowMapSize())
    const cam = key.shadow.camera
    cam.left = -area
    cam.right = area
    cam.top = area
    cam.bottom = -area
    cam.near = 0.5
    cam.far = 30
    key.shadow.radius = o.shadowRadius ?? 7
    key.shadow.blurSamples = 16
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 0.02
  }

  const rim = new THREE.DirectionalLight(o.rimColor ?? 0xeaf1ff, o.rim ?? 1.1)
  rim.position.set(4, 3.5, -5)

  stage.scene.add(hemi, key, key.target, rim)
  return { hemi, key, rim }
}

export function addShadowFloor(stage: Stage, opacity = 0.2, size = 30) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.ShadowMaterial({ color: 0x2a2a1c, opacity })
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  stage.scene.add(floor)
  return floor
}

export function createContactShadow(radius: number, opacity: number, alphaMap: THREE.Texture) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({
      color: 0x15140d,
      transparent: true,
      opacity,
      alphaMap,
      depthWrite: false
    })
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = 0.003
  mesh.renderOrder = -1
  return mesh
}
