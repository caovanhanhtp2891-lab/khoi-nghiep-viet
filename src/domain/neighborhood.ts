import { career, type CareerId } from './careers'
import { NPC_CATALOG, getNpc } from './npcCatalog'
import type { GameSnapshot } from './types'

export interface NpcRelationship { bond: number; greetedDay: number; meetings: number }
export interface DeliveryOrder { id: string; npcId: string; day: number; careerId: CareerId; quantity: number; unitPrice: number; acceptedAt: number; dueAt: number }
export type UpgradeId = 'canopy' | 'storage' | 'sign'
export interface NeighborhoodState {
 relationships: Record<string, NpcRelationship>
 activeOrder: DeliveryOrder | null
 completedOrders: string[]
 deliveries: number
 upgrades: UpgradeId[]
 claimedMilestones: string[]
}
export function initialNeighborhood(): NeighborhoodState { return { relationships:{}, activeOrder:null, completedOrders:[], deliveries:0, upgrades:[], claimedMilestones:[] } }
export const UPGRADES: Array<{ id: UpgradeId; title: string; description: string; cost: number }> = [
 {id:'canopy',title:'Mái che mở rộng',description:'Nhu cầu ngày mưa đạt ít nhất 0,78; khách chờ bớt ướt.',cost:90000},
 {id:'storage',title:'Tủ nguyên liệu',description:'Thêm 30 chỗ tồn kho, nhập hàng thuận tiện hơn.',cost:140000},
 {id:'sign',title:'Biển hiệu nổi bật',description:'Thêm 0,15 vào hệ số marketing, không mất đi theo ngày.',cost:100000},
]
export function absoluteMinute(state: Pick<GameSnapshot,'world'>): number { return state.world.day*1440+state.world.minuteOfDay }
/** Three deterministic adult customers per day, independent of economy RNG. */
export function dailyOrders(day: number, careerId: CareerId = 'xoi'): Array<Omit<DeliveryOrder,'acceptedAt'|'dueAt'>> {
 const adults=NPC_CATALOG.filter(n=>n.age>=18 && ['school','office','trade','health','transport','service'].includes(n.group))
 return [0,1,2].map(i=>({id:`delivery-${day}-${i}`,npcId:adults[(day*3+i)%adults.length]!.id,day,careerId,quantity:3+(day+i)%4,unitPrice:career(careerId).price-2000+i*2000}))
}
export const MILESTONES: Array<{id:string;title:string;description:string;target:number;money:number;xp:number;progress:(s:GameSnapshot)=>number}> = [
 {id:'neighbors-3',title:'Lời chào đầu ngõ',description:'Làm quen 3 cư dân khác nhau.',target:3,money:15000,xp:25,progress:s=>Object.keys(s.neighborhood.relationships).length},
 {id:'neighbors-10',title:'Hàng xóm thân thiện',description:'Làm quen 10 cư dân khác nhau.',target:10,money:30000,xp:50,progress:s=>Object.keys(s.neighborhood.relationships).length},
 {id:'booth',title:'Bước đầu khởi nghiệp',description:'Sở hữu quầy kinh doanh đầu tiên.',target:1,money:20000,xp:30,progress:s=>Number(s.business.owned)},
 {id:'customers-10',title:'Mười bữa sáng',description:'Phục vụ tổng cộng 10 phần cho khách.',target:10,money:20000,xp:35,progress:s=>s.lifetime.customers},
 {id:'customers-50',title:'Quầy quen của phố',description:'Phục vụ tổng cộng 50 phần cho khách.',target:50,money:50000,xp:75,progress:s=>s.lifetime.customers},
 {id:'delivery-1',title:'Đơn đặt đầu tiên',description:'Hoàn thành một đơn cư dân.',target:1,money:10000,xp:25,progress:s=>s.neighborhood.deliveries},
 {id:'delivery-5',title:'Giao đúng hẹn',description:'Hoàn thành 5 đơn cư dân.',target:5,money:40000,xp:70,progress:s=>s.neighborhood.deliveries},
 {id:'upgrades-3',title:'Góc bán hàng chỉn chu',description:'Mua đủ 3 nâng cấp quầy.',target:3,money:45000,xp:80,progress:s=>s.neighborhood.upgrades.length},
]
export function relationshipLabel(bond: number): string { return bond>=60?'Thân thiết':bond>=25?'Quen thuộc':bond>0?'Đã làm quen':'Chưa gặp' }
export function isKnownNpc(id: string): boolean { return Boolean(getNpc(id)) }
