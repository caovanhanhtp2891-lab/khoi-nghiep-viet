import type { DemandBreakdown, GameSnapshot, TickResult, Weather } from './types'

const DAY_MINUTES = 1_440
const OPEN_MINUTE = 5 * 60 + 30
const CLOSE_MINUTE = 10 * 60
const BASE_CUSTOMERS_PER_TICK = 1.35
const DAILY_RENT = 35_000

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function nextRandom(seed: number): { seed: number; value: number } {
  const nextSeed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
  return { seed: nextSeed, value: nextSeed / 4_294_967_296 }
}

export function getTimeDemandFactor(minute: number): number {
  if (minute >= 390 && minute < 465) return 1.85
  if (minute >= 330 && minute < 390) return 1.15
  if (minute >= 465 && minute < 540) return 1.35
  if (minute >= 540 && minute < 600) return 0.65
  return 0.08
}

export function getWeatherDemandFactor(weather: Weather): number {
  return {
    sunny: 1,
    cloudy: 0.92,
    rain: 0.58,
    hot: 0.88,
  }[weather]
}

export function calculateDemand(snapshot: GameSnapshot): DemandBreakdown {
  const { business, world } = snapshot
  const time = getTimeDemandFactor(world.minuteOfDay)
  const weather = getWeatherDemandFactor(world.weather)
  const price = clamp(1.8 - (business.price / 22_000) * 0.8, 0.35, 1.28)
  const quality = clamp(0.65 + business.quality / 200, 0.65, 1.15)
  const reputation = clamp(0.7 + business.reputation / 200, 0.7, 1.2)
  const marketing = 1 + (business.marketingScore / 100) * 0.45

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
  const random = nextRandom(snapshot.world.rngSeed)
  let minuteOfDay = snapshot.world.minuteOfDay + minutes
  let day = snapshot.world.day
  let weather = snapshot.world.weather
  let money = snapshot.player.money
  let dayStats = { ...snapshot.dayStats }
  let lifetime = { ...snapshot.lifetime }
  let newDay = false

  if (minuteOfDay >= DAY_MINUTES) {
    minuteOfDay %= DAY_MINUTES
    day += 1
    newDay = true

    const payroll = snapshot.business.hasEmployee ? snapshot.business.dailySalary : 0
    const operatingExpenses = snapshot.business.owned ? DAILY_RENT + payroll : 0
    const completedProfit =
      dayStats.revenue - dayStats.cogs - dayStats.expenses - operatingExpenses

    money -= operatingExpenses
    lifetime = {
      ...lifetime,
      profit: lifetime.profit + completedProfit,
      daysCompleted: lifetime.daysCompleted + 1,
    }
    dayStats = {
      revenue: 0,
      cogs: 0,
      expenses: 0,
      customers: 0,
      lostCustomers: 0,
    }
    weather = pickNextWeather(random.value)
  }

  const autoClosed = snapshot.business.open && minuteOfDay >= CLOSE_MINUTE
  const isTrading =
    snapshot.business.owned &&
    snapshot.business.open &&
    !autoClosed &&
    minuteOfDay >= OPEN_MINUTE &&
    minuteOfDay < CLOSE_MINUTE

  const baseSnapshot: GameSnapshot = {
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
    lifetime,
  }

  const demand = calculateDemand(baseSnapshot)
  if (!isTrading || snapshot.business.inventory <= 0) {
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

  const arrivals = stochasticRound(BASE_CUSTOMERS_PER_TICK * demand.total, random.value)
  const capacity = snapshot.business.hasEmployee ? 5 : 2
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
