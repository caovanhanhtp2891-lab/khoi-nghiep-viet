import { businessForCareer, career, isTradingHour, DAILY_RENT, STARTER_QUANTITY, type CareerId } from './careers'
import { freshDayStats } from './accounting'
import { getNpc } from './npcCatalog'
import { UPGRADES, type UpgradeId } from './neighborhood'
import type { BusinessState, DayReport, DayStats, GameSnapshot, WorldState } from './types'

export const RIVAL_DEFINITIONS = [
  { id: 'npc-011', careerId: 'xoi' as CareerId, shop: 'Xôi Chú Sáu', style: 'Giữ giá ổn định, dành tiền dự phòng.', priceOffset: 0 },
  { id: 'npc-013', careerId: 'banhmi' as CareerId, shop: 'Bánh Mì Anh Tài', style: 'Giá mềm, tập trung phục vụ giờ cao điểm.', priceOffset: -2000 },
  { id: 'npc-018', careerId: 'trasua' as CareerId, shop: 'Trà Sữa Trâm', style: 'Theo thời tiết, tăng giá nhẹ khi nắng nóng.', priceOffset: 0 },
] as const
export const DUEL_REWARD = 50000
export const DUEL_XP = 60
export const COMPETITION_FACTOR = 0.88

export interface RivalState {
  id: string
  cash: number
  business: BusinessState
  dayStats: DayStats
  rngSeed: number
  upgrades: UpgradeId[]
  lastPlanDay: number
  lastReport: DayReport | null
}
export interface CompetitionNews { id: number; npcId: string; day: number; minute: number; text: string }
export interface DailyDuel {
  day: number; rivalId: string; acceptedAt: number
  playerStartProfit: number; rivalStartProfit: number; playerStartCustomers: number
}
export interface DuelResult {
  day: number; rivalId: string; playerProfit: number; rivalProfit: number; customers: number
  outcome: 'won' | 'lost'; claimed: boolean
}
export interface CompetitionState {
  joinedAt: number; eligibleFromDay: number; rivals: RivalState[]
  news: CompetitionNews[]; newsSeq: number
  activeDuel: DailyDuel | null; lastDuelDay: number; history: DuelResult[]
}
export function createCompetition(world: Pick<WorldState, 'day' | 'minuteOfDay'>, historical = false): CompetitionState {
  return {
    joinedAt: world.day * 1440 + world.minuteOfDay,
    eligibleFromDay: world.day + Number(historical), news: [], newsSeq: 0,
    activeDuel: null, lastDuelDay: 0, history: [],
    rivals: RIVAL_DEFINITIONS.map((definition, index) => {
      const config = career(definition.careerId)
      const business = businessForCareer(definition.careerId)
      business.owned = true; business.inventory = STARTER_QUANTITY; business.name = definition.shop
      business.price += definition.priceOffset
      const dayStats = freshDayStats(1000000, definition.careerId)
      dayStats.stockPurchases = STARTER_QUANTITY * config.unitCost; dayStats.capitalPurchases = config.setup
      return { id: definition.id, cash: 1000000 - dayStats.stockPurchases - dayStats.capitalPurchases,
        business, dayStats, rngSeed: (20260930 + index * 7919) >>> 0, upgrades: [], lastPlanDay: 0, lastReport: null }
    }),
  }
}
export function operatingProfit(stats: DayStats): number { return stats.revenue - stats.cogs - stats.expenses }
export function projectedProfit(stats: DayStats, business: BusinessState): number {
  return operatingProfit(stats) - (business.owned ? DAILY_RENT + (business.hasEmployee ? business.dailySalary : 0) : 0)
}
export function assetBreakdown(cash: number, business: BusinessState, upgrades: UpgradeId[]) {
  const stock = business.owned ? business.inventory * business.unitCost : 0
  const equipment = business.owned ? Math.floor(career(business.careerId).setup / 2) : 0
  const improvements = business.owned ? UPGRADES.filter(u => upgrades.includes(u.id)).reduce((sum, u) => sum + Math.floor(u.cost / 2), 0) : 0
  return { cash, stock, equipment, improvements, total: cash + stock + equipment + improvements }
}
export type RankingMetric = 'assets' | 'revenue' | 'profit'
export function leaderboard(snapshot: GameSnapshot, metric: RankingMetric = 'assets') {
  const entries = [
    { id: 'player', name: snapshot.player.name, npcId: null as string | null, isPlayer: true, business: snapshot.business,
      assets: assetBreakdown(snapshot.player.money, snapshot.business, snapshot.neighborhood.upgrades), revenue: snapshot.dayStats.revenue,
      profit: projectedProfit(snapshot.dayStats, snapshot.business), customers: snapshot.dayStats.customers },
    ...snapshot.competition.rivals.map(rival => ({ id: rival.id, name: getNpc(rival.id)!.name, npcId: rival.id, isPlayer: false, business: rival.business,
      assets: assetBreakdown(rival.cash, rival.business, rival.upgrades), revenue: rival.dayStats.revenue,
      profit: projectedProfit(rival.dayStats, rival.business), customers: rival.dayStats.customers })),
  ].map(entry => ({ ...entry, value: metric === 'assets' ? entry.assets.total : entry[metric] }))
    .sort((a,b) => b.value - a.value || a.id.localeCompare(b.id))
  let rank = 1
  return entries.map((entry, index) => { if (index && entry.value !== entries[index-1]!.value) rank = index + 1; return { ...entry, rank } })
}
export function competitionPressure(snapshot: GameSnapshot): number {
  const rivals = snapshot.competition.rivals.filter(r => r.business.open && r.business.inventory > 0 && r.business.careerId === snapshot.business.careerId && isTradingHour(r.business.careerId, snapshot.world.minuteOfDay))
  return rivals.length ? COMPETITION_FACTOR : 1
}
export function duelOutcome(playerProfit: number, rivalProfit: number, customers: number): 'won' | 'lost' {
  return customers >= 10 && playerProfit > 0 && playerProfit > rivalProfit ? 'won' : 'lost'
}

function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value) }
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const integer = (value: unknown): value is number => finite(value) && Number.isSafeInteger(value) && value >= 0
/** Unknown save data must be checked before it replaces a user's existing progress. */
export function validateCompetition(raw: unknown, world: WorldState, validStats: (value: unknown) => boolean): CompetitionState {
  const at = world.day * 1440 + world.minuteOfDay
  const knownRival = (id: unknown) => RIVAL_DEFINITIONS.some(d => d.id === id)
  const validReport = (report: unknown) => record(report) && validStats(report) && integer(report.day) && report.day > 0 && report.day < world.day &&
    ['sunny','cloudy','rain','hot'].includes(String(report.weather)) && [report.rent,report.payroll,report.profit,report.cashClosing].every(finite) &&
    Number(report.rent) >= 0 && Number(report.payroll) >= 0 && report.profit === Number(report.revenue)-Number(report.cogs)-Number(report.expenses)-Number(report.rent)-Number(report.payroll)
  if (!record(raw) || !integer(raw.joinedAt) || raw.joinedAt > at || !integer(raw.eligibleFromDay) || raw.eligibleFromDay < 1 || raw.eligibleFromDay > world.day+1 ||
      !integer(raw.newsSeq) || !integer(raw.lastDuelDay) || raw.lastDuelDay > world.day || !Array.isArray(raw.rivals) || raw.rivals.length !== RIVAL_DEFINITIONS.length ||
      !Array.isArray(raw.news) || raw.news.length > 16 || !Array.isArray(raw.history) || raw.history.length > 30) throw new Error('Thi đua khu phố không hợp lệ')
  const ids = new Set<string>()
  for (const rival of raw.rivals) {
    if (!record(rival) || !knownRival(rival.id) || ids.has(String(rival.id)) || !finite(rival.cash) || !integer(rival.rngSeed) || rival.rngSeed > 0xffffffff ||
        !integer(rival.lastPlanDay) || rival.lastPlanDay > world.day || !validStats(rival.dayStats) || !record(rival.dayStats) || !finite(rival.dayStats.cashOpening) ||
        !record(rival.business) || !Array.isArray(rival.upgrades) || new Set(rival.upgrades).size !== rival.upgrades.length || !rival.upgrades.every(id => UPGRADES.some(u => u.id === id)) ||
        !(rival.lastReport === null || validReport(rival.lastReport))) throw new Error('Đối thủ không hợp lệ')
    ids.add(String(rival.id))
    const definition = RIVAL_DEFINITIONS.find(d => d.id === rival.id)!, b = rival.business, c = career(definition.careerId)
    if (b.careerId !== definition.careerId || b.owned !== true || typeof b.open !== 'boolean' || b.name !== definition.shop || b.productName !== c.product || b.unitCost !== c.unitCost ||
        !finite(b.price) || b.price < c.minPrice || b.price > c.maxPrice || !integer(b.inventory) || b.maxInventory !== c.stock + (rival.upgrades.includes('storage') ? 30 : 0) || b.inventory > Number(b.maxInventory) ||
        ![b.quality,b.reputation,b.marketingScore].every(v => finite(v) && v >= 0 && v <= 100) || typeof b.hasEmployee !== 'boolean' || typeof b.employeeName !== 'string' || b.dailySalary !== 120000)
      throw new Error('Quầy đối thủ không hợp lệ')
    const stats = rival.dayStats
    if (rival.cash !== Number(stats.cashOpening)+Number(stats.revenue)+Number(stats.recoveries)+Number(stats.communityRewards)-Number(stats.stockPurchases)-Number(stats.capitalPurchases)-Number(stats.expenses) ||
        !Array.isArray(stats.careerIds) || stats.careerIds.length !== 1 || stats.careerIds[0] !== definition.careerId) throw new Error('Dòng tiền đối thủ không khớp')
  }
  let lastNewsId = 0
  for (const news of raw.news) {
    if (!record(news) || !integer(news.id) || news.id <= lastNewsId || news.id > raw.newsSeq || !knownRival(news.npcId) || !integer(news.day) || news.day < 1 ||
        !integer(news.minute) || news.minute >= 1440 || news.day*1440+news.minute > at || typeof news.text !== 'string' || news.text.length > 240) throw new Error('Tin thi đua không hợp lệ')
    lastNewsId = news.id
  }
  let previousDay = 0
  for (const result of raw.history) {
    if (!record(result) || !integer(result.day) || result.day <= previousDay || result.day >= world.day || result.day > raw.lastDuelDay || !knownRival(result.rivalId) ||
        !finite(result.playerProfit) || !finite(result.rivalProfit) || !integer(result.customers) || typeof result.claimed !== 'boolean' ||
        result.outcome !== duelOutcome(result.playerProfit,result.rivalProfit,result.customers) || (result.claimed && result.outcome !== 'won')) throw new Error('Kết quả thi đua không hợp lệ')
    previousDay = result.day
  }
  if (raw.activeDuel !== null) {
    const duel = raw.activeDuel
    if (!record(duel) || duel.day !== world.day || duel.day !== raw.lastDuelDay || Number(duel.day) < raw.eligibleFromDay || !knownRival(duel.rivalId) || !integer(duel.acceptedAt) ||
        duel.acceptedAt < world.day*1440 || duel.acceptedAt > at || ![duel.playerStartProfit,duel.rivalStartProfit].every(finite) || !integer(duel.playerStartCustomers)) throw new Error('Thử thách đang nhận không hợp lệ')
  }
  return structuredClone(raw) as unknown as CompetitionState
}
