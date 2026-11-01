import * as THREE from 'three'
import { addShadowFloor, addStudioLights } from '~/three/core/lighting'
import type { Stage, StageOptions } from '~/three/core/Stage'
import { createBotanicalKit, createLeaf } from '~/three/objects/matchaLeaf'

export const options: StageOptions = { fov: 26, shadows: true, environment: 0.45, exposure: 1.05 }

export default function floatingLeaf(stage: Stage) {
  const { scene, camera } = stage
  addStudioLights(stage, { key: 2.4, rim: 1.4, ambient: 0.65, keyPosition: [-2, 9, 3], shadowArea: 3, shadowRadius: 14 })
  const floor = addShadowFloor(stage, 0.12)
  floor.position.y = -1.3

  const kit = createBotanicalKit(15)
  const leaf = createLeaf(kit, { length: 2.4, width: 1, fold: 0.16, curl: -0.18, twist: 0.25, seed: 5 })
  leaf.position.y = -1.2
  const holder = new THREE.Group()
  holder.add(leaf)
  scene.add(holder)

  stage.onFrame(({ time, pointer }) => {
    const aspect = stage.width / stage.height
    camera.position.set(0, 2.2, 8.2 / Math.min(1, aspect))
    camera.lookAt(0, 0, 0)
    holder.position.y = Math.sin(time * 0.5) * 0.06
    holder.rotation.set(
      0.55 + Math.sin(time * 0.31) * 0.04 + pointer.y * 0.06,
      -0.5 + Math.sin(time * 0.22) * 0.12 + pointer.x * 0.2,
      -0.9 + Math.sin(time * 0.27) * 0.03
    )
  })
}
