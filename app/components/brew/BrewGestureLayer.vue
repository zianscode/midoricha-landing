<script setup lang="ts">
import { BREW_RULES } from '~/constants/brew'

type GestureMode = 'whisk' | 'drag'

const props = defineProps<{ mode: GestureMode }>()
const emit = defineEmits<{ whisk: [x: number, z: number]; whiskActive: [active: boolean]; turn: [radians: number] }>()

const WHISK_AREA = 0.22
const KEY_DIRECTIONS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 }

const layer = useTemplateRef<HTMLElement>('layer')
let dragX: number | null = null
let keyStroke = 0

function toBowl(event: PointerEvent, area: HTMLElement): [number, number] {
  const rect = area.getBoundingClientRect()
  const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width * WHISK_AREA)
  const z = (event.clientY - (rect.top + rect.height / 2)) / (rect.height * WHISK_AREA)
  const length = Math.hypot(x, z)
  return length > 1 ? [x / length, z / length] : [x, z]
}

function onPointerEnter() {
  if (props.mode === 'whisk') emit('whiskActive', true)
}

function onPointerDown(event: PointerEvent) {
  layer.value?.setPointerCapture(event.pointerId)
  if (props.mode === 'drag') dragX = event.clientX
  else emit('whiskActive', true)
}

function onPointerMove(event: PointerEvent) {
  if (props.mode === 'whisk' && layer.value) {
    emit('whisk', ...toBowl(event, layer.value))
    return
  }
  if (dragX === null) return
  emit('turn', Math.abs(event.clientX - dragX) * BREW_RULES.turn.perPixel)
  dragX = event.clientX
}

function onPointerUp() {
  dragX = null
  if (props.mode === 'whisk') emit('whiskActive', false)
}

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  const direction = KEY_DIRECTIONS[event.key]
  if (!direction) return
  event.preventDefault()
  if (props.mode === 'drag') {
    emit('turn', BREW_RULES.turn.keyStep)
    return
  }
  keyStroke += 1
  emit('whisk', direction * BREW_RULES.whisk.keyStep, keyStroke % 2 ? 0.25 : -0.25)
})
</script>

<template>
  <div
    ref="layer"
    class="touch-none"
    :class="mode === 'drag' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerUp"
  />
</template>
