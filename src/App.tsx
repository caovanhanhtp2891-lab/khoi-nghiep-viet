import { useEffect, useState } from 'react'
import { MapPin, ShoppingBasket, Users, Navigation } from 'lucide-react'
import { BottomNav, type PanelName } from './components/BottomNav'
import { GamePanel } from './components/GamePanel'
import { TopHud } from './components/TopHud'
import { TutorialCard } from './components/TutorialCard'
import { StoryChoiceCard } from './components/StoryChoiceCard'
import { NoticeToast } from './components/NoticeToast'
import { exportSavedGame, restoreBackup, isDemoProfile } from './services/saveDb'
import { WelcomeModal } from './components/WelcomeModal'
import { formatMoney } from './domain/format'
import { WEATHER_META } from './domain/types'
import { gameEvents } from './game/events'
import { GameCanvas } from './game/GameCanvas'
import { useGameRuntime } from './hooks/useGameRuntime'
import { useGameStore } from './store/gameStore'

function App() {
  const saveStatus = useGameRuntime()
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const [panel, setPanel] = useState<PanelName | null>(null)
  const onboarded = useGameStore((state) => state.onboarded)
  const business = useGameStore((state) => state.business)
  const dayStats = useGameStore((state) => state.dayStats)
  const weather = useGameStore((state) => state.world.weather)
  const notices = useGameStore((state) => state.notices)
  const activeSituation = useGameStore((state) => state.story.activeSituation)
  const resolveSituation = useGameStore((state) => state.resolveSituation)
  const profit = dayStats.revenue - dayStats.cogs - dayStats.expenses

  useEffect(() => gameEvents.on('business:selected', () => setPanel('business')), [])

  const selectPanel = (next: PanelName) => {
    setPanel((current) => (current === next ? null : next))
  }

  if (saveStatus === 'loading') {
    return (
      <main className="loading-screen">
        <span className="loading-logo">KN</span>
        <h1>Khởi Nghiệp Việt</h1>
        <p>Đang mở khu phố Bình Minh…</p>
        <span className="loading-bar"><i /></span>
      </main>
    )
  }

  if (saveStatus === 'blocked') return <main className="recovery-screen"><h1>Dữ liệu cần được khôi phục</h1><p>Game đã dừng tự động lưu để bảo vệ tiến trình cũ.</p><button onClick={() => { void restoreBackup().then(() => window.location.reload()).catch(() => setRecoveryMessage('Chưa có bản sao lưu hợp lệ. Hãy tải dữ liệu để kiểm tra.')) }}>Khôi phục bản sao lưu</button><button onClick={() => { void exportSavedGame().then((text) => { const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = 'khoi-nghiep-viet-save.json'; link.click(); URL.revokeObjectURL(url) }).catch(() => setRecoveryMessage('Không thể đọc IndexedDB. Hãy kiểm tra quyền lưu của trình duyệt.')) }}>Tải dữ liệu hiện có</button><p role="status">{recoveryMessage}</p></main>

  return (
    <main className="app-shell">
      <TopHud saveStatus={saveStatus} />

      <section className="game-stage">
        <GameCanvas />
        <div className="street-caption"><span>KHU PHỐ BÌNH MINH</span><strong>Mỗi ngày, một bước tiến.</strong></div>
        <button className="locate-player" aria-label="Tìm nhân vật" onClick={() => gameEvents.emit('player:focus', undefined)}><Navigation size={18} /></button>
        <div className="movement-hint">Chạm vỉa hè để đi · Chạm người để trò chuyện</div>

        <div className="location-pill"><MapPin size={14} /> {isDemoProfile ? 'Hồ sơ chơi thử riêng' : 'Khu phố Bình Minh'}</div>
        <div className="weather-pill">
          <span>{WEATHER_META[weather].icon}</span>
          <div><small>Thời tiết hôm nay</small><strong>{WEATHER_META[weather].label}</strong></div>
        </div>

        {business.owned && (
          <div className="live-business-stats">
            <div><ShoppingBasket size={16} /><span><small>Doanh thu</small><strong>{formatMoney(dayStats.revenue, true)}</strong></span></div>
            <div><Users size={16} /><span><small>Khách</small><strong>{dayStats.customers}</strong></span></div>
            <div className={profit >= 0 ? 'positive' : 'negative'}><span><small>Lợi nhuận tạm tính</small><strong>{formatMoney(profit, true)}</strong></span></div>
          </div>
        )}
        {activeSituation && (
          <StoryChoiceCard situation={activeSituation} onChoose={resolveSituation} />
        )}

        <div className="tutorial-wrap">
          <TutorialCard openBusinessPanel={() => setPanel('business')} />
        </div>

        <div className="notice-stack" aria-live="polite">
          {notices.slice(-3).map((notice) => <NoticeToast key={notice.id} notice={notice} />)}
        </div>
      </section>

      <BottomNav active={panel} onSelect={selectPanel} />
      {panel && <GamePanel panel={panel} onClose={() => setPanel(null)} />}
      {!onboarded && <WelcomeModal />}
    </main>
  )
}

export default App
