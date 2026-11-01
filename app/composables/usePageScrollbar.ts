import type { Ref } from 'vue'

const MIN_THUMB_PX = 48

interface DragState {
  pointerY: number
  scrollY: number
}

export function usePageScrollbar(track: Readonly<Ref<HTMLElement | null>>) {
  const thumbHeight = ref(0)
  const thumbOffset = ref(0)
  const dragging = ref(false)
  const { jumpTo } = useSmoothScroll()
  let drag: DragState | null = null

  function scrollable() {
    return document.documentElement.scrollHeight - window.innerHeight
  }

  function travel() {
    return (track.value?.clientHeight ?? 0) - thumbHeight.value
  }

  function measure() {
    const trackHeight = track.value?.clientHeight ?? 0
    const documentHeight = document.documentElement.scrollHeight
    thumbHeight.value = Math.max(MIN_THUMB_PX, trackHeight * (window.innerHeight / documentHeight))
    const distance = scrollable()
    thumbOffset.value = distance > 0 ? clamp01(window.scrollY / distance) * travel() : 0
  }

  function onPointerDown(event: PointerEvent) {
    drag = { pointerY: event.clientY, scrollY: window.scrollY }
    dragging.value = true
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent) {
    if (!drag || travel() <= 0) return
    const ratio = scrollable() / travel()
    jumpTo(drag.scrollY + (event.clientY - drag.pointerY) * ratio)
  }

  function onPointerUp() {
    drag = null
    dragging.value = false
  }

  useScrollFrame(measure)

  return { thumbHeight, thumbOffset, dragging, onPointerDown, onPointerMove, onPointerUp }
}
