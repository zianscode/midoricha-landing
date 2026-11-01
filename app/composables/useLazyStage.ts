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

export function useLazyStage(
  target: Readonly<Ref<HTMLElement | null>>,
  load: () => Promise<StageBlueprint>,
  options: LazyStageOptions = {}
) {
  const ready = ref(false)
  const enabled = ref(true)
  let stage: Stage | null = null
  let teardown: void | (() => void)
  let cancelIdle: (() => void) | undefined
  let unmounted = false

  async function mount() {
    const element = target.value
    if (!element || stage) return
    const [{ Stage }, blueprint] = await Promise.all([import('~/three/core/Stage'), load()])
    if (unmounted || !target.value) return
    stage = new Stage(element, blueprint.options)
    teardown = blueprint.setup(stage)
    if (options.progress) stage.setProgress(options.progress.value)
    requestAnimationFrame(() => (ready.value = true))
  }

  const { stop, resume } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (!entry?.isIntersecting) return
      stop()
      cancelIdle = whenIdle(() => mount().catch((error) => console.error('[scene]', error)))
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
    cancelIdle?.()
    if (typeof teardown === 'function') teardown()
    stage?.dispose()
    stage = null
  })

  return { ready, enabled }
}
