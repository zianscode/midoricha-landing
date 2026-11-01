<script setup lang="ts">
import type { TextItem } from '~/types/content'

const props = defineProps<{ stages: TextItem[]; activeIndex: number; progress: number }>()
const emit = defineEmits<{ select: [index: number] }>()

const activeStage = computed(() => props.stages[props.activeIndex])
</script>

<template>
  <div>
    <div class="relative mb-5 min-h-13 max-w-md" aria-live="polite">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-700 ease-calm"
        leave-active-class="transition duration-300"
        enter-from-class="opacity-0 translate-y-2"
        leave-to-class="opacity-0"
      >
        <p :key="activeIndex" class="text-[15px] leading-relaxed text-ink/80 md:text-[16px]">{{ activeStage?.text }}</p>
      </Transition>
    </div>

    <ol class="relative grid grid-cols-5 border-t-2 border-ink/10">
      <li
        class="pointer-events-none absolute -top-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-matcha"
        :style="{ transform: `scaleX(${progress})` }"
        aria-hidden="true"
      />
      <li v-for="(stage, index) in stages" :key="stage.title">
        <button
          type="button"
          class="group w-full pr-2 pt-4 text-left"
          :aria-current="activeIndex === index ? 'step' : undefined"
          @click="emit('select', index)"
        >
          <span
            class="display block text-[1.05rem] tracking-[-0.03em] transition-colors duration-500 md:text-[1.6rem]"
            :class="activeIndex === index ? 'text-forest' : 'text-ink/35 group-hover:text-ink/60'"
          >
            {{ stage.title }}
          </span>
        </button>
      </li>
    </ol>
  </div>
</template>
