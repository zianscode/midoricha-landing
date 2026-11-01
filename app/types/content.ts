import type { SceneName } from '~/three/scenes'
import type { StillKind } from '~/three/stills/renderStills'

export type SectionId =
  | 'top'
  | 'leaf'
  | 'cultivation'
  | 'process'
  | 'grinding'
  | 'character'
  | 'history'
  | 'ritual'
  | 'modern'
  | 'begin'

export type Tone = 'dark' | 'light'

export interface Heading {
  lead: string
  accent: string
  inline?: boolean
}

export interface TextItem {
  title: string
  text: string
}

export interface Link {
  label: string
  href: string
}

export interface NavSection {
  id: SectionId
  label: string
}

export interface FigurePin {
  x: number
  y: number
}

export interface LeafFact extends TextItem {
  pin: FigurePin
}

export interface SceneFigure {
  scene: SceneName
  label: string
}

export type ProcessStepId = 'shade' | 'harvest' | 'steam' | 'dry' | 'grind'

export interface ProcessStep extends TextItem {
  id: ProcessStepId
}

export type ColorStops = readonly [string, string, string]

export interface SensoryNote {
  name: string
  level: number
  text: string
  tone: ColorStops
}

export interface HistoryEra extends TextItem {
  period: string
  kanji: string
  kanjiMeaning: string
}

export interface JapaneseTerm {
  kanji: string
  reading: string
  meaning: string
  text: string
}

export interface ModernUse extends TextItem {
  kind: StillKind
  alt: string
}
