<script setup lang="ts">
import type { SensoryNote } from '~/types/content'

defineProps<{ notes: SensoryNote[]; activeIndex: number }>()
const emit = defineEmits<{ select: [index: number] }>()
</script>

<template>
  <ol class="flex flex-wrap gap-2">
    <li v-for="(note, index) in notes" :key="note.name">
      <button
        type="button"
        class="label rounded-full border px-4 py-2 transition-colors duration-500"
        :class="activeIndex === index ? 'border-forest bg-forest text-white' : 'border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink'"
        :aria-current="activeIndex === index ? 'step' : undefined"
        @click="emit('select', index)"
      >
        {{ note.name }}
      </button>
    </li>
  </ol>
</template>
