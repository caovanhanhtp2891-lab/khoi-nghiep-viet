import { CAREER_IDS, career, STARTER_QUANTITY, switchQuote, tradingHours } from '../domain/careers'
import { formatMoney } from '../domain/format'
import { useGameStore } from '../store/gameStore'
export function CareerOptions() {
 const store=useGameStore(), b=store.business
 const blocked=b.open || Boolean(store.neighborhood.activeOrder) || Boolean(store.story.activeSituation)
 return <div className="stack-list career-options"><p className="community-note">Chọn một nghề cho quầy đang có. Mỗi nghề có giờ bán, giá vốn và công suất riêng; khách tự đến theo thời gian.</p>
 {CAREER_IDS.map(id=>{const c=career(id), selected=b.careerId===id, quote=switchQuote(b,id)
 return <article className={`section-card career-card ${selected?'selected':''}`} key={id}>
 <div className="career-title"><span>{c.icon}</span><div><h3>{c.label}</h3><small>{tradingHours(id)} · {selected?'Đang chọn':'Có thể chọn'}</small></div></div>
 <p>{c.description}</p><div className="career-facts"><span>Giá mặc định<strong>{formatMoney(c.price)}/{c.unit}</strong></span><span>Giá vốn<strong>{formatMoney(c.unitCost)}/{c.unit}</strong></span><span>Công suất<strong>{c.capacity} → {c.employeeCapacity}/lượt</strong></span><span>Cao điểm<strong>{c.peak}</strong></span></div>
 {b.owned && !selected ? <div className="career-quote"><span>Dụng cụ mới<strong>{formatMoney(quote.setup)}</strong></span><span>{STARTER_QUANTITY} {c.unit} nguyên liệu<strong>{formatMoney(quote.stock)}</strong></span><span>Thu hồi dụng cụ cũ (50%)<strong>−{formatMoney(quote.equipmentCredit)}</strong></span><span>Thu hồi nguyên liệu cũ (giá vốn)<strong>−{formatMoney(quote.stockCredit)}</strong></span><span className="total">{quote.net>=0?'Cần thêm vốn':'Tiền nhận lại'}<strong>{formatMoney(Math.abs(quote.net))}</strong></span></div>
 : <p className="career-start-cost">Gói bắt đầu: <strong>{formatMoney(c.setup+STARTER_QUANTITY*c.unitCost)}</strong> · xe và {STARTER_QUANTITY} {c.unit} nguyên liệu</p>}
 <button className="secondary-button full-button" disabled={selected || (b.owned && (blocked || store.player.money<quote.net))} onClick={()=>store.chooseCareer(id)}>{selected?'Nghề hiện tại':b.owned?`Đổi sang ${c.label.toLocaleLowerCase('vi')}`:`Chọn ${c.label.toLocaleLowerCase('vi')}`}</button>
 {!b.owned && selected && <button className="primary-button full-button" disabled={store.player.money<c.setup+STARTER_QUANTITY*c.unitCost} onClick={store.buyFirstBooth}>Mở quầy · {formatMoney(c.setup+STARTER_QUANTITY*c.unitCost,true)}</button>}
 </article>})}
 {b.owned && <p className="community-note">Đổi nghề giữ nhân viên, uy tín và nâng cấp; chuyển kho thành tiền theo giá vốn rồi cấp 20 nguyên liệu của nghề mới. Quầy phải đóng và không có đơn/tình huống đang chờ.{blocked?' Hiện cần đóng quầy hoặc xử lý việc đang chờ.':''}</p>}
 </div>
}
