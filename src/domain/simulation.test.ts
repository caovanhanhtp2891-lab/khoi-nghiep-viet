import { describe, expect, it } from 'vitest'
import { createInitialSnapshot } from '../store/initialState'
import { calculateDemand, nextRandom, simulateTick } from './simulation'

describe('simulation', () => {
  it('is deterministic for the same state and seed', () => {
    const snapshot = createInitialSnapshot()
    snapshot.business.owned = true
    snapshot.business.open = true
    snapshot.business.inventory = 20

    expect(simulateTick(snapshot)).toEqual(simulateTick(snapshot))
  })

  it('never sells more than inventory or service capacity', () => {
    const snapshot = createInitialSnapshot()
    snapshot.business.owned = true
    snapshot.business.open = true
    snapshot.business.inventory = 1
    snapshot.world.minuteOfDay = 420
    snapshot.business.marketingScore = 100

    const result = simulateTick(snapshot)
    expect(result.sales).toBeLessThanOrEqual(1)
    expect(result.next.business.inventory).toBeGreaterThanOrEqual(0)
  })

  it('makes rain reduce demand', () => {
    const sunny = createInitialSnapshot()
    sunny.world.minuteOfDay = 420
    sunny.world.weather = 'sunny'
    const rainy = structuredClone(sunny)
    rainy.world.weather = 'rain'

    expect(calculateDemand(rainy).total).toBeLessThan(calculateDemand(sunny).total)
  })

  it('advances the seeded random generator consistently', () => {
    expect(nextRandom(24_051_998)).toEqual(nextRandom(24_051_998))
  })
})
