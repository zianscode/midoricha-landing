<script setup lang="ts">
defineProps<{ label: string; holding: boolean; disabled?: boolean }>()
const emit = defineEmits<{ start: []; stop: [] }>()

const HOLD_KEYS = new Set([' ', 'Enter'])

function onKeyDown(event: KeyboardEvent) {
  if (!HOLD_KEYS.has(event.key) || event.repeat) return
  event.preventDefault()
  emit('start')
}

function onKeyUp(event: KeyboardEvent) {
  if (!HOLD_KEYS.has(event.key)) return
  event.preventDefault()
  emit('stop')
}
</script>

<template>
  <button
    type="button"
    class="relative h-14 w-full touch-none select-none overflow-hidden rounded-full border text-[15px] font-medium transition-[background-color,border-color,color,scale] duration-300 ease-calm disabled:pointer-events-none disabled:opacity-40"
    :class="holding ? 'scale-98 border-leaf bg-leaf text-forest' : 'border-white/20 bg-white/5 text-white hover:border-white/40'"
    :disabled="disabled"
    :aria-pressed="holding"
    @pointerdown="emit('start')"
    @pointerup="emit('stop')"
    @pointerleave="emit('stop')"
    @pointercancel="emit('stop')"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
    @blur="emit('stop')"
    @contextmenu.prevent
  >
    {{ label }}
  </button>
</template>
