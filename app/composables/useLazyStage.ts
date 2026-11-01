import type { Ref } from 'vue'
import type { SceneSetup, Stage, StageOptions } from '~/three/core/Stage'

export interface StageBlueprint {
  options: StageOptions
  setup: SceneSetup
}

interface LazyStageOptions {
  progress?: Ref<number>
  rootMargin?: string
}

const PRELOAD_MARGIN = '80% 0px'

interface MountTurn {
  element: HTMLElement
  run: () => Promise<void>
}

const waiting: MountTurn[] = []
let mounting = false

function distanceToViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  if (rect.bottom < 0) return -rect.bottom
  return Math.max(0, rect.top - window.innerHeight)
}

function nextTurn() {
  if (mounting || !waiting.length) return
  waiting.sort((a, b) => distanceToViewport(a.element) - distanceToViewport(b.element))
  const turn = waiting.shift()!
  mounting = true
  turn.run().finally(() => {
    mounting = false
    nextTurn()
  })
}

function requestTurn(turn: MountTurn) {
  waiting.push(turn)
  const cancelSchedule = distanceToViewport(turn.element) === 0 ? whenNextFrame(nextTurn) : whenIdle(nextTurn)
  return () => {
    cancelSchedule()
    const index = waiting.indexOf(turn)
    if (index >= 0) waiting.splice(index, 1)
  }
}

export function useLazyStage(
  target: Readonly<Ref<HTMLElement | null>>,
  load: () => Promise<StageBlueprint>,
  options: LazyStageOptions = {}
) {
  const ready = ref(false)
  const enabled = ref(true)
  let stage: Stage | null = null
  let teardown: void | (() => void)
  let cancelTurn: (() => void) | undefined
  let unmounted = false

  async function mount() {
    const element = target.value
    if (!element || stage) return
    const [{ Stage }, blueprint] = await Promise.all([import('~/three/core/Stage'), load()])
    if (unmounted || !target.value) return
    stage = new Stage(element, blueprint.options)
    teardown = blueprint.setup(stage)
    if (options.progress) stage.setProgress(options.progress.value)
    await stage.start()
    if (!unmounted) ready.value = true
  }

  const { stop, resume } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (!entry?.isIntersecting) return
      stop()
      cancelTurn = requestTurn({
        element: entry.target as HTMLElement,
        run: () => mount().catch((error) => console.error('[scene]', error))
      })
    },
    { rootMargin: options.rootMargin ?? PRELOAD_MARGIN, immediate: false }
  )

  onMounted(() => {
    enabled.value = getDeviceTier() !== 'none'
    if (enabled.value) resume()
  })

  if (options.progress) watch(options.progress, (value) => stage?.setProgress(value))

  onBeforeUnmount(() => {
    unmounted = true
    stop()
    cancelTurn?.()
    if (typeof teardown === 'function') teardown()
    stage?.dispose()
    stage = null
  })

  return { ready, enabled }
}
