import type { Ref } from 'vue'

export function useSectionProgress(target: Readonly<Ref<HTMLElement | null>>) {
  const progress = ref(0)

  function measure() {
    const element = target.value
    if (!element) return
    const rect = element.getBoundingClientRect()
    const scrollable = rect.height - window.innerHeight
    const next = scrollable > 0 ? clamp01(-rect.top / scrollable) : 0
    if (next !== progress.value) progress.value = next
  }

  function scrollYAt(value: number) {
    const element = target.value
    if (!element) return 0
    const top = element.getBoundingClientRect().top + window.scrollY
    return top + value * (element.offsetHeight - window.innerHeight)
  }

  useScrollFrame(measure)

  return { progress, scrollYAt }
}
