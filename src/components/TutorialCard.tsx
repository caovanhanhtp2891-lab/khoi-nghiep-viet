import { ArrowRight, Clock3, Store, Zap } from 'lucide-react'
import { formatMoney } from '../domain/format'
import { BOOTH_SETUP_COST, STARTER_STOCK_COST } from '../domain/types'
import { useGameStore } from '../store/gameStore'

export function TutorialCard({ openBusinessPanel }: { openBusinessPanel: () => void }) {
  const business = useGameStore((state) => state.business)
  const world = useGameStore((state) => state.world)
  const buyFirstBooth = useGameStore((state) => state.buyFirstBooth)
  const toggleBusiness = useGameStore((state) => state.toggleBusiness)
  const setSpeed = useGameStore((state) => state.setSpeed)

  if (!business.owned) {
    return (
      <section className="tutorial-card">
        <span className="tutorial-icon"><Store size={19} /></span>
        <div>
          <small>BƯỚC 1 · QUẦY ĐẦU TIÊN</small>
          <strong>Mua xe xôi và 20 phần nguyên liệu</strong>
          <p>Chi phí trọn gói {formatMoney(BOOTH_SETUP_COST + STARTER_STOCK_COST)}.</p>
        </div>
        <button onClick={buyFirstBooth}>Mua ngay <ArrowRight size={16} /></button>
      </section>
    )
  }

  if (!business.open && world.minuteOfDay < 600) {
    return (
      <section className="tutorial-card">
        <span className="tutorial-icon"><Clock3 size={19} /></span>
        <div>
          <small>BƯỚC 2 · GIỜ VÀNG</small>
          <strong>Mở quầy trước 06:30</strong>
          <p>Học sinh sẽ đi ngang đông nhất từ 06:30–07:45.</p>
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
