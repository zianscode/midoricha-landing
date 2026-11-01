import Lenis from 'lenis'

const LENIS_OPTIONS = { autoRaf: true, duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 }

function canSmoothScroll() {
  return !prefersReducedMotion() && hasFinePointer() && getDeviceTier() !== 'none'
}

export default defineNuxtPlugin(() => {
  const lenis = canSmoothScroll() ? new Lenis(LENIS_OPTIONS) : null
  return { provide: { lenis } }
})
