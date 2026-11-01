<script setup lang="ts">
defineProps<{ count: number; max: number; label: string }>()
const emit = defineEmits<{ add: [] }>()
</script>

<template>
  <div class="flex items-center gap-5">
    <BrewActionButton class="flex-1" :label="label" :disabled="count >= max" @press="emit('add')" />
    <div class="flex gap-2" role="img" :aria-label="`${count} of ${max} scoops`">
      <span
        v-for="slot in max"
        :key="slot"
        class="size-3.5 rounded-full border transition-colors duration-500"
        :class="slot <= count ? 'border-leaf bg-leaf' : 'border-white/30'"
      />
    </div>
  </div>
</template>
