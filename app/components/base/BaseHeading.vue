<script setup lang="ts">
import type { Heading, Tone } from '~/types/content'

const props = withDefaults(defineProps<{ heading: Heading; as?: 'h1' | 'h2'; tone?: Tone }>(), {
  as: 'h2',
  tone: 'dark'
})

const leadLines = computed(() => props.heading.lead.split('\n'))
</script>

<template>
  <component :is="as" class="display" :class="tone === 'light' ? 'text-white' : 'text-forest'">
    <template v-for="(line, index) in leadLines" :key="index">
      <br v-if="index > 0" />{{ line }}
    </template>
    <template v-if="heading.inline">{{ ' ' }}</template>
    <br v-else />
    <span :class="tone === 'light' ? 'text-leaf' : 'text-matcha'">{{ heading.accent }}</span>
  </component>
</template>
