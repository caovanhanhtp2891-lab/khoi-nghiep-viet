import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialSnapshot } from '../store/initialState'
import { migrateSnapshot } from '../domain/migrateSave'
import { db, loadGame, saveGame, restoreBackup } from './saveDb'

beforeEach(async () => { await db.saves.clear() })

describe('save compatibility and recovery', () => {
  it('loads historical v2 money, inventory, world and story instead of returning a new game', async () => {
    const old = structuredClone(createInitialSnapshot()) as unknown as Record<string, unknown>
    old.version = 2
    const player = old.player as Record<string, unknown>
    delete player.gender; delete player.position
    player.money = 784000
    ;(old.business as Record<string, unknown>).owned = true
    ;(old.business as Record<string, unknown>).inventory = 8
    await db.saves.put({ id: 'autosave', schemaVersion: 1, savedAt: '2026-09-30', payload: old })
    const loaded = await loadGame()
    expect(loaded?.version).toBe(6)
    expect(loaded?.player.money).toBe(784000)
    expect(loaded?.business.inventory).toBe(8)
    expect(loaded?.player.gender).toBe('male')
  })
  it('migrates a historical v1 payload without story or character fields', () => {
    const v1 = structuredClone(createInitialSnapshot()) as unknown as Record<string, unknown>
    v1.version = 1; delete v1.story; delete v1.chat; delete v1.chatSeq
    const player = v1.player as Record<string, unknown>
    delete player.gender; delete player.position
    expect(migrateSnapshot(v1).story).toEqual(createInitialSnapshot().story)
  })
  it('round trips a female character, saved position, chat, money, RNG and pause', async () => {
    const state = createInitialSnapshot()
    state.player.gender = 'female'; state.player.position = { x: 0.22, y: 0.76 }
    state.player.money = 620000; state.world.rngSeed = 12345; state.world.paused = true
    state.neighborhood.relationships['npc-002'] = { bond: 27, greetedDay: 1, meetings: 9 }
    state.neighborhood.upgrades = ['storage']; state.business.maxInventory = 90
    state.neighborhood.claimedMilestones = ['booth']
    state.chat = [{ id: 1, name: 'Lan', text: 'Chào bạn!', minute: 400, fromPlayer: false }]; state.chatSeq = 1
    await saveGame(state)
    const loaded = await loadGame()
    expect(loaded).toEqual({ ...state, notices: [] })
  })
  it('retains malformed and future-version saves when loading fails', async () => {
    for (const payload of [{ ...createInitialSnapshot(), version: 99 }, { ...createInitialSnapshot(), player: { money: 'hỏng' } }]) {
      await db.saves.put({ id: 'autosave', schemaVersion: 1, savedAt: '2026-09-30', payload })
      await expect(loadGame()).rejects.toThrow()
      expect((await db.saves.get('autosave'))?.payload).toEqual(payload)
    }
  })
  it('backs up the previous progress and restores it explicitly', async () => {
    const state = createInitialSnapshot()
    state.player.money = 800000; await saveGame(state)
    state.player.money = 700000; await saveGame(state)
    await restoreBackup()
    expect((await loadGame())?.player.money).toBe(800000)
  })
})
