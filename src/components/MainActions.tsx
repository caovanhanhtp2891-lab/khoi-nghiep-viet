import { PackagePlus, Settings2, Store } from 'lucide-react'
import { career, isTradingHour, tradingHours } from '../domain/careers'
import { formatMoney } from '../domain/format'
import { RESTOCK_QUANTITY } from '../domain/types'
import { useGameStore } from '../store/gameStore'

export function MainActions({ openBusinessPanel }: { openBusinessPanel: () => void }) {
  const business = useGameStore((state) => state.business)
  const world = useGameStore((state) => state.world)
  const money = useGameStore((state) => state.player.money)
  const stats = useGameStore((state) => state.dayStats)
  const toggleBusiness = useGameStore((state) => state.toggleBusiness)
  const restock = useGameStore((state) => state.restock)
  const config = career(business.careerId)
  const quantity = Math.min(RESTOCK_QUANTITY, business.maxInventory - business.inventory)
  const cost = quantity * business.unitCost
  const inHours = isTradingHour(business.careerId, world.minuteOfDay)
  const canOpen = business.inventory > 0 && inHours
  const profit = stats.revenue - stats.cogs - stats.expenses
  const status = business.open ? world.paused ? 'Quầy mở · tạm dừng' : 'Đang bán' : business.inventory === 0 ? 'Hết nguyên liệu' : inHours ? 'Sẵn sàng mở bán' : 'Ngoài giờ bán'

  if (!business.owned) return (
    <section className="main-actions starter-actions" aria-label="Bắt đầu kinh doanh">
      <div><strong>Khởi đầu với một quầy nhỏ</strong><small>Chọn xôi, bánh mì hoặc trà sữa để bắt đầu.</small></div>
      <button className="main-primary" onClick={openBusinessPanel}><Store size={18} />Chọn nghề</button>
    </section>
  )

  return (
    <section className="main-actions" aria-label="Thao tác nhanh với quầy">
      <div className="main-business-heading"><strong>{business.name}</strong><span className={business.open ? 'is-open' : ''}>{status}</span></div>
      <div className="main-business-summary">
        <div><small>Doanh thu</small><strong>{formatMoney(stats.revenue, true)}</strong></div>
        <div title="Doanh thu trừ giá vốn và chi phí đã ghi nhận; tiền thuê/lương quyết toán cuối ngày."><small>Lãi tạm tính</small><strong className={profit < 0 ? 'negative' : 'positive'}>{formatMoney(profit, true)}</strong></div>
        <div><small>Tồn kho · {config.unit}</small><strong>{business.inventory}/{business.maxInventory}</strong></div>
      </div>
      <div className="main-action-buttons">
        <button className="main-primary" disabled={!business.open && !canOpen} onClick={toggleBusiness} title={`Ca bán ${tradingHours(config.id)}`}><Store size={17} /><span>{business.open ? 'Đóng quầy' : 'Mở bán'}<small>{tradingHours(config.id)}</small></span></button>
        <button disabled={quantity <= 0 || money < cost} onClick={restock}><PackagePlus size={17} /><span>{quantity > 0 ? `Nhập ${quantity} ${config.unit}` : 'Kho đã đầy'}<small>{quantity <= 0 ? 'Không cần nhập' : `${formatMoney(cost, true)}${money < cost ? ' · thiếu tiền' : ''}`}</small></span></button>
        <button onClick={openBusinessPanel}><Settings2 size={17} /><span>Quản lý<small>Giá · nâng cấp</small></span></button>
      </div>
    </section>
  )
}
