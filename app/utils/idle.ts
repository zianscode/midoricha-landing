const IDLE_TIMEOUT_MS = 1200
const FALLBACK_DELAY_MS = 120

export function whenIdle(callback: () => void, timeout = IDLE_TIMEOUT_MS) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(callback, FALLBACK_DELAY_MS)
  return () => clearTimeout(id)
}
