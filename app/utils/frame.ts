export function createFrameScheduler(callback: () => void) {
  let frame = 0

  function schedule() {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      callback()
    })
  }

  function cancel() {
    cancelAnimationFrame(frame)
    frame = 0
  }

  return { schedule, cancel }
}

export function whenNextFrame(callback: () => void) {
  const frame = requestAnimationFrame(() => callback())
  return () => cancelAnimationFrame(frame)
}
