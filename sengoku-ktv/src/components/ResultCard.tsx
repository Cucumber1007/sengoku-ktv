import type { WheelItem } from '../types/wheel'
import { CATEGORY_LABELS } from '../types/wheel'

interface ResultCardProps {
  item: WheelItem
  visible: boolean
}

export function ResultCard({ item, visible }: ResultCardProps) {
  if (!visible) return null

  const modeTags: string[] = []
  if (item.modes.alcohol) modeTags.push('酒精限定')
  if (item.modes.food) modeTags.push('食物限定')
  if (item.modes.brutal) modeTags.push('殘酷限定')
  if (item.modes.interaction) modeTags.push('互動限定')

  return (
    <section
      className={`result-card result-card--${item.category} result-card--visible`}
      aria-live="polite"
      aria-label="抽選結果"
    >
      <div className="result-card__glow" aria-hidden="true" />
      <span className="result-card__category">
        {CATEGORY_LABELS[item.category]}
      </span>
      <h2 className="result-card__title">{item.title}</h2>
      <p className="result-card__description">{item.description}</p>
      <div className="result-card__tags">
        {item.tags.map((tag) => (
          <span key={tag} className="result-card__tag">
            {tag}
          </span>
        ))}
        {modeTags.map((tag) => (
          <span key={tag} className="result-card__tag result-card__tag--mode">
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
