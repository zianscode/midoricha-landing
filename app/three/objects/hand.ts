import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { damp } from '~/three/core/math'

export type HandSide = 'left' | 'right'
export type HandPose = 'relaxed' | 'pinch' | 'grip' | 'hold'

type Flex = [number, number, number]

const MODEL_URL: Record<HandSide, string> = {
  left: '/models/hands/left.glb',
  right: '/models/hands/right.glb'
}

const METERS_TO_SCENE = 1 / 0.09
const POSE_RATE = 8
const PALM_SURFACE = 0.012
const FLEX_AXIS = new THREE.Vector3(1, 0, 0)

const FINGER_NAMES = ['index', 'middle', 'ring', 'pinky'] as const
const FINGER_JOINTS = ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip']
const THUMB_JOINTS = ['metacarpal', 'phalanx-proximal', 'phalanx-distal', 'tip']

interface PoseSpec {
  fingers: [Flex, Flex, Flex, Flex]
  thumb: Flex
  grip: 'pinch' | 'fist' | 'palm'
}

const POSES: Record<HandPose, PoseSpec> = {
  relaxed: {
    fingers: [[0.25, 0.35, 0.2], [0.3, 0.4, 0.22], [0.35, 0.45, 0.25], [0.4, 0.5, 0.28]],
    thumb: [0.1, 0.2, 0.15],
    grip: 'palm'
  },
  pinch: {
    fingers: [[0.55, 0.75, 0.45], [0.85, 1.1, 0.6], [1.15, 1.35, 0.75], [1.25, 1.4, 0.8]],
    thumb: [0.35, 0.35, 0.3],
    grip: 'pinch'
  },
  grip: {
    fingers: [[1.05, 1.35, 0.85], [1.1, 1.4, 0.85], [1.15, 1.45, 0.9], [1.2, 1.45, 0.9]],
    thumb: [0.5, 0.45, 0.35],
    grip: 'fist'
  },
  hold: {
    fingers: [[0.3, 0.3, 0.15], [0.32, 0.32, 0.16], [0.36, 0.36, 0.18], [0.42, 0.42, 0.2]],
    thumb: [0.05, 0.1, 0.05],
    grip: 'palm'
  }
}

interface Chain {
  bones: THREE.Bone[]
  restPosition: THREE.Vector3[]
  restRotation: THREE.Quaternion[]
  flex: number[]
}

function createChain(armature: THREE.Object3D, prefix: string, joints: string[]): Chain {
  const bones = joints.map((joint) => armature.getObjectByName(`${prefix}-${joint}`) as THREE.Bone)
  return {
    bones,
    restPosition: bones.map((bone) => bone.position.clone()),
    restRotation: bones.map((bone) => bone.quaternion.clone()),
    flex: bones.map(() => 0)
  }
}

const accumulated = new THREE.Quaternion()
const bend = new THREE.Quaternion()
const axis = new THREE.Vector3()
const segment = new THREE.Vector3()

function solveChain(chain: Chain) {
  accumulated.identity()
  chain.bones.forEach((bone, index) => {
    if (index > 0) {
      segment.subVectors(chain.restPosition[index]!, chain.restPosition[index - 1]!).applyQuaternion(accumulated)
      bone.position.copy(chain.bones[index - 1]!.position).add(segment)
    }
    const angle = chain.flex[index] ?? 0
    if (angle) {
      axis.copy(FLEX_AXIS).applyQuaternion(bone.quaternion.copy(accumulated).multiply(chain.restRotation[index]!))
      bend.setFromAxisAngle(axis, -angle)
      accumulated.premultiply(bend)
    }
    bone.quaternion.copy(accumulated).multiply(chain.restRotation[index]!)
  })
}

function createSleeve() {
  const sleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.54, 2.3, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: '#1d2433', roughness: 0.95, side: THREE.DoubleSide })
  )
  sleeve.rotation.x = Math.PI / 2
  sleeve.scale.set(1, 1, 0.75)
  sleeve.position.z = 0.24 + 1.15
  sleeve.castShadow = true
  return sleeve
}

function handBasis(armature: THREE.Object3D, side: HandSide) {
  const position = (name: string) => (armature.getObjectByName(name) as THREE.Bone).position.clone()
  const wrist = position('wrist')
  const forward = position('middle-finger-tip').sub(wrist).normalize()
  const towardThumb = position('index-finger-metacarpal').sub(position('pinky-finger-metacarpal')).normalize()
  const z = forward.clone().negate()
  const x = towardThumb.multiplyScalar(side === 'right' ? -1 : 1)
  const y = new THREE.Vector3().crossVectors(z, x).normalize()
  x.crossVectors(y, z).normalize()
  const rotation = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z)).invert()
  return { rotation, wrist }
}

export async function loadHand(side: HandSide) {
  const gltf = await new GLTFLoader().loadAsync(MODEL_URL[side])
  const model = gltf.scene
  const armature = model.getObjectByName('Armature') ?? model

  const skin = new THREE.MeshStandardMaterial({ color: '#d9a98a', roughness: 0.62, metalness: 0 })
  model.traverse((object) => {
    const mesh = object as THREE.SkinnedMesh
    if (!mesh.isSkinnedMesh) return
    mesh.material = skin
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.frustumCulled = false
  })

  const fingers = FINGER_NAMES.map((name) => createChain(armature, `${name}-finger`, FINGER_JOINTS))
  const thumb = createChain(armature, 'thumb', THUMB_JOINTS)

  const { rotation, wrist } = handBasis(armature, side)
  const fitted = new THREE.Group()
  fitted.add(model)
  fitted.quaternion.copy(rotation)
  fitted.scale.setScalar(METERS_TO_SCENE)
  fitted.position.copy(wrist).applyQuaternion(rotation).multiplyScalar(-METERS_TO_SCENE)

  const group = new THREE.Group()
  group.add(fitted, createSleeve())

  let pose: HandPose = 'relaxed'
  const gripOffset = new THREE.Vector3()
  const worldPoint = new THREE.Vector3()

  function localPoint(name: string, target: THREE.Vector3) {
    ;(armature.getObjectByName(name) as THREE.Bone).getWorldPosition(worldPoint)
    return target.copy(group.worldToLocal(worldPoint))
  }

  const pointA = new THREE.Vector3()
  const pointB = new THREE.Vector3()

  function measureGrip(kind: PoseSpec['grip']) {
    group.updateMatrixWorld(true)
    if (kind === 'pinch') {
      localPoint('thumb-tip', pointA)
      localPoint('index-finger-tip', pointB)
      gripOffset.addVectors(pointA, pointB).multiplyScalar(0.5)
    } else if (kind === 'fist') {
      localPoint('index-finger-phalanx-intermediate', pointA)
      localPoint('thumb-phalanx-distal', pointB)
      gripOffset.addVectors(pointA, pointB).multiplyScalar(0.5)
    } else {
      localPoint('middle-finger-metacarpal', pointA)
      localPoint('middle-finger-phalanx-proximal', pointB)
      gripOffset.addVectors(pointA, pointB).multiplyScalar(0.5)
      gripOffset.y -= PALM_SURFACE * METERS_TO_SCENE
    }
  }

  function setPose(next: HandPose) {
    pose = next
  }

  function update(delta: number) {
    const spec = POSES[pose]
    fingers.forEach((chain, fingerIndex) => {
      spec.fingers[fingerIndex]!.forEach((angle, jointIndex) => {
        chain.flex[jointIndex + 1] = damp(chain.flex[jointIndex + 1]!, angle, POSE_RATE, delta)
      })
      solveChain(chain)
    })
    spec.thumb.forEach((angle, jointIndex) => {
      thumb.flex[jointIndex] = damp(thumb.flex[jointIndex]!, angle, POSE_RATE, delta)
    })
    solveChain(thumb)
    measureGrip(spec.grip)
  }

  update(1)

  return { group, setPose, update, gripOffset }
}

export type Hand = Awaited<ReturnType<typeof loadHand>>
