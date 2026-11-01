<script setup lang="ts">
import { leafContent as content } from '~/content/home'

const facts = useTemplateRef<HTMLElement>('facts')
const factsProgress = useViewportProgress(facts, { enter: 0.75, leave: 0.55 })
const revealedCount = computed(() => Math.ceil(factsProgress.value * content.facts.length))
</script>

<template>
  <section id="leaf" class="relative bg-paper py-28 md:py-40">
    <div class="wrap grid-editorial gap-y-14">
      <div class="col-span-4 md:col-span-5 md:row-span-2">
        <figure class="md:sticky md:top-24">
          <div class="relative aspect-[3/4.2] overflow-hidden rounded-[28px] bg-cream">
            <SceneCanvas v-bind="content.figure" />
            <LeafAnnotation
              v-for="(fact, index) in content.facts"
              :key="fact.title"
              :fact="fact"
              :index="index"
              :visible="index < revealedCount"
            />
          </div>
          <figcaption class="mt-4 flex items-baseline justify-between px-1 text-[13px] text-ink/50">
            <span class="font-medium text-ink/80">{{ content.caption.name }}</span>
            <span>{{ content.caption.note }}</span>
          </figcaption>
        </figure>
      </div>

      <div class="col-span-4 md:col-span-6 md:col-start-7">
        <BaseHeading v-reveal="0.08" :heading="content.heading" class="text-[clamp(2.9rem,5.6vw,5.8rem)]" />
        <ScrollRevealText
          :text="content.intro"
          class="mt-14 text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-tight tracking-[-0.03em] text-forest"
        />
        <p v-reveal class="mt-10 max-w-md text-[15px] leading-[1.75] text-ink/55">{{ content.detail }}</p>
      </div>

      <div ref="facts" class="col-span-4 md:col-span-6 md:col-start-7 md:pb-24">
        <LeafFacts :facts="content.facts" :revealed-count="revealedCount" />
      </div>
    </div>
  </section>
</template>
