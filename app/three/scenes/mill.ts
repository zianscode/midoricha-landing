import * as THREE from 'three'
import { addShadowFloor, addStudioLights, createContactShadow } from '~/three/core/lighting'
import { smoothstep } from '~/three/core/math'
import type { Stage, StageOptions } from '~/three/core/Stage'
import { createChawan } from '~/three/objects/chawan'
import { createPowderMound } from '~/three/objects/matchaPowder'
import { createParticles } from '~/three/objects/particles'
import { createStoneMill } from '~/three/objects/stoneMill'
import { createRadialAlpha } from '~/three/textures/masks'

export const options: StageOptions = { fov: 26, shadows: true, environment: 0.4, exposure: 1.02, progressDamping: 4 }

export default function mill(stage: Stage) {
  const { scene, camera, quality } = stage
  addStudioLights(stage, { key: 2.6, ambient: 0.55, rim: 1.3, shadowArea: 4, keyPosition: [-5, 8.5, 4] })
  addShadowFloor(stage, 0.2)
  const blob = createRadialAlpha()

  const world = new THREE.Group()
  scene.add(world)

  const mill = createStoneMill({ detail: quality })
  mill.group.position.set(-0.55, 0, 0)
  mill.group.add(createContactShadow(1.95, 0.5, blob))
  world.add(mill.group)

  const bowl = createChawan({ glaze: 'ash', seed: 11 })
  bowl.group.scale.setScalar(0.62)
  bowl.group.position.set(1.95, 0, 1.15)
  bowl.group.add(createContactShadow(1.2, 0.45, blob))
  world.add(bowl.group)

  const mound = createPowderMound({ radius: 0.58, height: 1.05, seed: 8, dust: false })
  mound.position.y = 0.21
  mound.scale.setScalar(0.001)
  bowl.group.add(mound)

  const dust = createParticles({
    count: quality === 'high' ? 120 : 60,
    box: new THREE.Vector3(3.6, 1.2, 3.6),
    color: '#86a43f',
    size: 26,
    opacity: 0
  })
  dust.points.position.set(-0.55, 0.6, 0)
  world.add(dust.points)

  stage.onFrame(({ time, progress, pointer }) => {
    const aspect = stage.width / stage.height
    const dist = 10.5 / Math.min(1, Math.pow(aspect, 0.9))
    const angle = 0.18 + pointer.x * 0.04 - progress * 0.12
    camera.position.set(Math.sin(angle) * dist, 4.3 - progress * 0.6, Math.cos(angle) * dist)
    camera.lookAt(0.35, 0.75, 0.2)

    mill.update(progress, time)
    const fill = smoothstep(0.45, 1, progress)
    mound.scale.set(fill + 0.001, Math.pow(fill, 1.3) + 0.001, fill + 0.001)
    dust.material.uniforms.uOpacity!.value = smoothstep(0.15, 0.6, progress) * 0.5
    dust.update(time)
  })
}
