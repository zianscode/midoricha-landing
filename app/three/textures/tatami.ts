import { makeCanvas } from '~/three/core/canvas'
import { makeRng } from '~/three/core/random'

const SIZE = 512
const ROW_HEIGHT = 6

export function paintTatami(seed = 61) {
  const rand = makeRng(seed)
  const color = makeCanvas(SIZE, SIZE)
  const bump = makeCanvas(SIZE, SIZE)

  color.ctx.fillStyle = '#b3ad7d'
  color.ctx.fillRect(0, 0, SIZE, SIZE)
  bump.ctx.fillStyle = '#808080'
  bump.ctx.fillRect(0, 0, SIZE, SIZE)

  for (let y = 0; y < SIZE; y += ROW_HEIGHT) {
    const shade = rand()
    color.ctx.fillStyle = shade > 0.5 ? 'rgba(214, 206, 152, 0.35)' : 'rgba(120, 118, 70, 0.22)'
    color.ctx.fillRect(0, y, SIZE, ROW_HEIGHT - 1)
    color.ctx.fillStyle = 'rgba(70, 66, 38, 0.28)'
    color.ctx.fillRect(0, y + ROW_HEIGHT - 1, SIZE, 1)
    bump.ctx.fillStyle = '#b4b4b4'
    bump.ctx.fillRect(0, y + 1, SIZE, ROW_HEIGHT - 3)
    bump.ctx.fillStyle = '#4a4a4a'
    bump.ctx.fillRect(0, y + ROW_HEIGHT - 1, SIZE, 1)
  }

  for (let i = 0; i < 1400; i++) {
    const x = rand() * SIZE
    const y = rand() * SIZE
    color.ctx.fillStyle = rand() > 0.5 ? 'rgba(255, 248, 210, 0.08)' : 'rgba(60, 56, 30, 0.08)'
    color.ctx.fillRect(x, y, 6 + rand() * 30, 1.5)
  }

  for (const x of [SIZE * 0.25, SIZE * 0.75]) {
    color.ctx.fillStyle = 'rgba(80, 76, 44, 0.35)'
    color.ctx.fillRect(x, 0, 2, SIZE)
    bump.ctx.fillStyle = '#5a5a5a'
    bump.ctx.fillRect(x, 0, 2, SIZE)
  }

  return {
    map: color.canvas,
    bump: bump.canvas
  }
}
