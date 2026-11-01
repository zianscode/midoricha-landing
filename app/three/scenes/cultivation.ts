import * as THREE from 'three'
import { clamp, lerp, smoothstep } from '~/three/core/math'
import type { Stage, StageOptions } from '~/three/core/Stage'
import { createParticles } from '~/three/objects/particles'
import { createSteam } from '~/three/objects/steam'
import { createTeaField } from '~/three/objects/teaField'

export const options: StageOptions = { fov: 34, far: 120, shadows: true, environment: 0.2, toneMapping: false, progressDamping: 3 }

interface Look {
  sun: number
  sunColor: string
  hemi: number
  net: number
  fogColor: string
  fogNear: number
  fogFar: number
  tint: string
  steam: number
  dust: number
  cam: [number, number, number]
}

const LOOKS: Look[] = [
  { sun: 0.8, sunColor: '#dfe6ec', hemi: 0.75, net: 0.95, fogColor: '#e6e9e4', fogNear: 4, fogFar: 34, tint: '#b9c6b4', steam: 0, dust: 0, cam: [0, 2.5, 5.8] },
  { sun: 2.8, sunColor: '#fff2da', hemi: 1.05, net: 0, fogColor: '#eef0ea', fogNear: 7, fogFar: 46, tint: '#ffffff', steam: 0, dust: 0, cam: [0.1, 2.1, 4.6] },
  { sun: 1.7, sunColor: '#f5f2ea', hemi: 1.15, net: 0, fogColor: '#f0f2ee', fogNear: 2, fogFar: 26, tint: '#e9f0dc', steam: 1, dust: 0, cam: [0.2, 1.9, 3.6] },
  { sun: 2.4, sunColor: '#ffe6c0', hemi: 0.9, net: 0, fogColor: '#eeede6', fogNear: 6, fogFar: 44, tint: '#c8c08e', steam: 0.15, dust: 0.2, cam: [0.05, 2.1, 2.6] },
  { sun: 2.0, sunColor: '#ffd9ab', hemi: 0.85, net: 0, fogColor: '#edebe3', fogNear: 5, fogFar: 40, tint: '#cfd0a0', steam: 0, dust: 1, cam: [-0.1, 2.5, 1.6] }
]

export default function cultivation(stage: Stage) {
  const { scene, camera, quality } = stage

  const fog = new THREE.Fog(LOOKS[0]!.fogColor, 6, 46)
  scene.fog = fog
  scene.background = fog.color

  const hemi = new THREE.HemisphereLight(0xf4f6ee, 0x6b5e45, 0.8)
  const sun = new THREE.DirectionalLight(0xfff2da, 1)
  sun.position.set(-8, 12, 6)
  sun.target.position.set(0, 0, -4)
  sun.castShadow = true
  sun.shadow.mapSize.setScalar(stage.shadowMapSize())
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 14, bottom: -14, near: 1, far: 50 })
  sun.shadow.radius = 4
  sun.shadow.bias = -0.0006
  sun.shadow.normalBias = 0.03
  scene.add(hemi, sun, sun.target)

  const rows = quality === 'high' ? 15 : 11
  const field = createTeaField({ leaves: quality === 'high' ? 14000 : 5000, rows })
  scene.add(field.group)
  const aisle = (z: number) => field.pathX((rows - 1) / 2, z) + 0.75

  const steams = Array.from({ length: 5 }, (_, i) => {
    const s = createSteam({ width: 8, height: 5, opacity: 0, color: '#ffffff', seed: i * 2.3 })
    const z = -1.5 - i * 3.6
    s.mesh.position.set(aisle(z) + (i % 2 ? 2.4 : -2.2), 0.3, z)
    scene.add(s.mesh)
    return s
  })

  const dust = createParticles({
    count: quality === 'high' ? 260 : 120,
    box: new THREE.Vector3(12, 4, 12),
    color: '#86a43f',
    size: 60,
    opacity: 0,
    speed: 0.8
  })
  dust.points.position.set(aisle(-2), 1.6, -2)
  scene.add(dust.points)

  const c1 = new THREE.Color()
  const c2 = new THREE.Color()
  const mix = (a: string, b: string, t: number, out: THREE.Color) => out.set(a).lerp(c2.set(b), t)

  stage.onFrame(({ time, progress, pointer }) => {
    const s = clamp(progress) * (LOOKS.length - 1)
    const i = Math.min(LOOKS.length - 2, Math.floor(s))
    const t = smoothstep(0, 1, s - i)
    const a = LOOKS[i]!
    const b = LOOKS[i + 1]!

    sun.intensity = lerp(a.sun, b.sun, t)
    mix(a.sunColor, b.sunColor, t, sun.color)
    hemi.intensity = lerp(a.hemi, b.hemi, t)
    field.netMaterial.opacity = lerp(a.net, b.net, t)
    field.netMaterial.visible = field.netMaterial.opacity > 0.01
    mix(a.fogColor, b.fogColor, t, fog.color)
    fog.near = lerp(a.fogNear, b.fogNear, t)
    fog.far = lerp(a.fogFar, b.fogFar, t)
    mix(a.tint, b.tint, t, c1)
    field.leafMaterial.color.copy(c1)
    field.foliage.color.copy(c1)

    const steam = lerp(a.steam, b.steam, t)
    steams.forEach((st) => {
      st.material.uniforms.uOpacity!.value = steam * 0.42
      st.mesh.visible = steam > 0.01
      st.update(time, camera)
    })
    dust.material.uniforms.uOpacity!.value = lerp(a.dust, b.dust, t) * 0.7
    dust.update(time)

    const z = lerp(a.cam[2], b.cam[2], t)
    camera.position.set(
      aisle(z) + lerp(a.cam[0], b.cam[0], t) + pointer.x * 0.2 + Math.sin(time * 0.05) * 0.1,
      lerp(a.cam[1], b.cam[1], t) - pointer.y * 0.1,
      z
    )
    camera.lookAt(aisle(z - 14), 0.9, z - 14)
  })
}
