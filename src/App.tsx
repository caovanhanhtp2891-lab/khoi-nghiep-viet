import { useEffect, useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { BottomNav, type PanelName } from './components/BottomNav'
import { GamePanel } from './components/GamePanel'
import { TopHud } from './components/TopHud'
import { MainActions } from './components/MainActions'
import { StoryChoiceCard } from './components/StoryChoiceCard'
import { NoticeToast } from './components/NoticeToast'
import { exportSavedGame, restoreBackup, isDemoProfile } from './services/saveDb'
import { WelcomeModal } from './components/WelcomeModal'
import { gameEvents } from './game/events'
import { GameCanvas } from './game/GameCanvas'
import { useGameRuntime } from './hooks/useGameRuntime'
import { useGameStore } from './store/gameStore'

function App() {
  const saveStatus = useGameRuntime()
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const [selectedNpc, setSelectedNpc] = useState<string | null>(null)
  const [panel, setPanel] = useState<PanelName | null>(null)
  const onboarded = useGameStore((state) => state.onboarded)
  const notices = useGameStore((state) => state.notices)
  const activeSituation = useGameStore((state) => state.story.activeSituation)
  const resolveSituation = useGameStore((state) => state.resolveSituation)

  useEffect(() => gameEvents.on('business:selected', () => setPanel('business')), [])

  useEffect(() => gameEvents.on('npc:selected', (id) => { setSelectedNpc(id); setPanel('neighbors') }), [])

  const selectPanel = (next: PanelName) => {
    setSelectedNpc(null)
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
        <GameCanvas inputBlocked={Boolean(panel) || !onboarded} />
        <button className="locate-player" aria-label="Tìm nhân vật" onClick={() => gameEvents.emit('player:focus', undefined)}><Navigation size={18} /></button>
        <div className="movement-hint">Chạm vỉa hè để đi · Chạm người để trò chuyện</div>

        <div className="location-pill"><MapPin size={14} /> {isDemoProfile ? 'Hồ sơ chơi thử riêng' : 'Khu phố Bình Minh'}</div>
        {activeSituation && (
          <StoryChoiceCard situation={activeSituation} onChoose={resolveSituation} />
        )}

        <div className="notice-stack" aria-live="polite">
          {notices.slice(-3).map((notice) => <NoticeToast key={notice.id} notice={notice} />)}
        </div>
      </section>
      <MainActions openBusinessPanel={() => setPanel('business')} />
      <BottomNav active={panel} onSelect={selectPanel} />
      {panel && <GamePanel key={panel} panel={panel} selectedNpc={selectedNpc} onClose={() => setPanel(null)} />}
      {!onboarded && <WelcomeModal />}
    </main>
  )
}

export default App
