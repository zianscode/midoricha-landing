<script setup lang="ts">
defineProps<{ text: string }>()

const gradientId = useId()
</script>

<template>
  <svg class="block w-full" viewBox="0 0 1000 236" aria-hidden="true">
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d6f4b0" />
        <stop offset="1" stop-color="#8fd14f" />
      </linearGradient>
    </defs>
    <text
      x="0"
      y="230"
      textLength="1000"
      lengthAdjust="spacingAndGlyphs"
      :fill="`url(#${gradientId})`"
      font-family="Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
      font-weight="600"
      font-size="300"
    >
      {{ text }}
    </text>
  </svg>
</template>
