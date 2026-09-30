import { CloudSun, Pause, Play, Save, WalletCards } from 'lucide-react'
import { formatGameTime, formatMoney } from '../domain/format'
import { WEATHER_META, type GameSpeed } from '../domain/types'
import type { SaveStatus } from '../hooks/useGameRuntime'
import { CharacterArt } from './CharacterArt'
import { useGameStore } from '../store/gameStore'

const avatarColors = {
  green: '#0d6655',
  orange: '#ef6a45',
  blue: '#4f8fc0',
}

export function TopHud({ saveStatus }: { saveStatus: SaveStatus }) {
  const player = useGameStore((state) => state.player)
  const world = useGameStore((state) => state.world)
  const setSpeed = useGameStore((state) => state.setSpeed)
  const togglePause = useGameStore((state) => state.togglePause)
  const weather = WEATHER_META[world.weather]

  return (
    <header className="top-hud">
      <div className="player-chip">
        <span
          className="player-avatar"
          style={{ background: avatarColors[player.avatarStyle] }}
          aria-hidden="true"
        >
          <CharacterArt gender={player.gender} />
        </span>
        <span className="player-copy">
          <strong>{player.name}</strong>
          <small>LV {player.level} · {player.age} tuổi</small>
        </span>
      </div>

      <div className="hud-metrics">
        <div className="metric money-metric" title={formatMoney(player.money)}>
          <WalletCards size={17} />
          <span>
            <small>Tiền mặt</small>
            <strong>{formatMoney(player.money, true)}</strong>
          </span>
        </div>

        <div className="metric time-metric">
          <span className="weather-emoji" aria-hidden="true">
            {weather.icon}
          </span>
          <span>
            <small>Ngày {world.day} · {weather.label}</small>
            <strong>{formatGameTime(world.minuteOfDay)}</strong>
          </span>
        </div>
      </div>

      <div className="time-controls" aria-label="Điều khiển thời gian">
        <button
          className={`icon-button ${world.paused ? 'is-active' : ''}`}
          onClick={togglePause}
          title={world.paused ? 'Tiếp tục' : 'Tạm dừng'}
        >
          {world.paused ? <Play size={17} /> : <Pause size={17} />}
        </button>
        {([1, 2, 4] as GameSpeed[]).map((speed) => (
          <button
            key={speed}
            className={`speed-button ${!world.paused && world.speed === speed ? 'is-active' : ''}`}
            onClick={() => setSpeed(speed)}
          >
            ×{speed}
          </button>
        ))}
      </div>

      <div className={`save-status ${saveStatus}`} title="Trạng thái lưu trên thiết bị">
        {saveStatus === 'loading' ? <CloudSun size={14} /> : <Save size={14} />}
        <span>
          {saveStatus === 'loading' && 'Đang tải'}
          {saveStatus === 'saving' && 'Đang lưu'}
          {saveStatus === 'saved' && 'Đã lưu'}
          {saveStatus === 'error' && 'Lỗi lưu'}
        </span>
      </div>
    </header>
  )
}
