const MAX_STEP_SECONDS = 0.1

export function useHoldAction(onTick: (seconds: number, heldSeconds: number) => void) {
  const holding = ref(false)
  let heldSeconds = 0

  const { pause, resume } = useRafFn(
    ({ delta }) => {
      const seconds = Math.min(MAX_STEP_SECONDS, delta / 1000)
      heldSeconds += seconds
      onTick(seconds, heldSeconds)
    },
    { immediate: false }
  )

  function start() {
    if (holding.value) return
    heldSeconds = 0
    holding.value = true
    resume()
  }

  function stop() {
    if (!holding.value) return
    holding.value = false
    pause()
  }

  onBeforeUnmount(stop)

  return { holding: readonly(holding), start, stop }
}
