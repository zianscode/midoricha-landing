<script setup lang="ts">
const props = defineProps<{ value: number; label: string; caption?: string; band?: readonly [number, number]; warn?: boolean }>()

const bandStyle = computed(() => {
  if (!props.band) return undefined
  const [start, end] = props.band
  return { left: `${start * 100}%`, width: `${(end - start) * 100}%` }
})
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between text-[13px]">
      <span class="text-white/55">{{ label }}</span>
      <span class="tabular-nums text-white">{{ caption }}</span>
    </div>
    <div
      class="relative mt-3 h-2 overflow-hidden rounded-full bg-white/10"
      role="progressbar"
      :aria-label="label"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(value * 100)"
    >
      <span v-if="bandStyle" class="absolute inset-y-0 rounded-full bg-leaf/25" :style="bandStyle" aria-hidden="true" />
      <span
        class="absolute inset-y-0 left-0 w-full origin-left rounded-full transition-[background-color] duration-300"
        :class="warn ? 'bg-shu' : 'bg-leaf'"
        :style="{ transform: `scaleX(${Math.min(1, value)})` }"
      />
    </div>
  </div>
</template>
