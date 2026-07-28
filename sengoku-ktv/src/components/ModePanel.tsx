import { useEffect, useId, useRef, useState } from 'react'
import type { AppSettings } from '../types/wheel'

interface ModePanelProps {
  settings: AppSettings
  onChange: (settings: AppSettings) => void
  forceOpen?: boolean
}

const MODES: { key: keyof AppSettings; label: string; description: string }[] = [
  { key: 'alcohol', label: '酒精模式', description: '可抽到喝酒相關效果' },
  { key: 'food', label: '食物模式', description: '可抽到拼盤相關效果' },
  { key: 'brutal', label: '殘酷模式', description: '可抽到較重的唱歌懲罰' },
  { key: 'interaction', label: '互動模式', description: '可抽到需指定他人的效果' },
]

function getModeSummary(settings: AppSettings): string {
  const active = MODES.filter(({ key }) => settings[key]).map(({ label }) =>
    label.replace('模式', ''),
  )
  return active.length > 0 ? active.join('、') : '標準模式'
}

export function ModePanel({ settings, onChange, forceOpen = false }: ModePanelProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const isOpen = forceOpen || open

  const toggle = (key: keyof AppSettings) => {
    onChange({ ...settings, [key]: !settings[key] })
  }

  useEffect(() => {
    if (!isOpen || forceOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, forceOpen])

  return (
    <section className="mode-panel" aria-label="模式設定" ref={panelRef} data-guide="modes">
      <button
        type="button"
        className="mode-panel__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={listId}
      >
        <span className="mode-panel__trigger-label">模式設定</span>
        <span className="mode-panel__summary">{getModeSummary(settings)}</span>
        <span className={`mode-panel__chevron ${isOpen ? 'mode-panel__chevron--open' : ''}`}>
          ▾
        </span>
      </button>

      <div
        id={listId}
        className={`mode-panel__dropdown ${isOpen ? 'mode-panel__dropdown--open' : ''}`}
        hidden={!isOpen}
      >
        <div className="mode-panel__grid">
          {MODES.map(({ key, label, description }) => (
            <label key={key} className="mode-toggle">
              <input
                type="checkbox"
                className="mode-toggle__input"
                checked={settings[key]}
                onChange={() => toggle(key)}
              />
              <span className="mode-toggle__switch" aria-hidden="true" />
              <span className="mode-toggle__text">
                <span className="mode-toggle__label">{label}</span>
                <span className="mode-toggle__desc">{description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}
