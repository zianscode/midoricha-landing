import type { Ref } from 'vue'

const CLOSE_DELAY_MS = 180

export function useHoverMenu(target: Readonly<Ref<HTMLElement | null>>) {
  const open = ref(false)
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  function close() {
    open.value = false
  }

  function toggle() {
    open.value = !open.value
  }

  function onPointerEnter(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    clearTimeout(closeTimer)
    open.value = true
  }

  function onPointerLeave(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    closeTimer = setTimeout(close, CLOSE_DELAY_MS)
  }

  onClickOutside(target, close)
  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') close()
  })
  onBeforeUnmount(() => clearTimeout(closeTimer))

  return { open, close, toggle, onPointerEnter, onPointerLeave }
}
