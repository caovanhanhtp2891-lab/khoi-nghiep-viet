import { BriefcaseBusiness, Map, MessageCircle, TrendingUp, UserRound } from 'lucide-react'

export type PanelName = 'map' | 'business' | 'invest' | 'chat' | 'character' | 'neighbors'

const items: Array<{
  id: PanelName
  label: string
  icon: typeof Map
}> = [
  { id: 'map', label: 'Bản đồ', icon: Map },
  { id: 'business', label: 'Kinh doanh', icon: BriefcaseBusiness },
  { id: 'invest', label: 'Đầu tư', icon: TrendingUp },
  { id: 'neighbors', label: 'Cư dân', icon: UserRound },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'character', label: 'Nhân vật', icon: UserRound },
]

export function BottomNav({
  active,
  onSelect,
}: {
  active: PanelName | null
  onSelect: (panel: PanelName) => void
}) {
  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={active === id ? 'is-active' : ''}
          onClick={() => onSelect(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon size={21} strokeWidth={active === id ? 2.6 : 2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
