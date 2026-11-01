import * as THREE from 'three'
import { addShadowFloor, addStudioLights, createContactShadow } from '~/three/core/lighting'
import type { Stage, StageOptions } from '~/three/core/Stage'
import { createChasen } from '~/three/objects/chasen'
import { createChashaku } from '~/three/objects/chashaku'
import { createChawan } from '~/three/objects/chawan'
import { createBotanicalKit, createLeaf } from '~/three/objects/matchaLeaf'
import { createPowderMound } from '~/three/objects/matchaPowder'
import { createParticles } from '~/three/objects/particles'
import { createTeaBranch } from '~/three/objects/teaBranch'
import { createRadialAlpha } from '~/three/textures/masks'

export const options: StageOptions = { fov: 24, shadows: true, environment: 0.4, exposure: 1.02 }

export default function hero(stage: Stage) {
  const { scene, camera, quality } = stage
  addStudioLights(stage, { key: 2.5, ambient: 0.6, shadowArea: 3.6, keyPosition: [-5, 8, 3.5] })
  addShadowFloor(stage, 0.2)
  const blob = createRadialAlpha()

  const world = new THREE.Group()
  scene.add(world)

  const bowl = createChawan({ glaze: 'charcoal', fill: 'foam', seed: 3 })
  bowl.group.position.set(0.35, 0, 0)
  bowl.group.add(createContactShadow(1.25, 0.45, blob))
  world.add(bowl.group)

  const chasen = createChasen({ detail: quality })
  chasen.position.set(-1.55, 0, -0.75)
  chasen.add(createContactShadow(0.45, 0.4, blob))
  world.add(chasen)

  const kit = createBotanicalKit(7)
  const branch = createTeaBranch(kit, { flat: true, seed: 4, length: 1.5, leaves: 3, leafScale: 0.85 })
  branch.rotation.set(-Math.PI / 2, 0, 0)
  branch.rotateZ(-1.1)
  branch.position.set(0.15, 0.04, 1.95)
  world.add(branch)

  const loose = createLeaf(kit, { length: 0.8, width: 0.33, fold: 0.12, curl: 0.06, seed: 2 })
  loose.rotation.set(-Math.PI / 2, 0, 0)
  loose.rotateZ(2.3)
  loose.position.set(-0.55, 0.03, -1.45)
  world.add(loose)

  const powder = createPowderMound({ radius: 0.4, height: 0.24, seed: 6 })
  powder.position.set(-1.25, 0, 0.95)
  world.add(powder)

  const scoop = createChashaku()
  scoop.rotation.y = Math.PI - 0.35
  scoop.position.set(-0.6, 0, 1.2)
  scoop.scale.setScalar(0.8)
  world.add(scoop)

  const particles = createParticles({
    count: quality === 'high' ? 160 : 80,
    box: new THREE.Vector3(4.5, 2.6, 2.6),
    color: '#7d9a52',
    size: 34,
    opacity: 0.5
  })
  particles.points.position.set(0, 1.9, 0)
  world.add(particles.points)

  const target = new THREE.Vector3(0.05, 0.45, 0.25)

  stage.onFrame(({ time, pointer }) => {
    const aspect = stage.width / stage.height
    const dist = 11.2 / Math.min(1, Math.pow(aspect, 1.1))
    const scroll = Math.min(1, window.scrollY / window.innerHeight)
    const angle = 0.45 + pointer.x * 0.06
    camera.position.set(Math.sin(angle) * dist * 0.5, 4.6 + scroll * 1.1 - pointer.y * 0.25, Math.cos(angle) * dist * 0.85)
    camera.lookAt(target.x, target.y - scroll * 0.25, target.z)

    world.rotation.y = pointer.x * 0.05
    bowl.group.rotation.y = Math.sin(time * 0.12) * 0.04
    particles.update(time)
  })
}
