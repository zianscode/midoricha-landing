import type { Ref } from 'vue'
import type { BrewSceneState } from '~/types/brew'

export function useBrewScene(target: Readonly<Ref<HTMLElement | null>>, state: BrewSceneState) {
  return useLazyStage(
    target,
    async () => {
      const brew = await import('~/three/brew/brewScene')
      return { options: brew.options, setup: (stage) => brew.default(stage, state) }
    },
    { rootMargin: '0px' }
  )
}
