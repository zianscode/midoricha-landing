import { makeCanvas } from '~/three/core/canvas'
import { makeRng } from '~/three/core/random'

export function paintFoliage() {
  const W = 512
  const H = 512
  const rand = makeRng(77)
  const { canvas, ctx } = makeCanvas(W, H)
  ctx.fillStyle = '#263f1d'
  ctx.fillRect(0, 0, W, H)
  for (let i = 0; i < 9000; i++) {
    const x = rand() * W
    const y = rand() * H
    const a = rand() * Math.PI
    const l = 3 + rand() * 7
    const shade = rand()
    ctx.fillStyle = shade > 0.82 ? '#7a9d48' : shade > 0.55 ? '#557c35' : shade > 0.25 ? '#3d6128' : '#1f3518'
    for (const [dx, dy] of [[0, 0], [W, 0], [-W, 0], [0, H], [0, -H]]) {
      ctx.beginPath()
      ctx.ellipse(x + dx!, y + dy!, l, l * 0.45, a, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  return { map: canvas }
}
