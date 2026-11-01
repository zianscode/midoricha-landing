import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { getDeviceTier, hasFinePointer, prefersReducedMotion } from '~/utils/device'
import { disposeObject } from '~/three/core/dispose'
import { clamp, damp } from '~/three/core/math'
import { prepareScene } from '~/three/core/prepare'

export interface StageOptions {
  fov?: number
  near?: number
  far?: number
  shadows?: boolean
  environment?: number
  exposure?: number
  toneMapping?: boolean
  progressDamping?: number
}

export interface Frame {
  time: number
  delta: number
  pointer: THREE.Vector2
  progress: number
}

type FrameCallback = (frame: Frame) => void

export class Stage {
  readonly container: HTMLElement
  readonly renderer: THREE.WebGLRenderer
  readonly scene = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  readonly quality: 'high' | 'low'
  readonly reducedMotion: boolean
  readonly finePointer: boolean

  width = 1
  height = 1

  private callbacks: FrameCallback[] = []
  private pointer = new THREE.Vector2()
  private pointerTarget = new THREE.Vector2()
  private progress = 0
  private progressTarget = 0
  private progressDamping: number
  private raf = 0
  private last = 0
  private elapsed = 0
  private inView = false
  private pageVisible = true
  private dirty = true
  private disposed = false
  private started = false
  private resizeObserver: ResizeObserver
  private intersectionObserver: IntersectionObserver
  private envTarget: THREE.WebGLRenderTarget | null = null
  private environment: number
  private pixelRatio: number
  private minPixelRatio: number
  private frameTime = 0
  private frameSamples = 0

  constructor(container: HTMLElement, options: StageOptions = {}) {
    this.container = container
    this.finePointer = hasFinePointer()
    this.quality = getDeviceTier() === 'high' ? 'high' : 'low'
    this.reducedMotion = prefersReducedMotion()
    this.progressDamping = options.progressDamping ?? 6

    this.renderer = new THREE.WebGLRenderer({
      antialias: this.quality === 'high',
      alpha: true,
      powerPreference: 'high-performance'
    })
    this.renderer.debug.checkShaderErrors = import.meta.dev
    this.pixelRatio = Math.min(window.devicePixelRatio, this.quality === 'high' ? 1.5 : 1.25)
    this.minPixelRatio = Math.min(this.pixelRatio, this.quality === 'high' ? 1 : 0.75)
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.toneMapping = options.toneMapping === false ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = options.exposure ?? 1
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    if (options.shadows && this.quality === 'high') {
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFShadowMap
    }

    const canvas = this.renderer.domElement
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;'
    canvas.setAttribute('aria-hidden', 'true')
    container.appendChild(canvas)

    this.camera = new THREE.PerspectiveCamera(options.fov ?? 30, 1, options.near ?? 0.1, options.far ?? 100)

    this.environment = options.environment ?? 0

    this.resize()
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(container)

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.inView = !!entry?.isIntersecting
        this.updateLoop()
      },
      { rootMargin: '80px 0px' }
    )
    this.intersectionObserver.observe(container)

    document.addEventListener('visibilitychange', this.onVisibility)
    if (this.finePointer && !this.reducedMotion) window.addEventListener('pointermove', this.onPointer, { passive: true })
  }

  onFrame(cb: FrameCallback) {
    this.callbacks.push(cb)
  }

  setProgress(value: number) {
    this.progressTarget = clamp(value)
    if (this.reducedMotion) this.progress = this.progressTarget
    this.dirty = true
  }

  shadowMapSize() {
    return this.quality === 'high' ? 1024 : 512
  }

  private onVisibility = () => {
    this.pageVisible = document.visibilityState === 'visible'
    this.updateLoop()
  }

  private onPointer = (e: PointerEvent) => {
    const rect = this.container.getBoundingClientRect()
    if (rect.bottom < 0 || rect.top > window.innerHeight) return
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    this.pointerTarget.set(clamp(x, -1.5, 1.5), clamp(y, -1.5, 1.5))
  }

  private resize() {
    const w = Math.max(1, this.container.clientWidth)
    const h = Math.max(1, this.container.clientHeight)
    if (w === this.width && h === this.height) return
    this.width = w
    this.height = h
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.dirty = true
    if (this.started && !this.raf) this.render(0)
  }

  private updateLoop() {
    const shouldRun = this.started && this.inView && this.pageVisible && !this.disposed
    if (shouldRun && !this.raf) {
      this.last = performance.now()
      this.raf = requestAnimationFrame(this.tick)
    } else if (!shouldRun && this.raf) {
      cancelAnimationFrame(this.raf)
      this.raf = 0
    }
  }

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick)
    const raw = (now - this.last) / 1000
    const delta = Math.min(0.05, raw)
    this.last = now
    if (this.reducedMotion && !this.dirty) return
    this.adaptResolution(raw)
    this.render(this.reducedMotion ? 0 : delta)
  }

  private adaptResolution(frameSeconds: number) {
    if (this.pixelRatio <= this.minPixelRatio || frameSeconds > 0.25) return
    this.frameTime += frameSeconds
    if (++this.frameSamples < 60) return
    const average = this.frameTime / this.frameSamples
    this.frameTime = 0
    this.frameSamples = 0
    if (average < 1 / 45) return
    this.pixelRatio = Math.max(this.minPixelRatio, this.pixelRatio - 0.25)
    this.renderer.setPixelRatio(this.pixelRatio)
  }

  private render(delta: number) {
    this.elapsed += delta
    this.pointer.x = damp(this.pointer.x, this.pointerTarget.x, 2.4, delta)
    this.pointer.y = damp(this.pointer.y, this.pointerTarget.y, 2.4, delta)
    this.progress = this.reducedMotion
      ? this.progressTarget
      : damp(this.progress, this.progressTarget, this.progressDamping, delta)
    const frame: Frame = { time: this.elapsed, delta, pointer: this.pointer, progress: this.progress }
    for (const cb of this.callbacks) cb(frame)
    this.renderer.render(this.scene, this.camera)
    this.dirty = false
  }

  private createEnvironment() {
    if (!this.environment) return
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    const room = new RoomEnvironment()
    this.envTarget = pmrem.fromScene(room, 0.04)
    this.scene.environment = this.envTarget.texture
    this.scene.environmentIntensity = this.environment
    room.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      ;(m.material as THREE.Material | undefined)?.dispose()
    })
    pmrem.dispose()
  }

  async start() {
    this.createEnvironment()
    const prepared = await prepareScene(this.renderer, this.scene, this.camera, () => !this.disposed)
    if (!prepared) return
    this.started = true
    this.render(0)
    this.updateLoop()
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.raf = 0
    this.resizeObserver.disconnect()
    this.intersectionObserver.disconnect()
    document.removeEventListener('visibilitychange', this.onVisibility)
    window.removeEventListener('pointermove', this.onPointer)
    disposeObject(this.scene)
    this.envTarget?.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.renderer.domElement.remove()
    this.callbacks = []
  }
}

export type SceneSetup = (stage: Stage) => void | (() => void)

export interface SceneModule {
  options: StageOptions
  default: SceneSetup
}
