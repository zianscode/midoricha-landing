<script setup lang="ts">
defineProps<{ back?: boolean }>()
</script>

<template>
  <svg
    class="h-3.5 w-3.5 transition-transform duration-300 ease-calm"
    :class="back ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
</template>
