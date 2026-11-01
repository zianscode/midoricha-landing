import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { disposeObject } from '~/three/core/dispose'
import { createContactShadow } from '~/three/core/lighting'
import { nextFrame, prepareScene } from '~/three/core/prepare'
import { createChasen } from '~/three/objects/chasen'
import { createChashaku } from '~/three/objects/chashaku'
import { createChawan } from '~/three/objects/chawan'
import { createBotanicalKit, createLeaf } from '~/three/objects/matchaLeaf'
import { createDustingTexture, createEnsoTextures, createNetAlpha, createRadialAlpha } from '~/three/textures'

export type StillKind = 'ceremonial' | 'latte' | 'culinary' | 'creative'

interface Shot {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
}

function keyLight(scene: THREE.Scene, pos: [number, number, number], intensity = 2.6, area = 4) {
  const key = new THREE.DirectionalLight(0xfff2de, intensity)
  key.position.set(...pos)
  key.castShadow = true
  key.shadow.mapSize.setScalar(2048)
  Object.assign(key.shadow.camera, { left: -area, right: area, top: area, bottom: -area, near: 0.5, far: 40 })
  key.shadow.radius = 9
  key.shadow.blurSamples = 20
  key.shadow.bias = -0.0005
  scene.add(key, new THREE.HemisphereLight(0xfffbf2, 0xa9a28c, 0.6))
  const rim = new THREE.DirectionalLight(0xeaf1ff, 0.8)
  rim.position.set(4, 3, -5)
  scene.add(rim)
}

function surface(scene: THREE.Scene, color: string) {
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color, roughness: 0.95 }))
  plane.rotation.x = -Math.PI / 2
  plane.receiveShadow = true
  scene.add(plane)
}

function topDown(aspect: number, height = 8, fov = 26) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 50)
  camera.position.set(0, height, 0.9)
  camera.lookAt(0, 0, 0)
  return camera
}

const SHOTS: Record<StillKind, (aspect: number) => Shot> = {
  ceremonial(aspect) {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#e6e1d3')
    keyLight(scene, [-4, 9, 2])
    surface(scene, '#e6e1d3')
    const blob = createRadialAlpha()
    const bowl = createChawan({ glaze: 'charcoal', fill: 'foam', seed: 14 })
    bowl.group.position.set(-0.3, 0, 0.55)
    bowl.group.add(createContactShadow(1.25, 0.5, blob))
    const chasen = createChasen({ seed: 6 })
    chasen.rotation.z = Math.PI / 2 - 0.13
    chasen.position.set(1.35, 0.12, -1.5)
    const kit = createBotanicalKit(3)
    const leaf = createLeaf(kit, { length: 0.75, width: 0.32, fold: 0.12, curl: 0.06 })
    leaf.rotation.set(-Math.PI / 2, 0, 0)
    leaf.rotateZ(-2.3)
    leaf.position.set(1.05, 0.03, 1.55)
    scene.add(bowl.group, chasen, leaf)
    return { scene, camera: topDown(aspect, 9.5) }
  },

  latte(aspect) {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#dde8c8')
    keyLight(scene, [-5, 7, 5], 2.4)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.16 }))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    const glassPts = [
      [0, 0.02], [0.78, 0.02], [0.8, 0.06], [0.86, 2.2], [0.84, 2.2], [0.78, 0.12], [0, 0.12]
    ].map(([x, y]) => new THREE.Vector2(x, y))
    const glass = new THREE.Mesh(
      new THREE.LatheGeometry(glassPts, 96),
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        roughness: 0.04,
        transmission: 1,
        thickness: 0.08,
        ior: 1.48,
        transparent: true,
        side: THREE.DoubleSide
      })
    )
    glass.castShadow = true

    const liquidGeo = new THREE.CylinderGeometry(0.825, 0.775, 1.75, 96, 40)
    liquidGeo.translate(0, 0.12 + 1.75 / 2, 0)
    const colors: number[] = []
    const lp = liquidGeo.attributes.position as THREE.BufferAttribute
    const milk = new THREE.Color('#efe9da')
    const green = new THREE.Color('#7f9f3c')
    const tmp = new THREE.Color()
    for (let i = 0; i < lp.count; i++) {
      const y = lp.getY(i)
      const theta = Math.atan2(lp.getZ(i), lp.getX(i))
      const edge = 1.12 + Math.sin(theta * 3) * 0.06
      const t = THREE.MathUtils.smoothstep(y, edge, edge + 0.42)
      tmp.copy(milk).lerp(green, t)
      colors.push(tmp.r, tmp.g, tmp.b)
    }
    liquidGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    const liquid = new THREE.Mesh(liquidGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4 }))

    const ice = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.12, transmission: 1, thickness: 0.4, ior: 1.31 })
    const cubes = [
      [-0.25, 1.72, 0.1, 0.4],
      [0.28, 1.78, -0.15, 0.9],
      [0.05, 1.5, 0.3, 1.6]
    ].map(([x, y, z, r]) => {
      const c = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.46, 0.46, 3, 0.06), ice)
      c.position.set(x!, y!, z!)
      c.rotation.set(r!, r! * 0.7, r! * 0.3)
      return c
    })

    scene.add(glass, liquid, ...cubes)
    const camera = new THREE.PerspectiveCamera(24, aspect, 0.1, 50)
    camera.position.set(0, 3.4, 8.4)
    camera.lookAt(0, 1.05, 0)
    return { scene, camera }
  },

  culinary(aspect) {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#f0ece2')
    keyLight(scene, [-3, 9, 3], 2.3)
    surface(scene, '#f0ece2')

    const dusting = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshStandardMaterial({ map: createDustingTexture(), transparent: true, roughness: 1, depthWrite: false })
    )
    dusting.rotation.x = -Math.PI / 2
    dusting.position.set(-0.35, 0.004, 0.4)
    dusting.receiveShadow = true

    const steel = new THREE.MeshStandardMaterial({ color: '#b9b7b0', metalness: 0.85, roughness: 0.35 })
    const sieve = new THREE.Group()
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.035, 12, 96), steel)
    rim.rotation.x = Math.PI / 2
    const netTex = createNetAlpha()
    netTex.repeat.set(10, 10)
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.89, 64),
      new THREE.MeshStandardMaterial({ color: '#8e8b84', metalness: 0.6, roughness: 0.5, alphaMap: netTex, alphaTest: 0.5, side: THREE.DoubleSide })
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = -0.02
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.4, 12), steel)
    handle.rotation.z = Math.PI / 2
    handle.position.x = 1.6
    sieve.add(rim, mesh, handle)
    sieve.traverse((o) => (o.castShadow = true))
    sieve.position.set(0.95, 0.42, -1.15)
    sieve.rotation.y = 0.5

    const kit = createBotanicalKit(5)
    const leaf = createLeaf(kit, { length: 0.6, width: 0.26, fold: 0.12, curl: 0.05, seed: 3 })
    leaf.rotation.set(-Math.PI / 2, 0, 0)
    leaf.rotateZ(1.2)
    leaf.position.set(-1.0, 0.03, 1.75)

    scene.add(dusting, sieve, leaf)
    return { scene, camera: topDown(aspect, 9.5) }
  },

  creative(aspect) {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#173628')
    keyLight(scene, [-4, 8, 3], 2.2)
    surface(scene, '#1d3c2e')

    const enso = createEnsoTextures()
    const stroke = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshStandardMaterial({
        map: enso.map,
        bumpMap: enso.bump,
        bumpScale: 2,
        transparent: true,
        roughness: 1,
        depthWrite: false
      })
    )
    stroke.rotation.x = -Math.PI / 2
    stroke.position.y = 0.004
    stroke.receiveShadow = true

    const scoop = createChashaku()
    scoop.rotation.y = -0.6
    scoop.position.set(0.55, 0, 1.75)
    scoop.scale.setScalar(0.75)

    scene.add(stroke, scoop)
    return { scene, camera: topDown(aspect, 10) }
  }
}

function snapshot(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('still capture failed'))), 'image/jpeg', 0.9)
  )
}

export async function renderStills(kinds: StillKind[], width: number, height: number) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.debug.checkShaderErrors = import.meta.dev
  renderer.setPixelRatio(1)
  renderer.setSize(width, height, false)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04)

  const out: Partial<Record<StillKind, string>> = {}
  for (const kind of kinds) {
    const { scene, camera } = SHOTS[kind](width / height)
    scene.environment = env.texture
    scene.environmentIntensity = 0.45
    await prepareScene(renderer, scene, camera)
    renderer.render(scene, camera)
    out[kind] = URL.createObjectURL(await snapshot(renderer.domElement))
    disposeObject(scene)
    await nextFrame()
  }

  env.dispose()
  pmrem.dispose()
  renderer.dispose()
  renderer.forceContextLoss()
  return out as Record<StillKind, string>
}
