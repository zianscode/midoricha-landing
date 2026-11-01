<script setup lang="ts">
import type { SceneName } from '~/three/scenes'

const props = defineProps<{ scene: SceneName; label: string; progress?: number }>()

const container = ref<HTMLElement | null>(null)
const progress = computed(() => props.progress ?? 0)
const { ready, enabled } = useThreeScene(container, props.scene, {
  progress: props.progress === undefined ? undefined : progress
})
</script>

<template>
  <div
    ref="container"
    class="absolute inset-0 transition-opacity duration-1000 ease-calm"
    :class="ready || !enabled ? 'opacity-100' : 'opacity-0'"
    role="img"
    :aria-label="label"
  >
    <div
      v-if="!enabled"
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,var(--color-leaf)_0%,transparent_62%)] opacity-40"
      aria-hidden="true"
    />
  </div>
</template>
