export type DeviceTier = 'high' | 'low' | 'none'

interface NavigatorCapabilities extends Navigator {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

const MIN_CORES = 2
const MIN_MEMORY_GB = 2
const HIGH_TIER_MIN_CORES = 4
const HIGH_TIER_MIN_MEMORY_GB = 4

let cachedTier: DeviceTier | undefined

function matches(query: string) {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

export function prefersReducedMotion() {
  return matches('(prefers-reduced-motion: reduce)')
}

export function hasFinePointer() {
  return matches('(pointer: fine)')
}

export function isSmallViewport() {
  return matches('(max-width: 767px)')
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

function detectTier(): DeviceTier {
  const nav = navigator as NavigatorCapabilities
  const cores = nav.hardwareConcurrency ?? HIGH_TIER_MIN_CORES
  const memory = nav.deviceMemory ?? HIGH_TIER_MIN_MEMORY_GB * 2

  const constrained = nav.connection?.saveData || memory <= MIN_MEMORY_GB || cores <= MIN_CORES
  if (constrained || !supportsWebGL()) return 'none'

  const modest = memory <= HIGH_TIER_MIN_MEMORY_GB || cores <= HIGH_TIER_MIN_CORES
  return isSmallViewport() || !hasFinePointer() || modest ? 'low' : 'high'
}

export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'low'
  cachedTier ??= detectTier()
  return cachedTier
}
