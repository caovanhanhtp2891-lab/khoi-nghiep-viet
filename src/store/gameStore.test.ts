import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from './gameStore'
import { generateLifeSituation } from '../domain/situations'

beforeEach(() => { useGameStore.getState().resetGame() })
function situation() {
  const state = useGameStore.getState()
  return generateLifeSituation(42, { ...state.world, price: state.business.price, productName: state.business.productName }).situation
}
describe('player, chat and story transactions', () => {
  it('creates the requested female character and clamps movement to the sidewalk', () => {
    useGameStore.getState().startJourney('Lan', 'orange', 'female')
    useGameStore.getState().movePlayer(-2, 10)
    expect(useGameStore.getState().player).toMatchObject({ name: 'Lan', gender: 'female', age: 18, position: { x: 0.08, y: 0.79 } })
  })
  it('does not create money for stock that is unavailable', () => {
    const event = situation()
    useGameStore.setState({ story: { ...useGameStore.getState().story, activeSituation: event } })
    const before = useGameStore.getState()
    useGameStore.getState().resolveSituation('serve')
    expect(useGameStore.getState().player.money).toBe(before.player.money)
    expect(useGameStore.getState().dayStats.revenue).toBe(0)
    expect(useGameStore.getState().story.activeSituation).not.toBeNull()
  })
  it('sells exactly the requested stock once and reconciles money, revenue and cost', () => {
    const event = situation()
    const choice = event.choices.find((c) => c.id === 'serve')!
    const quantity = -(choice.effect.inventory ?? 0)
    useGameStore.setState({ business: { ...useGameStore.getState().business, owned: true, inventory: quantity }, story: { ...useGameStore.getState().story, activeSituation: event } })
    const before = useGameStore.getState()
    useGameStore.getState().resolveSituation('serve')
    useGameStore.getState().resolveSituation('serve')
    const after = useGameStore.getState()
    expect(after.business.inventory).toBe(0)
    expect(after.player.money).toBe(before.player.money + quantity * before.business.price)
    expect(after.dayStats.revenue).toBe(quantity * before.business.price)
    expect(after.dayStats.cogs).toBe(quantity * before.business.unitCost)
    expect(after.story.resolvedToday).toBe(1)
  })
  it('rejects help when the player cannot afford it', () => {
    useGameStore.setState({ player: { ...useGameStore.getState().player, money: 0 }, story: { ...useGameStore.getState().story, activeSituation: situation() } })
    useGameStore.getState().resolveSituation('help')
    expect(useGameStore.getState().story.resolvedToday).toBe(0)
    expect(useGameStore.getState().dayStats.expenses).toBe(0)
  })
  it('keeps chat bounded, accepts plain text and creates a contextual NPC reply', () => {
    useGameStore.getState().startJourney('Lan', 'green', 'female')
    useGameStore.setState({ world: { ...useGameStore.getState().world, weather: 'rain' } })
    for (let i = 0; i < 30; i++) useGameStore.getState().sendChat(' Chào bạn! ')
    const state = useGameStore.getState()
    expect(state.chat).toHaveLength(40)
    expect(state.chat.at(-2)?.text).toBe('Chào bạn!')
    expect(state.chat.at(-1)?.fromPlayer).toBe(false)
    expect(state.chatSeq).toBe(60)
  })
})
