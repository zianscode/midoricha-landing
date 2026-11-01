import { makeCanvas } from '~/three/core/canvas'
import { makeRng } from '~/three/core/random'

export function paintGranite(seed = 9) {
  const W = 1024
  const H = 512
  const rand = makeRng(seed)
  const color = makeCanvas(W, H)
  const bump = makeCanvas(W, H)
  color.ctx.fillStyle = '#7b7972'
  color.ctx.fillRect(0, 0, W, H)
  bump.ctx.fillStyle = '#808080'
  bump.ctx.fillRect(0, 0, W, H)

  for (let i = 0; i < 160; i++) {
    const x = rand() * W
    const y = rand() * H
    const r = 30 + rand() * 120
    const g = color.ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, rand() > 0.5 ? 'rgba(60,58,54,0.18)' : 'rgba(160,156,146,0.15)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    color.ctx.fillStyle = g
    color.ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  const palette = ['#2a2927', '#3b3936', '#d9d5cc', '#a7a399', '#55524c', '#efece4']
  for (let i = 0; i < 52000; i++) {
    const x = rand() * W
    const y = rand() * H
    const s = 0.6 + rand() * (rand() > 0.97 ? 4 : 1.8)
    const col = palette[Math.floor(rand() * palette.length)]!
    color.ctx.fillStyle = col
    color.ctx.globalAlpha = 0.5 + rand() * 0.5
    color.ctx.fillRect(x, y, s, s * (0.6 + rand() * 0.8))
    if (rand() > 0.6) {
      bump.ctx.fillStyle = rand() > 0.5 ? '#a0a0a0' : '#5c5c5c'
      bump.ctx.fillRect(x, y, s, s)
    }
  }
  color.ctx.globalAlpha = 1

  return {
    map: color.canvas,
    bump: bump.canvas
  }
}
