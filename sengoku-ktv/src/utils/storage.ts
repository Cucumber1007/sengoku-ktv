import type { AppSettings, HistoryRecord, WheelItem } from '../types/wheel'
import { DEFAULT_SETTINGS } from '../types/wheel'

const KEYS = {
  settings: 'sengoku-settings',
  history: 'sengoku-history',
  lastResult: 'sengoku-last-result',
  customItems: 'sengoku-custom-items',
  disabledIds: 'sengoku-disabled-ids',
} as const

const MAX_HISTORY = 10

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadSettings(): AppSettings {
  return readJson<AppSettings>(KEYS.settings, DEFAULT_SETTINGS)
}

export function saveSettings(settings: AppSettings): void {
  writeJson(KEYS.settings, settings)
}

export function loadHistory(): HistoryRecord[] {
  return readJson<HistoryRecord[]>(KEYS.history, [])
}

export function addHistoryRecord(record: HistoryRecord): HistoryRecord[] {
  const history = loadHistory()
  const next = [record, ...history].slice(0, MAX_HISTORY)
  writeJson(KEYS.history, next)
  return next
}

export function loadLastResultId(): string | null {
  return readJson<string | null>(KEYS.lastResult, null)
}

export function saveLastResultId(id: string): void {
  writeJson(KEYS.lastResult, id)
}

export function clearHistoryAndLastResult(): void {
  writeJson(KEYS.history, [])
  writeJson(KEYS.lastResult, null)
}

export function loadCustomItems(): WheelItem[] {
  return readJson<WheelItem[]>(KEYS.customItems, [])
}

export function saveCustomItems(items: WheelItem[]): void {
  writeJson(KEYS.customItems, items)
}

export function loadDisabledIds(): string[] {
  return readJson<string[]>(KEYS.disabledIds, [])
}

export function saveDisabledIds(ids: string[]): void {
  writeJson(KEYS.disabledIds, ids)
}
