import { useCallback } from 'react'
import { FatePanel } from './components/FatePanel'
import { Header } from './components/Header'
import { HistoryList } from './components/HistoryList'
import { ModePanel } from './components/ModePanel'
import { ResultCard } from './components/ResultCard'
import { Wheel } from './components/Wheel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useWheel } from './hooks/useWheel'
import { DEFAULT_SETTINGS } from './types/wheel'
import type { AppSettings, WheelItem } from './types/wheel'
import './styles.css'

function App() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    'sengoku-settings',
    DEFAULT_SETTINGS,
  )
  const [customItems, setCustomItems] = useLocalStorage<WheelItem[]>(
    'sengoku-custom-items',
    [],
  )
  const [disabledIds, setDisabledIds] = useLocalStorage<string[]>(
    'sengoku-disabled-ids',
    [],
  )

  const {
    status,
    result,
    history,
    candidates,
    allItems,
    spin,
    clearHistory,
    spinDurationMs,
  } = useWheel(settings, customItems, disabledIds)

  const handleSettingsChange = useCallback(
    (next: AppSettings) => {
      setSettings(next)
    },
    [setSettings],
  )

  return (
    <div className="app">
      <Header settings={settings} />
      <main className="app__main">
        <ModePanel settings={settings} onChange={handleSettingsChange} />
        <FatePanel
          settings={settings}
          allItems={allItems}
          customItems={customItems}
          disabledIds={disabledIds}
          onCustomItemsChange={setCustomItems}
          onDisabledIdsChange={setDisabledIds}
        />
        <Wheel
          status={status}
          result={result}
          candidateCount={candidates.length}
          spinDurationMs={spinDurationMs}
          onSpin={spin}
        />
        {result && (
          <ResultCard item={result} visible={status === 'result'} />
        )}
        <HistoryList records={history} onClear={clearHistory} />
      </main>
    </div>
  )
}

export default App
