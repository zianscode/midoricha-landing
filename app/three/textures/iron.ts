import { makeCanvas } from '~/three/core/canvas'
import { makeRng } from '~/three/core/random'

const SIZE = 512
const DOT_SPACING = 18

export function paintIron(seed = 71) {
  const rand = makeRng(seed)
  const color = makeCanvas(SIZE, SIZE)
  const bump = makeCanvas(SIZE, SIZE)

  color.ctx.fillStyle = '#2c2a26'
  color.ctx.fillRect(0, 0, SIZE, SIZE)
  bump.ctx.fillStyle = '#6a6a6a'
  bump.ctx.fillRect(0, 0, SIZE, SIZE)

  for (let i = 0; i < 900; i++) {
    const x = rand() * SIZE
    const y = rand() * SIZE
    const radius = 4 + rand() * 18
    const gradient = color.ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, rand() > 0.7 ? 'rgba(110, 72, 44, 0.35)' : 'rgba(18, 17, 15, 0.4)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    color.ctx.fillStyle = gradient
    color.ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }

  for (let row = 0; row * DOT_SPACING < SIZE + DOT_SPACING; row++) {
    const offset = row % 2 ? DOT_SPACING / 2 : 0
    for (let x = offset; x < SIZE + DOT_SPACING; x += DOT_SPACING) {
      const y = row * DOT_SPACING
      const gradient = bump.ctx.createRadialGradient(x, y, 0, x, y, 6)
      gradient.addColorStop(0, '#ffffff')
      gradient.addColorStop(1, 'rgba(106, 106, 106, 0)')
      bump.ctx.fillStyle = gradient
      bump.ctx.fillRect(x - 6, y - 6, 12, 12)
      color.ctx.fillStyle = 'rgba(70, 66, 58, 0.5)'
      color.ctx.beginPath()
      color.ctx.arc(x, y, 3, 0, Math.PI * 2)
      color.ctx.fill()
    }
  }

  return {
    map: color.canvas,
    bump: bump.canvas
  }
}
