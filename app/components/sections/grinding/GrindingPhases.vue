<script setup lang="ts">
const props = defineProps<{ phases: string[]; progress: number }>()

const activeIndex = computed(() => Math.min(props.phases.length - 1, Math.floor(props.progress * props.phases.length)))

function fillOf(index: number) {
  return Math.min(1, Math.max(0, props.progress * props.phases.length - index))
}
</script>

<template>
  <ol class="flex gap-8" aria-label="Milling progress">
    <li v-for="(phase, index) in phases" :key="phase" class="min-w-22">
      <span class="block h-0.75 w-full overflow-hidden rounded-full bg-ink/10">
        <span
          class="block h-full origin-left rounded-full bg-matcha transition-transform duration-700"
          :style="{ transform: `scaleX(${fillOf(index)})` }"
        />
      </span>
      <span
        class="label mt-3 block transition-colors duration-500"
        :class="activeIndex === index ? 'text-forest' : 'text-ink/35'"
        :aria-current="activeIndex === index ? 'step' : undefined"
      >
        {{ phase }}
      </span>
    </li>
  </ol>
</template>
