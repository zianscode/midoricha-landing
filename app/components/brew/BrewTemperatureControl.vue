<script setup lang="ts">
import { BREW_RULES } from '~/constants/brew'

defineProps<{ modelValue: number; label: string; description: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const { min, max, idealMin, idealMax } = BREW_RULES.temperature
const band = [(idealMin - min) / (max - min), (idealMax - min) / (max - min)] as const

function onInput(event: Event) {
  emit('update:modelValue', Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between">
      <span class="text-[13px] text-white/55">{{ label }}</span>
      <span class="display text-[2.25rem] tabular-nums text-white">{{ Math.round(modelValue) }} °C</span>
    </div>
    <div class="relative mt-4">
      <span
        class="pointer-events-none absolute inset-y-0 my-auto h-2 rounded-full bg-leaf/30"
        :style="{ left: `${band[0] * 100}%`, width: `${(band[1] - band[0]) * 100}%` }"
        aria-hidden="true"
      />
      <input
        type="range"
        class="temperature-range relative w-full"
        :min="min"
        :max="max"
        step="1"
        :value="modelValue"
        :aria-label="description"
        @input="onInput"
      />
    </div>
    <div class="mt-2 flex justify-between text-[12px] tabular-nums text-white/40">
      <span>{{ min }} °C</span>
      <span>{{ max }} °C</span>
    </div>
  </div>
</template>

<style scoped>
.temperature-range {
  height: 2rem;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.temperature-range::-webkit-slider-runnable-track {
  height: 0.5rem;
  border-radius: 999px;
  background: linear-gradient(to right, #7fb4d6, #a9e26f 45%, #c8442f);
  opacity: 0.55;
}

.temperature-range::-moz-range-track {
  height: 0.5rem;
  border-radius: 999px;
  background: linear-gradient(to right, #7fb4d6, #a9e26f 45%, #c8442f);
  opacity: 0.55;
}

.temperature-range::-webkit-slider-thumb {
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  margin-top: -0.5rem;
  border-radius: 999px;
  background: #f7f8f6;
  box-shadow: 0 0 0 4px rgba(169, 226, 111, 0.35);
}

.temperature-range::-moz-range-thumb {
  width: 1.5rem;
  height: 1.5rem;
  border: 0;
  border-radius: 999px;
  background: #f7f8f6;
  box-shadow: 0 0 0 4px rgba(169, 226, 111, 0.35);
}
</style>
