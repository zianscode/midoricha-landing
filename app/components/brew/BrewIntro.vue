<script setup lang="ts">
import { brewIntro as content } from '~/content/brew'

const emit = defineEmits<{ begin: [] }>()
</script>

<template>
  <section class="max-w-xl">
    <p class="flex items-center gap-3 text-[13px] font-medium text-leaf">
      <span class="font-jp text-[17px] font-bold" lang="ja">{{ content.kanji }}</span>
      <span class="size-1 rounded-full bg-current opacity-50" aria-hidden="true" />
      <span class="italic text-shu-light">{{ content.reading }}</span>
    </p>
    <h1 class="display mt-6 text-[clamp(3rem,7vw,6.5rem)] text-white">{{ content.title }}</h1>
    <p class="mt-6 max-w-md text-[16px] leading-relaxed text-white/70">{{ content.text }}</p>
    <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
      <BaseButton tone="light" @click="emit('begin')">{{ content.action }}</BaseButton>
      <BaseArrowLink href="/" tone="light">{{ content.back }}</BaseArrowLink>
    </div>
  </section>
</template>
