import { useEffect, useRef } from 'react'
import type { WheelItem } from '../types/wheel'
import { CATEGORY_LABELS } from '../types/wheel'

interface ResultCardProps {
  item: WheelItem
  visible: boolean
  onClose: () => void
}

export function ResultCard({ item, visible, onClose }: ResultCardProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!visible) return

    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [visible, onClose])

  if (!visible) return null

  const modeTags: string[] = []
  if (item.modes.alcohol) modeTags.push('酒精限定')
  if (item.modes.food) modeTags.push('食物限定')
  if (item.modes.brutal) modeTags.push('殘酷限定')
  if (item.modes.interaction) modeTags.push('互動限定')

  return (
    <div
      className="result-modal"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`result-card result-card--${item.category} result-card--visible`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-card-title"
        aria-describedby="result-card-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="result-card__glow" aria-hidden="true" />
        <span className="result-card__category">
          {CATEGORY_LABELS[item.category]}
        </span>
        <h2 id="result-card-title" className="result-card__title">
          {item.title}
        </h2>
        <p id="result-card-description" className="result-card__description">
          {item.description}
        </p>
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
        <button
          ref={closeRef}
          type="button"
          className="result-card__close"
          onClick={onClose}
        >
          知道了
        </button>
      </div>
    </div>
  )
}
