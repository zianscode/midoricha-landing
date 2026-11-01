<script setup lang="ts">
import type { TextItem } from '~/types/content'

const props = defineProps<{ steps: TextItem[] }>()

const list = useTemplateRef<HTMLElement>('list')
const progress = useViewportProgress(list, { enter: 0.9, leave: 0.6 })
const reachedCount = computed(() => Math.ceil(progress.value * props.steps.length))
</script>

<template>
  <div ref="list" class="relative">
    <span class="absolute inset-x-0 top-2.75 hidden h-px md:block bg-cream/15" aria-hidden="true" />
    <span
      class="absolute inset-x-0 top-2.75 hidden h-px md:block origin-left bg-leaf"
      :style="{ transform: `scaleX(${progress})` }"
      aria-hidden="true"
    />

    <ol class="relative grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      <li v-for="(step, index) in steps" :key="step.title">
        <span
          class="grid size-6 place-items-center rounded-full border transition-colors duration-500"
          :class="index < reachedCount ? 'border-leaf bg-leaf' : 'border-cream/30 bg-forest'"
        >
          <span class="size-1.5 rounded-full transition-colors duration-500" :class="index < reachedCount ? 'bg-forest' : 'bg-cream/30'" />
        </span>
        <p class="mt-6 tabular-nums text-[12px] text-leaf/70">{{ padIndex(index) }}</p>
        <p
          class="display mt-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-none transition-colors duration-500"
          :class="index < reachedCount ? 'text-white' : 'text-white/30'"
        >
          {{ step.title }}
        </p>
        <p class="mt-3 max-w-60 text-[14px] leading-relaxed text-cream/55">{{ step.text }}</p>
      </li>
    </ol>
  </div>
</template>
