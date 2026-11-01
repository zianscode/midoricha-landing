export type Paint2D = OffscreenCanvasRenderingContext2D
export type PaintCanvas = OffscreenCanvas | HTMLCanvasElement

function offscreen(width: number, height: number) {
  if (typeof OffscreenCanvas === 'undefined') return null
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  return ctx ? { canvas, ctx } : null
}

export function makeCanvas(width: number, height: number): { canvas: PaintCanvas; ctx: Paint2D } {
  const painted = offscreen(width, height)
  if (painted) return painted
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return { canvas, ctx: canvas.getContext('2d') as unknown as Paint2D }
}
