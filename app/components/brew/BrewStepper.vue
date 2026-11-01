<script setup lang="ts">
import type { BrewStep } from '~/types/brew'

defineProps<{ steps: BrewStep[]; activeIndex: number; finished: boolean }>()
</script>

<template>
  <ol class="flex items-center gap-1.5 rounded-full bg-black/25 p-1.5 backdrop-blur-md md:gap-2">
    <li v-for="(step, index) in steps" :key="step.id">
      <span
        class="grid size-9 place-items-center rounded-full font-jp text-[15px] font-bold transition-colors duration-500 md:size-10"
        :class="
          finished || index < activeIndex
            ? 'bg-leaf/20 text-leaf'
            : index === activeIndex
              ? 'bg-leaf text-forest'
              : 'text-white/35'
        "
        :aria-current="!finished && index === activeIndex ? 'step' : undefined"
        :title="step.title"
        lang="ja"
      >
        {{ step.kanji }}
      </span>
    </li>
  </ol>
</template>
