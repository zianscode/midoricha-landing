import type { Ref } from 'vue'

interface ViewportProgressOptions {
  enter?: number
  leave?: number
}

export function useViewportProgress(target: Readonly<Ref<HTMLElement | null>>, { enter = 0.85, leave = 0.45 }: ViewportProgressOptions = {}) {
  const progress = ref(0)

  useScrollFrame(() => {
    const element = target.value
    if (!element) return
    const rect = element.getBoundingClientRect()
    const viewport = window.innerHeight
    const travelled = enter * viewport - rect.top
    const distance = rect.height + (enter - leave) * viewport
    progress.value = clamp01(travelled / distance)
  })

  return progress
}
