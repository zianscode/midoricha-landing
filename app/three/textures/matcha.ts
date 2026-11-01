import { makeCanvas } from '~/three/core/canvas'
import { makeRng } from '~/three/core/random'

export function paintPowder(seed = 13) {
  const S = 512
  const rand = makeRng(seed)
  const color = makeCanvas(S, S)
  const bump = makeCanvas(S, S)
  color.ctx.fillStyle = '#6a8a2c'
  color.ctx.fillRect(0, 0, S, S)
  bump.ctx.fillStyle = '#808080'
  bump.ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 46000; i++) {
    const x = rand() * S
    const y = rand() * S
    const r = rand()
    color.ctx.fillStyle = r > 0.6 ? 'rgba(150, 178, 84, 0.4)' : r > 0.25 ? 'rgba(78, 106, 32, 0.4)' : 'rgba(48, 70, 22, 0.35)'
    const s = 0.8 + rand() * 1.6
    color.ctx.fillRect(x, y, s, s)
    bump.ctx.fillStyle = r > 0.5 ? '#b0b0b0' : '#545454'
    bump.ctx.fillRect(x, y, s, s)
  }
  for (let i = 0; i < 220; i++) {
    const x = rand() * S
    const y = rand() * S
    const r = 2 + rand() * 5
    const g = bump.ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, '#d0d0d0')
    g.addColorStop(1, 'rgba(128,128,128,0)')
    bump.ctx.fillStyle = g
    bump.ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  return {
    map: color.canvas,
    bump: bump.canvas
  }
}

export function paintFoam(seed = 21) {
  const S = 1024
  const rand = makeRng(seed)
  const color = makeCanvas(S, S)
  const bump = makeCanvas(S, S)
  const c = S / 2

  const base = color.ctx.createRadialGradient(c * 0.92, c * 0.9, 0, c, c, c)
  base.addColorStop(0, '#9fbd5a')
  base.addColorStop(0.7, '#8aab45')
  base.addColorStop(0.96, '#6e8f34')
  base.addColorStop(1, '#4f6d25')
  color.ctx.fillStyle = base
  color.ctx.fillRect(0, 0, S, S)
  bump.ctx.fillStyle = '#808080'
  bump.ctx.fillRect(0, 0, S, S)

  color.ctx.strokeStyle = 'rgba(200, 220, 140, 0.08)'
  for (let i = 0; i < 40; i++) {
    color.ctx.lineWidth = 2 + rand() * 6
    color.ctx.beginPath()
    color.ctx.arc(c + (rand() - 0.5) * 60, c + (rand() - 0.5) * 60, 80 + rand() * 340, rand() * 6, rand() * 6 + 1.2)
    color.ctx.stroke()
  }

  for (let i = 0; i < 52000; i++) {
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * c * 0.98
    const x = c + Math.cos(a) * d
    const y = c + Math.sin(a) * d
    const big = rand() > 0.995
    const r = big ? 2.5 + rand() * 4 : 0.5 + rand() * 1.4
    color.ctx.fillStyle = rand() > 0.35 ? 'rgba(212, 228, 160, 0.32)' : 'rgba(70, 96, 30, 0.3)'
    color.ctx.beginPath()
    color.ctx.arc(x, y, r, 0, Math.PI * 2)
    color.ctx.fill()
    bump.ctx.fillStyle = big ? 'rgba(220,220,220,0.9)' : 'rgba(180,180,180,0.5)'
    bump.ctx.beginPath()
    bump.ctx.arc(x, y, r, 0, Math.PI * 2)
    bump.ctx.fill()
  }

  return {
    map: color.canvas,
    bump: bump.canvas
  }
}
