<script setup lang="ts">
import type { HistoryEra } from '~/types/content'

defineProps<{ era: HistoryEra; seal: string }>()
</script>

<template>
  <div class="relative flex items-start gap-5" aria-hidden="true">
    <div class="relative size-[clamp(9rem,16vw,15rem)] overflow-hidden">
      <Transition
        enter-active-class="transition duration-700 ease-calm"
        leave-active-class="absolute inset-0 transition duration-500 ease-calm"
        enter-from-class="translate-y-6 opacity-0 blur-sm"
        leave-to-class="-translate-y-6 opacity-0 blur-sm"
      >
        <span :key="era.kanji" class="block font-jp text-[clamp(9rem,16vw,15rem)] font-bold leading-none text-forest">
          {{ era.kanji }}
        </span>
      </Transition>
    </div>

    <div class="flex flex-col items-center gap-4 pt-2">
      <BaseHanko :text="seal" class="-rotate-6" />
      <Transition
        mode="out-in"
        enter-active-class="transition duration-500 ease-calm"
        leave-active-class="transition duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <span :key="era.kanjiMeaning" class="tategaki text-[13px] font-medium tracking-[0.08em] text-ink/45">
          {{ era.kanjiMeaning }}
        </span>
      </Transition>
    </div>
  </div>
</template>
