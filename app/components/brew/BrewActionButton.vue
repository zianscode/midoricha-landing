<script setup lang="ts">
defineProps<{ label: string; disabled?: boolean }>()
const emit = defineEmits<{ press: [] }>()
</script>

<template>
  <button
    type="button"
    class="h-14 w-full rounded-full border border-white/20 bg-white/5 text-[15px] font-medium text-white transition-colors duration-300 hover:border-leaf hover:bg-leaf hover:text-forest disabled:pointer-events-none disabled:opacity-40"
    :disabled="disabled"
    @click="emit('press')"
  >
    {{ label }}
  </button>
</template>
