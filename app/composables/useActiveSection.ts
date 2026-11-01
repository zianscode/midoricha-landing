const VIEWPORT_CENTER_BAND = '-45% 0px -54% 0px'

export function useActiveSection(sectionIds: readonly string[]) {
  const activeIndex = ref(0)
  let observer: IntersectionObserver | undefined

  function onIntersect(entries: IntersectionObserverEntry[]) {
    const visible = entries.find((entry) => entry.isIntersecting)
    if (!visible) return
    activeIndex.value = Math.max(0, sectionIds.indexOf(visible.target.id))
  }

  onMounted(() => {
    observer = new IntersectionObserver(onIntersect, { rootMargin: VIEWPORT_CENTER_BAND })
    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  return activeIndex
}
