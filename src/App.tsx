import { useEffect, useState } from 'react'
import { MapPin, ShoppingBasket, Users, X } from 'lucide-react'
import { BottomNav, type PanelName } from './components/BottomNav'
import { GamePanel } from './components/GamePanel'
import { TopHud } from './components/TopHud'
import { TutorialCard } from './components/TutorialCard'
import { StoryChoiceCard } from './components/StoryChoiceCard'
import { WelcomeModal } from './components/WelcomeModal'
import { formatMoney } from './domain/format'
import { WEATHER_META } from './domain/types'
import { gameEvents } from './game/events'
import { GameCanvas } from './game/GameCanvas'
import { useGameRuntime } from './hooks/useGameRuntime'
import { useGameStore } from './store/gameStore'

function App() {
  const saveStatus = useGameRuntime()
  const [panel, setPanel] = useState<PanelName | null>(null)
  const onboarded = useGameStore((state) => state.onboarded)
  const business = useGameStore((state) => state.business)
  const dayStats = useGameStore((state) => state.dayStats)
  const weather = useGameStore((state) => state.world.weather)
  const notices = useGameStore((state) => state.notices)
  const dismissNotice = useGameStore((state) => state.dismissNotice)
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

  return (
    <main className="app-shell">
      <TopHud saveStatus={saveStatus} />

      <section className="game-stage">
        <GameCanvas />

        <div className="location-pill"><MapPin size={14} /> Khu phố Bình Minh</div>
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
          {notices.slice(-3).map((notice) => (
            <article key={notice.id} className={`notice ${notice.tone}`}>
              <span />
              <p>{notice.message}</p>
              <button onClick={() => dismissNotice(notice.id)} aria-label="Ẩn thông báo"><X size={13} /></button>
            </article>
          ))}
        </div>
      </section>

      <BottomNav active={panel} onSelect={selectPanel} />
      {panel && <GamePanel panel={panel} onClose={() => setPanel(null)} />}
      {!onboarded && <WelcomeModal />}
    </main>
  )
}

export default App
