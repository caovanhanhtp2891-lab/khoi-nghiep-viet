import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialSnapshot } from '../store/initialState'
import { snapshotFromStore, useGameStore } from '../store/gameStore'
import { assetBreakdown, createCompetition, duelOutcome, leaderboard, projectedProfit } from './competition'
import { businessForCareer } from './careers'
import { simulateWorldTick } from './rivalSimulation'
import { simulateTick } from './simulation'
import { expectedClosingCash } from './accounting'
import { migrateSnapshot } from './migrateSave'
import { db, loadGame, saveGame } from '../services/saveDb'

beforeEach(async()=>{ useGameStore.getState().resetGame(); await db.saves.clear() })
const state = ()=>useGameStore.getState()
function journey(){ state().startJourney('Lan','green','female'); state().buyFirstBooth() }

describe('local rivals, rankings and daily challenges',()=>{
  it('starts each rival with one million, paid tools and starter stock, without modifying the player',()=>{
    const initial = createInitialSnapshot()
    expect(initial.player.money).toBe(1000000)
    expect(initial.competition.rivals.map(r=>r.cash)).toEqual([520000,400000,200000])
    for(const r of initial.competition.rivals) expect(r.cash+r.dayStats.stockPurchases+r.dayStats.capitalPurchases).toBe(1000000)
    expect(new Set(initial.competition.rivals.map(r=>r.id)).size).toBe(3)
  })
  it('values stock at cost, equipment and improvements at half cost, includes negative cash and ignores unowned gear',()=>{
    const b = businessForCareer('banhmi');b.owned=true;b.inventory=5
    expect(assetBreakdown(100000,b,['storage'])).toEqual({cash:100000,stock:45000,equipment:210000,improvements:70000,total:425000})
    b.owned=false;expect(assetBreakdown(-50000,b,['storage']).total).toBe(-50000)
  })
  it('sorts by distinct metrics, shares tied ranks and counts rent/payroll in projected profit',()=>{
    const s=createInitialSnapshot();s.player.money=100000;s.business.owned=true;s.business.hasEmployee=true
    s.dayStats.revenue=500000;s.dayStats.cogs=160000;s.dayStats.expenses=70000
    expect(projectedProfit(s.dayStats,s.business)).toBe(115000)
    expect(leaderboard(s,'assets').at(-1)?.id).toBe('player')
    expect(leaderboard(s,'revenue')[0]?.id).toBe('player')
    s.dayStats.revenue=0
    expect(leaderboard(s,'revenue').map(r=>r.rank)).toEqual([1,1,1,1])
  })
  it('simulates deterministically with separate rival seeds and does not mutate inputs or consume player RNG',()=>{
    const s=createInitialSnapshot(), before=structuredClone(s)
    expect(simulateWorldTick(s)).toEqual(simulateWorldTick(s))
    expect(s).toEqual(before)
    expect(simulateWorldTick(s).next.world.rngSeed).toBe(simulateTick(s).next.world.rngSeed)
    expect(simulateWorldTick(s).next.competition.rivals[0]?.rngSeed).not.toBe(s.competition.rivals[0]?.rngSeed)
  })
  it('charges marketing only once per day, honors career hours, and applies competition symmetrically',()=>{
    const s=createInitialSnapshot();s.business.owned=true;s.business.open=true;s.business.inventory=20
    const first=simulateWorldTick(s)
    expect(first.demand.competition).toBe(0.88)
    expect(first.next.competition.rivals[0]?.dayStats.expenses).toBe(50000)
    expect(first.next.competition.rivals[2]?.dayStats.revenue).toBe(0)
    expect(first.next.competition.rivals[2]?.dayStats.expenses).toBe(0)
    const next=simulateWorldTick(first.next)
    expect(next.next.competition.rivals[0]?.dayStats.expenses).toBe(50000)
    const alone=structuredClone(s);alone.business.open=false
    expect(first.next.competition.rivals[0]!.dayStats.revenue).toBeLessThanOrEqual(simulateWorldTick(alone).next.competition.rivals[0]!.dayStats.revenue)
  })
  it('cannot buy supplies, hire or market with no money, and cannot sell more than stock or capacity',()=>{
    const s=createInitialSnapshot();s.world.minuteOfDay=420
    for(const r of s.competition.rivals){r.cash=0;r.business.inventory=0;r.lastPlanDay=1;r.dayStats.cashOpening=r.dayStats.capitalPurchases+r.dayStats.stockPurchases}
    const next=simulateWorldTick(s).next
    for(const r of next.competition.rivals){expect(r.cash).toBe(0);expect(r.business.inventory).toBe(0);expect(r.business.hasEmployee).toBe(false);expect(r.dayStats.revenue).toBe(0)}
    s.competition.rivals[0]!.business.inventory=1
    const limited=simulateWorldTick(s).next.competition.rivals[0]!
    expect(limited.dayStats.customers).toBeLessThanOrEqual(1);expect(limited.business.inventory).toBeGreaterThanOrEqual(0)
  })
  it('runs a complete rival day with paid restocks, staff, upgrades and fees that reconcile exactly once',()=>{
    let s=createInitialSnapshot()
    for(let i=0;i<222;i++)s=simulateWorldTick(s).next
    expect(s.world.day).toBe(2)
    for(const r of s.competition.rivals){
      expect(r.dayStats.revenue).toBe(0);expect(r.business.open).toBe(false)
      expect(r.lastReport?.revenue).toBeGreaterThan(0)
      expect(r.lastReport?.stockPurchases).toBeGreaterThan(0)
      expect(expectedClosingCash(r.lastReport!)).toBe(r.lastReport?.cashClosing)
      expect(r.cash).toBe(r.lastReport?.cashClosing)
    }
    const again=simulateWorldTick(s).next
    expect(again.competition.rivals.map(r=>r.cash)).toEqual(s.competition.rivals.map(r=>r.cash))
    expect(()=>migrateSnapshot(again)).not.toThrow()
  })
  it('keeps rivals paused and inactive before onboarding, and fast-forward does not grant player sales',()=>{
    const before=structuredClone(state().competition);state().advanceTick();expect(state().competition).toEqual(before)
    journey();state().togglePause();const paused=structuredClone(state().competition);state().advanceTick();expect(state().competition).toEqual(paused)
    state().finishDay();expect(state().world.paused).toBe(true);expect(state().reports[0]?.revenue).toBe(0)
    expect(state().competition.rivals.some(r=>r.lastReport!.revenue>0)).toBe(true)
  })
  it('enrolls once daily using baselines, prevents changing careers, and rejects late entry',()=>{
    journey();useGameStore.setState({dayStats:{...state().dayStats,revenue:100000,cogs:40000,customers:5}})
    state().acceptDuel();const accepted=structuredClone(state().competition.activeDuel)
    expect(accepted?.playerStartProfit).toBe(60000);expect(accepted?.playerStartCustomers).toBe(5)
    state().acceptDuel();expect(state().competition.activeDuel).toEqual(accepted)
    state().chooseCareer('banhmi');expect(state().business.careerId).toBe('xoi')
    state().resetGame();journey();useGameStore.setState({world:{...state().world,minuteOfDay:481}})
    state().acceptDuel();expect(state().competition.activeDuel).toBeNull()
  })
  it('requires ten sales, positive profit and a strict win; ties and empty skipped days earn nothing',()=>{
    expect(duelOutcome(300000,200000,10)).toBe('won')
    for(const [p,r,c] of [[300000,200000,9],[0,-1,10],[300000,300000,10]])expect(duelOutcome(p!,r!,c!)).toBe('lost')
    journey();state().acceptDuel();state().finishDay()
    expect(state().competition.history[0]?.outcome).toBe('lost');expect(state().competition.activeDuel).toBeNull()
    const money=state().player.money;state().claimDuelReward(1);expect(state().player.money).toBe(money)
  })
  it('settles a winning challenge, rewards once with a cash ledger entry and persists the claim',async()=>{
    journey();state().acceptDuel()
    // Independent known sales fixture outperforms an entire autonomous shift.
    useGameStore.setState({player:{...state().player,money:state().player.money+10000000},dayStats:{...state().dayStats,revenue:10000000,cogs:800000,customers:100}})
    state().finishDay();expect(state().competition.history[0]?.outcome).toBe('won')
    const before=state().player.money;state().claimDuelReward(1);state().claimDuelReward(1)
    expect(state().player.money).toBe(before+50000);expect(state().dayStats.communityRewards).toBe(50000)
    const snapshot=snapshotFromStore(state());await saveGame(snapshot);state().hydrate((await loadGame())!)
    state().claimDuelReward(1);expect(state().player.money).toBe(before+50000)
    state().finishDay();expect(expectedClosingCash(state().reports.at(-1)!)).toBe(state().reports.at(-1)?.cashClosing)
  })
  it('migrates a genuine v5 report, tea order, unknown opening cash and upgrades without fabricating rival history',async()=>{
    state().startJourney('Lan','green','female');state().chooseCareer('trasua');state().buyFirstBooth()
    state().buyUpgrade('canopy');state().finishDay();state().acceptOrder('delivery-2-0')
    const old=structuredClone(snapshotFromStore(state())) as unknown as Record<string,unknown>;old.version=5;delete old.competition
    const oldStats=old.dayStats as Record<string,unknown>;oldStats.cashOpening=null
    await db.saves.put({id:'autosave',schemaVersion:1,savedAt:'2026-09-30',payload:old})
    const loaded=(await loadGame())!;state().hydrate(loaded)
    expect(loaded.version).toBe(6);expect(loaded.business).toEqual(old.business);expect(loaded.player).toEqual(old.player)
    expect(loaded.neighborhood.activeOrder?.careerId).toBe('trasua');expect(loaded.dayStats.cashOpening).toBeNull()
    expect(loaded.reports).toEqual(old.reports);expect(loaded.neighborhood.upgrades).toEqual(['canopy'])
    expect(loaded.competition.history).toEqual([]);expect(loaded.competition.eligibleFromDay).toBe(3)
    await saveGame(snapshotFromStore(state()));expect((await loadGame())?.competition).toEqual(state().competition)
    state().acceptDuel();expect(state().competition.activeDuel).toBeNull()
  })
  it('rejects corrupt rival cash, duplicated identities, future news and forged challenge results without overwriting the record',async()=>{
    const s=createInitialSnapshot();const bad=[structuredClone(s),structuredClone(s),structuredClone(s),structuredClone(s)]
    bad[0]!.competition.rivals[0]!.cash+=1
    bad[1]!.competition.rivals[1]!.id='npc-011'
    bad[2]!.competition.newsSeq=1;bad[2]!.competition.news=[{id:1,npcId:'npc-011',day:9,minute:0,text:'Tin tương lai'}]
    bad[3]!.world.day=2;bad[3]!.competition.lastDuelDay=1;bad[3]!.competition.history=[{day:1,rivalId:'npc-011',playerProfit:0,rivalProfit:1,customers:10,outcome:'won',claimed:true}]
    for(const payload of bad){await db.saves.put({id:'autosave',schemaVersion:1,savedAt:'2026-09-30',payload});await expect(loadGame()).rejects.toThrow();expect((await db.saves.get('autosave'))?.payload).toEqual(payload)}
  })
  it('keeps seed, rival purchases, news and active challenge identical across a save/load continuation',async()=>{
    journey();state().acceptDuel();state().toggleBusiness();for(let i=0;i<8;i++)state().advanceTick()
    const s=snapshotFromStore(state());await saveGame(s)
    const loaded=(await loadGame())!
    expect(simulateWorldTick(loaded).next.competition).toEqual(simulateWorldTick(s).next.competition)
    expect(loaded.competition.activeDuel).toEqual(s.competition.activeDuel)
    expect(loaded.chat.filter(c=>c.name.includes('Chủ quầy NPC')).length).toBeGreaterThan(0)
  })
  it('bounds news and settled challenge history and starts historical opponents at the current time',()=>{
    const historical=createCompetition({day:9,minuteOfDay:900},true)
    expect(historical.joinedAt).toBe(9*1440+900);expect(historical.eligibleFromDay).toBe(10)
    journey()
    for(let day=0;day<32;day++){state().acceptDuel();state().finishDay()}
    expect(state().competition.history).toHaveLength(30);expect(state().competition.news.length).toBeLessThanOrEqual(16)
    expect(()=>migrateSnapshot(snapshotFromStore(state()))).not.toThrow()
  })
})
