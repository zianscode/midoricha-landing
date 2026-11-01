import { makeCanvas } from '~/three/core/canvas'
import { fbm2, noise2 } from '~/three/core/noise'
import { makeRng } from '~/three/core/random'

export type GlazeName = 'charcoal' | 'ash' | 'celadon'

const GLAZES: Record<GlazeName, { base: string; light: string; dark: string; rim: string; clay: string; inner: string }> = {
  charcoal: { base: '#262722', light: '#3d3c35', dark: '#161714', rim: '#5d4631', clay: '#b38d66', inner: '#2a2b26' },
  ash: { base: '#d6d0c2', light: '#e7e2d6', dark: '#a9a293', rim: '#8a6c4e', clay: '#a67c57', inner: '#dcd6c9' },
  celadon: { base: '#a9b3a0', light: '#c1c9b8', dark: '#879180', rim: '#6d6150', clay: '#b08a63', inner: '#b2bba9' }
}

export function paintCeramic(glaze: GlazeName, rimV: number, footV: number, seed = 5) {
  const W = 1024
  const H = 512
  const c = GLAZES[glaze]
  const rand = makeRng(seed)
  const vy = (v: number) => H * (1 - v)

  const color = makeCanvas(W, H)
  const rough = makeCanvas(W, H)
  const bump = makeCanvas(W, H)

  color.ctx.fillStyle = c.base
  color.ctx.fillRect(0, 0, W, H)
  rough.ctx.fillStyle = '#8c8c8c'
  rough.ctx.fillRect(0, 0, W, H)
  bump.ctx.fillStyle = '#808080'
  bump.ctx.fillRect(0, 0, W, H)

  for (let i = 0; i < 520; i++) {
    const x = rand() * W
    const y = rand() * H
    const r = 10 + rand() * 60
    const g = color.ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, rand() > 0.5 ? c.light : c.dark)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    color.ctx.globalAlpha = 0.18 + rand() * 0.2
    color.ctx.fillStyle = g
    color.ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  color.ctx.globalAlpha = 1

  const rimY = vy(rimV)
  const lip = color.ctx.createLinearGradient(0, rimY - 26, 0, rimY + 26)
  lip.addColorStop(0, 'rgba(0,0,0,0)')
  lip.addColorStop(0.5, c.rim)
  lip.addColorStop(1, 'rgba(0,0,0,0)')
  color.ctx.globalAlpha = 0.75
  color.ctx.fillStyle = lip
  color.ctx.fillRect(0, rimY - 26, W, 52)
  color.ctx.globalAlpha = 1

  for (let i = 0; i < 70; i++) {
    const y = rand() * H
    bump.ctx.strokeStyle = `rgba(${rand() > 0.5 ? '160,160,160' : '96,96,96'},${0.25 + rand() * 0.3})`
    bump.ctx.lineWidth = 1 + rand() * 3
    bump.ctx.beginPath()
    bump.ctx.moveTo(0, y)
    for (let x = 0; x <= W; x += 32) bump.ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 1.5)
    bump.ctx.stroke()
  }

  const footTop = vy(footV)
  color.ctx.fillStyle = c.clay
  rough.ctx.fillStyle = '#f0f0f0'
  for (const ctx of [color.ctx, rough.ctx]) {
    ctx.beginPath()
    ctx.moveTo(0, H)
    for (let x = 0; x <= W; x += 4) {
      const n = fbm2(x * 0.012, 3.3) - 0.5
      const drip = Math.max(0, noise2(x * 0.045, 9.1) - 0.72) * 260
      ctx.lineTo(x, footTop + n * 26 + drip)
    }
    ctx.lineTo(W, H)
    ctx.closePath()
    ctx.fill()
  }
  for (let i = 0; i < 4000; i++) {
    const x = rand() * W
    const y = footTop + rand() * (H - footTop)
    color.ctx.fillStyle = rand() > 0.5 ? 'rgba(80,50,30,0.35)' : 'rgba(240,220,190,0.3)'
    color.ctx.fillRect(x, y, 1.5, 1.5)
  }

  for (let i = 0; i < 2600; i++) {
    const x = rand() * W
    const y = rand() * H
    const s = rand() * 2.2 + 0.4
    color.ctx.fillStyle = glaze === 'charcoal' ? 'rgba(120, 96, 70, 0.35)' : 'rgba(70, 52, 38, 0.45)'
    color.ctx.beginPath()
    color.ctx.arc(x, y, s, 0, Math.PI * 2)
    color.ctx.fill()
    bump.ctx.fillStyle = 'rgba(40,40,40,0.6)'
    bump.ctx.beginPath()
    bump.ctx.arc(x, y, s * 0.8, 0, Math.PI * 2)
    bump.ctx.fill()
  }

  const well = color.ctx.createLinearGradient(0, vy(1), 0, vy(rimV + 0.12))
  well.addColorStop(0, c.inner)
  well.addColorStop(1, 'rgba(0,0,0,0)')
  color.ctx.fillStyle = well
  color.ctx.globalAlpha = 0.5
  color.ctx.fillRect(0, 0, W, vy(rimV + 0.12))
  color.ctx.globalAlpha = 1
  rough.ctx.fillStyle = 'rgba(110,110,110,0.6)'
  rough.ctx.fillRect(0, 0, W, vy(rimV + 0.2))

  return {
    map: color.canvas,
    roughness: rough.canvas,
    bump: bump.canvas
  }
}
