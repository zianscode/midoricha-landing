<script setup lang="ts">
import { heroContent as content } from '~/content/home'
</script>

<template>
  <section id="top" class="relative isolate flex min-h-svh flex-col overflow-hidden bg-paper pt-24 md:pt-28">
    <div class="wrap relative z-20 grid-editorial gap-y-6">
      <div class="col-span-4 md:col-span-7">
        <BaseHeading as="h1" :heading="content.heading" class="intro text-[clamp(2.8rem,5.6vw,5.6rem)] [--intro-delay:80ms]" />
      </div>

      <div class="intro col-span-4 md:col-span-4 md:col-start-9 md:self-end [--intro-delay:160ms]">
        <p class="max-w-96 text-[15px] leading-[1.6] text-ink/65">{{ content.intro }}</p>
        <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <BaseButton :href="content.primaryAction.href">{{ content.primaryAction.label }}</BaseButton>
          <BaseArrowLink :href="content.secondaryAction.href">{{ content.secondaryAction.label }}</BaseArrowLink>
        </div>
      </div>
    </div>

    <div class="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 z-10 md:top-[14%]">
      <SceneCanvas v-bind="content.figure" />
    </div>

    <div class="relative z-0 mt-auto px-3 pb-3 pt-12 md:px-5 md:pb-4">
      <HeroWordmark :text="content.wordmark" class="intro [--intro-delay:240ms]" />
    </div>
  </section>
</template>
