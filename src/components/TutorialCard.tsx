import { ArrowRight, Clock3, Store, Zap } from 'lucide-react'
import { formatMoney } from '../domain/format'
import { career, STARTER_QUANTITY, isTradingHour, tradingHours } from '../domain/careers'
import { useGameStore } from '../store/gameStore'

export function TutorialCard({ openBusinessPanel }: { openBusinessPanel: () => void }) {
  const business = useGameStore((state) => state.business)
  const world = useGameStore((state) => state.world)
  const config = career(business.careerId)
  const toggleBusiness = useGameStore((state) => state.toggleBusiness)
  const setSpeed = useGameStore((state) => state.setSpeed)

  if (!business.owned) {
    return (
      <section className="tutorial-card">
        <span className="tutorial-icon"><Store size={19} /></span>
        <div>
          <small>BƯỚC 1 · QUẦY ĐẦU TIÊN</small>
          <strong>Chọn nghề: xôi, bánh mì hoặc trà sữa</strong>
          <p>Chi phí trọn gói {formatMoney(config.setup + STARTER_QUANTITY * config.unitCost)}.</p>
        </div>
        <button onClick={openBusinessPanel}>Chọn nghề <ArrowRight size={16} /></button>
      </section>
    )
  }

  if (!business.open && isTradingHour(business.careerId, world.minuteOfDay)) {
    return (
      <section className="tutorial-card">
        <span className="tutorial-icon"><Clock3 size={19} /></span>
        <div>
          <small>BƯỚC 2 · GIỜ VÀNG</small>
          <strong>Mở bán {config.product.toLocaleLowerCase('vi')}</strong>
          <p>Cao điểm: {config.peak}. Ca bán: {tradingHours(business.careerId)}.</p>
        </div>
        <button onClick={toggleBusiness}>Mở bán <ArrowRight size={16} /></button>
      </section>
    )
  }

  if (business.open && world.speed === 1) {
    return (
      <section className="tutorial-card compact-tutorial">
        <span className="tutorial-icon"><Zap size={19} /></span>
        <div>
          <small>MẸO</small>
          <strong>Tăng tốc để tới giờ cao điểm</strong>
        </div>
        <button onClick={() => setSpeed(2)}>Chạy ×2</button>
      </section>
    )
  }

  if (business.owned) {
    return (
      <button className="business-quick-button" onClick={openBusinessPanel}>
        <Store size={18} /> Quản lý {business.name} <ArrowRight size={15} />
      </button>
    )
  }

  return null
}
