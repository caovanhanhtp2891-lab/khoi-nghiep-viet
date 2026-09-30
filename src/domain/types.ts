export type Weather = 'sunny' | 'cloudy' | 'rain' | 'hot'
export type GameSpeed = 1 | 2 | 4
export type AvatarStyle = 'green' | 'orange' | 'blue'
export type NoticeTone = 'info' | 'success' | 'warning'

export interface PlayerState {
  name: string
  avatarStyle: AvatarStyle
  age: number
  money: number
  xp: number
  level: number
  businessSkill: number
  reputation: number
}

export interface WorldState {
  day: number
  minuteOfDay: number
  weather: Weather
  speed: GameSpeed
  paused: boolean
  rngSeed: number
}

export interface BusinessState {
  owned: boolean
  open: boolean
  name: string
  productName: string
  price: number
  unitCost: number
  inventory: number
  maxInventory: number
  quality: number
  reputation: number
  hasEmployee: boolean
  employeeName: string
  dailySalary: number
  marketingScore: number
}

export interface DayStats {
  revenue: number
  cogs: number
  expenses: number
  customers: number
  lostCustomers: number
}

export interface LifetimeStats {
  revenue: number
  profit: number
  customers: number
  daysCompleted: number
}

export interface GameNotice {
  id: number
  message: string
  tone: NoticeTone
}

export interface GameSnapshot {
  version: 1
  onboarded: boolean
  tutorialStep: number
  player: PlayerState
  world: WorldState
  business: BusinessState
  dayStats: DayStats
  lifetime: LifetimeStats
  noticeSeq: number
  notices: GameNotice[]
}

export interface DemandBreakdown {
  time: number
  weather: number
  price: number
  quality: number
  reputation: number
  marketing: number
  total: number
}

export interface TickResult {
  next: GameSnapshot
  arrivals: number
  sales: number
  lostCustomers: number
  revenue: number
  newDay: boolean
  autoClosed: boolean
  demand: DemandBreakdown
}

export const WEATHER_META: Record<
  Weather,
  { label: string; icon: string; description: string }
> = {
  sunny: { label: 'Nắng đẹp', icon: '☀️', description: 'Lưu lượng khách ổn định' },
  cloudy: { label: 'Nhiều mây', icon: '☁️', description: 'Khách giảm nhẹ' },
  rain: { label: 'Mưa', icon: '🌧️', description: 'Khách đi bộ giảm mạnh' },
  hot: { label: 'Nắng nóng', icon: '🌡️', description: 'Đồ uống bán tốt hơn' },
}

export const GAME_MINUTES_PER_TICK = 5
export const REAL_MS_PER_TICK = 2_000
export const BOOTH_SETUP_COST = 320_000
export const STARTER_STOCK_COST = 160_000
export const RESTOCK_QUANTITY = 20
export const RECRUITMENT_COST = 70_000
export const MARKETING_COST = 50_000
