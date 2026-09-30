import { CAREER_IDS, career } from './careers'
import { freshDayStats } from './accounting'
import { createCompetition, validateCompetition } from './competition'
import { getNpc } from './npcCatalog'
import { MILESTONES, UPGRADES, dailyOrders } from './neighborhood'
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
  if (!record(raw) || !(typeof raw.version === 'number' && [1, 2, 3, 4, 5, 6].includes(raw.version))) throw new Error('Phiên bản dữ liệu không được hỗ trợ')
  const defaults = createInitialSnapshot()
  for (const group of ['player', 'world', 'business', 'dayStats', 'lifetime'] as const) {
    const source = raw[group]
    if (!record(source)) throw new Error(`Dữ liệu ${group} không hợp lệ`)
    for (const [key, value] of Object.entries(defaults[group])) {
      // Historical saves have no reliable opening cash; validDayStats handles null.
      if (group === 'dayStats' && key === 'cashOpening') continue
      if (Number(raw.version) < 5 && ((group === 'business' && key === 'careerId') || (group === 'dayStats' && ['cashOpening','stockPurchases','capitalPurchases','recoveries','communityRewards','careerIds'].includes(key)))) continue
      if (group === 'player' && ['gender', 'position'].includes(key) && Number(raw.version) < 3) continue
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
  if (Number(raw.version) >= 3 && (!['male', 'female'].includes(String(player.gender)) || !record(player.position) || ![player.position.x, player.position.y].every((v) => typeof v === 'number' && Number.isFinite(v)))) throw new Error('Nhân vật không hợp lệ')
  const result = {
    ...defaults, ...raw, version: 6,
    player: { ...defaults.player, ...player },
    world: { ...defaults.world, ...world },
    story: { ...defaults.story, ...(record(raw.story) ? raw.story : {}) },
    chat: Array.isArray(raw.chat) ? raw.chat.filter((v) => record(v) && typeof v.id === 'number' && Number.isFinite(v.id) && typeof v.minute === 'number' && Number.isFinite(v.minute) && typeof v.name === 'string' && typeof v.text === 'string' && typeof v.fromPlayer === 'boolean').slice(-40) : [],
    chatSeq: typeof raw.chatSeq === 'number' && Number.isFinite(raw.chatSeq) ? raw.chatSeq : 0,
    notices: [], noticeSeq: typeof raw.noticeSeq === 'number' && Number.isFinite(raw.noticeSeq) ? raw.noticeSeq : 0,
  } as GameSnapshot
  if (Number(raw.version) >= 4) {
    const n = raw.neighborhood
    if (!record(n) || !record(n.relationships) || !Array.isArray(n.completedOrders) || !Array.isArray(n.upgrades) || !Array.isArray(n.claimedMilestones) || typeof n.deliveries !== 'number' || !Number.isSafeInteger(n.deliveries) || n.deliveries < 0) throw new Error('Tiến trình khu phố không hợp lệ')
    for (const [id, r] of Object.entries(n.relationships)) {
      if (!getNpc(id) || !record(r) || ![r.bond,r.greetedDay,r.meetings].every(v=>typeof v==='number' && Number.isSafeInteger(v) && v>=0) || Number(r.bond)>100 || Number(r.greetedDay)>Number(world.day)) throw new Error('Quan hệ cư dân không hợp lệ')
    }
    if (n.completedOrders.length>60 || !n.completedOrders.every(id=>typeof id==='string' && /^delivery-[1-9]\d*-[0-2]$/.test(id)) || !n.upgrades.every(id=>UPGRADES.some(u=>u.id===id)) || !n.claimedMilestones.every(id=>MILESTONES.some(m=>m.id===id))) throw new Error('Nhiệm vụ khu phố không hợp lệ')
    if (n.activeOrder !== null) {
      const order=n.activeOrder
      if (!record(order) || typeof order.day!=='number' || !Number.isSafeInteger(order.day) || order.day<1 || order.day>Number(world.day)) throw new Error('Đơn cư dân không hợp lệ')
      const orderCareer = Number(raw.version) >= 5 ? order.careerId : 'xoi'
      if (!CAREER_IDS.includes(orderCareer as GameSnapshot['business']['careerId'])) throw new Error('Nghề của đơn không hợp lệ')
      const offer=dailyOrders(order.day, orderCareer as GameSnapshot['business']['careerId']).find(o=>o.id===order.id)
      if (!offer || offer.npcId!==order.npcId || offer.quantity!==order.quantity || offer.unitPrice!==order.unitPrice || ![order.acceptedAt,order.dueAt].every(v=>typeof v==='number' && Number.isFinite(v)) || Number(order.dueAt)!==Number(order.acceptedAt)+120 || Number(order.acceptedAt)<order.day*1440 || Number(order.acceptedAt)>order.day*1440+1439 || n.completedOrders.includes(order.id)) throw new Error('Đơn cư dân không hợp lệ')
    }
    result.neighborhood = structuredClone(n) as unknown as GameSnapshot['neighborhood']
    if (raw.version === 4 && result.neighborhood.activeOrder) result.neighborhood.activeOrder.careerId = 'xoi'
    result.neighborhood.upgrades = [...new Set(result.neighborhood.upgrades)]
    result.neighborhood.claimedMilestones = [...new Set(result.neighborhood.claimedMilestones)]
  } else result.neighborhood = defaults.neighborhood
  if (Number(raw.version) >= 5) {
    if (!CAREER_IDS.includes(result.business.careerId)) throw new Error('Nghề kinh doanh không hợp lệ')
    const config = career(result.business.careerId)
    if (result.business.unitCost !== config.unitCost || result.business.price < config.minPrice || result.business.price > config.maxPrice || (result.neighborhood.activeOrder && result.neighborhood.activeOrder.careerId !== result.business.careerId)) throw new Error('Cấu hình sản phẩm không hợp lệ')
    if (!validDayStats(result.dayStats) || !Array.isArray(raw.reports) || raw.reports.length > 30) throw new Error('Sổ kinh doanh không hợp lệ')
    let previousDay = 0
    for (const report of raw.reports) {
      if (!record(report) || !validDayStats(report) || !Number.isSafeInteger(report.day) || Number(report.day) <= previousDay || Number(report.day) >= result.world.day || !['sunny','cloudy','rain','hot'].includes(String(report.weather)) || ![report.rent,report.payroll,report.profit,report.cashClosing].every(v=>typeof v==='number' && Number.isFinite(v)) || Number(report.rent)<0 || Number(report.payroll)<0 || report.profit !== Number(report.revenue)-Number(report.cogs)-Number(report.expenses)-Number(report.rent)-Number(report.payroll)) throw new Error('Báo cáo ngày không hợp lệ')
      previousDay = Number(report.day)
    }
  } else {
    result.business = { ...result.business, careerId: 'xoi' }
    const old = raw.dayStats as GameSnapshot['dayStats']
    result.dayStats = { ...freshDayStats(null, 'xoi'), revenue: old.revenue, cogs: old.cogs, expenses: old.expenses, customers: old.customers, lostCustomers: old.lostCustomers }
    result.reports = []
  }
  result.competition = raw.version === 6 ? validateCompetition(raw.competition, result.world, validDayStats) : createCompetition(result.world, true)
  if (result.competition.activeDuel && (result.competition.rivals.find(r => r.id === result.competition.activeDuel!.rivalId)!.business.careerId !== result.business.careerId || result.competition.activeDuel.playerStartCustomers > result.dayStats.customers)) throw new Error('Mốc thi đua không hợp lệ')
  // Old corrupted Vietnamese text cannot be restored by changing its encoding.
  if (result.story.activeSituation?.title.includes('?')) result.story.activeSituation = null
  result.story.history = result.story.history.filter((v) => !v.title.includes('?')).slice(-8)
  result.player.position = { x: Math.min(0.92, Math.max(0.08, result.player.position.x)), y: Math.min(0.79, Math.max(0.64, result.player.position.y)) }
  return structuredClone(result)
}

function validDayStats(value: unknown): boolean {
 if (!record(value) || !['revenue','cogs','expenses','customers','lostCustomers','stockPurchases','capitalPurchases','recoveries','communityRewards'].every(k=>typeof value[k]==='number' && Number.isFinite(value[k]) && Number(value[k])>=0)) return false
 return (value.cashOpening===null || (typeof value.cashOpening==='number' && Number.isFinite(value.cashOpening))) && Array.isArray(value.careerIds) && value.careerIds.length>0 && value.careerIds.length<=3 && value.careerIds.every(id=>CAREER_IDS.includes(id))
}
