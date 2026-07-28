import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { GUIDE_STEPS } from '../data/guideSteps'

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
}

interface CardPos {
  top?: number
  placement: 'center' | 'above' | 'below'
  maxHeight?: number
}

interface GuideTourProps {
  open: boolean
  onClose: () => void
  onOpenPanel: (panel: 'modes' | 'fate' | null) => void
}

const PAD = 8
const GAP = 10
const MARGIN = 12
const CARD_MIN = 168
const CARD_IDEAL = 220

function measureTarget(selector: string | undefined): SpotlightRect | null {
  if (!selector) return null
  const el = document.querySelector<HTMLElement>(`[data-guide="${selector}"]`)
  if (!el) return null

  const rect = el.getBoundingClientRect()
  const reserve = CARD_IDEAL + GAP + MARGIN
  const maxHeight = Math.max(
    72,
    Math.min(rect.height + PAD * 2, window.innerHeight - reserve - MARGIN),
  )

  let top = rect.top - PAD
  // Keep room under the spotlight for a nearby card (like the wheel step).
  if (top + maxHeight + reserve > window.innerHeight - MARGIN) {
    top = window.innerHeight - MARGIN - maxHeight - reserve
  }
  top = Math.max(MARGIN, Math.min(top, window.innerHeight - maxHeight - MARGIN))

  return {
    top,
    left: Math.max(0, rect.left - PAD),
    width: Math.min(window.innerWidth - Math.max(0, rect.left - PAD), rect.width + PAD * 2),
    height: maxHeight,
  }
}

function placeCard(spot: SpotlightRect | null): CardPos {
  if (!spot) return { placement: 'center' }

  const belowTop = spot.top + spot.height + GAP
  const spaceBelow = window.innerHeight - belowTop - MARGIN
  const spaceAbove = spot.top - MARGIN

  if (spaceBelow >= CARD_MIN) {
    return {
      top: belowTop,
      placement: 'below',
      maxHeight: Math.min(320, spaceBelow),
    }
  }

  if (spaceAbove >= CARD_MIN) {
    return {
      top: spot.top - GAP,
      placement: 'above',
      maxHeight: Math.min(320, spaceAbove),
    }
  }

  // Tight screens: still hug the spotlight, shrink the card.
  if (spaceBelow >= spaceAbove) {
    return {
      top: belowTop,
      placement: 'below',
      maxHeight: Math.max(140, spaceBelow),
    }
  }
  return {
    top: spot.top - GAP,
    placement: 'above',
    maxHeight: Math.max(140, spaceAbove),
  }
}

function scrollTargetNearTop(selector: string | undefined) {
  if (!selector) return
  const el = document.querySelector<HTMLElement>(`[data-guide="${selector}"]`)
  if (!el) return
  const rect = el.getBoundingClientRect()
  const desiredTop = 64
  const delta = rect.top - desiredTop
  if (Math.abs(delta) > 10) {
    window.scrollBy({ top: delta, behavior: 'smooth' })
  }
}

export function GuideTour({ open, onClose, onOpenPanel }: GuideTourProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [spot, setSpot] = useState<SpotlightRect | null>(null)
  const [cardPos, setCardPos] = useState<CardPos>({ placement: 'center' })

  const step = GUIDE_STEPS[stepIndex]
  const isLast = stepIndex === GUIDE_STEPS.length - 1

  const refreshLayout = useCallback(() => {
    if (!open || !step) return

    onOpenPanel(step.openPanel ?? null)

    const apply = (shouldScroll: boolean) => {
      if (shouldScroll) scrollTargetNearTop(step.target)
      const next = measureTarget(step.target)
      setSpot(next)
      setCardPos(placeCard(next))
    }

    requestAnimationFrame(() => {
      apply(true)
      window.setTimeout(() => apply(false), step.openPanel ? 120 : 80)
    })
  }, [open, step, onOpenPanel])

  useLayoutEffect(() => {
    if (!open) return
    refreshLayout()
  }, [open, stepIndex, refreshLayout])

  useEffect(() => {
    if (!open) return

    const onResizeOrScroll = () => {
      if (!step) return
      const next = measureTarget(step.target)
      setSpot(next)
      setCardPos(placeCard(next))
    }

    window.addEventListener('resize', onResizeOrScroll)
    window.addEventListener('scroll', onResizeOrScroll, true)

    return () => {
      window.removeEventListener('resize', onResizeOrScroll)
      window.removeEventListener('scroll', onResizeOrScroll, true)
    }
  }, [open, step])

  useEffect(() => {
    if (!open) {
      setStepIndex(0)
      onOpenPanel(null)
    }
  }, [open, onOpenPanel])

  if (!open || !step) return null

  const goNext = () => {
    if (isLast) {
      onClose()
      return
    }
    setStepIndex((i) => i + 1)
  }

  const goPrev = () => {
    setStepIndex((i) => Math.max(0, i - 1))
  }

  const cardClass =
    cardPos.placement === 'center'
      ? 'guide-tour__card--center'
      : cardPos.placement === 'above'
        ? 'guide-tour__card--above'
        : 'guide-tour__card--below'

  return (
    <div className="guide-tour" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      {spot ? (
        <div
          className="guide-tour__spot"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
          }}
          aria-hidden="true"
        />
      ) : (
        <div className="guide-tour__dim" aria-hidden="true" />
      )}

      <div
        className={`guide-tour__card ${cardClass}`}
        style={
          cardPos.placement === 'center'
            ? undefined
            : {
                top: cardPos.top,
                maxHeight: cardPos.maxHeight,
              }
        }
      >
        <p className="guide-tour__progress">
          {stepIndex + 1} / {GUIDE_STEPS.length}
        </p>
        <h2 id="guide-title" className="guide-tour__title">
          {step.title}
        </h2>
        <p className="guide-tour__body">{step.body}</p>
        <div className="guide-tour__actions">
          <button type="button" className="guide-tour__btn guide-tour__btn--ghost" onClick={onClose}>
            跳過
          </button>
          <div className="guide-tour__nav">
            {stepIndex > 0 && (
              <button type="button" className="guide-tour__btn guide-tour__btn--ghost" onClick={goPrev}>
                上一步
              </button>
            )}
            <button type="button" className="guide-tour__btn guide-tour__btn--primary" onClick={goNext}>
              {isLast ? '出征' : '下一步'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
