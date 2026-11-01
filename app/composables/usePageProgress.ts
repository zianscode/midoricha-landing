export function usePageProgress() {
  const progress = ref(0)

  useScrollFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    progress.value = scrollable > 0 ? clamp01(window.scrollY / scrollable) : 0
  })

  return progress
}
