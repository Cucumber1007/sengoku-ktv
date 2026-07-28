import { useCallback, useEffect, useState } from 'react'
import { FatePanel } from './components/FatePanel'
import { GuideTour } from './components/GuideTour'
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

const GUIDE_SEEN_KEY = 'sengoku-guide-seen'

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
  const [guideOpen, setGuideOpen] = useState(false)
  const [guidePanel, setGuidePanel] = useState<'modes' | 'fate' | null>(null)

  const {
    status,
    result,
    history,
    candidates,
    allItems,
    spin,
    dismissResult,
    clearHistory,
    spinDurationMs,
  } = useWheel(settings, customItems, disabledIds)

  useEffect(() => {
    try {
      if (localStorage.getItem(GUIDE_SEEN_KEY) !== '1') {
        setGuideOpen(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const handleSettingsChange = useCallback(
    (next: AppSettings) => {
      setSettings(next)
    },
    [setSettings],
  )

  const openGuide = useCallback(() => {
    if (status === 'result') dismissResult()
    setGuideOpen(true)
  }, [status, dismissResult])

  const closeGuide = useCallback(() => {
    setGuideOpen(false)
    setGuidePanel(null)
    try {
      localStorage.setItem(GUIDE_SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
  }, [])

  const handleOpenPanel = useCallback((panel: 'modes' | 'fate' | null) => {
    setGuidePanel(panel)
  }, [])

  return (
    <div className="app">
      <button
        type="button"
        className="help-button"
        data-guide="help"
        onClick={openGuide}
        aria-label="使用說明"
        title="使用說明"
      >
        ?
      </button>

      <Header settings={settings} />
      <main className="app__main">
        <ModePanel
          settings={settings}
          onChange={handleSettingsChange}
          forceOpen={guidePanel === 'modes'}
        />
        <FatePanel
          settings={settings}
          allItems={allItems}
          customItems={customItems}
          disabledIds={disabledIds}
          onCustomItemsChange={setCustomItems}
          onDisabledIdsChange={setDisabledIds}
          forceOpen={guidePanel === 'fate'}
        />
        <Wheel
          status={status}
          result={result}
          candidateCount={candidates.length}
          spinDurationMs={spinDurationMs}
          onSpin={spin}
        />
        <HistoryList records={history} onClear={clearHistory} />
      </main>
      {result && (
        <ResultCard
          item={result}
          visible={status === 'result'}
          onClose={dismissResult}
        />
      )}
      <GuideTour
        open={guideOpen}
        onClose={closeGuide}
        onOpenPanel={handleOpenPanel}
      />
    </div>
  )
}

export default App
