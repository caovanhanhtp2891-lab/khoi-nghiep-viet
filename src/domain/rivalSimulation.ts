import { career, isTradingHour, DAILY_RENT, type CareerId } from './careers'
import { simulateTick } from './simulation'
import { COMPETITION_FACTOR, RIVAL_DEFINITIONS, duelOutcome, type RivalState, type CompetitionState } from './competition'
import { getNpc } from './npcCatalog'
import { UPGRADES, type UpgradeId } from './neighborhood'
import { MARKETING_COST, RECRUITMENT_COST, type GameSnapshot, type WorldState } from './types'

function addNews(competition: CompetitionState, rival: RivalState, world: WorldState, text: string): void {
  competition.newsSeq += 1
  competition.news = [...competition.news, { id: competition.newsSeq, npcId: rival.id, day: world.day, minute: world.minuteOfDay, text }].slice(-16)
}
/** Every autonomous purchase uses the same cost and ledger category as the player's action. */
function prepareRival(rival: RivalState, world: WorldState, competition: CompetitionState): RivalState {
  const r = structuredClone(rival), config = career(r.business.careerId)
  if (!isTradingHour(config.id, world.minuteOfDay)) { r.business.open = false; return r }
  if (r.lastPlanDay !== world.day) {
    r.lastPlanDay = world.day
    const definition = RIVAL_DEFINITIONS.find(d => d.id === r.id)!
    const price = config.price + definition.priceOffset + (config.id === 'trasua' && world.weather === 'hot' ? 2000 : 0)
    r.business.price = price
    addNews(competition, r, world, `Mở ca ${config.product}, giá ${price.toLocaleString('vi-VN')}đ/${config.unit}.`)
    if (r.cash >= 300000 + MARKETING_COST) {
      r.cash -= MARKETING_COST; r.dayStats.expenses += MARKETING_COST
      r.business.marketingScore = Math.min(100, r.business.marketingScore + 35)
      addNews(competition, r, world, 'Chi 50.000đ phát tờ rơi, tăng nhận diện quầy.')
    }
  }
  if (!r.business.hasEmployee && r.cash >= 500000 + RECRUITMENT_COST) {
    r.cash -= RECRUITMENT_COST; r.dayStats.expenses += RECRUITMENT_COST; r.business.hasEmployee = true
    addNews(competition, r, world, `Tuyển người với phí 70.000đ; lương ${r.business.dailySalary.toLocaleString('vi-VN')}đ/ngày.`)
  }
  const upgrade: UpgradeId | undefined = world.weather === 'rain' && !r.upgrades.includes('canopy') ? 'canopy'
    : r.cash >= 840000 && !r.upgrades.includes('storage') ? 'storage'
    : r.cash >= 750000 && !r.upgrades.includes('sign') ? 'sign' : undefined
  if (upgrade) {
    const item = UPGRADES.find(u => u.id === upgrade)!
    if (r.cash >= item.cost + 250000) {
      r.cash -= item.cost; r.dayStats.expenses += item.cost; r.upgrades.push(upgrade)
      if (upgrade === 'storage') r.business.maxInventory += 30
      addNews(competition, r, world, `Lắp ${item.title.toLocaleLowerCase('vi')}, chi ${item.cost.toLocaleString('vi-VN')}đ.`)
    }
  }
  const capacity = r.business.hasEmployee ? config.employeeCapacity : config.capacity
  if (r.business.inventory < capacity * 3) {
    const reserve = DAILY_RENT + (r.business.hasEmployee ? r.business.dailySalary : 0)
    const quantity = Math.min(20, r.business.maxInventory - r.business.inventory, Math.max(0, Math.floor((r.cash - reserve) / config.unitCost)))
    if (quantity > 0) { const cost = quantity * config.unitCost; r.cash -= cost; r.business.inventory += quantity; r.dayStats.stockPurchases += cost }
  }
  r.business.open = r.business.inventory > 0
  return r
}

function rivalSnapshot(base: GameSnapshot, rival: RivalState, world: WorldState): GameSnapshot {
  return { ...base, world: { ...world, rngSeed: rival.rngSeed },
    player: { ...base.player, money: rival.cash, xp: 0, level: 1 }, business: rival.business, dayStats: rival.dayStats,
    neighborhood: { ...base.neighborhood, upgrades: rival.upgrades }, reports: [],
    lifetime: { revenue: 0, profit: 0, customers: 0, daysCompleted: 0 },
    story: { activeSituation: null, history: [], lastSituationAt: -90, resolvedToday: 0 } }
}

/** Player RNG remains independent; rivals use five-minute slices even when the player ends early. */
export function simulateWorldTick(snapshot: GameSnapshot, minutes = 5) {
  const competition = structuredClone(snapshot.competition)
  let cursor = { ...snapshot.world }
  competition.rivals = competition.rivals.map(r => prepareRival(r, cursor, competition))
  const result = simulateTick({ ...snapshot, competition }, minutes)
  let remaining = minutes
  while (remaining > 0) {
    const step = Math.min(5, remaining)
    competition.rivals = competition.rivals.map(rival => {
      const prepared = prepareRival(rival, cursor, competition)
      const playerCompeting = snapshot.business.open && snapshot.business.inventory > 0 && snapshot.business.careerId === prepared.business.careerId && isTradingHour(snapshot.business.careerId, cursor.minuteOfDay)
      const tick = simulateTick(rivalSnapshot(snapshot, prepared, cursor), step, { situations: false, competitionFactor: playerCompeting ? COMPETITION_FACTOR : 1 })
      return { ...prepared, cash: tick.next.player.money, business: tick.next.business, dayStats: tick.next.dayStats, rngSeed: tick.next.world.rngSeed,
        lastReport: tick.newDay ? tick.next.reports.at(-1)! : prepared.lastReport }
    })
    cursor.minuteOfDay += step
    if (cursor.minuteOfDay >= 1440) { cursor.minuteOfDay %= 1440; cursor.day += 1; cursor.weather = result.next.world.weather }
    remaining -= step
  }
  if (result.newDay && competition.activeDuel) {
    const duel = competition.activeDuel
    const playerReport = result.next.reports.find(r => r.day === duel.day)!
    const rivalReport = competition.rivals.find(r => r.id === duel.rivalId)!.lastReport!
    const playerProfit = playerReport.profit - duel.playerStartProfit
    const rivalProfit = rivalReport.profit - duel.rivalStartProfit
    const customers = playerReport.customers - duel.playerStartCustomers
    competition.history = [...competition.history, { day: duel.day, rivalId: duel.rivalId, playerProfit, rivalProfit, customers,
      outcome: duelOutcome(playerProfit, rivalProfit, customers), claimed: false }].slice(-30)
    competition.activeDuel = null
  }
  result.next.competition = competition
  for (const news of competition.news.filter(n => n.id > snapshot.competition.newsSeq).slice(-3)) {
    result.next.chatSeq += 1
    result.next.chat = [...result.next.chat, { id: result.next.chatSeq, name: `${getNpc(news.npcId)!.name} · Chủ quầy NPC`, npcId: news.npcId,
      text: news.text, minute: news.day*1440+news.minute, fromPlayer: false }].slice(-40)
  }
  return result
}

export function rivalForCareer(competition: CompetitionState, id: CareerId): RivalState {
  return competition.rivals.find(r => r.business.careerId === id)!
}
