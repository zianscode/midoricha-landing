export type BrewStepId = 'scoop' | 'temperature' | 'pour' | 'whisk' | 'serve' | 'turn' | 'drink'

export type BrewPhase = 'intro' | 'brewing' | 'done'

export type BrewShot = BrewStepId | Exclude<BrewPhase, 'brewing'>

export type BrewGesture = 'tap' | 'slide' | 'hold' | 'whisk' | 'drag'

export interface BrewStep {
  id: BrewStepId
  kanji: string
  reading: string
  title: string
  hint: string
  gesture: BrewGesture
}

export type FeedbackTone = 'neutral' | 'good' | 'warn'

export interface BrewStatus {
  done: boolean
  message: string
  tone: FeedbackTone
  progress: number
}

export interface BrewSummary {
  temperature: string
  water: string
  whisk: string
}

export interface BrewSceneState {
  shot: BrewShot
  scoops: number
  temperature: number
  water: number
  pouring: boolean
  foam: number
  whisking: boolean
  whiskX: number
  whiskZ: number
  served: boolean
  turn: number
  drink: number
  drinking: boolean
}
