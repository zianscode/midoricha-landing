export const BREW_RULES = {
  scoops: 2,
  temperature: { min: 60, max: 100, start: 96, idealMin: 75, idealMax: 85 },
  water: { max: 110, idealMin: 60, idealMax: 80, pourRatePerSecond: 18 },
  foam: { perUnit: 0.022, minStroke: 0.015, maxStroke: 2 },
  turn: { target: Math.PI, perPixel: 0.008, keyStep: Math.PI / 12 },
  drink: { ratePerSecond: 0.24, liftSeconds: 0.7 },
  whisk: { keyStep: 0.9 }
} as const
