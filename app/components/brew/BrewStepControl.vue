<script setup lang="ts">
import { BREW_RULES as RULES } from '~/constants/brew'
import { brewControls as labels } from '~/content/brew'
import type { BrewSceneState, BrewStatus, BrewStepId } from '~/types/brew'

defineProps<{
  stepId: BrewStepId
  scene: BrewSceneState
  status: BrewStatus
  pourHolding: boolean
  drinkHolding: boolean
}>()

const emit = defineEmits<{
  addScoop: []
  setTemperature: [value: number]
  pourStart: []
  pourStop: []
  emptyBowl: []
  serve: []
  drinkStart: []
  drinkStop: []
}>()

const waterBand = [RULES.water.idealMin / RULES.water.max, RULES.water.idealMax / RULES.water.max] as const
const overpoured = (water: number) => water > RULES.water.idealMax
</script>

<template>
  <div>
    <BrewScoopControl
      v-if="stepId === 'scoop'"
      :count="scene.scoops"
      :max="RULES.scoops"
      :label="labels.scoop"
      @add="emit('addScoop')"
    />

    <BrewTemperatureControl
      v-else-if="stepId === 'temperature'"
      :model-value="scene.temperature"
      :label="labels.kettle"
      :description="labels.temperatureLabel"
      @update:model-value="emit('setTemperature', $event)"
    />

    <div v-else-if="stepId === 'pour'" class="space-y-5">
      <BrewMeter
        :value="scene.water / RULES.water.max"
        :band="waterBand"
        :label="labels.water"
        :caption="`${Math.round(scene.water)} ml`"
        :warn="overpoured(scene.water)"
      />
      <button
        v-if="overpoured(scene.water)"
        type="button"
        class="h-14 w-full rounded-full border border-shu/60 text-[15px] font-medium text-shu-light transition-colors hover:bg-shu hover:text-white"
        @click="emit('emptyBowl')"
      >
        {{ labels.pourAgain }}
      </button>
      <BrewHoldButton v-else :label="labels.pour" :holding="pourHolding" @start="emit('pourStart')" @stop="emit('pourStop')" />
    </div>

    <div v-else-if="stepId === 'whisk'" class="space-y-3">
      <BrewMeter :value="scene.foam" :label="labels.foam" :caption="`${Math.round(scene.foam * 100)}%`" />
      <p class="text-[12px] text-white/40">{{ labels.whiskKeys }}</p>
    </div>

    <BrewActionButton
      v-else-if="stepId === 'serve'"
      :label="labels.serve"
      :disabled="scene.served"
      @press="emit('serve')"
    />

    <div v-else-if="stepId === 'turn'" class="space-y-3">
      <BrewMeter :value="status.progress" :label="labels.turned" :caption="`${Math.round(Math.min(1, status.progress) * 180)}°`" />
      <p class="text-[12px] text-white/40">{{ labels.turnKeys }}</p>
    </div>

    <div v-else class="space-y-5">
      <BrewMeter :value="scene.drink" :label="labels.drunk" :caption="`${Math.round(scene.drink * 100)}%`" />
      <BrewHoldButton
        :label="labels.drink"
        :holding="drinkHolding"
        :disabled="status.done"
        @start="emit('drinkStart')"
        @stop="emit('drinkStop')"
      />
    </div>
  </div>
</template>
