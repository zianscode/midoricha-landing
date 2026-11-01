import * as THREE from 'three'
import { createContactShadow } from '~/three/core/lighting'
import type { Stage, StageOptions } from '~/three/core/Stage'
import { createChasen } from '~/three/objects/chasen'
import { createChashaku } from '~/three/objects/chashaku'
import { createChawan } from '~/three/objects/chawan'
import { createBotanicalKit, createLeaf } from '~/three/objects/matchaLeaf'
import { createPowderMound } from '~/three/objects/matchaPowder'
import { createNatsume } from '~/three/objects/natsume'
import { createParticles } from '~/three/objects/particles'
import { createSteam } from '~/three/objects/steam'
import { createRadialAlpha } from '~/three/textures'

export const options: StageOptions = { fov: 26, shadows: true, environment: 0.12, exposure: 1.0 }

export default function ritual(stage: Stage) {
  const { scene, camera, quality } = stage
  const blob = createRadialAlpha()

  scene.add(new THREE.HemisphereLight(0xc9d8c4, 0x0d241b, 0.35))

  const key = new THREE.SpotLight(0xffeedb, 70, 0, 0.42, 0.85, 1.4)
  key.position.set(-3.2, 9, 2.6)
  key.target.position.set(0.1, 0, 0)
  key.castShadow = true
  key.shadow.mapSize.setScalar(stage.shadowMapSize())
  key.shadow.radius = 8
  key.shadow.blurSamples = 16
  key.shadow.bias = -0.0004
  key.shadow.camera.near = 3
  key.shadow.camera.far = 20
  const rim = new THREE.DirectionalLight(0xbfd6ff, 0.9)
  rim.position.set(3, 2.5, -6)
  scene.add(key, key.target, rim)

  const table = new THREE.Mesh(
    new THREE.CircleGeometry(4, 64),
    new THREE.MeshStandardMaterial({ color: '#21402f', roughness: 0.92, transparent: true, alphaMap: createRadialAlpha(0, 0.62) })
  )
  table.rotation.x = -Math.PI / 2
  table.receiveShadow = true
  scene.add(table)

  const world = new THREE.Group()
  scene.add(world)

  const bowl = createChawan({ glaze: 'ash', fill: 'foam', seed: 8 })
  bowl.group.add(createContactShadow(1.2, 0.6, blob))
  world.add(bowl.group)

  const chasen = createChasen({ detail: quality, seed: 9 })
  chasen.position.set(-1.85, 0, -0.55)
  chasen.add(createContactShadow(0.45, 0.6, blob))
  world.add(chasen)

  const natsume = createNatsume()
  natsume.group.add(createContactShadow(0.6, 0.6, blob))
  natsume.group.position.set(1.75, 0, -0.85)
  world.add(natsume.group)

  const scoop = createChashaku()
  scoop.rotation.y = 2.5
  scoop.position.set(1.55, 0, 0.95)
  scoop.scale.setScalar(0.85)
  world.add(scoop)
  const pinch = createPowderMound({ radius: 0.09, height: 0.05, seed: 3, dust: false })
  pinch.position.set(1.55 + Math.cos(2.5) * 0.74, 0.1, 0.95 - Math.sin(2.5) * 0.74)
  world.add(pinch)

  const kit = createBotanicalKit(19)
  const leafSpots: [number, number, number, number][] = [
    [-0.75, 1.55, 0.7, 0.4],
    [-1.25, 1.2, 0.55, 2.1],
    [0.95, 1.5, 0.6, -0.6]
  ]
  leafSpots.forEach(([x, z, size, rot], i) => {
    const leaf = createLeaf(kit, { length: size, width: size * 0.42, fold: 0.15, curl: 0.05, seed: i })
    leaf.rotation.set(-Math.PI / 2, 0, 0)
    leaf.rotateZ(rot)
    leaf.position.set(x, 0.02, z)
    world.add(leaf)
  })

  const steams = [0, 1].map((i) => {
    const s = createSteam({ width: 1.5, height: 2.8, opacity: 0.32, seed: i * 3.7 })
    s.mesh.position.set(i === 0 ? -0.1 : 0.15, 0.78, i === 0 ? 0 : 0.1)
    world.add(s.mesh)
    return s
  })

  const particles = createParticles({
    count: quality === 'high' ? 140 : 70,
    box: new THREE.Vector3(6, 3, 4),
    color: '#c4d9a0',
    size: 30,
    opacity: 0.4,
    speed: 0.6
  })
  particles.points.position.y = 1.5
  world.add(particles.points)

  stage.onFrame(({ time, pointer }) => {
    const aspect = stage.width / stage.height
    const dist = 12.5 / Math.min(1, Math.pow(aspect, 1.15))
    const orbit = Math.sin(time * 0.05) * 0.05 + pointer.x * 0.05
    camera.position.set(Math.sin(orbit) * dist * 0.55, dist * 0.8 - pointer.y * 0.2, Math.cos(orbit) * dist * 0.55)
    camera.lookAt(0, 0.2, 0.15)
    bowl.group.rotation.y = Math.sin(time * 0.08) * 0.08
    steams.forEach((s) => s.update(time, camera))
    particles.update(time)
  })
}
