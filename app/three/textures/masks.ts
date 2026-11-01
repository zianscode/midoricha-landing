import { makeCanvas } from '~/three/core/canvas'

export function paintRadialAlpha(inner = 0, outer = 1, size = 256) {
  const { canvas, ctx } = makeCanvas(size, size)
  const g = ctx.createRadialGradient(size / 2, size / 2, (size / 2) * inner, size / 2, size / 2, (size / 2) * outer)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.5, '#777777')
  g.addColorStop(1, '#000000')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return { map: canvas }
}

export function paintNetAlpha() {
  const S = 128
  const { canvas, ctx } = makeCanvas(S, S)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, S, S)
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 3
  for (let i = 0; i <= S; i += 8) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, S)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(S, i)
    ctx.stroke()
  }
  return { map: canvas }
}
