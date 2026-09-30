import Dexie, { type EntityTable } from 'dexie'
import type { GameSnapshot } from '../domain/types'
import { migrateSnapshot } from '../domain/migrateSave'

interface SaveRecord {
  id: 'autosave' | 'backup'
  schemaVersion: 1
  savedAt: string
  payload: unknown
}
class GameDatabase extends Dexie {
  saves!: EntityTable<SaveRecord, 'id'>
  constructor() {
    super('khoi-nghiep-viet')
    this.version(1).stores({ saves: 'id, savedAt' })
  }
}
export const db = new GameDatabase()

export async function saveGame(snapshot: GameSnapshot): Promise<void> {
  migrateSnapshot(snapshot)
  await db.transaction('rw', db.saves, async () => {
    const old = await db.saves.get('autosave')
    if (old) await db.saves.put({ ...old, id: 'backup' })
    await db.saves.put({ id: 'autosave', schemaVersion: 1, savedAt: new Date().toISOString(), payload: snapshot })
  })
}
export async function loadGame(): Promise<GameSnapshot | null> {
  const save = await db.saves.get('autosave')
  if (!save) return null
  if (save.schemaVersion !== 1) throw new Error('Định dạng lưu chưa được hỗ trợ')
  return migrateSnapshot(save.payload)
}
export async function restoreBackup(): Promise<void> {
  const backup = await db.saves.get('backup')
  if (!backup) throw new Error('Chưa có bản sao lưu')
  const payload = migrateSnapshot(backup.payload)
  await db.saves.put({ ...backup, id: 'autosave', payload })
}
export async function exportSavedGame(): Promise<string> {
  return JSON.stringify(await db.saves.toArray(), null, 2)
}
export async function deleteSave(): Promise<void> {
  await db.saves.delete('autosave')
}
