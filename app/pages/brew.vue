<script setup lang="ts">
import { brewMeta } from '~/content/brew'

definePageMeta({ layout: 'immersive' })
useSeoMeta({ title: brewMeta.title, description: brewMeta.description, ogTitle: brewMeta.title, ogDescription: brewMeta.description })

const session = useBrewSession()
const { phase, step, stepIndex, steps, current, isLastStep, scene, summary, pour, drink } = session

const canvas = useTemplateRef<HTMLElement>('canvas')
const { ready, enabled } = useBrewScene(canvas, scene)

const gestureMode = computed(() => {
  if (phase.value !== 'brewing') return null
  if (step.value.gesture === 'whisk') return 'whisk'
  if (step.value.gesture === 'drag') return 'drag'
  return null
})
</script>

<template>
  <div class="relative size-full">
    <div
      ref="canvas"
      class="absolute inset-0 transition-opacity duration-1000 ease-calm"
      :class="ready || !enabled ? 'opacity-100' : 'opacity-0'"
      role="img"
      :aria-label="brewMeta.sceneLabel"
    />

    <BrewGestureLayer
      v-if="gestureMode"
      :key="gestureMode"
      class="absolute inset-0 z-10"
      :mode="gestureMode"
      @whisk="session.whiskTo"
      @whisk-active="session.setWhisking"
      @turn="session.turnBy"
    />

    <header class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 p-5 md:p-8">
      <NuxtLink to="/" class="pointer-events-auto text-white" :aria-label="brewMeta.homeLabel">
        <BrandMark collapsible accent />
      </NuxtLink>
      <BrewStepper
        v-if="phase !== 'intro'"
        class="pointer-events-auto"
        :steps="steps"
        :active-index="stepIndex"
        :finished="phase === 'done'"
      />
      <NuxtLink
        to="/"
        class="group pointer-events-auto inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/25 px-4 text-[13px] font-medium text-white transition-colors duration-300 ease-calm hover:border-white/60 hover:bg-white/10"
        :aria-label="brewMeta.homeLabel"
      >
        <BaseArrowIcon back />
        <span class="hidden sm:inline">{{ brewMeta.homeAction }}</span>
      </NuxtLink>
    </header>

    <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 md:inset-y-0 md:left-0 md:right-auto md:flex md:w-[min(30rem,44vw)] md:items-end md:p-8">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-700 ease-calm"
        leave-active-class="transition duration-300"
        enter-from-class="translate-y-4 opacity-0"
        leave-to-class="opacity-0"
      >
        <BrewIntro v-if="phase === 'intro'" class="pointer-events-auto pb-6 md:pb-10" @begin="session.begin" />

        <BrewPanel
          v-else-if="phase === 'brewing'"
          class="pointer-events-auto w-full"
          :step="step"
          :index="stepIndex"
          :total="steps.length"
          :status="current"
          :is-last="isLastStep"
          @next="session.next"
        >
          <BrewStepControl
            :step-id="step.id"
            :scene="scene"
            :status="current"
            :pour-holding="pour.holding.value"
            :drink-holding="drink.holding.value"
            @add-scoop="session.addScoop"
            @set-temperature="session.setTemperature"
            @pour-start="pour.start"
            @pour-stop="pour.stop"
            @empty-bowl="session.emptyBowl"
            @serve="session.serve"
            @drink-start="drink.start"
            @drink-stop="drink.stop"
          />
        </BrewPanel>

        <BrewComplete v-else class="pointer-events-auto pb-6 md:pb-10" :summary="summary" @again="session.restart" />
      </Transition>
    </div>
  </div>
</template>
