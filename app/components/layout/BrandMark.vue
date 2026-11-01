<script setup lang="ts">
import { BRAND_NAME } from '~/content/site'

defineProps<{ collapsible?: boolean; accent?: boolean }>()
</script>

<template>
  <span class="flex items-center gap-2">
    <BaseLeafMark class="h-5 w-5" :class="{ 'text-matcha': accent }" />
    <span class="text-[17px] font-semibold tracking-[-0.03em]" :class="{ 'hidden sm:inline': collapsible }">{{ BRAND_NAME }}</span>
  </span>
</template>
