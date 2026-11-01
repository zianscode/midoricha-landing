<script setup lang="ts">
import type { Tone } from '~/types/content'

const props = withDefaults(defineProps<{ href: string; tone?: Tone }>(), { tone: 'dark' })

const { followAnchor } = useSmoothScroll()
const { tag, attributes } = useLinkTarget(() => props.href)
</script>

<template>
  <component
    :is="tag"
    v-bind="attributes"
    class="group inline-flex items-center gap-2 text-[15px] font-medium tracking-[-0.01em]"
    :class="tone === 'light' ? 'text-white/85 hover:text-white' : 'text-ink/80 hover:text-ink'"
    @click="followAnchor($event, href)"
  >
    <span class="link-underline pb-0.5"><slot /></span>
    <BaseArrowIcon />
  </component>
</template>
