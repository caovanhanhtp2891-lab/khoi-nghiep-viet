import { useState } from 'react'
import { ArrowRight, Banknote, Sparkles } from 'lucide-react'
import type { AvatarStyle, Gender } from '../domain/types'
import { useGameStore } from '../store/gameStore'
import { CharacterArt } from './CharacterArt'

export function WelcomeModal() {
  const startJourney = useGameStore((state) => state.startJourney)
  const [name, setName] = useState('Minh')
  const [gender, setGender] = useState<Gender>('male')
  const [avatar, setAvatar] = useState<AvatarStyle>('green')
  return (
    <div className="modal-backdrop welcome-backdrop" role="dialog" aria-modal="true" aria-label="Tạo nhân vật">
      <section className="welcome-card">
        <div className="welcome-brand"><span className="brand-mark">KN</span><span><small>MỘT KHU PHỐ · NGÀN CƠ HỘI</small><strong>KHỞI NGHIỆP VIỆT</strong></span></div>
        <div className="welcome-hero-copy"><span className="eyebrow"><Sparkles size={15} /> Câu chuyện của bạn bắt đầu</span><h1>Từ một triệu đồng,<br />đến một ước mơ lớn.</h1><p>18 tuổi, một khu phố thân quen. Chọn xôi, bánh mì hoặc trà sữa để lập nghiệp.</p></div>
        <div className="gender-options" role="radiogroup" aria-label="Giới tính nhân vật">
          {(['male', 'female'] as Gender[]).map((value) => <button key={value} role="radio" aria-checked={gender === value} className={gender === value ? 'selected' : ''} onClick={() => setGender(value)}><CharacterArt gender={value} /><strong>{value === 'male' ? 'Nam' : 'Nữ'}</strong><small>{gender === value ? 'Đã chọn' : 'Chọn nhân vật'}</small></button>)}
        </div>
        <label className="field-label" htmlFor="player-name">Tên nhân vật</label><input id="player-name" className="text-input" value={name} maxLength={24} onChange={(event) => setName(event.target.value)} placeholder="Nhập tên của bạn" />
        <div className="color-choice"><span>Màu hồ sơ</span>{(['green', 'orange', 'blue'] as AvatarStyle[]).map((value) => <button key={value} className={`color-dot ${value} ${avatar === value ? 'selected' : ''}`} onClick={() => setAvatar(value)} aria-label={`Màu hồ sơ ${value === 'green' ? 'xanh lá' : value === 'orange' ? 'cam' : 'xanh dương'}`} aria-pressed={avatar === value} />)}</div>
        <div className="starting-budget"><Banknote size={18} /><span>Vốn khởi đầu</span><strong>1.000.000 ₫</strong></div>
        <button className="primary-button welcome-cta" onClick={() => startJourney(name, avatar, gender)}>Bắt đầu lập nghiệp <ArrowRight size={18} /></button>
        <p className="micro-copy">Chạm vỉa hè để đi lại · Tiến trình tự động lưu</p>
      </section>
    </div>
  )
}
