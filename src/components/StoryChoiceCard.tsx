import { HandHeart, Megaphone, ShoppingBasket } from 'lucide-react'
import type { LifeSituation, SituationChoice } from '../domain/types'

const choiceIcons = {
  serve: ShoppingBasket,
  help: HandHeart,
  connect: Megaphone,
}

function effectSummary(choice: SituationChoice): string {
  const { effect } = choice
  if ((effect.money ?? 0) > 0) return 'C? th?m doanh thu'
  if ((effect.money ?? 0) < 0) return 'T?n m?t kho?n nh?'
  if ((effect.marketing ?? 0) > 0) return 'T?ng nh?n di?n'
  return 'T?ng thi?n c?m'
}

export function StoryChoiceCard({
  situation,
  onChoose,
}: {
  situation: LifeSituation
  onChoose: (choiceId: string) => void
}) {
  return (
    <section className="story-choice-card" aria-live="polite" aria-label="T?nh hu?ng khu ph?">
      <header>
        <span className="story-icon">{situation.icon}</span>
        <div>
          <small>T?NH HU?NG KHU PH?</small>
          <strong>{situation.title}</strong>
        </div>
      </header>
      <p>{situation.description}</p>
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
      </div>
    </section>
  )
}
