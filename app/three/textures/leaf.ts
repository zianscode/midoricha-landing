import { makeCanvas, toTexture } from '~/three/core/canvas'
import { type Rng, makeRng } from '~/three/core/random'

function leafVeins(ctx: CanvasRenderingContext2D, W: number, H: number, rand: Rng, style: 'color' | 'bump') {
  const cx = W / 2
  const isBump = style === 'bump'

  ctx.beginPath()
  ctx.moveTo(cx - W * 0.016, H)
  ctx.quadraticCurveTo(cx - W * 0.006, H * 0.4, cx - 1, 0)
  ctx.lineTo(cx + 1, 0)
  ctx.quadraticCurveTo(cx + W * 0.006, H * 0.4, cx + W * 0.016, H)
  ctx.closePath()
  ctx.fillStyle = isBump ? '#3c3c3c' : 'rgba(196, 214, 140, 0.85)'
  ctx.fill()

  const count = 9
  for (let i = 0; i < count; i++) {
    const t = 0.07 + i * (0.86 / count) + (rand() - 0.5) * 0.02
    const y0 = H * (1 - t)
    for (const side of [-1, 1]) {
      const reach = W * (0.36 + rand() * 0.06) * Math.sin(Math.PI * Math.min(0.98, t * 0.95 + 0.05)) ** 0.6
      const x1 = cx + side * reach
      const y1 = y0 - H * (0.07 + rand() * 0.02)
      ctx.beginPath()
      ctx.moveTo(cx, y0)
      ctx.quadraticCurveTo(cx + side * reach * 0.45, y0 - H * 0.012, x1, y1)
      ctx.quadraticCurveTo(cx + side * reach * 1.04, y1 - H * 0.05, cx + side * reach * 0.88, y1 - H * 0.095)
      ctx.lineWidth = isBump ? 5 : 3.2 * (1 - t * 0.5)
      ctx.strokeStyle = isBump ? 'rgba(60,60,60,0.9)' : 'rgba(185, 206, 128, 0.42)'
      ctx.stroke()
    }
  }

  const lines = isBump ? 900 : 1400
  for (let i = 0; i < lines; i++) {
    const x = cx + (rand() - 0.5) * W * 0.9
    const y = rand() * H
    const a = rand() * Math.PI
    const len = 6 + rand() * 18
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    ctx.lineWidth = isBump ? 1.6 : 1
    ctx.strokeStyle = isBump ? 'rgba(90,90,90,0.35)' : 'rgba(170, 196, 110, 0.07)'
    ctx.stroke()
  }
}

export function createLeafTextures(seed = 7) {
  const W = 512
  const H = 1024
  const rand = makeRng(seed)

  const { canvas, ctx } = makeCanvas(W, H)
  const base = ctx.createLinearGradient(0, H, 0, 0)
  base.addColorStop(0, '#557f35')
  base.addColorStop(0.45, '#3f6c2a')
  base.addColorStop(1, '#335e22')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, W, H)

  const edge = ctx.createLinearGradient(0, 0, W, 0)
  edge.addColorStop(0, 'rgba(176, 190, 96, 0.32)')
  edge.addColorStop(0.16, 'rgba(0,0,0,0)')
  edge.addColorStop(0.84, 'rgba(0,0,0,0)')
  edge.addColorStop(1, 'rgba(176, 190, 96, 0.32)')
  ctx.fillStyle = edge
  ctx.fillRect(0, 0, W, H)

  for (let i = 0; i < 260; i++) {
    const x = rand() * W
    const y = rand() * H
    const r = 20 + rand() * 70
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    const dark = rand() > 0.5
    g.addColorStop(0, dark ? 'rgba(25, 52, 18, 0.10)' : 'rgba(150, 180, 90, 0.07)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  leafVeins(ctx, W, H, makeRng(seed + 11), 'color')

  for (let i = 0; i < 26000; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.05)'
    ctx.fillRect(rand() * W, rand() * H, 1.5, 1.5)
  }

  const bump = makeCanvas(W, H)
  bump.ctx.fillStyle = '#808080'
  bump.ctx.fillRect(0, 0, W, H)
  for (let i = 0; i < 500; i++) {
    const x = rand() * W
    const y = rand() * H
    const r = 8 + rand() * 22
    const g = bump.ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(170,170,170,0.35)')
    g.addColorStop(1, 'rgba(128,128,128,0)')
    bump.ctx.fillStyle = g
    bump.ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  bump.ctx.filter = 'blur(1.5px)'
  leafVeins(bump.ctx, W, H, makeRng(seed + 11), 'bump')
  bump.ctx.filter = 'none'

  return {
    map: toTexture(canvas),
    bump: toTexture(bump.canvas, { color: false })
  }
}
