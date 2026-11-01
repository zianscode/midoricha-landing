<script setup lang="ts">
const maskId = useId()
</script>

<template>
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <defs>
      <mask :id="maskId">
        <rect width="20" height="20" fill="#fff" />
        <path d="M3.5 16.5L12.5 7.5" stroke="#000" stroke-width="1.6" stroke-linecap="round" />
      </mask>
    </defs>
    <path d="M3.5 16.5C3.5 9 8.5 3.5 16.5 3.5C16.5 11.5 11 16.5 3.5 16.5Z" fill="currentColor" :mask="`url(#${maskId})`" />
  </svg>
</template>
