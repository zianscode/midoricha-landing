<script setup lang="ts">
defineProps<{ level: number; maxLevel: number }>()
</script>

<template>
  <div class="flex items-center gap-2" role="img" :aria-label="`Intensity ${level} of ${maxLevel}`">
    <span
      v-for="step in maxLevel"
      :key="step"
      class="h-1.5 flex-1 rounded-full transition-colors duration-700 ease-calm"
      :class="step <= level ? 'bg-matcha' : 'bg-ink/10'"
    />
  </div>
</template>
