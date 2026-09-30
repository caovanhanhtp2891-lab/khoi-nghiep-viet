import Dexie, { type EntityTable } from 'dexie'
import type { GameSnapshot } from '../domain/types'

interface SaveRecord {
  id: 'autosave'
  schemaVersion: 1
  savedAt: string
  payload: GameSnapshot
}

class GameDatabase extends Dexie {
  saves!: EntityTable<SaveRecord, 'id'>

  constructor() {
    super('khoi-nghiep-viet')
    this.version(1).stores({
      saves: 'id, savedAt',
    })
  }
}

const db = new GameDatabase()

export async function saveGame(snapshot: GameSnapshot): Promise<void> {
  await db.saves.put({
    id: 'autosave',
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    payload: snapshot,
  })
}

export async function loadGame(): Promise<GameSnapshot | null> {
  const save = await db.saves.get('autosave')
  if (!save || save.schemaVersion !== 1 || save.payload.version !== 1) return null
  return save.payload
}

export async function deleteSave(): Promise<void> {
  await db.saves.delete('autosave')
}
