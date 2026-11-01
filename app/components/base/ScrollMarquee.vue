<script setup lang="ts">
const props = withDefaults(defineProps<{ items: string[]; speed?: number; outlined?: boolean }>(), {
  speed: 0.3,
  outlined: false
})

const REPEATS = 4

const segments = useTemplateRef<HTMLElement[]>('segments')
const firstSegment = computed(() => segments.value?.[0] ?? null)
const { width: segmentWidth } = useElementSize(firstSegment)
const { y: scrollY } = useWindowScroll()

const offset = computed(() => {
  if (!segmentWidth.value) return 0
  const travelled = (scrollY.value * props.speed) % segmentWidth.value
  return travelled > 0 ? travelled - segmentWidth.value : travelled
})
</script>

<template>
  <div class="overflow-hidden" aria-hidden="true">
    <div class="flex w-max will-change-transform" :style="{ transform: `translate3d(${offset}px, 0, 0)` }">
      <div v-for="copy in REPEATS" :key="copy" ref="segments" class="flex shrink-0 items-center">
        <template v-for="item in items" :key="item">
          <span class="display px-[0.18em] text-[clamp(3.4rem,10vw,9rem)] leading-none" :class="{ 'text-outline': outlined }">
            {{ item }}
          </span>
          <BaseLeafMark class="size-[clamp(1.5rem,3vw,2.75rem)] shrink-0 text-matcha" />
        </template>
      </div>
    </div>
  </div>
</template>
