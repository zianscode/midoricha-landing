import type { Ref } from 'vue'

const FALLBACK_HEIGHT = '420vh'

type ElementRef = Readonly<Ref<HTMLElement | null>>

export function useHorizontalScroll(section: ElementRef, track: ElementRef) {
  const { width: trackWidth } = useElementSize(track, undefined, { box: 'border-box' })
  const { width: viewportWidth, height: viewportHeight } = useWindowSize({ includeScrollbar: false })
  const { progress } = useSectionProgress(section)

  const distance = computed(() => Math.max(0, trackWidth.value - viewportWidth.value))
  const sectionHeight = computed(() => (trackWidth.value ? `${distance.value + viewportHeight.value}px` : FALLBACK_HEIGHT))
  const offset = computed(() => -progress.value * distance.value)

  return { progress, offset, sectionHeight }
}
