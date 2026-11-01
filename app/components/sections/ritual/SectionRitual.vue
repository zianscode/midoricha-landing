<script setup lang="ts">
import { ritualContent as content } from '~/content/home'
</script>

<template>
  <section id="ritual" class="relative overflow-hidden bg-forest text-cream">
    <div class="relative min-h-svh md:min-h-[min(100svh,58rem)]">
      <div class="scene-mask absolute inset-x-0 bottom-0 top-[42%] md:inset-y-0 md:left-[28%] md:right-0">
        <SceneCanvas v-bind="content.figure" />
      </div>

      <div class="wrap relative grid-editorial pb-[62svh] pt-28 md:min-h-[inherit] md:items-center md:py-32">
        <div class="col-span-4 md:col-span-5">
          <BaseHeading v-reveal="0.08" :heading="content.heading" tone="light" class="text-[clamp(2.9rem,5.2vw,5.6rem)]" />
          <ScrollRevealText
            :text="content.intro"
            class="mt-10 max-w-md text-[clamp(1.25rem,1.8vw,1.6rem)] font-medium leading-snug tracking-[-0.02em] text-cream"
          />
          <div v-reveal="0.2" class="mt-10">
            <BaseButton :href="content.action.href" tone="light">{{ content.action.label }}</BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div class="wrap relative pb-28 md:pb-40">
      <RitualSteps :steps="content.steps" />
    </div>
  </section>
</template>

<style scoped>
.scene-mask {
  mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 82%, transparent);
}

@media (min-width: 768px) {
  .scene-mask {
    mask-image:
      linear-gradient(to right, transparent, #000 26%),
      linear-gradient(to bottom, transparent, #000 12%, #000 80%, transparent);
    mask-composite: intersect;
  }
}
</style>
