<script setup lang="ts">
import type { HistoryEra } from '~/types/content'

const props = defineProps<{ eras: HistoryEra[]; activeIndex: number; idPrefix: string }>()

const fill = computed(() => (props.activeIndex + 0.5) / props.eras.length)
</script>

<template>
  <ol class="relative pl-8 md:pl-14">
    <span class="absolute inset-y-0 left-0 w-px bg-ink/10" aria-hidden="true" />
    <span
      class="absolute inset-y-0 left-0 w-px origin-top bg-matcha transition-transform duration-700 ease-calm"
      :style="{ transform: `scaleY(${fill})` }"
      aria-hidden="true"
    />

    <li
      v-for="(era, index) in eras"
      :id="`${idPrefix}${index}`"
      :key="era.period"
      class="relative py-10 transition-opacity duration-700 ease-calm md:py-14"
      :class="index === activeIndex ? 'opacity-100' : 'opacity-35'"
    >
      <span
        class="absolute -left-8 top-12 size-2.5 -translate-x-1/2 rounded-full ring-4 ring-cream transition-colors duration-500 md:-left-14 md:top-16"
        :class="index <= activeIndex ? 'bg-shu' : 'bg-ink/20'"
        aria-hidden="true"
      />
      <p class="tabular-nums text-[13px] font-medium text-matcha">{{ era.period }}</p>
      <h3 class="mt-2 flex items-baseline gap-3 text-forest">
        <span class="font-jp text-[1.75rem] font-bold leading-none text-matcha md:hidden" aria-hidden="true">{{ era.kanji }}</span>
        <span class="display text-[clamp(1.8rem,3vw,2.6rem)]">{{ era.title }}</span>
      </h3>
      <p class="mt-4 max-w-md text-[15px] leading-[1.7] text-ink/60">{{ era.text }}</p>
    </li>
  </ol>
</template>
