<script setup lang="ts">
const props = defineProps<{ progress: number }>()

const RADIUS = 13
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const dashOffset = computed(() => CIRCUMFERENCE * (1 - props.progress))
</script>

<template>
  <span class="relative grid h-9 w-9 shrink-0 place-items-center">
    <svg class="absolute inset-0 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" :r="RADIUS" fill="none" stroke="currentColor" stroke-opacity="0.15" stroke-width="2" />
      <circle
        cx="16"
        cy="16"
        :r="RADIUS"
        fill="none"
        stroke="var(--color-leaf)"
        stroke-width="2"
        stroke-linecap="round"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
  </span>
</template>
