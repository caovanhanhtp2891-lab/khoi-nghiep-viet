import { useState } from 'react'
import { career, DAILY_RENT } from '../domain/careers'
import { formatMoney } from '../domain/format'
import { WEATHER_META } from '../domain/types'
import { expectedClosingCash } from '../domain/accounting'
import { useGameStore } from '../store/gameStore'
export function DayReports() {
 const store=useGameStore()
 const [selected,setSelected]=useState<number | null>(null)
 const reports=store.reports
 const report=reports.find(r=>r.day===selected) ?? reports.at(-1)
 const fee=store.business.owned?DAILY_RENT+(store.business.hasEmployee?store.business.dailySalary:0):0
 const blocked=Boolean(store.neighborhood.activeOrder || store.story.activeSituation)
 const currentProfit=store.dayStats.revenue-store.dayStats.cogs-store.dayStats.expenses-fee
 return <div className="stack-list day-reports">
 <section className="section-card"><h3>Hôm nay · Ngày {store.world.day}</h3><p>Lợi nhuận dự kiến sau tiền thuê và lương: <strong className={currentProfit>=0?'positive':'negative'}>{formatMoney(currentProfit)}</strong></p>
 <p>Cuối ngày trừ {formatMoney(fee)} tiền thuê/lương. Kết thúc sớm sẽ đóng quầy, bỏ qua thời gian còn lại và sang 05:30 ngày mai.</p>
 {store.competition.activeDuel && <p className="community-note">Thi đua đang diễn ra: kết thúc sớm bỏ doanh thu còn lại của bạn, đối thủ vẫn mô phỏng hết ca trước khi so kết quả.</p>}
 <button className="primary-button full-button" disabled={!store.business.owned || blocked} onClick={store.finishDay}>Kết thúc ngày & xem báo cáo</button>{blocked && <small>Hoàn thành hoặc hủy đơn, xử lý tình huống đang chờ trước.</small>}
 </section>
 {reports.length===0 ? <p className="community-note">Chưa có ngày nào được quyết toán. Báo cáo tự xuất hiện khi sang ngày mới, hoặc sau khi bạn kết thúc ngày.</p> : <>
 <label className="field-label" htmlFor="report-day">Báo cáo 30 ngày gần nhất</label><select id="report-day" className="report-select" value={report?.day} onChange={e=>setSelected(Number(e.target.value))}>{[...reports].reverse().map(r=><option key={r.day} value={r.day}>Ngày {r.day} · {formatMoney(r.profit)}</option>)}</select>
 {report && <>
 <article className="report-hero"><small>{WEATHER_META[report.weather].icon} Ngày {report.day} · {report.careerIds.map(id=>career(id).label).join(' / ')}</small><h3 className={report.profit>=0?'positive':'negative'}>{formatMoney(report.profit)}</h3><span>Lợi nhuận ngày · {report.customers} sản phẩm bán · {report.lostCustomers} khách chưa phục vụ</span></article>
 <section className="section-card"><h3>Lời lỗ kinh doanh</h3><div className="report-ledger"><span>Doanh thu<strong>{formatMoney(report.revenue)}</strong></span><span>Giá vốn đã bán<strong>−{formatMoney(report.cogs)}</strong></span><span>Chi phí hoạt động/nâng cấp<strong>−{formatMoney(report.expenses)}</strong></span><span>Tiền thuê<strong>−{formatMoney(report.rent)}</strong></span><span>Lương nhân viên<strong>−{formatMoney(report.payroll)}</strong></span><span className="total">Lợi nhuận<strong>{formatMoney(report.profit)}</strong></span></div></section>
 <section className="section-card"><h3>Dòng tiền</h3><div className="report-ledger"><span>Tiền đầu ngày<strong>{report.cashOpening===null?'Chưa có dữ liệu':formatMoney(report.cashOpening)}</strong></span><span>Tiền bán hàng<strong>+{formatMoney(report.revenue)}</strong></span><span>Thưởng từ khu phố<strong>+{formatMoney(report.communityRewards)}</strong></span><span>Thu hồi khi đổi nghề<strong>+{formatMoney(report.recoveries)}</strong></span><span>Mua nguyên liệu<strong>−{formatMoney(report.stockPurchases)}</strong></span><span>Mua dụng cụ<strong>−{formatMoney(report.capitalPurchases)}</strong></span><span>Hoạt động, thuê, lương<strong>−{formatMoney(report.expenses+report.rent+report.payroll)}</strong></span><span className="total">Tiền sau quyết toán<strong>{formatMoney(report.cashClosing)}</strong></span></div>
 <p className="community-note">Nhập nguyên liệu là tiền trả trước; giá vốn chỉ tính phần đã bán. Dụng cụ và thưởng được tách khỏi doanh thu bán hàng.{report.cashOpening===null?' Ngày từ save cũ chưa có toàn bộ lịch sử dòng tiền; từ ngày sau sẽ có đủ.':expectedClosingCash(report)===report.cashClosing?' Dòng tiền đã đối soát khớp.':' Có khoản lệch dòng tiền cần kiểm tra.'}</p></section>
 </>}
 </>}
 </div>
}
