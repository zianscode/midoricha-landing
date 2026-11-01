<script setup lang="ts">
import type { ColorStops } from '~/types/content'

const props = defineProps<{ tone: ColorStops; markerCount: number; activeIndex: number }>()

const CENTER = 210
const DISC_RADIUS = 160
const RING_RADIUS = 196
const TICK_INNER = 186
const TICK_OUTER = 204

const toneId = useId()
const sheenId = useId()

const ticks = computed(() =>
  Array.from({ length: props.markerCount }, (_, index) => {
    const angle = (index / props.markerCount) * Math.PI * 2 - Math.PI / 2
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x1: CENTER + cos * TICK_INNER,
      y1: CENTER + sin * TICK_INNER,
      x2: CENTER + cos * TICK_OUTER,
      y2: CENTER + sin * TICK_OUTER
    }
  })
)

const ringRotation = computed(() => -(props.activeIndex / props.markerCount) * 360)
</script>

<template>
  <svg viewBox="0 0 420 420" aria-hidden="true">
    <defs>
      <radialGradient :id="toneId" cx="44%" cy="40%" r="62%">
        <stop offset="0%" class="tone-stop" :style="{ stopColor: tone[0] }" />
        <stop offset="55%" class="tone-stop" :style="{ stopColor: tone[1] }" />
        <stop offset="100%" class="tone-stop" :style="{ stopColor: tone[2] }" />
      </radialGradient>
      <radialGradient :id="sheenId" cx="38%" cy="30%" r="45%">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#fff" stop-opacity="0" />
      </radialGradient>
    </defs>

    <g class="ring" :style="{ transform: `rotate(${ringRotation}deg)` }">
      <circle :cx="CENTER" :cy="CENTER" :r="RING_RADIUS" fill="none" stroke="#0e1311" stroke-opacity="0.1" stroke-dasharray="2 6" />
      <line
        v-for="(tick, index) in ticks"
        :key="index"
        v-bind="tick"
        stroke="#3f8a2a"
        stroke-width="2"
        stroke-linecap="round"
        :stroke-opacity="activeIndex === index ? 1 : 0.25"
        class="transition-[stroke-opacity] duration-500"
      />
    </g>

    <path :d="`M${CENTER - 7} 2 L${CENTER + 7} 2 L${CENTER} 12 Z`" fill="#0b1a13" />
    <circle :cx="CENTER" :cy="CENTER" :r="DISC_RADIUS" :fill="`url(#${toneId})`" />
    <circle :cx="CENTER" :cy="CENTER" :r="DISC_RADIUS" :fill="`url(#${sheenId})`" />
  </svg>
</template>

<style scoped>
.tone-stop {
  transition: stop-color 1.2s var(--ease-calm);
}

.ring {
  transform-origin: 210px 210px;
  transition: transform 1.2s var(--ease-calm);
}
</style>
