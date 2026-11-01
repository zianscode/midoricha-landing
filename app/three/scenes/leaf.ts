import * as THREE from 'three'
import { addStudioLights } from '~/three/core/lighting'
import type { Stage, StageOptions } from '~/three/core/Stage'
import { createBotanicalKit } from '~/three/objects/matchaLeaf'
import { createTeaBranch } from '~/three/objects/teaBranch'

export const options: StageOptions = { fov: 26, environment: 0.45, exposure: 1.05 }

export default function leaf(stage: Stage) {
  const { scene, camera } = stage
  addStudioLights(stage, { key: 2.6, rim: 1.6, ambient: 0.65, keyPosition: [-4, 6, 6] })

  const kit = createBotanicalKit(9)
  const branch = createTeaBranch(kit, { seed: 12, length: 2.3, leaves: 5, leafScale: 0.95 })
  const pivot = new THREE.Group()
  branch.position.y = -1.25
  pivot.add(branch)
  scene.add(pivot)

  const leaves = branch.userData.leaves as THREE.Object3D[]
  const rest = leaves.map((l) => l.quaternion.clone())
  const sway = new THREE.Quaternion()
  const axis = new THREE.Vector3(1, 0, 0)

  stage.onFrame(({ time, pointer }) => {
    const aspect = stage.width / stage.height
    camera.position.set(0, 0.25, 7.6 / Math.min(1, aspect * 1.45))
    camera.lookAt(0, 0.05, 0)

    pivot.rotation.y = Math.sin(time * 0.16) * 0.45 + pointer.x * 0.35
    pivot.rotation.x = pointer.y * 0.06
    pivot.rotation.z = -0.12
    leaves.forEach((l, i) => {
      sway.setFromAxisAngle(axis, Math.sin(time * 0.7 + i * 1.3) * 0.025)
      l.quaternion.copy(rest[i]!).multiply(sway)
    })
  })
}
