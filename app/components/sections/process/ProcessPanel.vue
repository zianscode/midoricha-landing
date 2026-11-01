<script setup lang="ts">
import type { ProcessStep } from '~/types/content'

defineProps<{ step: ProcessStep; index: number; active: boolean }>()
</script>

<template>
  <li
    class="relative flex h-[min(68svh,40rem)] w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-4xl border p-7 transition-[background-color,border-color,color] duration-700 ease-calm md:w-[min(46vw,44rem)] md:p-10"
    :class="active ? 'border-forest bg-forest text-white' : 'border-ink/10 bg-white text-forest'"
  >
    <div class="flex items-start justify-between gap-6">
      <span
        class="text-outline font-display tabular-nums text-[clamp(5rem,11vw,10rem)] font-medium leading-none tracking-[-0.06em] transition-colors duration-700"
        :class="active ? 'text-leaf' : 'text-ink/20'"
      >
        {{ padIndex(index) }}
      </span>
      <ProcessPlate
        :step="step.id"
        class="size-28 shrink-0 transition-colors duration-700 md:size-44"
        :class="active ? 'text-leaf' : 'text-ink/35'"
      />
    </div>

    <div>
      <h3 class="flex items-center gap-3">
        <ProcessIcon :step="step.id" :class="active ? 'text-leaf' : 'text-matcha'" />
        <span class="display text-[clamp(2rem,3.4vw,3.25rem)]">{{ step.title }}</span>
      </h3>
      <p
        class="mt-4 max-w-md text-[15px] leading-[1.7] transition-colors duration-700 md:text-[16px]"
        :class="active ? 'text-white/70' : 'text-ink/60'"
      >
        {{ step.text }}
      </p>
    </div>
  </li>
</template>
