<script setup lang="ts">
import type { LeafFact } from '~/types/content'

defineProps<{ facts: LeafFact[]; revealedCount: number }>()
</script>

<template>
  <ol class="border-t border-ink/10">
    <li
      v-for="(fact, index) in facts"
      :key="fact.title"
      class="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-ink/10 py-7 transition-opacity duration-700 ease-calm md:grid-cols-[4rem_1fr] md:py-9"
      :class="index < revealedCount ? 'opacity-100' : 'opacity-35'"
    >
      <span class="tabular-nums text-[13px] text-matcha">{{ padIndex(index) }}</span>
      <div>
        <h3 class="font-display text-[1.4rem] font-semibold tracking-[-0.03em] text-forest md:text-[1.75rem]">{{ fact.title }}</h3>
        <p class="mt-2 max-w-md text-[15px] leading-relaxed text-ink/60">{{ fact.text }}</p>
      </div>
    </li>
  </ol>
</template>
