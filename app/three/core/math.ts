export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}

export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))
