<script setup lang="ts">
import { brewComplete as content } from '~/content/brew'
import type { BrewSummary } from '~/types/brew'

defineProps<{ summary: BrewSummary }>()
const emit = defineEmits<{ again: [] }>()

const SUMMARY_KEYS = ['temperature', 'water', 'whisk'] as const
</script>

<template>
  <section class="max-w-xl">
    <div class="flex items-start gap-5">
      <span class="tategaki font-jp text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] text-leaf" lang="ja">{{ content.kanji }}</span>
      <div class="pt-2">
        <p class="text-[14px] italic text-shu-light">{{ content.reading }}</p>
        <h1 class="display mt-3 text-[clamp(2.6rem,5.5vw,5rem)] text-white">{{ content.meaning }}</h1>
        <p class="mt-5 max-w-sm text-[16px] leading-relaxed text-white/70">{{ content.text }}</p>
      </div>
    </div>

    <dl class="mt-10 grid grid-cols-3 gap-3">
      <div v-for="key in SUMMARY_KEYS" :key="key" class="rounded-3xl border border-white/10 bg-white/5 p-5">
        <dt class="text-[13px] text-white/50">{{ content.summary[key] }}</dt>
        <dd class="display mt-2 text-[1.75rem] tabular-nums text-white">{{ summary[key] }}</dd>
      </div>
    </dl>

    <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
      <BaseButton tone="light" @click="emit('again')">{{ content.again }}</BaseButton>
      <BaseArrowLink href="/#ritual" tone="light">{{ content.back }}</BaseArrowLink>
    </div>
  </section>
</template>
