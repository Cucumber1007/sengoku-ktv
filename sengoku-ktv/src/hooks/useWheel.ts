import { useCallback, useMemo, useRef, useState } from 'react'
import type { AppSettings, HistoryRecord, WheelItem, WheelStatus } from '../types/wheel'
import { excludeLastResult, filterItems } from '../utils/filterItems'
import { pickWeightedItem } from '../utils/pickWeightedItem'
import {
  addHistoryRecord,
  clearHistoryAndLastResult,
  loadHistory,
  loadLastResultId,
  saveLastResultId,
} from '../utils/storage'
import { excludeDisabledItems, getAllWheelItems } from '../utils/wheelPool'

const SPIN_DURATION_MS = 3000

export function useWheel(
  settings: AppSettings,
  customItems: WheelItem[],
  disabledIds: string[],
) {
  const [status, setStatus] = useState<WheelStatus>('idle')
  const [result, setResult] = useState<WheelItem | null>(null)
  const [history, setHistory] = useState<HistoryRecord[]>(() => loadHistory())
  const [lastResultId, setLastResultId] = useState<string | null>(() =>
    loadLastResultId(),
  )
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allItems = useMemo(
    () => getAllWheelItems(customItems),
    [customItems],
  )

  const historyIds = useMemo(() => history.map((record) => record.id), [history])

  const candidates = useMemo(() => {
    const modeFiltered = filterItems(allItems, settings)
    const enabled = excludeDisabledItems(modeFiltered, disabledIds)
    return excludeLastResult(enabled, lastResultId)
  }, [allItems, settings, disabledIds, lastResultId])

  const spin = useCallback(() => {
    if (status === 'spinning') return

    const picked = pickWeightedItem(candidates, historyIds)
    if (!picked) return

    setStatus('spinning')
    setResult(null)

    if (spinTimerRef.current) clearTimeout(spinTimerRef.current)

    spinTimerRef.current = setTimeout(() => {
      const record: HistoryRecord = {
        id: picked.id,
        title: picked.title,
        description: picked.description,
        category: picked.category,
        createdAt: new Date().toISOString(),
      }

      saveLastResultId(picked.id)
      const nextHistory = addHistoryRecord(record)

      setLastResultId(picked.id)
      setResult(picked)
      setHistory(nextHistory)
      setStatus('result')
    }, SPIN_DURATION_MS)
  }, [candidates, historyIds, status])

  const clearHistory = useCallback(() => {
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current)
    clearHistoryAndLastResult()
    setHistory([])
    setLastResultId(null)
    setResult(null)
    setStatus('idle')
  }, [])

  return {
    status,
    result,
    history,
    candidates,
    allItems,
    spin,
    clearHistory,
    spinDurationMs: SPIN_DURATION_MS,
  }
}
