<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span
    class="tategaki inline-grid place-items-center rounded-md bg-shu px-1.5 py-2 font-jp text-[15px] font-bold leading-none tracking-[0.15em] text-paper shadow-[inset_0_0_0_2px_rgba(255,255,255,0.18)]"
    aria-hidden="true"
  >
    {{ text }}
  </span>
</template>
