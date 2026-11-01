<script setup lang="ts">
import type { ProcessStepId } from '~/types/content'

defineProps<{ step: ProcessStepId }>()

const ICON_PATHS: Record<ProcessStepId, string> = {
  shade: 'M2 7h16M4 7v10M16 7v10M5 17c1-3 4-3 5 0M10 17c1-3 4-3 5 0',
  harvest: 'M10 18V9M10 9C10 5 13 3 16 3c0 3-2 6-6 6ZM10 12c0-3-3-5-6-5 0 3 2 5 6 5Z',
  steam: 'M3 16h14M6 13c-1.5-2 1.5-3 0-5s1.5-3 0-5M10 13c-1.5-2 1.5-3 0-5s1.5-3 0-5M14 13c-1.5-2 1.5-3 0-5s1.5-3 0-5',
  dry: 'M3 8l5-2 2 4-5 2ZM11 5l4 1-1 4-4-1ZM9 13l5-1 1 4-5 1Z',
  grind: 'M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0M8.5 10a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M17 10h2'
}
</script>

<template>
  <svg class="size-5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
    <path :d="ICON_PATHS[step]" />
  </svg>
</template>
