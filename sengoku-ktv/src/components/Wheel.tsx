import { useEffect, useState } from 'react'
import type { WheelItem, WheelStatus } from '../types/wheel'

interface WheelProps {
  status: WheelStatus
  result: WheelItem | null
  candidateCount: number
  spinDurationMs: number
  onSpin: () => void
}

export function Wheel({
  status,
  result,
  candidateCount,
  spinDurationMs,
  onSpin,
}: WheelProps) {
  const [rotation, setRotation] = useState(0)
  const isSpinning = status === 'spinning'
  const isDisabled = isSpinning || candidateCount === 0

  useEffect(() => {
    if (status !== 'spinning') return

    const extraTurns = 4 + Math.floor(Math.random() * 3)
    const extraAngle = extraTurns * 360 + Math.random() * 360
    setRotation((prev) => prev + extraAngle)
  }, [status])

  const hint =
    status === 'result' && result
      ? `命運已定：${result.title}`
      : isSpinning
        ? '合戰中…'
        : candidateCount === 0
          ? '無可用效果'
          : '點擊轉盤開戰'

  return (
    <section className="wheel-section" aria-label="轉盤">
      <button
        type="button"
        className="wheel-hit"
        onClick={onSpin}
        disabled={isDisabled}
        aria-busy={isSpinning}
        aria-label={isSpinning ? '轉盤旋轉中' : '點擊轉盤開始抽選'}
      >
        <div className="wheel-container">
          <div
            className={`wheel-disc ${isSpinning ? 'wheel-disc--spinning' : ''}`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? `${spinDurationMs}ms` : '0ms',
            }}
          >
            <div className="wheel-disc__inner">
              <span className="wheel-disc__kanji">戰</span>
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="wheel-disc__segment"
                style={{ transform: `rotate(${i * 45}deg)` }}
              />
            ))}
          </div>
          <div className="wheel-pointer" aria-hidden="true" />
        </div>
      </button>

      <p
        className={`wheel-hint ${status === 'result' ? 'wheel-hint--result' : ''}`}
        aria-live="polite"
      >
        {hint}
      </p>
    </section>
  )
}
