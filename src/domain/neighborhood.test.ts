import { beforeEach, describe, expect, it } from 'vitest'
import { NPC_CATALOG, streetNpc } from './npcCatalog'
import { npcSheetSvg } from './npcArt'
import { dailyOrders, MILESTONES } from './neighborhood'
import { useGameStore, snapshotFromStore } from '../store/gameStore'
import { calculateDemand } from './simulation'
import { migrateSnapshot } from './migrateSave'
import { createInitialSnapshot } from '../store/initialState'

beforeEach(()=>{useGameStore.getState().resetGame();useGameStore.getState().startJourney('Lan','green','female')})
function store() { return useGameStore.getState() }
function openBooth() { store().buyFirstBooth() }
function accept() { openBooth(); store().acceptOrder(dailyOrders(store().world.day)[0]!.id); return store().neighborhood.activeOrder! }
describe('neighborhood economy and residents',()=>{
 it('has 100 distinct identities, professions and sheets spanning childhood to old age',()=>{
  expect(NPC_CATALOG).toHaveLength(100)
  expect(new Set(NPC_CATALOG.map(n=>n.id)).size).toBe(100)
  expect(new Set(NPC_CATALOG.map(n=>n.job)).size).toBe(50)
  expect(new Set(NPC_CATALOG.map(n=>npcSheetSvg(n).replace(/<title>.*<\/title>/, ''))).size).toBe(100)
  expect(Math.min(...NPC_CATALOG.map(n=>n.age))).toBe(7)
  expect(Math.max(...NPC_CATALOG.map(n=>n.age))).toBe(82)
  expect(NPC_CATALOG.filter(n=>n.gender==='female')).toHaveLength(50)
 })
 it('uses a deterministic daily roster without affecting economic seed',()=>{
  const world=store().world;const seed=world.rngSeed
  expect(streetNpc(world,1)).toEqual(streetNpc(world,1))
  expect(streetNpc({...world,day:world.day+1},1).id).not.toBe(streetNpc(world,1).id)
  expect(world.rngSeed).toBe(seed)
 })
 it('limits greeting XP and bond to once per NPC per day and retains dialogue',()=>{
  store().talkToNpc('npc-061');store().talkToNpc('npc-061','work')
  expect(store().player.xp).toBe(3)
  expect(store().neighborhood.relationships['npc-061']).toEqual({bond:3,greetedDay:1,meetings:1})
  expect(store().chat.at(-1)?.npcId).toBe('npc-061')
  useGameStore.setState({world:{...store().world,day:2}});store().talkToNpc('npc-061')
  expect(store().player.xp).toBe(6);expect(store().neighborhood.relationships['npc-061']?.bond).toBe(6)
 })
 it('does not give milestone rewards before completion or twice after completion',()=>{
  const before=store().player.money
  store().claimMilestone('neighbors-3');expect(store().player.money).toBe(before)
  for(const id of ['npc-001','npc-002','npc-003']) store().talkToNpc(id)
  store().claimMilestone('neighbors-3');store().claimMilestone('neighbors-3')
  expect(store().player.money).toBe(before+MILESTONES[0]!.money)
  expect(store().dayStats.revenue).toBe(0)
  expect(store().neighborhood.claimedMilestones).toEqual(['neighbors-3'])
 })
 it('accepts one offered daily order, and reconciles payment, stock, cost and relationship once',()=>{
  const order=accept();store().acceptOrder(dailyOrders(1)[1]!.id)
  expect(store().neighborhood.activeOrder?.id).toBe(order.id)
  const money=store().player.money,inventory=store().business.inventory
  store().completeOrder();store().completeOrder();store().acceptOrder(order.id)
  expect(store().neighborhood.activeOrder).toBeNull()
  expect(store().player.money).toBe(money+order.quantity*order.unitPrice)
  expect(store().business.inventory).toBe(inventory-order.quantity)
  expect(store().dayStats.revenue).toBe(order.quantity*order.unitPrice)
  expect(store().dayStats.cogs).toBe(order.quantity*store().business.unitCost)
  expect(store().lifetime.customers).toBe(order.quantity)
  expect(store().neighborhood.deliveries).toBe(1)
  expect(store().neighborhood.relationships[order.npcId]?.bond).toBe(8)
 })
 it('rejects insufficient stock and expired orders without paying or consuming inventory',()=>{
  const order=accept()
  useGameStore.setState({business:{...store().business,inventory:order.quantity-1}})
  const before=store().player.money
  store().completeOrder();expect(store().neighborhood.deliveries).toBe(0)
  useGameStore.setState({business:{...store().business,inventory:20},world:{...store().world,minuteOfDay:store().world.minuteOfDay+121}})
  store().completeOrder();expect(store().player.money).toBe(before);expect(store().business.inventory).toBe(20)
  store().cancelOrder();expect(store().neighborhood.activeOrder).toBeNull()
 })
 it('rejects forged or yesterday orders and allows the next daily roster',()=>{
  openBooth();store().acceptOrder('delivery-1-8');expect(store().neighborhood.activeOrder).toBeNull()
  useGameStore.setState({world:{...store().world,day:2}})
  store().acceptOrder(dailyOrders(1)[0]!.id);expect(store().neighborhood.activeOrder).toBeNull()
  store().acceptOrder(dailyOrders(2)[0]!.id);expect(store().neighborhood.activeOrder?.day).toBe(2)
 })
 it('purchases upgrades once, adds capacity and adjusts rain/marketing demand',()=>{
  openBooth();const money=store().player.money
  useGameStore.setState({world:{...store().world,weather:'rain'}})
  const before=calculateDemand(snapshotFromStore(store()))
  store().buyUpgrade('canopy');store().buyUpgrade('canopy');store().buyUpgrade('storage');store().buyUpgrade('sign')
  const demand=calculateDemand(snapshotFromStore(store()))
  expect(store().player.money).toBe(money-90000-140000-100000)
  expect(store().dayStats.expenses).toBe(330000)
  expect(store().business.maxInventory).toBe(90)
  expect(demand.weather).toBe(0.78);expect(demand.weather).toBeGreaterThan(before.weather)
  expect(demand.marketing).toBeCloseTo(before.marketing+0.15)
 })
 it('round-trips the neighborhood and migrates v3 without losing previous progress',()=>{
  store().talkToNpc('npc-002');accept();store().buyUpgrade('storage')
  const state=snapshotFromStore(store())
  expect(migrateSnapshot(state)).toEqual({...state,notices:[]})
  const old=structuredClone(createInitialSnapshot()) as unknown as Record<string,unknown>
  old.version=3;delete old.neighborhood
  ;(old.player as Record<string,unknown>).money=123456
  expect(migrateSnapshot(old)).toMatchObject({version:4,player:{money:123456},neighborhood:{relationships:{},activeOrder:null}})
 })
 it('rejects invalid v4 relationships, rewards and forged delivery prices',()=>{
  const order=accept();const valid=snapshotFromStore(store())
  for(const changes of [
   {relationships:{unknown:{bond:2,greetedDay:1,meetings:1}}},
   {relationships:{'npc-001':{bond:101,greetedDay:1,meetings:1}}},
   {claimedMilestones:['fake-reward']},
   {activeOrder:{...order,unitPrice:1000000}},
  ]) expect(()=>migrateSnapshot({...valid,neighborhood:{...valid.neighborhood,...changes}})).toThrow()
 })
})
