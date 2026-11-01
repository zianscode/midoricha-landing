import * as THREE from 'three'
import { createContactShadow } from '~/three/core/lighting'
import { clamp, damp, lerp, smoothstep } from '~/three/core/math'
import type { Stage, StageOptions } from '~/three/core/Stage'
import { createHandRig } from '~/three/brew/handRig'
import { createChasen } from '~/three/objects/chasen'
import { createChashaku } from '~/three/objects/chashaku'
import { createChawan } from '~/three/objects/chawan'
import { createHishaku } from '~/three/objects/hishaku'
import { createKama } from '~/three/objects/kama'
import { createPowderMound } from '~/three/objects/matchaPowder'
import { createNatsume } from '~/three/objects/natsume'
import { createParticles } from '~/three/objects/particles'
import { createSteam } from '~/three/objects/steam'
import { createFoamTextures, createRadialAlpha, createTatamiTextures } from '~/three/textures'
import type { BrewSceneState, BrewShot } from '~/types/brew'

export const options: StageOptions = { fov: 30, shadows: true, environment: 0.16, exposure: 1.05 }

type Vec3 = [number, number, number]

interface Shot {
  position: Vec3
  target: Vec3
}

const SHOTS: Record<BrewShot, Shot> = {
  intro: { position: [0, 6.2, 7.4], target: [0, 0.3, -0.3] },
  scoop: { position: [2.4, 4.4, 4.8], target: [1.0, 0.4, -0.3] },
  temperature: { position: [-4.6, 3.4, 3.0], target: [-2.4, 0.9, -1.4] },
  pour: { position: [-2.2, 3.8, 4.6], target: [-0.3, 0.8, -0.2] },
  whisk: { position: [0, 5.4, 2.7], target: [0, 0.4, 0] },
  serve: { position: [-0.1, 3.8, 6.4], target: [-0.1, 0.5, 0.6] },
  turn: { position: [-0.15, 2.7, 5.5], target: [-0.15, 0.55, 1.05] },
  drink: { position: [-0.15, 1.65, 4.7], target: [-0.15, 1.0, 1.5] },
  done: { position: [0, 6.2, 7.4], target: [0, 0.3, -0.3] }
}

const BOWL_FLOOR = 0.2
const BOWL_FULL = 0.68
const WATER_FOR_FULL = 80
const SCOOP_SECONDS = 2.2
const SCOOP_PICKUP = 0.3
const SCOOP_RELEASE = 0.8
const NATSUME_POSITION = new THREE.Vector3(1.75, 0, -0.95)
const KAMA_POSITION = new THREE.Vector3(-2.45, 0, -1.5)
const KAMA_SCALE = 0.85
const CHASEN_REST = new THREE.Vector3(2.3, 0, 0.45)
const CHASEN_TIP_DEPTH = 1.74
const WHISK_REACH = { x: 0.42, z: 0.32 }
const WOBBLE_STRENGTH = 2.5
const PANEL_SHIFT = { landscape: 0.16, portrait: 0.2 }
const SERVED_POSITION = new THREE.Vector3(-0.15, 0, 1.05)
const SERVE_ARC = 0.25
const DRINK_LIFT = new THREE.Vector3(0, 0.45, 1.7)
const DRINK_TILT = { start: 0.35, extra: 0.55 }
const LIFT_RATE = 5
const DRINK_CAMERA_PUSH = new THREE.Vector3(0, -0.35, -1.1)
const SCOOP_GRIP = new THREE.Vector3(-1.2, 0.03, 0)
const LADLE_GRIP = new THREE.Vector3(1.55, 0.2, 0)
const CHASEN_GRIP = new THREE.Vector3(0, 0.5, 0)
const BOWL_HOLD_HEIGHT = 0.42
const BOWL_HOLD_GAP = 0.24
const BOWL_PALM_LIFT = 0.6
const BOWL_HOLD_FORWARD = 0.15
const BOWL_SHOTS = new Set<BrewShot>(['serve', 'turn', 'drink'])

const TOWARD_TIP = new THREE.Vector3(1, 0, 0)
const TOWARD_CUP = new THREE.Vector3(-1, 0, 0)
const PALM_DOWN = new THREE.Vector3(0, -1, 0)
const WHISK_FINGERS = new THREE.Vector3(0, -0.75, -0.65)
const WHISK_PALM = new THREE.Vector3(-1, 0, 0.1)
const BOWL_FINGERS = new THREE.Vector3(0, 0.1, -1)
const FILM_OPACITY = 0.7
const UNWHISKED = new THREE.Color('#4d6a22')
const WHISKED = new THREE.Color('#ffffff')

interface ScoopPose {
  position: THREE.Vector3
  yaw: number
  pitch: number
  roll: number
}

const SCOOP_REST: ScoopPose = { position: new THREE.Vector3(1.45, 0.11, 0.9), yaw: 2.2, pitch: 0, roll: 0 }
const SCOOP_DIP: ScoopPose = { position: new THREE.Vector3(1.75, 0.46, -0.95), yaw: 2.4, pitch: 0.35, roll: 0 }
const SCOOP_LIFT: ScoopPose = { position: new THREE.Vector3(1.2, 1.15, -0.5), yaw: 2.6, pitch: -0.1, roll: 0 }
const SCOOP_OVER_BOWL: ScoopPose = { position: new THREE.Vector3(0.1, 0.78, 0.05), yaw: 2.9, pitch: 0.05, roll: 0 }
const SCOOP_TIPPED: ScoopPose = { position: new THREE.Vector3(0.1, 0.74, 0.05), yaw: 2.9, pitch: 0.2, roll: 1.4 }

const SCOOP_KEYFRAMES: [number, ScoopPose][] = [
  [0, SCOOP_REST],
  [0.25, SCOOP_DIP],
  [0.38, SCOOP_DIP],
  [0.52, SCOOP_LIFT],
  [0.68, SCOOP_OVER_BOWL],
  [0.8, SCOOP_TIPPED],
  [0.88, SCOOP_OVER_BOWL],
  [1, SCOOP_REST]
]

function samplePose(t: number, target: ScoopPose) {
  for (let i = 0; i < SCOOP_KEYFRAMES.length - 1; i++) {
    const [t0, a] = SCOOP_KEYFRAMES[i]!
    const [t1, b] = SCOOP_KEYFRAMES[i + 1]!
    if (t > t1) continue
    const k = smoothstep(0, 1, (t - t0) / (t1 - t0 || 1))
    target.position.lerpVectors(a.position, b.position, k)
    target.yaw = lerp(a.yaw, b.yaw, k)
    target.pitch = lerp(a.pitch, b.pitch, k)
    target.roll = lerp(a.roll, b.roll, k)
    return target
  }
  return target
}

function createFrontMark(outerRadiusAt: (height: number) => number) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23
    const angle = Math.PI / 2 + (t - 0.5) * 0.45
    const y = 0.42 + t * 0.4 + Math.sin(t * Math.PI) * 0.04
    const radius = outerRadiusAt(y) + 0.006
    return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
  })
  return new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 40, 0.022, 6, false),
    new THREE.MeshStandardMaterial({ color: '#5a3d26', roughness: 0.6 })
  )
}

function createTatami() {
  const tatami = createTatamiTextures()
  tatami.map.repeat.set(4, 4)
  tatami.bump.repeat.set(4, 4)
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(6.5, 72),
    new THREE.MeshStandardMaterial({
      map: tatami.map,
      bumpMap: tatami.bump,
      bumpScale: 0.6,
      roughness: 0.92,
      transparent: true,
      alphaMap: createRadialAlpha(0, 0.66)
    })
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true

  const heri = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 0.32),
    new THREE.MeshStandardMaterial({ color: '#16241b', roughness: 0.8, transparent: true, alphaMap: createRadialAlpha(0, 0.9) })
  )
  heri.rotation.x = -Math.PI / 2
  heri.position.set(0, 0.004, -2.9)

  const group = new THREE.Group()
  group.add(floor, heri)
  return group
}

function addLights(stage: Stage) {
  stage.scene.add(new THREE.HemisphereLight(0xe6ead8, 0x0d241b, 0.55))
  const key = new THREE.SpotLight(0xffefd8, 90, 0, 0.55, 0.85, 1.4)
  key.position.set(-3, 10, 3.5)
  key.target.position.set(-0.3, 0, -0.4)
  key.castShadow = true
  key.shadow.mapSize.setScalar(stage.shadowMapSize())
  key.shadow.radius = 8
  key.shadow.blurSamples = 16
  key.shadow.bias = -0.0004
  key.shadow.camera.near = 3
  key.shadow.camera.far = 22
  const rim = new THREE.DirectionalLight(0xbfd6ff, 0.8)
  rim.position.set(4, 3, -6)
  stage.scene.add(key, key.target, rim)
}

export default function brew(stage: Stage, state: BrewSceneState) {
  const { scene, camera, quality } = stage
  const blob = createRadialAlpha()
  addLights(stage)
  scene.add(createTatami())

  const bowl = createChawan({ glaze: 'ash', seed: 8 })
  bowl.group.add(createFrontMark(bowl.outerRadiusAt))
  const bowlShadow = createContactShadow(1.25, 0.55, blob)
  scene.add(bowl.group, bowlShadow)

  const powderInBowl = createPowderMound({ radius: 0.32, height: 0.24, seed: 4, dust: false })
  powderInBowl.position.y = BOWL_FLOOR - 0.01
  powderInBowl.scale.setScalar(0.001)
  bowl.group.add(powderInBowl)

  const foam = createFoamTextures(31)
  const liquidMaterial = new THREE.MeshStandardMaterial({ map: foam.map, bumpMap: foam.bump, bumpScale: 0, roughness: 0.2, color: UNWHISKED })
  const liquid = new THREE.Mesh(new THREE.CircleGeometry(1, 72), liquidMaterial)
  liquid.rotation.x = -Math.PI / 2
  liquid.receiveShadow = true
  liquid.visible = false
  bowl.group.add(liquid)

  const filmMaterial = new THREE.MeshStandardMaterial({ map: foam.map, color: '#b8d27c', roughness: 0.7, transparent: true, opacity: 0 })
  const film = new THREE.Mesh(new THREE.CircleGeometry(bowl.innerRadiusAt(BOWL_FLOOR + 0.02), 48), filmMaterial)
  film.rotation.x = -Math.PI / 2
  film.position.y = BOWL_FLOOR + 0.004
  bowl.group.add(film)

  const natsume = createNatsume()
  natsume.group.position.copy(NATSUME_POSITION)
  natsume.group.add(createContactShadow(0.6, 0.55, blob))
  scene.add(natsume.group)
  const lidClosed = natsume.lid.position.clone()
  const lidOpen = new THREE.Vector3(0.78, 0.01, 0.55)

  const scoopRoot = new THREE.Group()
  const scoopTilt = new THREE.Group()
  const scoop = createChashaku()
  scoop.scale.setScalar(0.85)
  scoop.position.x = -0.95 * 0.85
  const scoopPinch = createPowderMound({ radius: 0.07, height: 0.045, seed: 2, dust: false })
  scoopPinch.position.set(-0.05, 0.09, 0)
  scoopTilt.add(scoop, scoopPinch)
  scoopRoot.add(scoopTilt)
  scene.add(scoopRoot)

  const kama = createKama()
  kama.group.position.copy(KAMA_POSITION)
  kama.group.scale.setScalar(KAMA_SCALE)
  kama.group.add(createContactShadow(1.4, 0.6, blob))
  scene.add(kama.group)
  const kamaMouth = kama.mouth.clone().multiplyScalar(KAMA_SCALE).add(KAMA_POSITION)

  const ladle = createHishaku()
  scene.add(ladle.group)
  const ladleRest = { position: kamaMouth.clone().add(new THREE.Vector3(0.05, 0.12, 0)), yaw: 2.6, tilt: -0.42 }
  const ladlePour = { position: new THREE.Vector3(0.28, 1.25, 0.02), yaw: 0, tilt: 0.25 }

  const stream = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.03, 1, 10, 1, true),
    new THREE.MeshStandardMaterial({ color: '#dfece4', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.6 })
  )
  stream.visible = false
  scene.add(stream)

  const chasen = createChasen({ detail: quality, seed: 11 })
  scene.add(chasen)
  const chasenShadow = createContactShadow(0.45, 0.55, blob)
  scene.add(chasenShadow)
  const upright = new THREE.Quaternion()
  const inverted = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0))
  const wobble = new THREE.Quaternion()
  const wobbleAngles = new THREE.Euler()

  const kamaSteam = createSteam({ width: 1.4, height: 2.6, opacity: 0.3, seed: 1.7 })
  kamaSteam.mesh.position.copy(kamaMouth)
  scene.add(kamaSteam.mesh)
  const bowlSteam = createSteam({ width: 1.2, height: 2.2, opacity: 0, seed: 4.1 })
  scene.add(bowlSteam.mesh)

  const particles = createParticles({
    count: quality === 'high' ? 110 : 50,
    box: new THREE.Vector3(7, 3, 5),
    color: '#c4d9a0',
    size: 28,
    opacity: 0.35,
    speed: 0.5
  })
  particles.points.position.y = 1.6
  scene.add(particles.points)

  const hands = createHandRig(scene)
  const bowlAnchor = new THREE.Group()
  scene.add(bowlAnchor)
  const gripPoint = new THREE.Vector3()
  const fingerDirection = new THREE.Vector3()
  const palmDirection = new THREE.Vector3()

  const cameraTarget = new THREE.Vector3(...SHOTS.intro.target)
  const cameraPosition = new THREE.Vector3(...SHOTS.intro.position)
  const shotPosition = new THREE.Vector3()
  const shotTarget = new THREE.Vector3()
  const pose: ScoopPose = { position: new THREE.Vector3(), yaw: 0, pitch: 0, roll: 0 }
  const lipWorld = new THREE.Vector3()
  const whiskPoint = new THREE.Vector3()
  const chasenPosition = new THREE.Vector3()
  const bowlPosition = new THREE.Vector3()
  const flatSurface = new THREE.Quaternion()
  const surfaceAngles = new THREE.Euler()

  function holdTool(tool: THREE.Object3D, grip: THREE.Vector3, fingers: THREE.Vector3, pose: 'pinch' | 'grip') {
    fingerDirection.copy(fingers).transformDirection(tool.matrixWorld)
    palmDirection.copy(PALM_DOWN).transformDirection(tool.matrixWorld)
    hands.hold('right', tool.localToWorld(gripPoint.copy(grip)), fingerDirection, palmDirection, pose)
  }

  function holdBowl(side: 'left' | 'right') {
    const direction = side === 'right' ? 1 : -1
    gripPoint.set(direction * (bowl.outerRadiusAt(BOWL_HOLD_HEIGHT) + BOWL_HOLD_GAP), BOWL_HOLD_HEIGHT, BOWL_HOLD_FORWARD)
    bowlAnchor.localToWorld(gripPoint)
    fingerDirection.copy(BOWL_FINGERS).applyQuaternion(bowlAnchor.quaternion)
    palmDirection.set(-direction, BOWL_PALM_LIFT, 0).applyQuaternion(bowlAnchor.quaternion)
    hands.hold(side, gripPoint, fingerDirection, palmDirection, 'hold')
  }

  function placeHands() {
    const shot = state.shot
    if (BOWL_SHOTS.has(shot)) {
      holdBowl('right')
      holdBowl('left')
      return
    }
    if (shot === 'scoop') holdTool(scoopTilt, SCOOP_GRIP, TOWARD_TIP, 'pinch')
    else if (shot === 'pour') holdTool(ladle.group, LADLE_GRIP, TOWARD_CUP, 'grip')
    else if (shot === 'whisk') hands.hold('right', chasen.localToWorld(gripPoint.copy(CHASEN_GRIP)), WHISK_FINGERS, WHISK_PALM, 'pinch')
    else hands.release('right')

    if (shot === 'whisk') holdBowl('left')
    else hands.release('left')
  }

  let framedWidth = 0
  let framedHeight = 0

  function frameAroundPanel() {
    if (stage.width === framedWidth && stage.height === framedHeight) return
    framedWidth = stage.width
    framedHeight = stage.height
    const landscape = stage.width >= stage.height
    const shiftX = landscape ? -stage.width * PANEL_SHIFT.landscape : 0
    const shiftY = landscape ? 0 : stage.height * PANEL_SHIFT.portrait
    camera.setViewOffset(stage.width, stage.height, shiftX, shiftY, stage.width, stage.height)
  }

  let scoopsShown = 0
  let scoopClock = -1
  let scoopDelivered = false
  let pourBlend = 0
  let pourTilt = 0
  let whiskBlend = 0
  let whiskX = 0
  let whiskZ = 0
  let turn = 0
  let drinkLift = 0
  let serveBlend = 0
  let lidBlend = 0

  stage.onFrame(({ time, delta }) => {
    frameAroundPanel()
    const shot = SHOTS[state.shot]
    const aspect = stage.width / stage.height
    const pull = 1 / Math.min(1, Math.pow(aspect, 0.9))
    shotTarget.set(...shot.target)
    shotPosition.set(...shot.position).sub(shotTarget).multiplyScalar(pull).add(shotTarget)
    if (state.shot === 'drink') shotPosition.addScaledVector(DRINK_CAMERA_PUSH, drinkLift)
    const cameraEase = 1 - Math.exp(-2.2 * delta)
    cameraPosition.lerp(shotPosition, cameraEase)
    cameraTarget.lerp(shotTarget, cameraEase)
    camera.position.copy(cameraPosition)
    camera.lookAt(cameraTarget)

    lidBlend = damp(lidBlend, state.shot === 'intro' ? 0 : 1, 3, delta)
    natsume.lid.position.lerpVectors(lidClosed, lidOpen, lidBlend)
    natsume.lid.rotation.z = lidBlend * 0.25

    if (state.scoops < scoopsShown) {
      scoopsShown = state.scoops
      scoopClock = -1
    }
    if (scoopClock < 0 && scoopsShown < state.scoops) {
      scoopClock = 0
      scoopDelivered = false
    }
    if (scoopClock >= 0) {
      scoopClock = Math.min(1, scoopClock + delta / SCOOP_SECONDS)
      samplePose(scoopClock, pose)
      scoopPinch.visible = scoopClock > SCOOP_PICKUP && scoopClock < SCOOP_RELEASE
      if (!scoopDelivered && scoopClock >= SCOOP_RELEASE) {
        scoopDelivered = true
        scoopsShown += 1
      }
      if (scoopClock >= 1) scoopClock = -1
    } else {
      samplePose(0, pose)
      scoopPinch.visible = false
    }
    scoopRoot.position.copy(pose.position)
    scoopRoot.rotation.y = pose.yaw
    scoopTilt.rotation.set(pose.roll, 0, pose.pitch)

    const fill = clamp(state.water / WATER_FOR_FULL, 0, 1.3)
    const level = BOWL_FLOOR + (lerp(BOWL_FLOOR, BOWL_FULL, Math.min(fill, 1)) - BOWL_FLOOR) * (1 - state.drink)
    const dissolve = smoothstep(0, 0.5, fill)
    const powderScale = (scoopsShown / 2) * (1 - dissolve) + 0.001
    powderInBowl.scale.setScalar(powderScale)

    liquidMaterial.color.copy(UNWHISKED).lerp(WHISKED, state.foam)
    liquidMaterial.roughness = lerp(0.18, 0.62, state.foam)
    liquidMaterial.bumpScale = state.foam * 0.5
    filmMaterial.opacity = smoothstep(0.85, 1, state.drink) * state.foam * FILM_OPACITY

    pourBlend = damp(pourBlend, state.shot === 'pour' ? 1 : 0, 3, delta)
    pourTilt = damp(pourTilt, state.pouring ? 1 : 0, 6, delta)
    ladle.group.position.lerpVectors(ladleRest.position, ladlePour.position, pourBlend)
    ladle.group.position.y += Math.sin(pourBlend * Math.PI) * 0.6
    ladle.group.rotation.y = lerp(ladleRest.yaw, ladlePour.yaw, pourBlend)
    ladle.group.rotation.z = lerp(ladleRest.tilt, ladlePour.tilt, pourBlend) + pourTilt * 0.85
    ladle.setWaterLevel(1 - clamp(state.water / WATER_FOR_FULL, 0, 1))

    ladle.group.updateMatrixWorld()
    ladle.lip.getWorldPosition(lipWorld)
    stream.visible = state.pouring && pourTilt > 0.6
    if (stream.visible) {
      const length = Math.max(0.05, lipWorld.y - level)
      stream.position.set(lipWorld.x, level + length / 2, lipWorld.z)
      stream.scale.set(1, length, 1)
    }

    whiskBlend = damp(whiskBlend, state.shot === 'whisk' ? 1 : 0, 3.5, delta)
    whiskX = damp(whiskX, state.whiskX, 14, delta)
    whiskZ = damp(whiskZ, state.whiskZ, 14, delta)
    whiskPoint.set(whiskX * WHISK_REACH.x, level + CHASEN_TIP_DEPTH, whiskZ * WHISK_REACH.z)
    chasenPosition.lerpVectors(CHASEN_REST, whiskPoint, whiskBlend)
    chasenPosition.y += Math.sin(whiskBlend * Math.PI) * 1.2
    chasen.position.copy(chasenPosition)
    wobbleAngles.set((state.whiskZ - whiskZ) * WOBBLE_STRENGTH, 0, -(state.whiskX - whiskX) * WOBBLE_STRENGTH)
    wobble.setFromEuler(wobbleAngles)
    chasen.quaternion.slerpQuaternions(upright, inverted, smoothstep(0.15, 0.85, whiskBlend)).multiply(wobble)
    chasenShadow.position.set(chasen.position.x, 0.003, chasen.position.z)
    chasenShadow.visible = whiskBlend < 0.2

    serveBlend = damp(serveBlend, state.served ? 1 : 0, 2.2, delta)
    turn = damp(turn, state.turn, 5, delta)
    drinkLift = damp(drinkLift, state.drinking ? 1 : 0, LIFT_RATE, delta)
    const tilt = drinkLift * (DRINK_TILT.start + DRINK_TILT.extra * state.drink)
    bowlPosition.copy(SERVED_POSITION).multiplyScalar(serveBlend).addScaledVector(DRINK_LIFT, drinkLift)
    bowlPosition.y += Math.sin(serveBlend * Math.PI) * SERVE_ARC
    bowl.group.position.copy(bowlPosition)
    bowl.group.rotation.set(tilt, -turn, 0)
    bowlShadow.position.set(bowlPosition.x, 0.003, bowlPosition.z)
    bowlShadow.material.opacity = 0.55 * (1 - drinkLift * 0.6)

    liquid.visible = state.water > 0.5 && level > BOWL_FLOOR + 0.006
    liquid.position.y = level
    const radius = bowl.innerRadiusAt(level) * 1.02
    liquid.scale.set(radius, radius / Math.cos(tilt), 1)
    surfaceAngles.set(-Math.PI / 2, 0, time * 0.05 * (1 - state.foam))
    flatSurface.setFromEuler(surfaceAngles)
    liquid.quaternion.copy(bowl.group.quaternion).invert().multiply(flatSurface)

    const heat = smoothstep(60, 100, state.temperature)
    kamaSteam.material.uniforms.uOpacity!.value = 0.08 + heat * 0.4
    bowlSteam.mesh.position.set(bowlPosition.x, level + bowlPosition.y, bowlPosition.z)
    bowlSteam.material.uniforms.uOpacity!.value = liquid.visible ? 0.22 * heat * (1 - state.drink) : 0

    bowlAnchor.position.copy(bowlPosition)
    bowlAnchor.rotation.set(tilt, 0, 0)
    scene.updateMatrixWorld()
    placeHands()
    hands.update(delta)

    kamaSteam.update(time, camera)
    bowlSteam.update(time, camera)
    particles.update(time)
  })

  return () => hands.dispose()
}
