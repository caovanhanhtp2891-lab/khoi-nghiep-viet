import type { BusinessState, Weather } from './types'
export type CareerId = 'xoi' | 'banhmi' | 'trasua'
export interface CareerConfig {
 id: CareerId; label: string; name: string; product: string; unit: string; icon: string; shortSign: string
 description: string; setup: number; unitCost: number; price: number; minPrice: number; maxPrice: number
 stock: number; open: number; close: number; peak: string; baseCustomers: number; capacity: number; employeeCapacity: number
 weather: Record<Weather,number>; hours: Array<{from:number;to:number;factor:number}>
 color: number
}
export const CAREERS: Record<CareerId,CareerConfig> = {
 xoi: {id:'xoi',label:'Bán xôi',name:'Xôi Sáng 18',product:'Xôi mặn',unit:'phần',icon:'🍚',shortSign:'XÔI SÁNG 18',description:'Vốn thấp, bán nhanh trước giờ vào lớp. Ca sáng ngắn, cần nhập hàng đúng lúc.',setup:320000,unitCost:8000,price:22000,minPrice:12000,maxPrice:35000,stock:60,open:330,close:600,peak:'06:30–07:45',baseCustomers:1.35,capacity:2,employeeCapacity:5,color:0xb8533b,weather:{sunny:1,cloudy:0.92,rain:0.58,hot:0.88},hours:[{from:330,to:390,factor:1.15},{from:390,to:465,factor:1.85},{from:465,to:540,factor:1.35},{from:540,to:600,factor:0.65}]},
 banhmi: {id:'banhmi',label:'Bán bánh mì',name:'Bánh Mì Ngõ Nhỏ',product:'Bánh mì thịt',unit:'ổ',icon:'🥖',shortSign:'BÁNH MÌ NGÕ NHỎ',description:'Hai đợt khách sáng và trưa, phục vụ nhanh. Quầy có công suất cao hơn nhưng cần nhiều vốn hơn xôi.',setup:420000,unitCost:9000,price:25000,minPrice:15000,maxPrice:40000,stock:70,open:330,close:840,peak:'06:30–08:00 · 11:00–13:00',baseCustomers:1.45,capacity:3,employeeCapacity:7,color:0xa67b34,weather:{sunny:1,cloudy:0.95,rain:0.65,hot:0.95},hours:[{from:330,to:390,factor:1.05},{from:390,to:480,factor:1.7},{from:480,to:660,factor:0.65},{from:660,to:780,factor:1.55},{from:780,to:840,factor:0.8}]},
 trasua: {id:'trasua',label:'Bán trà sữa',name:'Trà Sữa Ban Công',product:'Trà sữa trân châu',unit:'ly',icon:'🧋',shortSign:'TRÀ SỮA BAN CÔNG',description:'Đông khách chiều và tối; ngày nóng có nhu cầu cao. Giá vốn và vốn ban đầu cao, tránh để quầy mở ngoài ca.',setup:580000,unitCost:11000,price:32000,minPrice:20000,maxPrice:50000,stock:50,open:600,close:1320,peak:'14:00–18:00',baseCustomers:1.25,capacity:2,employeeCapacity:5,color:0x82639a,weather:{sunny:1,cloudy:0.98,rain:0.65,hot:1.45},hours:[{from:600,to:720,factor:0.6},{from:720,to:840,factor:1.05},{from:840,to:1080,factor:1.9},{from:1080,to:1260,factor:1.2},{from:1260,to:1320,factor:0.7}]},
}
export const CAREER_IDS = Object.keys(CAREERS) as CareerId[]
export const STARTER_QUANTITY = 20
export const DAILY_RENT = 35000
export function career(id: CareerId): CareerConfig { return CAREERS[id] }
export function minuteLabel(minute: number): string { return `${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}` }
export function tradingHours(id: CareerId): string { const c=career(id);return `${minuteLabel(c.open)}–${minuteLabel(c.close)}` }
export function isTradingHour(id: CareerId, minute: number): boolean { const c=career(id);return minute>=c.open && minute<c.close }
export function businessForCareer(id: CareerId, old?: BusinessState): BusinessState {
 const c=career(id)
 return {careerId:id,owned:old?.owned ?? false,open:false,name:c.name,productName:c.product,price:c.price,unitCost:c.unitCost,inventory:0,maxInventory:c.stock,quality:old?.quality ?? 65,reputation:old?.reputation ?? 55,hasEmployee:old?.hasEmployee ?? false,employeeName:old?.employeeName ?? 'Chị Mai',dailySalary:old?.dailySalary ?? 120000,marketingScore:old?.marketingScore ?? 0}
}
export function switchQuote(business: BusinessState, target: CareerId): {setup:number;stock:number;equipmentCredit:number;stockCredit:number;net:number} {
 const c=career(target), current=career(business.careerId)
 const equipmentCredit=business.owned?Math.floor(current.setup*0.5):0
 const stockCredit=business.owned?business.inventory*business.unitCost:0
 const stock=STARTER_QUANTITY*c.unitCost
 return {setup:c.setup,stock,equipmentCredit,stockCredit,net:c.setup+stock-equipmentCredit-stockCredit}
}
