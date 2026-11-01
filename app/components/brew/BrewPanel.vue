<script setup lang="ts">
import { brewControls } from '~/content/brew'
import type { BrewStatus, BrewStep } from '~/types/brew'

defineProps<{ step: BrewStep; index: number; total: number; status: BrewStatus; isLast: boolean }>()
const emit = defineEmits<{ next: [] }>()

const TONE_CLASSES = {
  neutral: 'text-white/65',
  good: 'text-leaf',
  warn: 'text-shu-light'
} as const
</script>

<template>
  <section class="rounded-4xl border border-white/10 bg-forest/80 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl md:p-8">
    <Transition
      mode="out-in"
      enter-active-class="transition duration-500 ease-calm"
      leave-active-class="transition duration-200"
      enter-from-class="translate-y-2 opacity-0"
      leave-to-class="opacity-0"
    >
      <div :key="step.id">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[13px] tabular-nums text-white/45">{{ brewControls.stepOf }} {{ index + 1 }} / {{ total }}</p>
            <h1 class="display mt-2 text-[clamp(2rem,3.4vw,2.75rem)] text-white">{{ step.title }}</h1>
          </div>
          <div class="flex flex-col items-center gap-1" lang="ja">
            <span class="font-jp text-[2.75rem] font-bold leading-none text-leaf">{{ step.kanji }}</span>
            <span class="text-[11px] italic text-shu">{{ step.reading }}</span>
          </div>
        </div>
        <p class="mt-4 text-[15px] leading-relaxed text-white/70">{{ step.hint }}</p>
      </div>
    </Transition>

    <div class="mt-6">
      <slot />
    </div>

    <div class="mt-6 flex items-center justify-between gap-4">
      <p class="min-h-6 text-[14px] transition-colors duration-300" :class="TONE_CLASSES[status.tone]" aria-live="polite">
        {{ status.message }}
      </p>
      <BaseButton tone="light" size="sm" :disabled="!status.done" class="shrink-0 disabled:pointer-events-none disabled:opacity-35" @click="emit('next')">
        {{ isLast ? brewControls.finish : brewControls.next }}
      </BaseButton>
    </div>
  </section>
</template>
