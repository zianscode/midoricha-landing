import { BREW_RULES as RULES } from '~/constants/brew'
import { brewFeedback, brewSteps } from '~/content/brew'
import type { BrewPhase, BrewSceneState, BrewStatus, BrewStepId, BrewSummary, FeedbackTone } from '~/types/brew'

const MAX_WHISK_GAP_MS = 250

function createSceneState(): BrewSceneState {
  return {
    shot: 'intro',
    scoops: 0,
    temperature: RULES.temperature.start,
    water: 0,
    pouring: false,
    foam: 0,
    whisking: false,
    whiskX: 0,
    whiskZ: 0,
    served: false,
    turn: 0,
    drink: 0,
    drinking: false
  }
}

function status(step: BrewStepId, key: string, done: boolean, progress: number, tone: FeedbackTone = 'neutral'): BrewStatus {
  return { done, progress: clamp01(progress), message: brewFeedback[step][key] ?? '', tone: done ? 'good' : tone }
}

function evaluate(step: BrewStepId, scene: BrewSceneState): BrewStatus {
  switch (step) {
    case 'scoop': {
      const key = scene.scoops === 0 ? 'empty' : scene.scoops < RULES.scoops ? 'one' : 'ready'
      return status(step, key, scene.scoops >= RULES.scoops, scene.scoops / RULES.scoops)
    }
    case 'temperature': {
      const { idealMin, idealMax, max, min } = RULES.temperature
      if (scene.temperature > idealMax) return status(step, 'hot', false, (max - scene.temperature) / (max - idealMax), 'warn')
      if (scene.temperature < idealMin) return status(step, 'cool', false, (scene.temperature - min) / (idealMin - min), 'warn')
      return status(step, 'ready', true, 1)
    }
    case 'pour': {
      const { idealMin, idealMax } = RULES.water
      const progress = scene.water / idealMin
      if (scene.water > idealMax) return status(step, 'over', false, 1, 'warn')
      if (scene.water >= idealMin) return status(step, 'ready', !scene.pouring, 1)
      return status(step, scene.water === 0 ? 'empty' : 'low', false, progress)
    }
    case 'whisk': {
      const key = scene.foam === 0 ? 'start' : scene.foam < 1 ? 'keep' : 'ready'
      return status(step, key, scene.foam >= 1, scene.foam)
    }
    case 'serve':
      return status(step, scene.served ? 'ready' : 'start', scene.served, scene.served ? 1 : 0)
    case 'turn': {
      const key = scene.turn === 0 ? 'start' : scene.turn < RULES.turn.target ? 'keep' : 'ready'
      return status(step, key, scene.turn >= RULES.turn.target, scene.turn / RULES.turn.target)
    }
    case 'drink': {
      const key = scene.drink >= 1 ? 'ready' : scene.drinking ? 'sip' : scene.drink === 0 ? 'start' : 'keep'
      return status(step, key, scene.drink >= 1, scene.drink)
    }
  }
}

export function useBrewSession() {
  const phase = ref<BrewPhase>('intro')
  const stepIndex = ref(0)
  const scene = reactive(createSceneState())
  const whiskMilliseconds = ref(0)
  let lastWhiskAt = 0

  const step = computed(() => brewSteps[stepIndex.value]!)
  const current = computed(() => evaluate(step.value.id, scene))
  const isLastStep = computed(() => stepIndex.value === brewSteps.length - 1)

  const pour = useHoldAction((seconds) => {
    scene.water = Math.min(RULES.water.max, scene.water + RULES.water.pourRatePerSecond * seconds)
  })

  const drink = useHoldAction((seconds, heldSeconds) => {
    if (heldSeconds < RULES.drink.liftSeconds) return
    scene.drink = Math.min(1, scene.drink + RULES.drink.ratePerSecond * seconds)
    if (scene.drink >= 1) drink.stop()
  })

  watch(pour.holding, (holding) => (scene.pouring = holding))
  watch(drink.holding, (holding) => (scene.drinking = holding))
  watchEffect(() => {
    scene.shot = phase.value === 'brewing' ? step.value.id : phase.value
  })

  function begin() {
    phase.value = 'brewing'
  }

  function next() {
    if (!current.value.done) return
    if (isLastStep.value) phase.value = 'done'
    else stepIndex.value += 1
  }

  function restart() {
    pour.stop()
    drink.stop()
    Object.assign(scene, createSceneState())
    whiskMilliseconds.value = 0
    stepIndex.value = 0
    phase.value = 'brewing'
  }

  function addScoop() {
    if (scene.scoops < RULES.scoops) scene.scoops += 1
  }

  function setTemperature(value: number) {
    scene.temperature = Math.min(RULES.temperature.max, Math.max(RULES.temperature.min, value))
  }

  function emptyBowl() {
    pour.stop()
    scene.water = 0
  }

  function whiskTo(x: number, z: number) {
    const distance = Math.hypot(x - scene.whiskX, z - scene.whiskZ)
    scene.whiskX = x
    scene.whiskZ = z
    if (distance < RULES.foam.minStroke || scene.foam >= 1) return
    scene.foam = Math.min(1, scene.foam + Math.min(distance, RULES.foam.maxStroke) * RULES.foam.perUnit)
    const now = performance.now()
    if (lastWhiskAt) whiskMilliseconds.value += Math.min(MAX_WHISK_GAP_MS, now - lastWhiskAt)
    lastWhiskAt = now
  }

  function setWhisking(active: boolean) {
    scene.whisking = active
    if (!active) lastWhiskAt = 0
  }

  function serve() {
    scene.served = true
  }

  function turnBy(radians: number) {
    if (radians <= 0) return
    scene.turn = Math.min(RULES.turn.target * 1.1, scene.turn + radians)
  }

  const summary = computed<BrewSummary>(() => ({
    temperature: `${Math.round(scene.temperature)} °C`,
    water: `${Math.round(scene.water)} ml`,
    whisk: `${(whiskMilliseconds.value / 1000).toFixed(1)} s`
  }))

  return {
    phase: readonly(phase),
    stepIndex: readonly(stepIndex),
    steps: brewSteps,
    step,
    current,
    isLastStep,
    scene,
    summary,
    pour,
    drink,
    begin,
    next,
    restart,
    addScoop,
    setTemperature,
    emptyBowl,
    whiskTo,
    setWhisking,
    serve,
    turnBy
  }
}
