import type { AppSettings } from '../types/wheel'

interface HeaderProps {
  settings: AppSettings
}

const MODE_LABELS: { key: keyof AppSettings; label: string }[] = [
  { key: 'alcohol', label: '酒精' },
  { key: 'food', label: '食物' },
  { key: 'brutal', label: '殘酷' },
  { key: 'interaction', label: '互動' },
]

export function Header({ settings }: HeaderProps) {
  const activeModes = MODE_LABELS.filter(({ key }) => settings[key])

  return (
    <header className="header">
      <div className="header__brand">
        <h1 className="header__title">戰國時代</h1>
        <p className="header__subtitle">KTV 合戰轉盤</p>
      </div>
      <div className="header__modes">
        {activeModes.length > 0 ? (
          activeModes.map(({ key, label }) => (
            <span key={key} className="header__mode-tag">
              {label}
            </span>
          ))
        ) : (
          <span className="header__mode-tag header__mode-tag--default">標準模式</span>
        )}
      </div>
    </header>
  )
}
