<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string; as?: string }>(), { as: 'p' })

const DIM_OPACITY = 0.16

const element = useTemplateRef<HTMLElement>('element')
const progress = useViewportProgress(element, { enter: 0.8, leave: 0.4 })
const words = computed(() => props.text.split(' '))
const reducedMotion = ref(false)

onMounted(() => (reducedMotion.value = prefersReducedMotion()))

function opacityOf(index: number) {
  if (reducedMotion.value) return 1
  const lit = clamp01(progress.value * words.value.length - index)
  return DIM_OPACITY + (1 - DIM_OPACITY) * lit
}
</script>

<template>
  <component :is="as" ref="element">
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
      <template v-for="(word, index) in words" :key="index">
        <span class="transition-opacity duration-300" :style="{ opacity: opacityOf(index) }">{{ word }}</span>{{ ' ' }}
      </template>
    </span>
  </component>
</template>
