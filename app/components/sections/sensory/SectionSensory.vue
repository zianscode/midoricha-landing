<script setup lang="ts">
import { sensoryContent as content } from '~/content/home'

const section = useTemplateRef<HTMLElement>('section')
const { progress, scrollYAt } = useSectionProgress(section)
const { scrollToTarget } = useSmoothScroll()

const noteCount = content.notes.length
const activeIndex = computed(() => Math.min(noteCount - 1, Math.floor(progress.value * noteCount)))
const activeNote = computed(() => content.notes[activeIndex.value]!)

function selectNote(index: number) {
  scrollToTarget(scrollYAt((index + 0.5) / noteCount))
}
</script>

<template>
  <section id="character" ref="section" class="relative h-[360vh] bg-paper">
    <div class="sticky top-0 flex h-svh flex-col overflow-hidden pt-24 md:pt-28">
      <div class="wrap">
        <BaseHeading :heading="content.heading" class="text-[clamp(2.4rem,5vw,5rem)]" />
      </div>

      <div class="wrap grid-editorial flex-1 content-center items-center gap-y-6">
        <div class="col-span-4 md:col-span-5">
          <SensoryPowderDisc
            class="mx-auto w-full max-w-[min(30rem,38svh)] md:max-w-[min(32rem,58svh)]"
            :tone="activeNote.tone"
            :marker-count="noteCount"
            :active-index="activeIndex"
          />
        </div>

        <div class="col-span-4 md:col-span-6 md:col-start-7">
          <div class="relative h-[clamp(4rem,11vw,10rem)] overflow-hidden">
            <Transition
              enter-active-class="transition duration-700 ease-calm"
              leave-active-class="absolute inset-x-0 top-0 transition duration-500 ease-calm"
              enter-from-class="translate-y-full opacity-0"
              leave-to-class="-translate-y-full opacity-0"
            >
              <p :key="activeNote.name" class="display text-[clamp(4rem,11vw,10rem)] leading-none text-forest">
                {{ activeNote.name }}
              </p>
            </Transition>
          </div>

          <div class="mt-6 max-w-md">
            <SensoryLevel :level="activeNote.level" :max-level="content.maxLevel" />
            <p class="mt-5 min-h-12 text-[16px] leading-relaxed text-ink/65" aria-live="polite">{{ activeNote.text }}</p>
          </div>

          <SensoryTabs class="mt-8" :notes="content.notes" :active-index="activeIndex" @select="selectNote" />
          <p class="mt-6 text-[12px] text-ink/40">{{ content.caption }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
