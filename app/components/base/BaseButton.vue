<script setup lang="ts">
import type { Tone } from '~/types/content'

type Size = 'sm' | 'md'
type Variant = 'solid' | 'outline'

const props = withDefaults(defineProps<{ href?: string; tone?: Tone; size?: Size; variant?: Variant }>(), {
  href: undefined,
  tone: 'dark',
  size: 'md',
  variant: 'solid'
})

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-12 px-6 text-[15px]'
}

const VARIANT_CLASSES: Record<Variant, Record<Tone, string>> = {
  solid: {
    dark: 'border-forest bg-forest text-white hover:border-deep hover:bg-deep',
    light: 'border-leaf bg-leaf text-forest hover:border-white hover:bg-white'
  },
  outline: {
    dark: 'border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/4',
    light: 'border-white/25 text-white hover:border-white/60 hover:bg-white/10'
  }
}

const { followAnchor } = useSmoothScroll()
const { tag, attributes } = useLinkTarget(() => props.href)
const classes = computed(() => [SIZE_CLASSES[props.size], VARIANT_CLASSES[props.variant][props.tone]])
</script>

<template>
  <component
    :is="tag"
    v-bind="attributes"
    class="group inline-flex items-center justify-center gap-2 rounded-full border font-sans font-medium tracking-[-0.01em] transition-[background-color,color,border-color,scale] duration-300 ease-calm active:scale-98"
    :class="classes"
    @click="followAnchor($event, href)"
  >
    <slot />
    <BaseArrowIcon />
  </component>
</template>
