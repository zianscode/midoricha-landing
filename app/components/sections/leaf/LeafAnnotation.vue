<script setup lang="ts">
import type { LeafFact } from '~/types/content'

defineProps<{ fact: LeafFact; index: number; visible: boolean }>()
</script>

<template>
  <div
    class="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 transition-[opacity,transform] duration-700 ease-calm"
    :class="visible ? 'opacity-100' : 'pointer-events-none translate-y-1 opacity-0'"
    :style="{ left: `${fact.pin.x}%`, top: `${fact.pin.y}%` }"
  >
    <span class="relative grid size-4 place-items-center">
      <span class="absolute inset-0 animate-ping rounded-full bg-matcha/40" />
      <span class="size-2 rounded-full bg-matcha ring-2 ring-white" />
    </span>
    <span class="rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium tracking-[-0.01em] text-forest shadow-[0_6px_20px_-12px_rgba(14,19,17,0.35)] backdrop-blur">
      <span class="tabular-nums text-ink/40">{{ padIndex(index) }}</span>
      {{ fact.title }}
    </span>
  </div>
</template>
