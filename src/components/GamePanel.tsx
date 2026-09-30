import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Coins,
  LockKeyhole,
  MapPin,
  Megaphone,
  MessageCircle,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Star,
  Store,
  TrendingUp,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { calculateDemand } from '../domain/simulation'
import { formatMoney, formatPercent } from '../domain/format'
import {
  BOOTH_SETUP_COST,
  MARKETING_COST,
  RECRUITMENT_COST,
  STARTER_STOCK_COST,
  WEATHER_META,
} from '../domain/types'
import { snapshotFromStore, useGameStore } from '../store/gameStore'
import type { PanelName } from './BottomNav'

const panelMeta: Record<PanelName, { title: string; subtitle: string }> = {
  map: { title: 'Bản đồ khu phố', subtitle: 'Đọc lưu lượng trước khi đặt điểm bán' },
  business: { title: 'Kinh doanh', subtitle: 'Quản lý vận hành và lợi nhuận' },
  invest: { title: 'Đầu tư', subtitle: 'Tăng tài sản bằng quyết định dài hạn' },
  chat: { title: 'Chat khu phố', subtitle: 'Tin tức đang diễn ra quanh bạn' },
  character: { title: 'Nhân vật', subtitle: 'Kỹ năng, uy tín và hành trình' },
}

export function GamePanel({ panel, onClose }: { panel: PanelName; onClose: () => void }) {
  const meta = panelMeta[panel]

  return (
    <div className="panel-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="game-panel" role="dialog" aria-modal="true" aria-label={meta.title}>
        <div className="panel-handle" aria-hidden="true" />
        <header className="panel-header">
          <div>
            <small>{meta.subtitle}</small>
            <h2>{meta.title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Đóng bảng">
            <X size={19} />
          </button>
        </header>
        <div className="panel-content">
          {panel === 'map' && <MapPanel />}
          {panel === 'business' && <BusinessPanel />}
          {panel === 'invest' && <InvestmentPanel />}
          {panel === 'chat' && <ChatPanel />}
          {panel === 'character' && <CharacterPanel />}
        </div>
      </section>
    </div>
  )
}

function MapPanel() {
  const weather = useGameStore((state) => state.world.weather)
  const businessOwned = useGameStore((state) => state.business.owned)

  return (
    <div className="stack-list">
      <article className="location-hero">
        <div>
          <span className="eyebrow"><MapPin size={14} /> KHU HIỆN TẠI</span>
          <h3>Khu phố Bình Minh</h3>
          <p>Khu dân cư trẻ cạnh trường học và chợ sáng.</p>
        </div>
        <span className="location-score">A</span>
      </article>

      <div className="map-stats-grid">
        <div><Users size={18} /><span><small>Lưu lượng sáng</small><strong>Rất cao</strong></span></div>
        <div><Coins size={18} /><span><small>Thu nhập</small><strong>Trung bình</strong></span></div>
        <div><Store size={18} /><span><small>Cạnh tranh</small><strong>Thấp</strong></span></div>
        <div><span className="weather-mini">{WEATHER_META[weather].icon}</span><span><small>Thời tiết</small><strong>{WEATHER_META[weather].label}</strong></span></div>
      </div>

      <section className="section-card">
        <div className="section-title-row"><h3>Điểm kinh doanh</h3><span>1 / 4 đã khám phá</span></div>
        <div className={`lot-row ${businessOwned ? 'owned' : ''}`}>
          <span className="lot-icon"><Store size={19} /></span>
          <div><strong>Cổng trường Bình Minh</strong><small>Khách học sinh · Cao điểm 06:30–07:45</small></div>
          <span className="lot-badge">{businessOwned ? 'Đang thuê' : 'Trống'}</span>
        </div>
        <div className="lot-row is-locked">
          <span className="lot-icon"><LockKeyhole size={18} /></span>
          <div><strong>Chợ đầu mối</strong><small>Mở khóa ở cấp 5</small></div>
          <span className="lot-badge">Khóa</span>
        </div>
      </section>
    </div>
  )
}

function BusinessPanel() {
  const store = useGameStore()
  const { business, dayStats, player } = store
  const profit = dayStats.revenue - dayStats.cogs - dayStats.expenses
  const demand = calculateDemand(snapshotFromStore(store))
  const canRestock =
    business.owned &&
    business.inventory < business.maxInventory &&
    player.money >= business.unitCost

  if (!business.owned) {
    return (
      <div className="empty-business">
        <span className="large-feature-icon"><BriefcaseBusiness size={34} /></span>
        <span className="eyebrow">CƠ HỘI ĐẦU TIÊN</span>
        <h3>Quầy Xôi Sáng 18</h3>
        <p>
          Vị trí ngay cổng trường, lưu lượng học sinh cao vào buổi sáng. Gói khởi đầu
          gồm xe bán hàng và 20 phần nguyên liệu.
        </p>
        <div className="cost-breakdown">
          <span>Xe và dụng cụ <strong>{formatMoney(BOOTH_SETUP_COST)}</strong></span>
          <span>Nguyên liệu ban đầu <strong>{formatMoney(STARTER_STOCK_COST)}</strong></span>
          <span className="total">Tổng vốn <strong>{formatMoney(BOOTH_SETUP_COST + STARTER_STOCK_COST)}</strong></span>
        </div>
        <button className="primary-button" onClick={store.buyFirstBooth}>
          <Store size={18} /> Mở quầy đầu tiên
        </button>
      </div>
    )
  }

  return (
    <div className="stack-list business-panel-content">
      <article className="business-heading-card">
        <div>
          <span className={`open-dot ${business.open ? 'is-open' : ''}`} />
          <small>{business.open ? 'ĐANG MỞ BÁN' : 'ĐÃ ĐÓNG CỬA'}</small>
          <h3>{business.name}</h3>
          <p>Cổng trường Bình Minh · Xôi mặn</p>
        </div>
        <button className={business.open ? 'danger-button' : 'primary-button'} onClick={store.toggleBusiness}>
          {business.open ? 'Đóng quầy' : 'Mở bán'}
        </button>
      </article>

      <div className="finance-grid">
        <div><small>Doanh thu</small><strong>{formatMoney(dayStats.revenue, true)}</strong></div>
        <div><small>Giá vốn</small><strong>−{formatMoney(dayStats.cogs, true)}</strong></div>
        <div><small>Chi phí</small><strong>−{formatMoney(dayStats.expenses, true)}</strong></div>
        <div className={profit >= 0 ? 'positive' : 'negative'}><small>Lợi nhuận</small><strong>{formatMoney(profit, true)}</strong></div>
      </div>

      <section className="section-card">
        <div className="section-title-row"><h3>Sản phẩm và giá</h3><span>{dayStats.customers} khách hôm nay</span></div>
        <div className="product-control-row">
          <div className="product-icon">🍚</div>
          <div className="product-copy"><strong>{business.productName}</strong><small>Giá vốn {formatMoney(business.unitCost)}</small></div>
          <div className="stepper">
            <button onClick={() => store.changePrice(-1_000)} aria-label="Giảm giá"><Minus size={15} /></button>
            <strong>{formatMoney(business.price, true)}</strong>
            <button onClick={() => store.changePrice(1_000)} aria-label="Tăng giá"><Plus size={15} /></button>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-title-row"><h3>Nguyên liệu</h3><span>{business.inventory}/{business.maxInventory} phần</span></div>
        <div className="progress-track"><span style={{ width: `${(business.inventory / business.maxInventory) * 100}%` }} /></div>
        <button className="secondary-button full-button" disabled={!canRestock} onClick={store.restock}>
          <Package size={17} /> Nhập 20 phần · {formatMoney(20 * business.unitCost)}
        </button>
      </section>

      <section className="section-card">
        <div className="section-title-row"><h3>Nhu cầu hiện tại</h3><span className="demand-score">×{demand.total.toFixed(2)}</span></div>
        <div className="factor-grid">
          <Factor label="Khung giờ" value={demand.time} />
          <Factor label="Thời tiết" value={demand.weather} />
          <Factor label="Mức giá" value={demand.price} />
          <Factor label="Chất lượng" value={demand.quality} />
          <Factor label="Uy tín" value={demand.reputation} />
          <Factor label="Marketing" value={demand.marketing} />
        </div>
      </section>

      <div className="management-grid">
        <section className="section-card management-card">
          <span className="mini-card-icon"><Users size={18} /></span>
          <h3>Nhân viên</h3>
          {business.hasEmployee ? (
            <><strong>{business.employeeName}</strong><small>5 khách/lượt · {formatMoney(business.dailySalary)}/ngày</small><span className="success-label">Đang làm việc</span></>
          ) : (
            <><p>Tăng công suất từ 2 lên 5 khách mỗi lượt.</p><button className="text-button" disabled={player.money < RECRUITMENT_COST} onClick={store.hireEmployee}>Tuyển · {formatMoney(RECRUITMENT_COST, true)}</button></>
          )}
        </section>
        <section className="section-card management-card">
          <span className="mini-card-icon orange"><Megaphone size={18} /></span>
          <h3>Marketing</h3>
          <strong>{Math.round(business.marketingScore)} điểm nhận biết</strong>
          <p>Phát tờ rơi quanh trường, hiệu quả giảm dần.</p>
          <button className="text-button" disabled={player.money < MARKETING_COST} onClick={store.launchMarketing}>Chạy · {formatMoney(MARKETING_COST, true)}</button>
        </section>
      </div>
    </div>
  )
}

function Factor({ label, value }: { label: string; value: number }) {
  const tone = value >= 1.05 ? 'positive' : value < 0.9 ? 'negative' : 'neutral'
  return <div className={tone}><small>{label}</small><strong>{formatPercent(value)}</strong></div>
}

function InvestmentPanel() {
  const playerLevel = useGameStore((state) => state.player.level)
  const cards = [
    { icon: Coins, title: 'Vàng', level: 15, text: 'Tích lũy và phòng vệ trước biến động.' },
    { icon: TrendingUp, title: 'Chứng khoán', level: 20, text: 'Đầu tư vào các công ty hư cấu.' },
    { icon: Building2, title: 'Bất động sản', level: 25, text: 'Mua, cho thuê và phát triển mặt bằng.' },
  ]

  return (
    <div className="stack-list">
      <article className="locked-hero">
        <span className="large-feature-icon"><TrendingUp size={32} /></span>
        <div><span className="eyebrow">SẮP MỞ KHÓA</span><h3>Dùng lợi nhuận để xây tài sản</h3><p>Trước tiên hãy chứng minh mô hình kinh doanh đầu tiên có lợi nhuận ổn định.</p></div>
      </article>
      {cards.map(({ icon: Icon, title, level, text }) => (
        <article className="feature-row is-locked" key={title}>
          <span><Icon size={20} /></span>
          <div><strong>{title}</strong><small>{text}</small></div>
          <em><LockKeyhole size={12} /> LV {level}</em>
        </article>
      ))}
      <div className="level-progress-card">
        <span>Cấp hiện tại <strong>LV {playerLevel}</strong></span>
        <div className="progress-track"><span style={{ width: `${Math.min(100, (playerLevel / 15) * 100)}%` }} /></div>
        <small>Đạt LV 15 để mở thị trường đầu tư đầu tiên.</small>
      </div>
    </div>
  )
}

function ChatPanel() {
  const world = useGameStore((state) => state.world)
  const business = useGameStore((state) => state.business)
  const dayStats = useGameStore((state) => state.dayStats)
  const weatherLine = world.weather === 'rain'
    ? 'Mưa thế này quầy có mái che sẽ lợi thế lắm.'
    : 'Sáng nay cổng trường đông hơn mọi hôm đó!'

  const messages = [
    { name: 'Cô Lan · Chủ tạp hóa', time: 'vừa xong', text: weatherLine, color: '#ef6a45' },
    { name: 'Anh Thịnh · Chủ quán ăn', time: '2 phút', text: business.open ? `${business.name} mở sớm ghê. Khách bắt đầu tới rồi kìa.` : 'Ai bán đồ ăn sáng nhớ mở trước 06:30 nhé.', color: '#0d6655' },
    { name: 'Báo Kinh Tế', time: '5 phút', text: `Giá nếp hôm nay ổn định. Khu Bình Minh đã phục vụ ${dayStats.customers} lượt khách sáng.`, color: '#4f8fc0' },
    { name: 'Minh Giao Hàng', time: '8 phút', text: 'Chợ đầu mối đang có gói nguyên liệu giá tốt tới 09:00.', color: '#8b5cf6' },
  ]

  return (
    <div className="chat-list">
      <div className="channel-tabs"><button className="is-active">Khu phố</button><button>Thương mại</button><button>Toàn quốc</button></div>
      {messages.map((message) => (
        <article className="chat-message" key={message.name}>
          <span className="chat-avatar" style={{ background: message.color }}>{message.name.slice(0, 1)}</span>
          <div><p><strong>{message.name}</strong><time>{message.time}</time></p><span>{message.text}</span></div>
        </article>
      ))}
      <div className="bot-disclosure"><MessageCircle size={15} /> Các đoạn chat hiện tại được tạo bởi nhân vật NPC.</div>
    </div>
  )
}

function CharacterPanel() {
  const player = useGameStore((state) => state.player)
  const lifetime = useGameStore((state) => state.lifetime)
  const business = useGameStore((state) => state.business)
  const resetGame = useGameStore((state) => state.resetGame)

  const handleReset = () => {
    if (window.confirm('Bắt đầu lại từ đầu? Tiến trình hiện tại sẽ bị thay thế ở lần lưu kế tiếp.')) {
      resetGame()
    }
  }

  return (
    <div className="stack-list">
      <article className="character-hero">
        <span className={`large-avatar ${player.avatarStyle}`}>{player.name.slice(0, 1).toUpperCase()}</span>
        <div><span className="eyebrow"><UserRound size={14} /> HỒ SƠ NHÀ SÁNG LẬP</span><h3>{player.name}</h3><p>18 tuổi · Khu phố Bình Minh · Cấp {player.level}</p></div>
      </article>
      <div className="profile-stats">
        <div><BarChart3 size={18} /><small>Doanh thu trọn đời</small><strong>{formatMoney(lifetime.revenue, true)}</strong></div>
        <div><Users size={18} /><small>Khách đã phục vụ</small><strong>{lifetime.customers}</strong></div>
        <div><Star size={18} /><small>Uy tín cá nhân</small><strong>{player.reputation.toFixed(1)}</strong></div>
        <div><BriefcaseBusiness size={18} /><small>Cơ sở sở hữu</small><strong>{business.owned ? 1 : 0}</strong></div>
      </div>
      <section className="section-card">
        <div className="section-title-row"><h3>Kỹ năng kinh doanh</h3><span>{player.xp} XP</span></div>
        <div className="skill-row"><span>Kinh doanh</span><div className="progress-track"><span style={{ width: `${player.businessSkill}%` }} /></div><strong>{player.businessSkill}</strong></div>
        <div className="skill-row"><span>Đàm phán</span><div className="progress-track"><span style={{ width: '5%' }} /></div><strong>5</strong></div>
        <div className="skill-row"><span>Quản trị</span><div className="progress-track"><span style={{ width: business.hasEmployee ? '12%' : '3%' }} /></div><strong>{business.hasEmployee ? 12 : 3}</strong></div>
      </section>
      <button className="reset-button" onClick={handleReset}><RotateCcw size={16} /> Chơi lại từ đầu</button>
    </div>
  )
}
