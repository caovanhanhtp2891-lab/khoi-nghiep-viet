import { career, DAILY_RENT, type CareerId } from './careers'
import { closeDayReport, freshDayStats } from './accounting'
import type { DemandBreakdown, GameSnapshot, TickResult, Weather } from './types'
import { generateLifeSituation, SITUATION_INTERVAL_MINUTES } from './situations'

const DAY_MINUTES = 1_440

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function nextRandom(seed: number): { seed: number; value: number } {
  const nextSeed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
  return { seed: nextSeed, value: nextSeed / 4_294_967_296 }
}

export function getTimeDemandFactor(minute: number, careerId: CareerId = 'xoi'): number {
  return career(careerId).hours.find(h=>minute>=h.from && minute<h.to)?.factor ?? 0.08
}

export function getWeatherDemandFactor(weather: Weather, careerId: CareerId = 'xoi'): number {
  return career(careerId).weather[weather]
}

export function calculateDemand(snapshot: GameSnapshot): DemandBreakdown {
  const { business, world } = snapshot
  const config = career(business.careerId)
  const time = getTimeDemandFactor(world.minuteOfDay, business.careerId)
  const weather = world.weather === 'rain' && snapshot.neighborhood.upgrades.includes('canopy') ? Math.max(0.78, config.weather.rain) : getWeatherDemandFactor(world.weather, business.careerId)
  const price = clamp(1.8 - (business.price / config.price) * 0.8, 0.35, 1.28)
  const quality = clamp(0.65 + business.quality / 200, 0.65, 1.15)
  const reputation = clamp(0.7 + business.reputation / 200, 0.7, 1.2)
  const marketing = 1 + (business.marketingScore / 100) * 0.45 + (snapshot.neighborhood.upgrades.includes('sign') ? 0.15 : 0)

  return {
    time,
    weather,
    price,
    quality,
    reputation,
    marketing,
    total: time * weather * price * quality * reputation * marketing,
  }
}

function pickNextWeather(randomValue: number): Weather {
  if (randomValue < 0.48) return 'sunny'
  if (randomValue < 0.7) return 'cloudy'
  if (randomValue < 0.86) return 'rain'
  return 'hot'
}

function stochasticRound(value: number, randomValue: number): number {
  const whole = Math.floor(value)
  return whole + (randomValue < value - whole ? 1 : 0)
}

export function simulateTick(snapshot: GameSnapshot, minutes = 5): TickResult {
  if (!Number.isFinite(minutes) || !Number.isInteger(minutes) || minutes <= 0 || minutes > DAY_MINUTES) throw new Error('Bước thời gian không hợp lệ')
  const config = career(snapshot.business.careerId)
  const random = nextRandom(snapshot.world.rngSeed)
  let minuteOfDay = snapshot.world.minuteOfDay + minutes
  let day = snapshot.world.day
  let weather = snapshot.world.weather
  let money = snapshot.player.money
  let dayStats = { ...snapshot.dayStats }
  let lifetime = { ...snapshot.lifetime }
  let story = { ...snapshot.story, history: snapshot.story.history.slice(-8) }
  let reports = snapshot.reports
  let newDay = false

  if (minuteOfDay >= DAY_MINUTES) {
    minuteOfDay %= DAY_MINUTES
    day += 1
    newDay = true

    const payroll = snapshot.business.hasEmployee ? snapshot.business.dailySalary : 0
    const operatingExpenses = snapshot.business.owned ? DAILY_RENT + payroll : 0
    const report = closeDayReport(snapshot, snapshot.business.owned ? DAILY_RENT : 0, payroll)
    const completedProfit = report.profit
    reports = [...reports, report].slice(-30)

    money -= operatingExpenses
    lifetime = {
      ...lifetime,
      profit: lifetime.profit + completedProfit,
      daysCompleted: lifetime.daysCompleted + 1,
    }
    dayStats = freshDayStats(money, snapshot.business.careerId)
    story = { ...story, resolvedToday: 0 }
    weather = pickNextWeather(random.value)
  }

  const autoClosed = snapshot.business.open && (newDay || minuteOfDay >= config.close)
  const isTrading =
    snapshot.business.owned &&
    snapshot.business.open &&
    !autoClosed &&
    minuteOfDay >= config.open &&
    minuteOfDay < config.close

  let baseSnapshot: GameSnapshot = {
    ...snapshot,
    world: {
      ...snapshot.world,
      day,
      minuteOfDay,
      weather,
      rngSeed: random.seed,
    },
    player: { ...snapshot.player, money },
    business: {
      ...snapshot.business,
      open: autoClosed ? false : snapshot.business.open,
      marketingScore: clamp(snapshot.business.marketingScore - 0.08, 0, 100),
    },
    dayStats,
    story,
    lifetime,
    reports,
  }

  const absoluteMinute = day * DAY_MINUTES + minuteOfDay
  if (
    isTrading &&
    !baseSnapshot.story.activeSituation &&
    absoluteMinute - baseSnapshot.story.lastSituationAt >= SITUATION_INTERVAL_MINUTES
  ) {
    const generated = generateLifeSituation(baseSnapshot.world.rngSeed, {
      ...baseSnapshot.world,
      productName: baseSnapshot.business.productName,
      price: baseSnapshot.business.price,
    })
    baseSnapshot = {
      ...baseSnapshot,
      world: { ...baseSnapshot.world, rngSeed: generated.seed },
      story: {
        ...baseSnapshot.story,
        activeSituation: generated.situation,
        lastSituationAt: absoluteMinute,
      },
    }
  }

  const demand = calculateDemand(baseSnapshot)
  if (!isTrading) {
    return {
      next: baseSnapshot,
      arrivals: 0,
      sales: 0,
      lostCustomers: 0,
      revenue: 0,
      newDay,
      autoClosed,
      demand,
    }
  }

  const arrivals = stochasticRound(config.baseCustomers * demand.total, random.value)
  const capacity = snapshot.business.hasEmployee ? config.employeeCapacity : config.capacity
  const sales = Math.min(arrivals, capacity, snapshot.business.inventory)
  const lostCustomers = Math.max(0, arrivals - sales)
  const revenue = sales * snapshot.business.price
  const cogs = sales * snapshot.business.unitCost
  const reputationDelta = sales > 0 ? 0.05 * sales - 0.12 * lostCustomers : 0
  const xpGain = sales * 8
  const nextXp = snapshot.player.xp + xpGain
  const nextLevel = Math.max(snapshot.player.level, 1 + Math.floor(nextXp / 350))

  return {
    next: {
      ...baseSnapshot,
      player: {
        ...baseSnapshot.player,
        money: baseSnapshot.player.money + revenue,
        xp: nextXp,
        level: nextLevel,
        reputation: clamp(baseSnapshot.player.reputation + reputationDelta * 0.25, 0, 100),
      },
      business: {
        ...baseSnapshot.business,
        inventory: baseSnapshot.business.inventory - sales,
        reputation: clamp(baseSnapshot.business.reputation + reputationDelta, 0, 100),
      },
      dayStats: {
        ...baseSnapshot.dayStats,
        revenue: baseSnapshot.dayStats.revenue + revenue,
        cogs: baseSnapshot.dayStats.cogs + cogs,
        customers: baseSnapshot.dayStats.customers + sales,
        lostCustomers: baseSnapshot.dayStats.lostCustomers + lostCustomers,
      },
      lifetime: {
        ...baseSnapshot.lifetime,
        revenue: baseSnapshot.lifetime.revenue + revenue,
        customers: baseSnapshot.lifetime.customers + sales,
      },
    },
    arrivals,
    sales,
    lostCustomers,
    revenue,
    newDay,
    autoClosed,
    demand,
  }
}
