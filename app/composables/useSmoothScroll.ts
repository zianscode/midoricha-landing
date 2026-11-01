const SCROLL_DURATION_S = 1.6

type ScrollTarget = string | number | HTMLElement

function nativeScrollTo(target: ScrollTarget, offset: number) {
  if (typeof target === 'number') {
    window.scrollTo({ top: target })
    return
  }
  const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY + offset })
}

export function useSmoothScroll() {
  const { $lenis } = useNuxtApp()

  function scrollToTarget(target: ScrollTarget, offset = 0) {
    if ($lenis) $lenis.scrollTo(target, { offset, duration: SCROLL_DURATION_S })
    else nativeScrollTo(target, offset)
  }

  function jumpTo(top: number) {
    if ($lenis) $lenis.scrollTo(top, { immediate: true })
    else window.scrollTo({ top })
  }

  function followAnchor(event: MouseEvent, href?: string) {
    if (!href?.startsWith('#')) return
    event.preventDefault()
    scrollToTarget(href)
  }

  return { scrollToTarget, jumpTo, followAnchor }
}
