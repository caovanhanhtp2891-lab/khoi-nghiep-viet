import { CAREER_IDS, career, businessForCareer, switchQuote, STARTER_QUANTITY, isTradingHour, tradingHours, minuteLabel, type CareerId } from '../domain/careers'
import { create } from 'zustand'
import {
  MARKETING_COST,
  RECRUITMENT_COST,
  RESTOCK_QUANTITY,
  type AvatarStyle,
  type Gender,
  type GameNotice,
  type GameSnapshot,
  type GameSpeed,
  type NoticeTone,
} from '../domain/types'
import { clamp } from '../domain/simulation'
import { simulateWorldTick, rivalForCareer } from '../domain/rivalSimulation'
import { DUEL_REWARD, DUEL_XP, operatingProfit } from '../domain/competition'
import { gameEvents } from '../game/events'
import { migrateSnapshot } from '../domain/migrateSave'
import { chatReply, npcConversation } from '../domain/chat'
import { getNpc, npcLine, type TalkTopic } from '../domain/npcCatalog'
import { dailyOrders, absoluteMinute, MILESTONES, UPGRADES, type UpgradeId } from '../domain/neighborhood'
import { createInitialSnapshot } from './initialState'

export interface GameActions {
  startJourney: (name: string, avatarStyle: AvatarStyle, gender?: Gender) => void
  movePlayer: (x: number, y: number) => void
  sendChat: (text: string, npcId?: string) => void
  talkToNpc: (id: string, topic?: TalkTopic) => void
  acceptOrder: (id: string) => void
  completeOrder: () => void
  cancelOrder: () => void
  buyUpgrade: (id: UpgradeId) => void
  claimMilestone: (id: string) => void
  chooseCareer: (id: CareerId) => void
  finishDay: () => void
  acceptDuel: () => void
  claimDuelReward: (day: number) => void
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
  resolveSituation: (choiceId: string) => void
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
    story: state.story,
    noticeSeq: state.noticeSeq,
    notices: state.notices,
    chat: state.chat,
    chatSeq: state.chatSeq,
    neighborhood: state.neighborhood,
    reports: state.reports,
    competition: state.competition,
  })
}

function interactionPatch(state:GameSnapshot,npcId:string) {
  const previous=state.neighborhood.relationships[npcId] ?? {bond:0,greetedDay:0,meetings:0}
  const firstToday=previous.greetedDay!==state.world.day
  const xp=state.player.xp+(firstToday?3:0)
  return {player:{...state.player,xp,level:Math.max(state.player.level,1+Math.floor(xp/350))},neighborhood:{...state.neighborhood,relationships:{...state.neighborhood.relationships,[npcId]:{bond:clamp(previous.bond+(firstToday?3:0),0,100),greetedDay:state.world.day,meetings:previous.meetings+(firstToday?1:0)}}}}
}
export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialSnapshot(),

  startJourney: (name, avatarStyle, gender = 'male') => {
    set((state) => ({
      onboarded: true,
      tutorialStep: 1,
      player: {
        ...state.player,
        name: name.trim() || 'Nhà khởi nghiệp',
        avatarStyle,
        gender,
      },
      ...appendNotice(state, 'Chọn nghề trong Kinh doanh; thi đua với chủ quầy trong Cư dân → Đua top.', 'info'),
    }))
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  movePlayer: (x, y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return
    set((state) => ({ player: { ...state.player, position: { x: clamp(x, 0.08, 0.92), y: clamp(y, 0.64, 0.79) } } }))
  },

  sendChat: (text, npcId) => {
    const state = get()
    const clean = text.trim().slice(0, 160)
    if (!clean || !state.onboarded) return
    const minute = state.world.day * 1440 + state.world.minuteOfDay
    const id = state.chatSeq + 1
    if (npcId && !getNpc(npcId)) return
    const reply = chatReply(state.world, state.business, id, clean, npcId ? getNpc(npcId) : undefined)
    set({ ...interactionPatch(state,reply.npcId), chatSeq: id + 1, chat: [...state.chat, { id, name: state.player.name, text: clean, minute, fromPlayer: true }, { id: id + 1, ...reply, minute, fromPlayer: false }].slice(-40) })
  },

  talkToNpc: (npcId, topic = 'greet') => {
    const state = get()
    const npc = getNpc(npcId)
    if (!npc || !state.onboarded) return
    const id = state.chatSeq + 1
    set({
      ...interactionPatch(state,npcId),
      chatSeq: id,
      chat: [...state.chat, { id, npcId, name: `${npc.name} · ${npc.job}`, text: npcLine(npc, state.world, state.business, topic,id), minute: absoluteMinute(state), fromPlayer: false }].slice(-40),
    })
  },

  acceptOrder: (id) => {
    const state = get()
    const offer = dailyOrders(state.world.day, state.business.careerId).find(o => o.id === id)
    if (!state.onboarded || !state.business.owned || !offer || state.neighborhood.activeOrder || state.neighborhood.completedOrders.includes(id)) return
    const at = absoluteMinute(state)
    set({ neighborhood: { ...state.neighborhood, activeOrder: { ...offer, acceptedAt: at, dueAt: at + 120 } }, ...appendNotice(state, 'Đã nhận đơn. Chuẩn bị đủ hàng trong 120 phút game.', 'info') })
  },

  completeOrder: () => {
    const state = get()
    const order = state.neighborhood.activeOrder
    if (!order || order.careerId !== state.business.careerId || state.neighborhood.completedOrders.includes(order.id)) return
    if (absoluteMinute(state) > order.dueAt || state.world.day !== order.day) {
      set(appendNotice(state, 'Đơn đã hết hạn. Hủy đơn để nhận đơn khác.', 'warning')); return
    }
    if (state.business.inventory < order.quantity) {
      set(appendNotice(state, 'Chưa đủ nguyên liệu để giao trọn đơn.', 'warning')); return
    }
    const revenue = order.quantity * order.unitPrice
    const cogs = order.quantity * state.business.unitCost
    const previous = state.neighborhood.relationships[order.npcId] ?? { bond: 0, greetedDay: 0, meetings: 0 }
    const xp = state.player.xp + 15
    set({
      neighborhood: { ...state.neighborhood, activeOrder: null, deliveries: state.neighborhood.deliveries + 1, completedOrders: [...state.neighborhood.completedOrders, order.id].slice(-60), relationships: { ...state.neighborhood.relationships, [order.npcId]: { ...previous, bond: clamp(previous.bond + 8, 0, 100) } } },
      business: { ...state.business, inventory: state.business.inventory - order.quantity },
      player: { ...state.player, money: state.player.money + revenue, xp, level: Math.max(state.player.level, 1 + Math.floor(xp / 350)) },
      dayStats: { ...state.dayStats, revenue: state.dayStats.revenue + revenue, cogs: state.dayStats.cogs + cogs, customers: state.dayStats.customers + order.quantity },
      lifetime: { ...state.lifetime, revenue: state.lifetime.revenue + revenue, customers: state.lifetime.customers + order.quantity },
      ...appendNotice(state, `Đã giao ${order.quantity} ${career(state.business.careerId).unit} cho ${getNpc(order.npcId)?.name}. +${revenue.toLocaleString('vi-VN')}đ`, 'success'),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
    gameEvents.emit('sale', { count: order.quantity, revenue })
  },
  cancelOrder: () => set(state => ({ neighborhood: { ...state.neighborhood, activeOrder: null } })),

  buyUpgrade: (id) => {
    const state = get()
    const upgrade = UPGRADES.find(u => u.id === id)
    if (!upgrade || !state.business.owned || state.neighborhood.upgrades.includes(id) || state.player.money < upgrade.cost) return
    set({
      neighborhood: { ...state.neighborhood, upgrades: [...state.neighborhood.upgrades, id] },
      player: { ...state.player, money: state.player.money - upgrade.cost },
      business: { ...state.business, maxInventory: state.business.maxInventory + (id === 'storage' ? 30 : 0) },
      dayStats: { ...state.dayStats, expenses: state.dayStats.expenses + upgrade.cost },
      ...appendNotice(state, `Đã lắp ${upgrade.title.toLocaleLowerCase('vi')}.`, 'success'),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  claimMilestone: (id) => {
    const state = get()
    const milestone = MILESTONES.find(m => m.id === id)
    if (!state.onboarded || !milestone || state.neighborhood.claimedMilestones.includes(id) || milestone.progress(state) < milestone.target) return
    const xp = state.player.xp + milestone.xp
    set({
      neighborhood: { ...state.neighborhood, claimedMilestones: [...state.neighborhood.claimedMilestones, id] },
      dayStats: { ...state.dayStats, communityRewards: state.dayStats.communityRewards + milestone.money },
      player: { ...state.player, money: state.player.money + milestone.money, xp, level: Math.max(state.player.level, 1 + Math.floor(xp / 350)) },
      ...appendNotice(state, `Hoàn thành “${milestone.title}”: +${milestone.money.toLocaleString('vi-VN')}đ, +${milestone.xp} XP.`, 'success'),
    })
  },

  chooseCareer: (id) => {
    const state = get()
    if (!CAREER_IDS.includes(id) || id === state.business.careerId) return
    if (!state.business.owned) {
      set({ business: businessForCareer(id, state.business), dayStats: { ...state.dayStats, careerIds: [id] } })
      gameEvents.emit('simulation:update', snapshotFromStore(get())); return
    }
    if (state.business.open || state.neighborhood.activeOrder || state.story.activeSituation || state.competition.activeDuel) {
      set(appendNotice(state, 'Đóng quầy, xử lý đơn/tình huống và hoàn tất thi đua trong ngày trước khi đổi nghề.', 'warning')); return
    }
    const quote = switchQuote(state.business, id)
    if (state.player.money < quote.net) { set(appendNotice(state, 'Chưa đủ vốn để đổi nghề.', 'warning')); return }
    const nextBusiness = businessForCareer(id, state.business)
    nextBusiness.owned = true
    nextBusiness.inventory = STARTER_QUANTITY
    nextBusiness.maxInventory += state.neighborhood.upgrades.includes('storage') ? 30 : 0
    set({
      business: nextBusiness,
      player: { ...state.player, money: state.player.money - quote.net },
      dayStats: { ...state.dayStats, capitalPurchases: state.dayStats.capitalPurchases + quote.setup, stockPurchases: state.dayStats.stockPurchases + quote.stock, recoveries: state.dayStats.recoveries + quote.equipmentCredit + quote.stockCredit, careerIds: [...new Set([...state.dayStats.careerIds, id])] },
      ...appendNotice(state, `Đã đổi sang ${career(id).label.toLocaleLowerCase('vi')}. Có ${STARTER_QUANTITY} ${career(id).unit} nguyên liệu mới.`, 'success'),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  finishDay: () => {
    const state = get()
    if (!state.onboarded || !state.business.owned) return
    if (state.neighborhood.activeOrder || state.story.activeSituation) { set(appendNotice(state, 'Hoàn thành hoặc hủy đơn và xử lý tình huống trước khi kết thúc ngày.', 'warning')); return }
    const next = simulateWorldTick({ ...snapshotFromStore(state), business: { ...state.business, open: false } }, 1440 - state.world.minuteOfDay).next
    next.world = { ...next.world, minuteOfDay: 330, paused: state.world.paused }
    set({ ...next, ...appendNotice(next, `Ngày ${state.world.day} đã quyết toán. Báo cáo đã lưu trong Kinh doanh.`, 'success') })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  acceptDuel: () => {
    const state = get()
    if (!state.onboarded || !state.business.owned || state.competition.activeDuel || state.competition.lastDuelDay === state.world.day || state.world.day < state.competition.eligibleFromDay ||
        state.world.minuteOfDay > career(state.business.careerId).close - 120) return
    const rival = rivalForCareer(state.competition, state.business.careerId)
    set({ competition: { ...state.competition, lastDuelDay: state.world.day, activeDuel: {
      day: state.world.day, rivalId: rival.id, acceptedAt: absoluteMinute(state), playerStartProfit: operatingProfit(state.dayStats),
      rivalStartProfit: operatingProfit(rival.dayStats), playerStartCustomers: state.dayStats.customers,
    } }, ...appendNotice(state, `Đã nhận thi đua với ${getNpc(rival.id)!.name}. So lợi nhuận khi quyết toán, cần bán ít nhất 10 sản phẩm sau khi nhận.`, 'info') })
  },
  claimDuelReward: (day) => {
    const state = get()
    const result = state.competition.history.find(r => r.day === day)
    if (!state.onboarded || !result || result.outcome !== 'won' || result.claimed) return
    const xp = state.player.xp + DUEL_XP
    set({ competition: { ...state.competition, history: state.competition.history.map(r => r.day === day ? { ...r, claimed: true } : r) },
      player: { ...state.player, money: state.player.money + DUEL_REWARD, xp, level: Math.max(state.player.level, 1 + Math.floor(xp/350)) },
      dayStats: { ...state.dayStats, communityRewards: state.dayStats.communityRewards + DUEL_REWARD },
      ...appendNotice(state, `Thắng thi đua ngày ${day}: +50.000đ và +60 XP.`, 'success') })
  },

  buyFirstBooth: () => {
    const state = get()
    const config = career(state.business.careerId)
    const stockCost = STARTER_QUANTITY * config.unitCost
    const totalCost = config.setup + stockCost
    if (state.business.owned || state.player.money < totalCost) return

    set({
      player: { ...state.player, money: state.player.money - totalCost },
      business: { ...state.business, owned: true, inventory: RESTOCK_QUANTITY },
      dayStats: { ...state.dayStats, capitalPurchases: state.dayStats.capitalPurchases + config.setup, stockPurchases: state.dayStats.stockPurchases + stockCost },
      tutorialStep: Math.max(state.tutorialStep, 2),
      ...appendNotice(
        state,
        `Quầy ${state.business.name} đã sẵn sàng. Mở bán trong ca ${tradingHours(state.business.careerId)}.`,
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

    if (!state.business.open && !isTradingHour(state.business.careerId, state.world.minuteOfDay)) {
      set(appendNotice(state, `Chưa trong ca bán. Giờ của nghề này: ${tradingHours(state.business.careerId)}.`, 'warning')); return
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
      dayStats: { ...state.dayStats, stockPurchases: state.dayStats.stockPurchases + cost },
      ...appendNotice(state, `Đã nhập ${quantity} ${career(state.business.careerId).unit} nguyên liệu mới.`, 'success'),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  changePrice: (delta) => {
    const state = get()
    if (!Number.isFinite(delta)) return
    const config = career(state.business.careerId)
    const price = clamp(state.business.price + delta, config.minPrice, config.maxPrice)
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
        `${state.business.employeeName} đã gia nhập. Công suất tăng từ ${career(state.business.careerId).capacity} lên ${career(state.business.careerId).employeeCapacity} mỗi lượt.`,
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
    if (state.world.paused || !state.onboarded) return

    const previousLevel = state.player.level
    const previousInventory = state.business.inventory
    const result = simulateWorldTick(snapshotFromStore(state), minutes)
    let next = result.next
    if (!state.story.activeSituation && next.story.activeSituation) {
      next = {
        ...next,
        ...appendNotice(next, `Tình huống mới: ${next.story.activeSituation.title}`, 'info'),
      }
    }


    if (result.autoClosed) {
      next = {
        ...next,
        ...appendNotice(next, `${minuteLabel(career(state.business.careerId).close)} — quầy tự động đóng khi hết ca.`, 'info'),
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

    const totalMinute = next.world.day * 1440 + next.world.minuteOfDay
    if (Math.floor(totalMinute / 30) !== Math.floor((state.world.day * 1440 + state.world.minuteOfDay) / 30)) {
      const id = next.chatSeq + 1
      const conversation=npcConversation(next.world,id)
      next = { ...next, chatSeq: id+1, chat: [...next.chat, ...conversation.map((message,i)=>({id:id+i,...message,minute:totalMinute,fromPlayer:false}))].slice(-40) }
    }
    set(next)
    gameEvents.emit('simulation:update', next)
    if (result.sales > 0) {
      gameEvents.emit('sale', { count: result.sales, revenue: result.revenue })
    }
  },
  resolveSituation: (choiceId) => {
    const state = get()
    const situation = state.story.activeSituation
    const choice = situation?.choices.find((option) => option.id === choiceId)
    if (!situation || !choice) return

    const effect = choice.effect
    const requested = Math.max(0, -(effect.inventory ?? 0))
    if (requested > state.business.inventory || (effect.money ?? 0) < -state.player.money) {
      set(appendNotice(state, requested > state.business.inventory ? 'Không đủ hàng. Hãy nhập thêm hoặc chọn cách hỗ trợ khác.' : 'Bạn chưa đủ tiền cho lựa chọn này.', 'warning'))
      return
    }
    const inventoryDelta = effect.inventory ?? 0
    const unitsSold = Math.max(0, -inventoryDelta)
    const revenue = effect.revenue ?? 0
    const expense = effect.expense ?? 0
    const nextXp = state.player.xp + (effect.xp ?? 0)

    set({
      player: {
        ...state.player,
        money: Math.max(0, state.player.money + (effect.money ?? 0)),
        xp: nextXp,
        level: Math.max(state.player.level, 1 + Math.floor(nextXp / 350)),
        reputation: clamp(state.player.reputation + (effect.reputation ?? 0), 0, 100),
      },
      business: {
        ...state.business,
        inventory: clamp(state.business.inventory + inventoryDelta, 0, state.business.maxInventory),
        reputation: clamp(state.business.reputation + (effect.businessReputation ?? 0), 0, 100),
        quality: clamp(state.business.quality + (effect.quality ?? 0), 0, 100),
        marketingScore: clamp(state.business.marketingScore + (effect.marketing ?? 0), 0, 100),
      },
      dayStats: {
        ...state.dayStats,
        revenue: state.dayStats.revenue + revenue,
        cogs: state.dayStats.cogs + unitsSold * state.business.unitCost,
        expenses: state.dayStats.expenses + expense,
        customers: state.dayStats.customers + unitsSold,
      },
      lifetime: {
        ...state.lifetime,
        revenue: state.lifetime.revenue + revenue,
        customers: state.lifetime.customers + unitsSold,
      },
      story: {
        activeSituation: null,
        history: [...state.story.history, situation].slice(-8),
        lastSituationAt: state.story.lastSituationAt,
        resolvedToday: state.story.resolvedToday + 1,
      },
      ...appendNotice(
        state,
        `${situation.character}: ${choice.label}. Khu phố đã ghi nhận quyết định của bạn.`,
        choice.tone === 'kind' ? 'success' : 'info',
      ),
    })
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },


  setTutorialStep: (tutorialStep) => set({ tutorialStep }),

  dismissNotice: (id) =>
    set((state) => ({ notices: state.notices.filter((notice) => notice.id !== id) })),

  hydrate: (snapshot) => {
    const migrated = migrateSnapshot(snapshot)
    set(migrated)
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },

  resetGame: () => {
    set(createInitialSnapshot())
    gameEvents.emit('reset', undefined)
    gameEvents.emit('simulation:update', snapshotFromStore(get()))
  },
}))
