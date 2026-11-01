import * as THREE from 'three'
import type { PaintCanvas } from '~/three/core/canvas'
import {
  type PaintRequest,
  type PaintResponse,
  type PaintedSlot,
  type PainterArgs,
  type PainterName,
  runPainter
} from '~/three/textures/painters'

interface SlotOptions {
  color?: boolean
  repeat?: boolean
}

type PaintedImages = Record<string, ImageBitmap | PaintCanvas>

interface QueuedJob {
  request: PaintRequest
  resolve: (bitmaps: Record<string, ImageBitmap>) => void
  reject: (error: Error) => void
}

interface PaintWorker {
  worker: Worker
  job: QueuedJob | null
}

const COLOR: SlotOptions = { color: true }
const DATA: SlotOptions = {}
const COLOR_TILE: SlotOptions = { color: true, repeat: true }
const DATA_TILE: SlotOptions = { repeat: true }

const MAX_WORKERS = 4
const ANISOTROPY = 4

const painting = new WeakMap<THREE.Texture, Promise<void>>()
const queue: QueuedJob[] = []
let workers: PaintWorker[] | null | undefined
let nextId = 0

function canPaintOffThread() {
  return typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap === 'function'
}

function poolSize() {
  return Math.max(1, Math.min(MAX_WORKERS, (navigator.hardwareConcurrency ?? 2) - 1))
}

function abandonWorkers() {
  const unfinished = [...queue, ...(workers ?? []).flatMap((entry) => entry.job ?? [])]
  workers?.forEach((entry) => entry.worker.terminate())
  workers = null
  queue.length = 0
  unfinished.forEach((job) => job.reject(new Error('paint worker unavailable')))
}

function dispatch() {
  for (const entry of workers ?? []) {
    if (entry.job) continue
    const job = queue.shift()
    if (!job) return
    entry.job = job
    entry.worker.postMessage(job.request)
  }
}

function spawnWorker(): PaintWorker {
  const entry: PaintWorker = { worker: new Worker(new URL('./paint.worker.ts', import.meta.url), { type: 'module' }), job: null }
  entry.worker.onmessage = ({ data }: MessageEvent<PaintResponse>) => {
    const job = entry.job
    entry.job = null
    if (job?.request.id === data.id) {
      if ('error' in data) job.reject(new Error(data.error))
      else job.resolve(data.bitmaps)
    }
    dispatch()
  }
  entry.worker.onerror = (event) => {
    event.preventDefault()
    abandonWorkers()
  }
  return entry
}

function workerPool() {
  if (workers === undefined) {
    try {
      workers = canPaintOffThread() ? Array.from({ length: poolSize() }, spawnWorker) : null
    } catch {
      workers = null
    }
  }
  return workers
}

function paintOffThread(name: PainterName, args: unknown[]) {
  if (!workerPool()?.length) return null
  const request: PaintRequest = { id: ++nextId, name, args }
  return new Promise<Record<string, ImageBitmap>>((resolve, reject) => {
    queue.push({ request, resolve, reject })
    dispatch()
  })
}

function blankTexture({ color, repeat }: SlotOptions) {
  const texture = new THREE.Texture()
  if (color) texture.colorSpace = THREE.SRGBColorSpace
  if (repeat) texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = ANISOTROPY
  return texture
}

async function deliver(name: PainterName, args: unknown[], textures: Record<string, THREE.Texture>) {
  const bitmaps = await paintOffThread(name, args)?.catch(() => null)
  const images: PaintedImages = bitmaps ?? runPainter(name, args)
  for (const [slot, texture] of Object.entries(textures)) {
    texture.image = images[slot]!
    texture.flipY = !bitmaps
    texture.needsUpdate = true
  }
}

function paintTextures<N extends PainterName>(name: N, args: PainterArgs<N>, slots: Record<PaintedSlot<N>, SlotOptions>) {
  const textures = Object.fromEntries(
    Object.entries<SlotOptions>(slots).map(([slot, options]) => [slot, blankTexture(options)])
  ) as Record<PaintedSlot<N>, THREE.Texture>
  const job = deliver(name, args, textures)
  for (const texture of Object.values<THREE.Texture>(textures)) painting.set(texture, job)
  return textures
}

export function collectTextures(root: THREE.Object3D) {
  const found = new Set<THREE.Texture>()
  root.traverse((object) => {
    const material = (object as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
    for (const entry of [material ?? []].flat()) {
      const uniforms = Object.values((entry as THREE.ShaderMaterial).uniforms ?? {}).map((uniform) => uniform.value)
      for (const value of [...Object.values(entry), ...uniforms]) {
        if (value instanceof THREE.Texture) found.add(value)
      }
    }
  })
  return [...found]
}

export function texturesPainted(textures: THREE.Texture[]) {
  return Promise.all(textures.map((texture) => painting.get(texture)))
}

export const createCeramicTextures = (...args: PainterArgs<'ceramic'>) =>
  paintTextures('ceramic', args, { map: COLOR, roughness: DATA, bump: DATA })

export const createFoamTextures = (...args: PainterArgs<'foam'>) => paintTextures('foam', args, { map: COLOR, bump: DATA })

export const createPowderTextures = (...args: PainterArgs<'powder'>) =>
  paintTextures('powder', args, { map: COLOR_TILE, bump: DATA_TILE })

export const createGraniteTextures = (...args: PainterArgs<'granite'>) =>
  paintTextures('granite', args, { map: COLOR_TILE, bump: DATA_TILE })

export const createIronTextures = (...args: PainterArgs<'iron'>) => paintTextures('iron', args, { map: COLOR_TILE, bump: DATA_TILE })

export const createTatamiTextures = (...args: PainterArgs<'tatami'>) =>
  paintTextures('tatami', args, { map: COLOR_TILE, bump: DATA_TILE })

export const createLeafTextures = (...args: PainterArgs<'leaf'>) => paintTextures('leaf', args, { map: COLOR, bump: DATA })

export const createEnsoTextures = () => paintTextures('enso', [], { map: COLOR, bump: DATA })

export const createBambooTexture = (...args: PainterArgs<'bamboo'>) => paintTextures('bamboo', args, { map: COLOR_TILE }).map

export const createFoliageTexture = () => paintTextures('foliage', [], { map: COLOR_TILE }).map

export const createDustingTexture = () => paintTextures('dusting', [], { map: COLOR }).map

export const createRadialAlpha = (...args: PainterArgs<'radialAlpha'>) => paintTextures('radialAlpha', args, { map: DATA }).map

export const createNetAlpha = () => paintTextures('netAlpha', [], { map: DATA_TILE }).map
