import type { Ref } from 'vue'
import type { StillKind } from '~/three/stills/renderStills'

const STILL_SIZE = {
  high: [960, 1200],
  low: [640, 800]
} as const

const PRELOAD_MARGIN = '80% 0px'

export function useStillImages(target: Readonly<Ref<HTMLElement | null>>, kinds: StillKind[]) {
  const images = ref<Partial<Record<StillKind, string>>>({})
  const enabled = ref(true)
  let cancelIdle: (() => void) | undefined
  let unmounted = false

  function release(urls: Partial<Record<StillKind, string>>) {
    Object.values(urls).forEach((url) => URL.revokeObjectURL(url))
  }

  async function render(tier: keyof typeof STILL_SIZE) {
    const { renderStills } = await import('~/three/stills/renderStills')
    const [width, height] = STILL_SIZE[tier]
    const rendered = await renderStills(kinds, width, height)
    if (unmounted) release(rendered)
    else images.value = rendered
  }

  const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (!entry?.isIntersecting) return
      stop()
      const tier = getDeviceTier()
      if (tier === 'none') {
        enabled.value = false
        return
      }
      cancelIdle = whenIdle(() => render(tier).catch((error) => console.error('[stills]', error)))
    },
    { rootMargin: PRELOAD_MARGIN }
  )

  onBeforeUnmount(() => {
    unmounted = true
    cancelIdle?.()
    release(images.value)
  })

  return { images, enabled }
}
