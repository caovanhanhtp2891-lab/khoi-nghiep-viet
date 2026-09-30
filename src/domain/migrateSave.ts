import { createInitialSnapshot } from '../store/initialState'
import type { GameSnapshot } from './types'

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function validSituation(value: unknown): boolean {
  if (!record(value) || !['id', 'title', 'description', 'character', 'role', 'location', 'icon'].every((key) => typeof value[key] === 'string') || !Array.isArray(value.choices)) return false
  return value.choices.every((choice) => record(choice) && typeof choice.id === 'string' && typeof choice.label === 'string' && typeof choice.description === 'string' && ['kind', 'business', 'careful'].includes(String(choice.tone)) && record(choice.effect) && Object.values(choice.effect).every((v) => typeof v === 'number' && Number.isFinite(v)))
}

/** Validate unknown historical payloads before allowing autosave to replace them. */
export function migrateSnapshot(raw: unknown): GameSnapshot {
  if (!record(raw) || !(typeof raw.version === 'number' && [1, 2, 3].includes(raw.version))) throw new Error('Phiên bản dữ liệu không được hỗ trợ')
  const defaults = createInitialSnapshot()
  for (const group of ['player', 'world', 'business', 'dayStats', 'lifetime'] as const) {
    const source = raw[group]
    if (!record(source)) throw new Error(`Dữ liệu ${group} không hợp lệ`)
    for (const [key, value] of Object.entries(defaults[group])) {
      if (group === 'player' && ['gender', 'position'].includes(key) && raw.version !== 3) continue
      const actual = source[key]
      if (typeof value === 'number' && (typeof actual !== 'number' || !Number.isFinite(actual))) throw new Error(`Số liệu ${group}.${key} không hợp lệ`)
      if (typeof value === 'string' && typeof actual !== 'string') throw new Error(`Nội dung ${group}.${key} không hợp lệ`)
      if (typeof value === 'boolean' && typeof actual !== 'boolean') throw new Error(`Trạng thái ${group}.${key} không hợp lệ`)
    }
  }
  const player = raw.player as Record<string, unknown>
  const world = raw.world as Record<string, unknown>
  const business = raw.business as Record<string, unknown>
  if (!['green', 'orange', 'blue'].includes(String(player.avatarStyle)) || !['sunny', 'cloudy', 'rain', 'hot'].includes(String(world.weather)) || ![1, 2, 4].includes(Number(world.speed))) throw new Error('Cấu hình game không hợp lệ')
  if (Number(world.minuteOfDay) < 0 || Number(world.minuteOfDay) >= 1440 || Number(world.day) < 1 || Number(business.inventory) < 0 || Number(business.inventory) > Number(business.maxInventory)) throw new Error('Trạng thái game ngoài giới hạn')
  if (typeof raw.onboarded !== 'boolean' || typeof raw.tutorialStep !== 'number' || !Number.isFinite(raw.tutorialStep)) throw new Error('Tiến trình mở đầu không hợp lệ')
  if (raw.version !== 1 && (!record(raw.story) || !Array.isArray(raw.story.history) || ![raw.story.lastSituationAt, raw.story.resolvedToday].every((v) => typeof v === 'number' && Number.isFinite(v)) || !(raw.story.activeSituation === null || validSituation(raw.story.activeSituation)) || !raw.story.history.every(validSituation))) throw new Error('Dữ liệu tình huống không hợp lệ')
  if (raw.version === 3 && (!['male', 'female'].includes(String(player.gender)) || !record(player.position) || ![player.position.x, player.position.y].every((v) => typeof v === 'number' && Number.isFinite(v)))) throw new Error('Nhân vật không hợp lệ')
  const result = {
    ...defaults, ...raw, version: 3,
    player: { ...defaults.player, ...player },
    world: { ...defaults.world, ...world },
    story: { ...defaults.story, ...(record(raw.story) ? raw.story : {}) },
    chat: Array.isArray(raw.chat) ? raw.chat.filter((v) => record(v) && typeof v.id === 'number' && Number.isFinite(v.id) && typeof v.minute === 'number' && Number.isFinite(v.minute) && typeof v.name === 'string' && typeof v.text === 'string' && typeof v.fromPlayer === 'boolean').slice(-40) : [],
    chatSeq: typeof raw.chatSeq === 'number' && Number.isFinite(raw.chatSeq) ? raw.chatSeq : 0,
    notices: [], noticeSeq: typeof raw.noticeSeq === 'number' && Number.isFinite(raw.noticeSeq) ? raw.noticeSeq : 0,
  } as GameSnapshot
  // Old corrupted Vietnamese text cannot be restored by changing its encoding.
  if (result.story.activeSituation?.title.includes('?')) result.story.activeSituation = null
  result.story.history = result.story.history.filter((v) => !v.title.includes('?')).slice(-8)
  result.player.position = { x: Math.min(0.92, Math.max(0.08, result.player.position.x)), y: Math.min(0.79, Math.max(0.64, result.player.position.y)) }
  return structuredClone(result)
}
