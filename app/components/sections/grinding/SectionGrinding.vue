<script setup lang="ts">
import { grindingContent as content } from '~/content/home'

const section = ref<HTMLElement | null>(null)
const { progress } = useSectionProgress(section)
</script>

<template>
  <section id="grinding" ref="section" class="relative h-[340vh] bg-cream" aria-labelledby="grinding-title">
    <div class="sticky top-0 h-svh overflow-hidden">
      <div class="absolute inset-0 top-[24%] bottom-[14%] md:bottom-0 md:left-[40%] md:top-[6%]">
        <SceneCanvas v-bind="content.figure" :progress="progress" />
      </div>

      <div class="wrap pointer-events-none relative flex h-full flex-col justify-between pb-8 pt-24 md:pb-12 md:pt-32">
        <BaseHeading id="grinding-title" :heading="content.heading" class="text-[clamp(3rem,7.6vw,8.4rem)]" />

        <div class="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div class="max-w-xs">
            <p class="text-[15px] leading-[1.7] text-ink/70">{{ content.intro }}</p>
            <p class="mt-3 text-[13px] text-ink/45">{{ content.note }}</p>
          </div>
          <GrindingPhases :phases="content.phases" :progress="progress" />
        </div>
      </div>
    </div>
  </section>
</template>
