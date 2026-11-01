<script setup lang="ts">
import { closingContent as content } from '~/content/home'

const MARQUEE_SPEED = 0.35
</script>

<template>
  <section id="begin" class="relative overflow-hidden bg-cream pb-28 pt-16 md:pb-40 md:pt-24">
    <div class="space-y-1 text-forest md:space-y-3">
      <ScrollMarquee :items="content.marquee" :speed="MARQUEE_SPEED" />
      <ScrollMarquee :items="content.marquee" :speed="-MARQUEE_SPEED" outlined class="text-matcha" />
    </div>

    <div class="wrap grid-editorial mt-20 items-center gap-y-6 md:mt-28">
      <div class="col-span-4 md:col-span-6">
        <BaseHeading v-reveal :heading="content.heading" class="text-[clamp(3.4rem,8vw,8.6rem)]" />
        <p v-reveal="0.1" class="mt-10 max-w-sm text-[16px] leading-[1.7] text-ink/65">{{ content.intro }}</p>
        <div v-reveal="0.18" class="mt-10">
          <BaseButton :href="content.action.href">{{ content.action.label }}</BaseButton>
        </div>
      </div>

      <div class="relative col-span-4 h-88 md:col-span-5 md:col-start-8 md:h-136">
        <SceneCanvas v-bind="content.figure" />
      </div>
    </div>
  </section>
</template>
