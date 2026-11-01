<script setup lang="ts">
import type { JapaneseTerm } from '~/types/content'

defineProps<{ term: JapaneseTerm; seal: string }>()
</script>

<template>
  <figure class="grid-editorial items-center gap-y-10 rounded-4xl bg-paper p-8 md:p-16">
    <div class="col-span-4 flex items-start justify-center gap-4 md:col-span-4">
      <span class="tategaki font-jp text-[clamp(3.5rem,7vw,6rem)] font-bold leading-[1.1] text-forest" lang="ja">
        {{ term.kanji }}
      </span>
      <BaseHanko :text="seal" class="mt-2 -rotate-3" />
    </div>

    <blockquote class="col-span-4 md:col-span-7 md:col-start-6">
      <p class="text-[14px] italic text-shu">{{ term.reading }}</p>
      <p class="display mt-3 text-[clamp(2.2rem,4vw,3.75rem)] text-forest">{{ term.meaning }}</p>
      <ScrollRevealText
        :text="term.text"
        class="mt-8 max-w-xl text-[clamp(1.15rem,1.6vw,1.45rem)] font-medium leading-snug tracking-[-0.02em] text-forest"
      />
    </blockquote>
  </figure>
</template>
