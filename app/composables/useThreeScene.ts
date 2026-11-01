import type { Ref } from 'vue'
import { sceneLoaders, type SceneName } from '~/three/scenes'

interface ThreeSceneOptions {
  progress?: Ref<number>
  rootMargin?: string
}

export function useThreeScene(target: Readonly<Ref<HTMLElement | null>>, scene: SceneName, options: ThreeSceneOptions = {}) {
  return useLazyStage(
    target,
    async () => {
      const sceneModule = await sceneLoaders[scene]()
      return { options: sceneModule.options, setup: sceneModule.default }
    },
    options
  )
}
