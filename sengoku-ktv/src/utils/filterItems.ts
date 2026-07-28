import type { AppSettings, WheelItem } from '../types/wheel'

export function filterItems(items: WheelItem[], settings: AppSettings): WheelItem[] {
  return items.filter((item) => {
    if (!settings.alcohol && item.modes.alcohol) return false
    if (!settings.food && item.modes.food) return false
    if (!settings.brutal && item.modes.brutal) return false
    if (!settings.interaction && item.modes.interaction) return false
    return true
  })
}

export function excludeLastResult(
  items: WheelItem[],
  lastResultId: string | null,
): WheelItem[] {
  if (!lastResultId || items.length <= 1) return items
  return items.filter((item) => item.id !== lastResultId)
}
