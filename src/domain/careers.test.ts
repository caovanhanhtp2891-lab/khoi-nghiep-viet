import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore, snapshotFromStore } from '../store/gameStore'
import { createInitialSnapshot } from '../store/initialState'
import { CAREERS, businessForCareer, switchQuote } from './careers'
import { simulateTick, calculateDemand } from './simulation'
import { expectedClosingCash } from './accounting'
import { dailyOrders } from './neighborhood'
import { migrateSnapshot } from './migrateSave'
import { db, saveGame, loadGame } from '../services/saveDb'

beforeEach(async()=>{useGameStore.getState().resetGame();useGameStore.getState().startJourney('Lan','green','female');await db.saves.clear()})
const state=()=>useGameStore.getState()
function setMinute(minute:number){useGameStore.setState({world:{...state().world,minuteOfDay:minute}})}
describe('careers and accounting',()=>{
 it('lets a new player choose any of three careers with exact setup and starter costs',()=>{
  state().chooseCareer('trasua');expect(state().player.money).toBe(1000000)
  state().buyFirstBooth();state().buyFirstBooth()
  expect(state().player.money).toBe(200000);expect(state().business.inventory).toBe(20)
  expect(state().dayStats.capitalPurchases).toBe(580000);expect(state().dayStats.stockPurchases).toBe(220000)
 })
 it('uses different trading windows and milk tea benefits from heat',()=>{
  const s=createInitialSnapshot();s.business=businessForCareer('trasua');s.business.owned=true;s.business.open=true;s.business.inventory=30
  s.world.minuteOfDay=420;expect(simulateTick(s).sales).toBe(0)
  s.world.minuteOfDay=900;const sunny=calculateDemand(s);s.world.weather='hot'
  expect(calculateDemand(s).weather).toBe(1.45);expect(calculateDemand(s).total).toBeGreaterThan(sunny.total)
  s.business=businessForCareer('banhmi');s.business.owned=true;s.business.open=true;s.business.inventory=30;s.world.minuteOfDay=720
  expect(simulateTick(s).sales).toBeGreaterThan(0)
  expect(CAREERS.xoi.close).toBe(600);expect(CAREERS.banhmi.close).toBe(840);expect(CAREERS.trasua.close).toBe(1320)
 })
 it('rejects opening before or after a career shift and closes at its own cutoff',()=>{
  state().chooseCareer('trasua');state().buyFirstBooth();state().toggleBusiness();expect(state().business.open).toBe(false)
  setMinute(600);state().toggleBusiness();expect(state().business.open).toBe(true)
  setMinute(1315);state().advanceTick();expect(state().business.open).toBe(false)
 })
 it('switches careers with exact recovered stock/equipment and keeps portable upgrades/staff',()=>{
  state().buyFirstBooth();state().buyUpgrade('storage');state().hireEmployee()
  const before=state().player.money, quote=switchQuote(state().business,'banhmi')
  state().chooseCareer('banhmi')
  expect(state().player.money).toBe(before-quote.net)
  expect(state().business).toMatchObject({careerId:'banhmi',inventory:20,maxInventory:100,hasEmployee:true,open:false})
  expect(state().dayStats.recoveries).toBe(320000)
  expect(state().dayStats.careerIds).toEqual(['xoi','banhmi'])
  state().finishDay();const report=state().reports.at(-1)!
  expect(expectedClosingCash(report)).toBe(report.cashClosing)
 })
 it('does not multiply money when switching back and forth or choosing the same career',()=>{
  state().buyFirstBooth();const before=state().player.money
  state().chooseCareer('xoi');expect(state().player.money).toBe(before)
  state().chooseCareer('banhmi');state().chooseCareer('xoi')
  expect(state().player.money).toBe(before-370000)
 })
 it('blocks career switching while trading, while an order is active, or when funds are insufficient',()=>{
  state().buyFirstBooth();setMinute(420);state().toggleBusiness();state().chooseCareer('banhmi');expect(state().business.careerId).toBe('xoi')
  state().toggleBusiness();state().acceptOrder(dailyOrders(1)[0]!.id);state().chooseCareer('banhmi');expect(state().business.careerId).toBe('xoi')
  state().cancelOrder();useGameStore.setState({player:{...state().player,money:0}});state().chooseCareer('trasua');expect(state().business.careerId).toBe('xoi')
 })
 it('quotes orders for the chosen product and does not turn an old order into a new product',()=>{
  state().chooseCareer('trasua');state().buyFirstBooth();const offer=dailyOrders(1,'trasua')[0]!
  state().acceptOrder(offer.id);expect(state().neighborhood.activeOrder?.careerId).toBe('trasua')
  expect(offer.unitPrice).toBe(30000)
  const before=state().player.money;state().completeOrder()
  expect(state().player.money).toBe(before+offer.quantity*offer.unitPrice)
  expect(state().dayStats.cogs).toBe(offer.quantity*11000)
 })
 it('reconciles a full morning shift, purchases, marketing, staff, reward, daily rent and payroll',()=>{
  state().buyFirstBooth();state().hireEmployee();state().launchMarketing();state().claimMilestone('booth')
  setMinute(390);state().toggleBusiness()
  for(let i=0;i<42;i++) {if(state().business.inventory<8)state().restock();state().advanceTick(5)}
  expect(state().world.minuteOfDay).toBe(600);expect(state().business.open).toBe(false)
  if(state().story.activeSituation)state().resolveSituation('connect')
  const before=state().player.money;state().finishDay();const r=state().reports.at(-1)!
  expect(r.rent).toBe(35000);expect(r.payroll).toBe(120000);expect(r.cashClosing).toBe(before-155000)
  expect(expectedClosingCash(r)).toBe(r.cashClosing)
  expect(r.profit).toBe(r.revenue-r.cogs-r.expenses-r.rent-r.payroll)
  expect(state().lifetime.profit).toBe(r.profit)
  expect(state().dayStats.cashOpening).toBe(r.cashClosing);expect(state().world.minuteOfDay).toBe(330)
 })
 it('settles a natural day boundary once, closes the booth and carries stock without duplicate fees',()=>{
  const s=createInitialSnapshot();s.business.owned=true;s.business.open=true;s.business.hasEmployee=true;s.business.inventory=9;s.world.minuteOfDay=1435
  const r=simulateTick(s)
  expect(r.newDay).toBe(true);expect(r.next.business.open).toBe(false);expect(r.next.business.inventory).toBe(9)
  expect(r.next.reports).toHaveLength(1);expect(r.next.player.money).toBe(845000)
  const again=simulateTick(r.next);expect(again.next.reports).toHaveLength(1);expect(again.next.player.money).toBe(845000)
 })
 it('does not count equipment or community rewards as sales profit',()=>{
  state().buyFirstBooth();state().claimMilestone('booth');state().finishDay()
  const r=state().reports[0]!
  expect(r.revenue).toBe(0);expect(r.profit).toBe(-35000)
  expect(r.capitalPurchases).toBe(320000);expect(r.communityRewards).toBe(20000)
  expect(r.cashClosing).toBe(505000);expect(expectedClosingCash(r)).toBe(505000)
 })
 it('keeps reports bounded to 30 distinct days and preserves pause on an explicit early finish',()=>{
  state().buyFirstBooth();state().togglePause()
  for(let i=0;i<35;i++)state().finishDay()
  expect(state().reports).toHaveLength(30);expect(state().reports[0]?.day).toBe(6)
  expect(new Set(state().reports.map(r=>r.day)).size).toBe(30);expect(state().world.paused).toBe(true)
 })
 it('blocks early finish for an active order without charging a daily fee',()=>{
  state().buyFirstBooth();state().acceptOrder(dailyOrders(1)[0]!.id)
  const before=state().player.money;state().finishDay()
  expect(state().world.day).toBe(1);expect(state().reports).toHaveLength(0);expect(state().player.money).toBe(before)
 })
 it('preserves genuine v4 character, economy, relations, upgrades and pending xoi order',()=>{
  state().buyFirstBooth();state().talkToNpc('npc-002');state().acceptOrder(dailyOrders(1)[0]!.id)
  const old=structuredClone(snapshotFromStore(state())) as unknown as Record<string,unknown>;old.version=4;delete old.reports
  delete (old.business as Record<string,unknown>).careerId
  const oldOrder=(old.neighborhood as Record<string,unknown>).activeOrder as Record<string,unknown>;delete oldOrder.careerId
  for(const key of ['cashOpening','stockPurchases','capitalPurchases','recoveries','communityRewards','careerIds'])delete (old.dayStats as Record<string,unknown>)[key]
  const loaded=migrateSnapshot(old)
  expect(loaded.version).toBe(5);expect(loaded.player).toEqual(state().player);expect(loaded.business.inventory).toBe(20)
  expect(loaded.neighborhood.relationships).toEqual(state().neighborhood.relationships)
  expect(loaded.neighborhood.activeOrder?.careerId).toBe('xoi');expect(loaded.dayStats.cashOpening).toBeNull();expect(loaded.reports).toEqual([])
 })
 it('round-trips a new career, reports and accounting in IndexedDB',async()=>{
  state().chooseCareer('banhmi');state().buyFirstBooth();state().finishDay()
  const snapshot=snapshotFromStore(state());await saveGame(snapshot)
  expect(await loadGame()).toEqual({...snapshot,notices:[]})
 })
 it('rejects unknown careers, altered product costs and broken report formulas without replacing the saved record',async()=>{
  state().buyFirstBooth();state().finishDay();const good=snapshotFromStore(state())
  const corrupt=[{...good,business:{...good.business,careerId:'fake'}},{...good,business:{...good.business,unitCost:1}},{...good,reports:[{...good.reports[0]!,profit:999999}]}]
  for(const payload of corrupt){await db.saves.put({id:'autosave',schemaVersion:1,savedAt:'2026-09-30',payload});await expect(loadGame()).rejects.toThrow();expect((await db.saves.get('autosave'))?.payload).toEqual(payload)}
 })
 it('counts unmet demand when an open booth has zero inventory and rejects multi-day steps',()=>{
  const s=createInitialSnapshot();s.business.owned=true;s.business.open=true;s.world.minuteOfDay=420
  expect(simulateTick(s).lostCustomers).toBeGreaterThan(0);expect(simulateTick(s).sales).toBe(0)
  expect(()=>simulateTick(s,3000)).toThrow();expect(()=>simulateTick(s,NaN)).toThrow()
 })
})
