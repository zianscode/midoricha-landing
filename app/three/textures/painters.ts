import type { PaintCanvas } from '~/three/core/canvas'
import { paintBamboo } from '~/three/textures/bamboo'
import { paintCeramic } from '~/three/textures/ceramic'
import { paintFoliage } from '~/three/textures/foliage'
import { paintGranite } from '~/three/textures/granite'
import { paintIron } from '~/three/textures/iron'
import { paintLeaf } from '~/three/textures/leaf'
import { paintNetAlpha, paintRadialAlpha } from '~/three/textures/masks'
import { paintFoam, paintPowder } from '~/three/textures/matcha'
import { paintDusting, paintEnso } from '~/three/textures/stills'
import { paintTatami } from '~/three/textures/tatami'

export const painters = {
  bamboo: paintBamboo,
  ceramic: paintCeramic,
  dusting: paintDusting,
  enso: paintEnso,
  foam: paintFoam,
  foliage: paintFoliage,
  granite: paintGranite,
  iron: paintIron,
  leaf: paintLeaf,
  netAlpha: paintNetAlpha,
  powder: paintPowder,
  radialAlpha: paintRadialAlpha,
  tatami: paintTatami
} satisfies Record<string, (...args: never[]) => Record<string, PaintCanvas>>

export type Painters = typeof painters
export type PainterName = keyof Painters
export type PainterArgs<N extends PainterName> = Parameters<Painters[N]>
export type PaintedSlot<N extends PainterName> = keyof ReturnType<Painters[N]> & string

export interface PaintRequest {
  id: number
  name: PainterName
  args: unknown[]
}

export type PaintResponse =
  | { id: number; bitmaps: Record<string, ImageBitmap> }
  | { id: number; error: string }

export function runPainter(name: PainterName, args: unknown[]) {
  return (painters[name] as (...input: unknown[]) => Record<string, PaintCanvas>)(...args)
}
