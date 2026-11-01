<script setup lang="ts">
import type { ModernUse } from '~/types/content'

const props = defineProps<{
  use: ModernUse
  index: number
  total: number
  depth: number
  image?: string
  showFallback: boolean
}>()

const SURFACES = [
  'bg-white text-forest',
  'bg-forest text-white',
  'bg-soft text-forest',
  'bg-deep text-white'
]

const MAX_SHRINK = 0.08
const MAX_SHADE = 0.35

const loaded = ref(false)
const surface = computed(() => SURFACES[props.index % SURFACES.length])
const transform = computed(() => `scale(${1 - props.depth * MAX_SHRINK})`)
</script>

<template>
  <article
    class="relative grid h-[min(78svh,44rem)] origin-top grid-rows-[1.2fr_1fr] overflow-hidden rounded-4xl shadow-[0_30px_60px_-30px_rgba(11,26,19,0.45)] md:grid-cols-2 md:grid-rows-1"
    :class="surface"
    :style="{ transform }"
  >
    <div class="relative overflow-hidden bg-cream">
      <img
        v-if="image"
        :src="image"
        :alt="use.alt"
        class="size-full object-cover transition-opacity duration-1400"
        :class="loaded ? 'opacity-100' : 'opacity-0'"
        @load="loaded = true"
      />
      <div
        v-if="showFallback"
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,var(--color-leaf)_0%,transparent_65%)] opacity-50"
        aria-hidden="true"
      />
    </div>

    <div class="flex flex-col justify-between p-7 md:p-12">
      <div>
        <p class="tabular-nums text-[13px] opacity-60">{{ padIndex(index) }} / {{ padIndex(total - 1) }}</p>
        <h3 class="display mt-4 text-[clamp(2.6rem,6vw,6rem)]">{{ use.title }}</h3>
      </div>
      <p class="max-w-sm text-[15px] leading-relaxed opacity-70 md:text-[17px]">{{ use.text }}</p>
    </div>

    <div class="pointer-events-none absolute inset-0 bg-forest" :style="{ opacity: depth * MAX_SHADE }" aria-hidden="true" />
  </article>
</template>
