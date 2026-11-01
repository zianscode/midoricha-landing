import * as THREE from 'three'
import { damp, smoothstep } from '~/three/core/math'
import { loadHand, type Hand, type HandPose, type HandSide } from '~/three/objects/hand'

const ENTRY_OFFSET = new THREE.Vector3(0, 1.4, 4.2)
const PRESENCE_RATE = 3.2
const SIDES: HandSide[] = ['left', 'right']

interface HandTarget {
  wanted: boolean
  presence: number
  grip: THREE.Vector3
  orientation: THREE.Quaternion
  pose: HandPose
}

const basisX = new THREE.Vector3()
const basisY = new THREE.Vector3()
const basisZ = new THREE.Vector3()
const basis = new THREE.Matrix4()

function orientationFrom(fingers: THREE.Vector3, palm: THREE.Vector3, target: THREE.Quaternion) {
  basisZ.copy(fingers).negate().normalize()
  basisY.copy(palm).negate()
  basisY.addScaledVector(basisZ, -basisY.dot(basisZ)).normalize()
  basisX.crossVectors(basisY, basisZ).normalize()
  return target.setFromRotationMatrix(basis.makeBasis(basisX, basisY, basisZ))
}

export function createHandRig(scene: THREE.Scene) {
  const hands: Partial<Record<HandSide, Hand>> = {}
  const targets = Object.fromEntries(
    SIDES.map((side) => [
      side,
      { wanted: false, presence: 0, grip: new THREE.Vector3(), orientation: new THREE.Quaternion(), pose: 'relaxed' as HandPose }
    ])
  ) as Record<HandSide, HandTarget>
  const offset = new THREE.Vector3()
  let disposed = false

  Promise.all(SIDES.map((side) => loadHand(side)))
    .then((loaded) => {
      if (disposed) return
      loaded.forEach((hand, index) => {
        hand.group.visible = false
        hands[SIDES[index]!] = hand
        scene.add(hand.group)
      })
    })
    .catch((error) => console.error('[hands]', error))

  function hold(side: HandSide, grip: THREE.Vector3, fingers: THREE.Vector3, palm: THREE.Vector3, pose: HandPose) {
    const target = targets[side]
    target.wanted = true
    target.grip.copy(grip)
    orientationFrom(fingers, palm, target.orientation)
    target.pose = pose
  }

  function release(side: HandSide) {
    targets[side].wanted = false
  }

  function update(delta: number) {
    for (const side of SIDES) {
      const hand = hands[side]
      if (!hand) continue
      const target = targets[side]
      target.presence = damp(target.presence, target.wanted ? 1 : 0, PRESENCE_RATE, delta)
      hand.group.quaternion.copy(target.orientation)
      hand.setPose(target.pose)
      hand.update(delta)
      offset.copy(hand.gripOffset).applyQuaternion(target.orientation)
      hand.group.position.copy(target.grip).sub(offset).addScaledVector(ENTRY_OFFSET, 1 - smoothstep(0, 1, target.presence))
      hand.group.visible = target.presence > 0.01
    }
  }

  function dispose() {
    disposed = true
  }

  return { hold, release, update, dispose }
}
