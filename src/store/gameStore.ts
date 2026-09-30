import { create } from 'zustand'
import {
  BOOTH_SETUP_COST,
  MARKETING_COST,
  RECRUITMENT_COST,
  RESTOCK_QUANTITY,
  STARTER_STOCK_COST,
  type AvatarStyle,
  type GameNotice,
  type GameSnapshot,
  type GameSpeed,
  type NoticeTone,
} from '../domain/types'
import { clamp, simulateTick } from '../domain/simulation'
import { gameEvents } from '../game/events'
import { createInitialSnapshot } from './initialState'

export interface GameActions {
  startJourney: (name: string, avatarStyle: AvatarStyle) => void
  buyFirstBooth: () => void
  toggleBusiness: () => void
  restock: () => void
  changePrice: (delta: number) => void
  hireEmployee: () => void
  launchMarketing: () => void
  setSpeed: (speed: GameSpeed) => void
  togglePause: () => void
  advanceTick: (minutes?: number) => void
  setTutorialStep: (step: number) => void
  dismissNotice: (id: number) => void
  hydrate: (snapshot: GameSnapshot) => void
  resetGame: () => void
}

export type GameStore = GameSnapshot & GameActions

function makeNotice(
  state: GameSnapshot,
  message: string,
  tone: NoticeTone,
): { notice: GameNotice; nextSeq: number } {
  const nextSeq = state.noticeSeq + 1
  return {
    notice: { id: nextSeq, message, tone },
    nextSeq,
  }
}

function appendNotice(
  state: GameSnapshot,
  message: string,
  tone: NoticeTone,
): Pick<GameSnapshot, 'noticeSeq' | 'notices'> {
  const { notice, nextSeq } = makeNotice(state, message, tone)
  return {
    noticeSeq: nextSeq,
    notices: [...state.notices, notice].slice(-5),
  }
}

export function snapshotFromStore(state: GameStore): GameSnapshot {
  return structuredClone({
    version: state.version,
    onboarded: state.onboarded,
    tutorialStep: state.tutorialStep,
    player: state.player,
    world: state.world,
    business: state.business,
    dayStats: state.dayStats,
    lifetime: state.lifetime,
    noticeSeq: state.noticeSeq,
    notices: state.notices,
  })
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialSnapshot(),

  startJourney: (name, avatarStyle) => {
    set((state) => ({
      onboarded: true,
      tutorialStep: 1,
      player: {
        ...state.player,
        name: name.trim() || 'Nhà khởi nghiệp',
        avatarStyle,
      },
      ...appendNotice(state, 'Hãy mở quầy xôi đầu tiên trước giờ cao điểm 06:30.', 'info'),
    }))
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  buyFirstBooth: () => {
    const state = get()
    const totalCost = BOOTH_SETUP_COST + STARTER_STOCK_COST
    if (state.business.owned || state.player.money < totalCost) return

    set({
      player: { ...state.player, money: state.player.money - totalCost },
      business: { ...state.business, owned: true, inventory: RESTOCK_QUANTITY },
      tutorialStep: Math.max(state.tutorialStep, 2),
      ...appendNotice(
        state,
        'Quầy Xôi Sáng 18 đã sẵn sàng. Mở bán để đón khách!',
        'success',
      ),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  toggleBusiness: () => {
    const state = get()
    if (!state.business.owned) return
    if (!state.business.open && state.business.inventory <= 0) {
      set(appendNotice(state, 'Quầy đã hết nguyên liệu. Hãy nhập thêm hàng.', 'warning'))
      return
    }

    const open = !state.business.open
    set({
      business: { ...state.business, open },
      tutorialStep: open ? Math.max(state.tutorialStep, 3) : state.tutorialStep,
      ...appendNotice(
        state,
        open ? 'Quầy đã mở bán. Khách sẽ đến theo nhu cầu thực tế.' : 'Quầy đã đóng cửa.',
        open ? 'success' : 'info',
      ),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  restock: () => {
    const state = get()
    const availableSpace = state.business.maxInventory - state.business.inventory
    const quantity = Math.min(RESTOCK_QUANTITY, availableSpace)
    const cost = quantity * state.business.unitCost
    if (!state.business.owned || quantity <= 0 || state.player.money < cost) return

    set({
      player: { ...state.player, money: state.player.money - cost },
      business: { ...state.business, inventory: state.business.inventory + quantity },
      ...appendNotice(state, `Đã nhập ${quantity} phần nguyên liệu mới.`, 'success'),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  changePrice: (delta) => {
    const state = get()
    const price = clamp(state.business.price + delta, 12_000, 35_000)
    set({ business: { ...state.business, price } })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  hireEmployee: () => {
    const state = get()
    if (
      !state.business.owned ||
      state.business.hasEmployee ||
      state.player.money < RECRUITMENT_COST
    ) {
      return
    }

    set({
      player: { ...state.player, money: state.player.money - RECRUITMENT_COST },
      business: { ...state.business, hasEmployee: true },
      dayStats: { ...state.dayStats, expenses: state.dayStats.expenses + RECRUITMENT_COST },
      ...appendNotice(
        state,
        'Chị Mai đã gia nhập. Công suất phục vụ tăng từ 2 lên 5 khách mỗi lượt.',
        'success',
      ),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  launchMarketing: () => {
    const state = get()
    if (!state.business.owned || state.player.money < MARKETING_COST) return

    set({
      player: { ...state.player, money: state.player.money - MARKETING_COST },
      business: {
        ...state.business,
        marketingScore: clamp(state.business.marketingScore + 35, 0, 100),
      },
      dayStats: { ...state.dayStats, expenses: state.dayStats.expenses + MARKETING_COST },
      ...appendNotice(state, 'Chiến dịch tờ rơi đã bắt đầu quanh trường học.', 'success'),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  setSpeed: (speed) => set((state) => ({ world: { ...state.world, speed, paused: false } })),

  togglePause: () =>
    set((state) => ({ world: { ...state.world, paused: !state.world.paused } })),

  advanceTick: (minutes = 5) => {
    const state = get()
    if (state.world.paused) return

    const previousLevel = state.player.level
    const previousInventory = state.business.inventory
    const result = simulateTick(snapshotFromStore(state), minutes)
    let next = result.next

    if (result.autoClosed) {
      next = {
        ...next,
        ...appendNotice(next, '10:00 — quầy tự động đóng sau ca sáng.', 'info'),
      }
    }
    if (result.newDay) {
      next = {
        ...next,
        ...appendNotice(next, `Ngày ${next.world.day} đã bắt đầu. Chi phí cố định đã được quyết toán.`, 'info'),
      }
    }
    if (previousInventory > 3 && next.business.inventory <= 3) {
      next = {
        ...next,
        ...appendNotice(next, 'Nguyên liệu sắp hết. Bạn nên nhập thêm hàng.', 'warning'),
      }
    }
    if (next.player.level > previousLevel) {
      next = {
        ...next,
        ...appendNotice(next, `Bạn đã đạt cấp ${next.player.level}!`, 'success'),
      }
    }

    set(next)
    gameEvents.emit('simulation:update', next)
    if (result.sales > 0) {
      gameEvents.emit('sale', { count: result.sales, revenue: result.revenue })
    }
  },

  setTutorialStep: (tutorialStep) => set({ tutorialStep }),

  dismissNotice: (id) =>
    set((state) => ({ notices: state.notices.filter((notice) => notice.id !== id) })),

  hydrate: (snapshot) => {
    if (snapshot.version !== 1) return
    const defaults = createInitialSnapshot()
    set({
      ...defaults,
      ...snapshot,
      player: { ...defaults.player, ...snapshot.player },
      world: { ...defaults.world, ...snapshot.world, paused: false },
      business: { ...defaults.business, ...snapshot.business },
      dayStats: { ...defaults.dayStats, ...snapshot.dayStats },
      lifetime: { ...defaults.lifetime, ...snapshot.lifetime },
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  resetGame: () => {
    set(createInitialSnapshot())
    gameEvents.emit('reset', undefined)
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },
}))
