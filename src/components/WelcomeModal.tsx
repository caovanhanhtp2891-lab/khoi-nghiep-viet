import { useState } from 'react'
import { ArrowRight, Banknote, Building2, MapPin, Sparkles } from 'lucide-react'
import { formatMoney } from '../domain/format'
import type { AvatarStyle } from '../domain/types'
import { useGameStore } from '../store/gameStore'

const avatars: Array<{ id: AvatarStyle; label: string; color: string }> = [
  { id: 'green', label: 'Xanh lá', color: '#0d6655' },
  { id: 'orange', label: 'Cam', color: '#ef6a45' },
  { id: 'blue', label: 'Xanh dương', color: '#4f8fc0' },
]

export function WelcomeModal() {
  const startJourney = useGameStore((state) => state.startJourney)
  const [name, setName] = useState('Minh')
  const [avatar, setAvatar] = useState<AvatarStyle>('green')

  return (
    <div className="modal-backdrop welcome-backdrop" role="dialog" aria-modal="true">
      <section className="welcome-card">
        <div className="welcome-brand">
          <span className="brand-mark">
            <Building2 size={26} />
          </span>
          <span>
            <small>GAME MÔ PHỎNG KINH DOANH 2D</small>
            <strong>KHỞI NGHIỆP VIỆT</strong>
          </span>
        </div>

        <div className="welcome-hero-copy">
          <span className="eyebrow"><Sparkles size={15} /> Hành trình của bạn bắt đầu</span>
          <h1>18 tuổi. 1 triệu đồng.<br />Bạn sẽ làm gì?</h1>
          <p>
            Tự tay mở quầy đầu tiên, đọc nhu cầu khu phố và xây một đế chế kinh doanh
            trong thế giới Việt Nam thu nhỏ.
          </p>
        </div>

        <div className="starting-cards">
          <div><Banknote size={18} /><span><small>Vốn khởi đầu</small><strong>{formatMoney(1_000_000)}</strong></span></div>
          <div><MapPin size={18} /><span><small>Địa điểm</small><strong>Khu phố Bình Minh</strong></span></div>
        </div>

        <label className="field-label" htmlFor="player-name">Tên nhân vật</label>
        <input
          id="player-name"
          className="text-input"
          value={name}
          maxLength={24}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nhập tên của bạn"
        />

        <span className="field-label">Chọn màu trang phục</span>
        <div className="avatar-options" role="radiogroup" aria-label="Màu trang phục">
          {avatars.map((option) => (
            <button
              key={option.id}
              className={avatar === option.id ? 'is-active' : ''}
              onClick={() => setAvatar(option.id)}
              role="radio"
              aria-checked={avatar === option.id}
            >
              <span style={{ background: option.color }}>{name.slice(0, 1).toUpperCase() || 'K'}</span>
              {option.label}
            </button>
          ))}
        </div>

        <button className="primary-button welcome-cta" onClick={() => startJourney(name, avatar)}>
          Bắt đầu lập nghiệp <ArrowRight size={18} />
        </button>
        <p className="micro-copy">Tiến trình được tự động lưu trên thiết bị này.</p>
      </section>
    </div>
  )
}
