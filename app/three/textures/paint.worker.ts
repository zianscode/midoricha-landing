import { type PaintRequest, type PaintResponse, runPainter } from '~/three/textures/painters'

interface PaintScope {
  location: Location
  onmessage: ((event: MessageEvent<PaintRequest>) => void) | null
  postMessage(message: PaintResponse, transfer?: Transferable[]): void
}

type Layers = Record<string, OffscreenCanvas>
type Bitmaps = Record<string, ImageBitmap>

const scope = self as unknown as PaintScope

const CACHE_PREFIX = 'midoricha-paint:'
const MANIFEST = 'slots'
const cacheName = CACHE_PREFIX + scope.location.pathname
const cacheReady = openCache()

async function openCache() {
  if (typeof caches === 'undefined') return null
  try {
    const names = await caches.keys()
    await Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== cacheName).map((name) => caches.delete(name)))
    return await caches.open(cacheName)
  } catch {
    return null
  }
}

function entryUrl(request: PaintRequest, part: string) {
  return new URL(`paint/${request.name}/${encodeURIComponent(JSON.stringify(request.args))}/${part}`, scope.location.href).href
}

const decode = (source: Blob | OffscreenCanvas) => createImageBitmap(source, { premultiplyAlpha: 'none' })

function flipped(source: OffscreenCanvas) {
  const canvas = new OffscreenCanvas(source.width, source.height)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.translate(0, source.height)
  ctx.scale(1, -1)
  ctx.drawImage(source, 0, 0)
  return canvas
}

function paint(request: PaintRequest): Layers {
  const canvases = runPainter(request.name, request.args) as Layers
  return Object.fromEntries(Object.entries(canvases).map(([slot, canvas]) => [slot, flipped(canvas)]))
}

async function toBitmaps(slots: string[], sources: (Blob | OffscreenCanvas)[]): Promise<Bitmaps> {
  const bitmaps = await Promise.all(sources.map(decode))
  return Object.fromEntries(slots.map((slot, index) => [slot, bitmaps[index]!]))
}

async function restore(request: PaintRequest) {
  const cache = await cacheReady
  const manifest = await cache?.match(entryUrl(request, MANIFEST))
  if (!cache || !manifest) return null
  const slots: string[] = await manifest.json()
  const entries = await Promise.all(slots.map((slot) => cache.match(entryUrl(request, slot))))
  if (entries.some((entry) => !entry)) return null
  return toBitmaps(slots, await Promise.all(entries.map((entry) => entry!.blob())))
}

async function remember(request: PaintRequest, layers: Layers) {
  const cache = await cacheReady
  if (!cache) return
  const slots = Object.keys(layers)
  await Promise.all(
    slots.map(async (slot) => cache.put(entryUrl(request, slot), new Response(await layers[slot]!.convertToBlob({ type: 'image/png' }))))
  )
  await cache.put(entryUrl(request, MANIFEST), new Response(JSON.stringify(slots), { headers: { 'content-type': 'application/json' } }))
}

function reply(id: number, bitmaps: Bitmaps) {
  scope.postMessage({ id, bitmaps } satisfies PaintResponse, Object.values(bitmaps))
}

scope.onmessage = async ({ data }: MessageEvent<PaintRequest>) => {
  try {
    const cached = await restore(data).catch(() => null)
    if (cached) return reply(data.id, cached)
    const layers = paint(data)
    reply(data.id, await toBitmaps(Object.keys(layers), Object.values(layers)))
    remember(data, layers).catch(() => undefined)
  } catch (error) {
    scope.postMessage({ id: data.id, error: String(error) } satisfies PaintResponse)
  }
}
