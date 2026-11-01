import { makeCanvas, toTexture } from '~/three/core/canvas'
import { makeRng } from '~/three/core/random'

export function createBambooTexture(tone: 'pale' | 'aged' = 'pale', seed = 3) {
  const W = 256
  const H = 1024
  const rand = makeRng(seed)
  const { canvas, ctx } = makeCanvas(W, H)
  ctx.fillStyle = tone === 'pale' ? '#dccb9f' : '#b8935e'
  ctx.fillRect(0, 0, W, H)
  for (let i = 0; i < 380; i++) {
    const x = rand() * W
    const dark = rand() > 0.45
    ctx.strokeStyle = dark
      ? `rgba(120, 92, 48, ${0.04 + rand() * 0.12})`
      : `rgba(255, 246, 220, ${0.05 + rand() * 0.12})`
    ctx.lineWidth = 0.6 + rand() * 1.8
    ctx.beginPath()
    ctx.moveTo(x, 0)
    for (let y = 0; y <= H; y += 64) ctx.lineTo(x + Math.sin(y * 0.01 + i) * 1.4, y)
    ctx.stroke()
  }
  for (let i = 0; i < 40; i++) {
    const x = rand() * W
    const y = rand() * H
    const g = ctx.createRadialGradient(x, y, 0, x, y, 6 + rand() * 18)
    g.addColorStop(0, 'rgba(110, 80, 40, 0.12)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - 30, y - 30, 60, 60)
  }
  return toTexture(canvas, { repeat: true })
}
