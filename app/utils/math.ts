export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function padIndex(index: number) {
  return String(index + 1).padStart(2, '0')
}
