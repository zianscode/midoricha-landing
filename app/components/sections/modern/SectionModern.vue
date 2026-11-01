<script setup lang="ts">
import { modernContent as content } from '~/content/home'

const STICKY_TOP_REM = 5.5
const STACK_STEP_REM = 1.25

const section = useTemplateRef<HTMLElement>('section')
const stack = useTemplateRef<HTMLElement>('stack')
const { images, enabled } = useStillImages(
  section,
  content.uses.map((use) => use.kind)
)
const { progress } = useSectionProgress(stack)

const lastIndex = content.uses.length - 1

function depthOf(index: number) {
  return clamp01(progress.value * lastIndex - index)
}

function stickyTop(index: number) {
  return `${STICKY_TOP_REM + index * STACK_STEP_REM}rem`
}
</script>

<template>
  <section id="modern" ref="section" class="relative bg-paper py-28 md:py-40">
    <div class="wrap">
      <div class="grid-editorial gap-y-8">
        <div class="col-span-4 md:col-span-7">
          <BaseHeading v-reveal="0.08" :heading="content.heading" class="text-[clamp(2.9rem,6vw,6.4rem)]" />
        </div>
        <p v-reveal="0.14" class="col-span-4 max-w-xs self-end text-[15px] leading-[1.7] text-ink/60 md:col-span-3 md:col-start-10">
          {{ content.intro }}
        </p>
      </div>

      <div ref="stack" class="mt-16 md:mt-24">
        <div
          v-for="(use, index) in content.uses"
          :key="use.kind"
          class="sticky"
          :class="{ 'mb-[40svh]': index < lastIndex }"
          :style="{ top: stickyTop(index) }"
        >
          <ModernCard
            :use="use"
            :index="index"
            :total="content.uses.length"
            :depth="depthOf(index)"
            :image="images[use.kind]"
            :show-fallback="!enabled"
          />
        </div>
      </div>
    </div>
  </section>
</template>
