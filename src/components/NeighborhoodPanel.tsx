import { career } from '../domain/careers'
import { useState } from 'react'
import { NPC_CATALOG, NPC_GROUP_LABELS, getNpc, npcLine } from '../domain/npcCatalog'
import { absoluteMinute, dailyOrders, MILESTONES, relationshipLabel } from '../domain/neighborhood'
import { formatMoney } from '../domain/format'
import { useGameStore, snapshotFromStore } from '../store/gameStore'
import { NpcPortrait } from './NpcPortrait'
import { CompetitionPanel } from './CompetitionPanel'

export function NeighborhoodPanel({ selectedNpc }: { selectedNpc?: string | null }) {
 const store=useGameStore()
 const [tab,setTab]=useState<'residents'|'orders'|'tasks'|'competition'>('residents')
 const [query,setQuery]=useState('')
 const [group,setGroup]=useState('all')
 const [age,setAge]=useState('all')
 const [page,setPage]=useState(0)
 const [focused,setFocused]=useState<string | null>(selectedNpc ?? null)
 const [topic,setTopic]=useState<'greet'|'work'>('greet')
 const npc=focused ? getNpc(focused) : undefined
 const residents=NPC_CATALOG.filter(n=>`${n.name} ${n.job}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')) && (group==='all' || n.group===group) && (age==='all' || (age==='child' ? n.age<18 : age==='senior' ? n.age>=60 : n.age>=18 && n.age<60)))
 const pages=Math.max(1,Math.ceil(residents.length/10))
 const current=Math.min(page,pages-1)
 const seen=Object.keys(store.neighborhood.relationships).length
 const config=career(store.business.careerId)
 const order=store.neighborhood.activeOrder
 const expired=order && (absoluteMinute(store)>order.dueAt || store.world.day!==order.day)
 const talk=(id:string,next:'greet'|'work')=>{store.talkToNpc(id,next);setTopic(next)}
 return <div className="neighborhood-panel">
  <div className="community-tabs neighborhood-tabs" role="tablist" aria-label="Khu phố">{([['residents','Cư dân'],['orders','Đơn đặt'],['tasks','Nhiệm vụ'],['competition','Đua top']] as const).map(([id,label])=><button key={id} role="tab" aria-selected={tab===id} className={tab===id?'is-active':''} onClick={()=>{setTab(id);setFocused(null)}}>{label}</button>)}</div>
  {tab==='competition' && <CompetitionPanel/>}
  {tab==='residents' && (npc ? <div className="resident-detail">
   <button className="text-button" onClick={()=>setFocused(null)}>← Sổ cư dân</button>
   <div className="resident-hero"><NpcPortrait npcId={npc.id}/><div><h3>{npc.name}</h3><p>{npc.age} tuổi · {npc.gender==='female'?'Nữ':'Nam'}</p><strong>{npc.job}</strong><small>{NPC_GROUP_LABELS[npc.group]}</small></div></div>
   <div className="resident-bond"><strong>{relationshipLabel(store.neighborhood.relationships[npc.id]?.bond ?? 0)}</strong><span>{store.neighborhood.relationships[npc.id]?.bond ?? 0}/100 tình thân</span></div>
   <div className="progress-track"><span style={{width:`${store.neighborhood.relationships[npc.id]?.bond ?? 0}%`}}/></div>
   <blockquote>{npcLine(npc,store.world,store.business,topic)}</blockquote>
   <div className="resident-actions"><button className="primary-button" onClick={()=>talk(npc.id,'greet')}>Chào hỏi</button><button className="secondary-button" onClick={()=>talk(npc.id,'work')}>Hỏi chuyện nghề</button></div>
   <p className="community-note">Lần trò chuyện đầu mỗi ngày: +3 tình thân và +3 XP. Lời chào được lưu trong Chat.</p>
   {dailyOrders(store.world.day,store.business.careerId).some(o=>o.npcId===npc.id) && <button className="secondary-button full-button" onClick={()=>{setFocused(null);setTab('orders')}}>Xem đơn đặt của {npc.name}</button>}
  </div> : <>
   <div className="community-summary"><strong>100 người · 50 nghề</strong><span>Đã quen {seen}/100</span></div>
   <input className="resident-search" aria-label="Tìm cư dân" placeholder="Tìm tên hoặc nghề…" value={query} onChange={e=>{setQuery(e.target.value);setPage(0)}}/>
   <div className="resident-filters"><select aria-label="Nhóm nghề" value={group} onChange={e=>{setGroup(e.target.value);setPage(0)}}><option value="all">Mọi nhóm nghề</option>{Object.entries(NPC_GROUP_LABELS).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select><select aria-label="Độ tuổi cư dân" value={age} onChange={e=>{setAge(e.target.value);setPage(0)}}><option value="all">Mọi độ tuổi</option><option value="child">Dưới 18</option><option value="adult">18–59</option><option value="senior">Từ 60</option></select></div>
   <div className="resident-list">{residents.slice(current*10,current*10+10).map(n=><button className="resident-card" key={n.id} onClick={()=>{setFocused(n.id);setTopic('greet')}}><NpcPortrait npcId={n.id}/><span><strong>{n.name}</strong><small>{n.age} tuổi · {n.job}</small><em>{relationshipLabel(store.neighborhood.relationships[n.id]?.bond ?? 0)}</em></span><b>›</b></button>)}</div>
   {residents.length===0 && <p>Chưa tìm thấy cư dân phù hợp.</p>}
   <div className="resident-pagination"><button className="secondary-button" disabled={current===0} onClick={()=>setPage(current-1)}>Trước</button><span>{current+1}/{pages} · {residents.length} người</span><button className="secondary-button" disabled={current===pages-1} onClick={()=>setPage(current+1)}>Sau</button></div>
  </>)}
  {tab==='orders' && <div className="stack-list">
   <p className="community-note">Mỗi ngày có 3 đơn mới. Một đơn đang nhận; thời hạn 120 phút game. Chuẩn bị đủ hàng rồi giao, quầy có thể đóng khi chuẩn bị.</p>
   {order && <article className={`section-card active-delivery ${expired?'expired':''}`}><h3>{expired?'Đơn đã hết hạn':'Đơn đang chuẩn bị'} · {getNpc(order.npcId)?.name}</h3><p>{order.quantity} {config.unit} {config.product} · {formatMoney(order.unitPrice)}/{config.unit}</p><strong>{expired?'Hãy hủy để chọn đơn khác':`Còn ${Math.ceil(order.dueAt-absoluteMinute(store))} phút game`}</strong><div className="resident-actions"><button className="primary-button" disabled={Boolean(expired) || store.business.inventory<order.quantity} onClick={store.completeOrder}>Giao đơn · {formatMoney(order.quantity*order.unitPrice,true)}</button><button className="text-button" onClick={store.cancelOrder}>Hủy đơn</button></div><small>Hàng trong quầy: {store.business.inventory} {config.unit}</small></article>}
   {dailyOrders(store.world.day,store.business.careerId).map(o=>{const n=getNpc(o.npcId)!;const done=store.neighborhood.completedOrders.includes(o.id);return <article className="section-card delivery-offer" key={o.id}><div className="delivery-person"><NpcPortrait npcId={n.id}/><div><h3>{n.name}</h3><small>{n.job}</small><p>{o.quantity} {config.unit} {config.product} · Tổng {formatMoney(o.quantity*o.unitPrice)}</p></div></div><button className="secondary-button full-button" disabled={!store.business.owned || Boolean(order) || done} onClick={()=>store.acceptOrder(o.id)}>{done?'Đã giao hôm nay':order?.id===o.id?'Đang chuẩn bị':store.business.owned?'Nhận đơn':'Cần mở quầy trước'}</button></article>})}
   <p className="community-note">Đã hoàn thành {store.neighborhood.deliveries} đơn. Tiền đơn được ghi nhận vào doanh thu, nguyên liệu vào giá vốn; giao thành công +8 tình thân và +15 XP.</p>
  </div>}
  {tab==='tasks' && <div className="stack-list"><p className="community-note">Các mốc hành trình nhận thưởng một lần. Thưởng từ khu phố không tính vào doanh thu bán hàng.</p>{MILESTONES.map(m=>{const progress=Math.min(m.target,m.progress(snapshotFromStore(store)));const claimed=store.neighborhood.claimedMilestones.includes(m.id);return <article className="section-card milestone-card" key={m.id}><div className="section-title-row"><h3>{m.title}</h3><span>{progress}/{m.target}</span></div><p>{m.description}</p><div className="progress-track"><span style={{width:`${progress/m.target*100}%`}}/></div><div className="milestone-reward"><small>+{formatMoney(m.money,true)} · {m.xp} XP</small><button className="secondary-button" disabled={claimed || progress<m.target} onClick={()=>store.claimMilestone(m.id)}>{claimed?'Đã nhận':'Nhận thưởng'}</button></div></article>})}</div>}
 </div>
}
