import { expect, it } from 'vitest'
import { generateLifeSituation } from './situations'
import { nextRandom } from './simulation'
it('returns the RNG state after generating all choices, with deterministic Vietnamese text', () => {
  const context = { day: 1, minuteOfDay: 420, weather: 'rain' as const, productName: 'Xôi mặn', price: 22000 }
  const result = generateLifeSituation(42, context)
  expect(result).toEqual(generateLifeSituation(42, context))
  let seed = 42
  // Rain skips the random icon: 6 content choices + 1 order quantity draw.
  for (let i = 0; i < 7; i++) seed = nextRandom(seed).seed
  expect(result.seed).toBe(seed)
  expect(result.situation.title).not.toContain('?')
  expect(result.situation.choices[0]?.label).toContain('Phục vụ')
})
