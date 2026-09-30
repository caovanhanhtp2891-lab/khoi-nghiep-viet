import { useState } from 'react'
import { HandHeart, Megaphone, ShoppingBasket } from 'lucide-react'
import type { LifeSituation, SituationChoice } from '../domain/types'

const choiceIcons = {
  serve: ShoppingBasket,
  help: HandHeart,
  connect: Megaphone,
}

function effectSummary(choice: SituationChoice): string {
  const { effect } = choice
  if ((effect.money ?? 0) > 0) return 'Có thêm doanh thu'
  if ((effect.money ?? 0) < 0) return 'Tốn một khoản nhỏ'
  if ((effect.marketing ?? 0) > 0) return 'Tăng nhận diện'
  return 'Tăng thiện cảm'
}

export function StoryChoiceCard({
  situation,
  onChoose,
}: {
  situation: LifeSituation
  onChoose: (choiceId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <section className="story-choice-card" aria-live="polite" aria-label="Tình huống khu phố">
<button className="story-toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><header>
        <span className="story-icon">{situation.icon}</span>
        <div>
          <small>TÌNH HUỐNG KHU PHỐ</small>
          <strong>{situation.title}</strong>
        </div>
</header><span>{expanded ? 'Thu gọn' : 'Chọn cách xử lý'} →</span></button>
      {expanded && <><p>{situation.description}</p>
      <div className="story-choices">
        {situation.choices.map((choice) => {
          const Icon = choiceIcons[choice.id as keyof typeof choiceIcons] ?? HandHeart
          return (
            <button
              className={`story-choice ${choice.tone}`}
              key={choice.id}
              onClick={() => onChoose(choice.id)}
            >
              <Icon size={16} />
              <span><strong>{choice.label}</strong><small>{effectSummary(choice)}</small></span>
            </button>
          )
        })}
      </div></>}
    </section>
  )
}
