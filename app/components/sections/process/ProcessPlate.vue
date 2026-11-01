<script setup lang="ts">
import type { ProcessStepId } from '~/types/content'

defineProps<{ step: ProcessStepId }>()

const NET_STRANDS = 18

const TENCHA_FLAKES = [
  { x: 34, y: 48, width: 18, height: 12, angle: 14 },
  { x: 70, y: 40, width: 22, height: 14, angle: -20 },
  { x: 108, y: 52, width: 16, height: 11, angle: 32 },
  { x: 46, y: 82, width: 20, height: 13, angle: -8 },
  { x: 88, y: 78, width: 24, height: 15, angle: 18 },
  { x: 124, y: 86, width: 15, height: 10, angle: -30 },
  { x: 30, y: 114, width: 16, height: 11, angle: 24 },
  { x: 66, y: 112, width: 21, height: 13, angle: -14 },
  { x: 104, y: 116, width: 18, height: 12, angle: 8 },
  { x: 136, y: 120, width: 12, height: 9, angle: 40 }
]
</script>

<template>
  <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="0.8" aria-hidden="true">
    <rect x="0.5" y="0.5" width="159" height="159" rx="16" stroke-opacity="0.2" />

    <g v-if="step === 'shade'">
      <circle cx="122" cy="34" r="12" />
      <path d="M8 66h144M16 66v68M144 66v68M8 134h144" />
      <path v-for="strand in NET_STRANDS" :key="strand" :d="`M${strand * 8 + 2} 62l6 8`" stroke-opacity="0.6" />
      <path d="M18 134c4-26 34-26 38 0M62 134c4-26 34-26 38 0M106 134c4-26 34-26 38 0" />
    </g>

    <g v-else-if="step === 'harvest'">
      <path d="M80 150c0-30 2-62 0-110" />
      <path d="M80 40c-6-12-4-24 0-32 4 8 6 20 0 32Z" />
      <path d="M80 66c-20-4-40-18-46-36 20 2 38 14 46 36Z" />
      <path d="M80 66C64 54 48 42 34 30" stroke-opacity="0.6" />
      <path d="M80 98c22-2 44-16 52-38-22 2-42 16-52 38Z" />
      <path d="M80 98c18-12 34-24 52-38" stroke-opacity="0.6" />
    </g>

    <g v-else-if="step === 'steam'">
      <ellipse cx="80" cy="124" rx="58" ry="12" />
      <path d="M44 122c6-4 12-4 18 0M70 126c6-4 12-4 18 0M96 121c6-4 12-4 18 0" stroke-opacity="0.7" />
      <path d="M56 100c-10-14 10-22 0-36s10-22 0-36M80 100c-10-14 10-22 0-36s10-22 0-36M104 100c-10-14 10-22 0-36s10-22 0-36" />
    </g>

    <g v-else-if="step === 'dry'">
      <rect
        v-for="(flake, index) in TENCHA_FLAKES"
        :key="index"
        :x="flake.x - flake.width / 2"
        :y="flake.y - flake.height / 2"
        :width="flake.width"
        :height="flake.height"
        :transform="`rotate(${flake.angle} ${flake.x} ${flake.y})`"
      />
      <path d="M24 140l30-6M98 142l36-8" stroke-opacity="0.5" />
    </g>

    <g v-else>
      <rect x="42" y="56" width="76" height="30" rx="3" />
      <rect x="42" y="88" width="76" height="26" rx="3" />
      <path d="M24 114h112c0 12-6 18-14 18H38c-8 0-14-6-14-18Z" />
      <path d="M118 70h16V46" />
      <path d="M76 56l4-8 4 8" />
      <path d="M34 124c10-3 22-3 32 0M94 124c10-3 22-3 32 0" stroke-opacity="0.6" />
    </g>
  </svg>
</template>
