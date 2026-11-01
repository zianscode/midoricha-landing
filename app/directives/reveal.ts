import type { Directive } from 'vue'

export type RevealValue = number | { delay?: number; y?: number } | undefined

const DEFAULT_OFFSET_PX = 18
const REVEALED_CLASS = 'is-revealed'
const VIEWPORT_MARGIN = '0px 0px -8% 0px'

function revealStyle(value: RevealValue) {
  const delay = typeof value === 'number' ? value : (value?.delay ?? 0)
  const offset = typeof value === 'object' ? (value.y ?? DEFAULT_OFFSET_PX) : DEFAULT_OFFSET_PX
  return `--reveal-delay:${delay}s;--reveal-y:${offset}px`
}

export function createRevealDirective(): Directive<HTMLElement, RevealValue> {
  let observer: IntersectionObserver | undefined

  function revealVisible(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add(REVEALED_CLASS)
      observer?.unobserve(entry.target)
    }
  }

  function getObserver() {
    observer ??= new IntersectionObserver(revealVisible, { rootMargin: VIEWPORT_MARGIN })
    return observer
  }

  return {
    getSSRProps: (binding) => ({ 'data-reveal': '', style: revealStyle(binding.value) }),
    created(element, binding) {
      element.setAttribute('data-reveal', '')
      element.style.cssText += `;${revealStyle(binding.value)}`
    },
    mounted(element) {
      getObserver().observe(element)
    },
    unmounted(element) {
      observer?.unobserve(element)
    }
  }
}
