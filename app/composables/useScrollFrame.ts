export function useScrollFrame(measure: () => void) {
  const frame = createFrameScheduler(measure)

  onMounted(measure)
  onBeforeUnmount(frame.cancel)
  useEventListener(window, 'scroll', frame.schedule, { passive: true })
  useEventListener(window, 'resize', frame.schedule, { passive: true })
}
