import { makeCanvas } from '~/three/core/canvas'
import { makeRng } from '~/three/core/random'

export function paintEnso() {
  const S = 1024
  const rand = makeRng(88)
  const color = makeCanvas(S, S)
  const bump = makeCanvas(S, S)
  bump.ctx.fillStyle = '#000'
  bump.ctx.fillRect(0, 0, S, S)
  const start = -2.2
  const sweep = Math.PI * 1.82
  for (let i = 0; i < 150000; i++) {
    const u = rand()
    const a = start + u * sweep
    const landing = Math.min(1, u / 0.06)
    const weight = Math.sqrt(landing) * Math.pow(1 - u, 0.5) * (0.8 + 0.2 * Math.sin(u * 7))
    const width = 6 + 46 * weight
    if (u > 0.75 && rand() > (1 - u) * 3.2) continue
    const spread = (rand() + rand() - 1) * width
    const r = 270 + spread + Math.sin(u * 11) * 7
    const x = S / 2 + Math.cos(a) * r
    const y = S / 2 + Math.sin(a) * r
    const s = 0.8 + rand() * 2
    color.ctx.fillStyle = rand() > 0.3 ? 'rgba(112, 142, 48, 0.8)' : 'rgba(150, 178, 82, 0.6)'
    color.ctx.fillRect(x, y, s, s)
    bump.ctx.fillStyle = 'rgba(255,255,255,0.18)'
    bump.ctx.fillRect(x, y, s * 1.6, s * 1.6)
  }
  return { map: color.canvas, bump: bump.canvas }
}

export function paintDusting() {
  const S = 1024
  const rand = makeRng(54)
  const { canvas, ctx } = makeCanvas(S, S)
  for (let i = 0; i < 150000; i++) {
    const a = rand() * Math.PI * 2
    const d = Math.pow(rand(), 0.85) * S * 0.36 * (1 + (rand() - 0.5) * 0.1)
    const x = S / 2 + Math.cos(a) * d
    const y = S / 2 + Math.sin(a) * d
    ctx.fillStyle = rand() > 0.35 ? 'rgba(104, 136, 42, 0.85)' : 'rgba(80, 108, 34, 0.8)'
    const s = 0.8 + rand() * 1.6
    ctx.fillRect(x, y, s, s)
  }
  return { map: canvas }
}
