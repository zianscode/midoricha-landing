<script setup lang="ts">
import { processContent as content } from '~/content/home'

const section = useTemplateRef<HTMLElement>('section')
const track = useTemplateRef<HTMLElement>('track')
const { progress, offset, sectionHeight } = useHorizontalScroll(section, track)

const stepCount = content.steps.length
const activeIndex = computed(() => Math.min(stepCount - 1, Math.floor(progress.value * stepCount)))
</script>

<template>
  <section id="process" ref="section" class="relative bg-paper" :style="{ height: sectionHeight }">
    <div class="sticky top-0 flex h-svh flex-col overflow-hidden">
      <div class="wrap flex items-end justify-between gap-6 pt-24 md:pt-28">
        <p class="label text-ink/45">{{ content.hint }}</p>
        <div class="flex items-center gap-4">
          <span class="tabular-nums text-[13px] text-forest">
            {{ padIndex(activeIndex) }} <span class="text-ink/35">/ {{ padIndex(stepCount - 1) }}</span>
          </span>
          <span class="h-0.5 w-24 overflow-hidden rounded-full bg-ink/10 md:w-40">
            <span class="block h-full origin-left rounded-full bg-matcha" :style="{ transform: `scaleX(${progress})` }" />
          </span>
        </div>
      </div>

      <div class="flex flex-1 items-center">
        <ol
          ref="track"
          class="flex w-max items-center gap-6 px-6 will-change-transform md:gap-10 md:px-10"
          :style="{ transform: `translate3d(${offset}px, 0, 0)` }"
        >
          <li class="flex w-[82vw] shrink-0 flex-col justify-center md:w-[34vw] md:pr-10">
            <BaseHeading :heading="content.heading" class="text-[clamp(2.7rem,4.8vw,5rem)]" />
            <p class="mt-8 max-w-sm text-[15px] leading-[1.7] text-ink/60">{{ content.intro }}</p>
          </li>
          <ProcessPanel
            v-for="(step, index) in content.steps"
            :key="step.id"
            :step="step"
            :index="index"
            :active="index === activeIndex"
          />
        </ol>
      </div>
    </div>
  </section>
</template>
