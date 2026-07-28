import { wheelItems } from '../data/wheelItems'
import type { AppSettings, WheelItem } from '../types/wheel'
import { filterItems } from './filterItems'

export function isCustomItem(item: WheelItem): boolean {
  return item.id.startsWith('custom-')
}

export function mergeWheelItems(customItems: WheelItem[]): WheelItem[] {
  return [...wheelItems, ...customItems]
}

export function createCustomItem(
  title: string,
  description: string,
  category: WheelItem['category'],
): WheelItem {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    description: description.trim(),
    category,
    tags: ['自訂'],
    modes: {
      alcohol: false,
      food: false,
      brutal: false,
      interaction: false,
    },
    weight: 1,
  }
}

export function excludeDisabledItems(
  items: WheelItem[],
  disabledIds: string[],
): WheelItem[] {
  if (disabledIds.length === 0) return items
  const disabled = new Set(disabledIds)
  return items.filter((item) => !disabled.has(item.id))
}

export function countEnabledItems(
  allItems: WheelItem[],
  settings: AppSettings,
  disabledIds: string[],
): { enabled: number; total: number } {
  const active = excludeDisabledItems(filterItems(allItems, settings), disabledIds)
  return { enabled: active.length, total: allItems.length }
}

export function getAllWheelItems(customItems: WheelItem[]): WheelItem[] {
  return mergeWheelItems(customItems)
}
