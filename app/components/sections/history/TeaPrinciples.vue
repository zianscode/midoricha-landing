<script setup lang="ts">
import type { JapaneseTerm } from '~/types/content'

defineProps<{ title: string; principles: JapaneseTerm[] }>()
</script>

<template>
  <div>
    <div class="flex items-end justify-between gap-6 border-b border-ink/10 pb-6">
      <h3 class="display text-[clamp(1.8rem,3vw,2.6rem)] text-forest">{{ title }}</h3>
      <p class="font-jp text-[clamp(1.25rem,2vw,1.75rem)] font-bold tracking-[0.2em] text-matcha" lang="ja">
        <span v-for="principle in principles" :key="principle.kanji">{{ principle.kanji }}</span>
      </p>
    </div>

    <ol class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      <li
        v-for="(principle, index) in principles"
        :key="principle.kanji"
        v-reveal="0.08 * index"
        class="group border-b border-ink/10 py-10 sm:odd:pr-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
      >
        <span
          class="block font-jp text-[clamp(5rem,9vw,8rem)] font-bold leading-none text-forest transition-colors duration-500 group-hover:text-matcha"
          lang="ja"
        >
          {{ principle.kanji }}
        </span>
        <p class="mt-6 flex items-baseline gap-3">
          <span class="display text-[1.6rem] text-forest">{{ principle.meaning }}</span>
          <span class="text-[14px] italic text-shu">{{ principle.reading }}</span>
        </p>
        <p class="mt-3 max-w-60 text-[14px] leading-relaxed text-ink/60">{{ principle.text }}</p>
      </li>
    </ol>
  </div>
</template>
