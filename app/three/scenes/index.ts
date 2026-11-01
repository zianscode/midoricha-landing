import type { SceneModule } from '~/three/core/Stage'

export const sceneLoaders = {
  hero: () => import('~/three/scenes/hero'),
  leaf: () => import('~/three/scenes/leaf'),
  cultivation: () => import('~/three/scenes/cultivation'),
  mill: () => import('~/three/scenes/mill'),
  ritual: () => import('~/three/scenes/ritual'),
  floatingLeaf: () => import('~/three/scenes/floatingLeaf')
} satisfies Record<string, () => Promise<SceneModule>>

export type SceneName = keyof typeof sceneLoaders
