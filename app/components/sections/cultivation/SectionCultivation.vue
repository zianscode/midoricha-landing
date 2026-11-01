<script setup lang="ts">
import { cultivationContent as content } from '~/content/home'

const STAGE_SCROLL_NUDGE_PX = 2

const section = ref<HTMLElement | null>(null)
const { progress, scrollYAt } = useSectionProgress(section)
const { scrollToTarget } = useSmoothScroll()

const lastStage = content.stages.length - 1
const activeIndex = computed(() => Math.min(lastStage, Math.round(progress.value * lastStage)))

function goToStage(index: number) {
  scrollToTarget(scrollYAt(index / lastStage) + STAGE_SCROLL_NUDGE_PX)
}
</script>

<template>
  <section id="cultivation" ref="section" class="relative h-[460vh] bg-[#e6e9e4]" aria-labelledby="cultivation-title">
    <div class="sticky top-0 h-svh overflow-hidden">
      <div class="absolute inset-x-0 top-0 bottom-50 md:bottom-52">
        <SceneCanvas v-bind="content.figure" :progress="progress" />
      </div>

      <div class="wrap relative pt-24 md:pt-32">
        <div class="grid-editorial">
          <div class="col-span-4 md:col-span-6">
            <BaseHeading id="cultivation-title" :heading="content.heading" class="text-[clamp(2.8rem,6vw,6.2rem)]" />
          </div>
          <div class="col-span-4 mt-6 md:col-span-3 md:col-start-10 md:mt-3">
            <p class="text-[14px] leading-relaxed text-ink/65">{{ content.intro }}</p>
          </div>
        </div>
      </div>

      <div class="absolute inset-x-0 bottom-0 h-50 rounded-t-[28px] bg-paper md:h-52">
        <CultivationTimeline
          class="wrap pt-6 md:pt-7"
          :stages="content.stages"
          :active-index="activeIndex"
          :progress="progress"
          @select="goToStage"
        />
      </div>
    </div>
  </section>
</template>
