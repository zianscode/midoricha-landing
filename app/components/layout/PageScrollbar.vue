<script setup lang="ts">
const track = useTemplateRef<HTMLElement>('track')
const { thumbHeight, thumbOffset, dragging, onPointerDown, onPointerMove, onPointerUp } = usePageScrollbar(track)
</script>

<template>
  <div ref="track" class="group fixed inset-y-2 right-1 z-60 hidden w-2.5 pointer-fine:block" aria-hidden="true">
    <div
      class="absolute inset-x-0 touch-none rounded-full transition-[background-color,scale] duration-300 ease-calm"
      :class="dragging ? 'scale-x-125 bg-deep' : 'scale-x-75 bg-matcha group-hover:scale-x-100 group-hover:bg-deep'"
      :style="{ height: `${thumbHeight}px`, transform: `translate3d(0, ${thumbOffset}px, 0)` }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    />
  </div>
</template>
