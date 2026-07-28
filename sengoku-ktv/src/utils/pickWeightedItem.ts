import type { WheelItem } from '../types/wheel'

const RECENCY_PENALTY = [0.15, 0.25, 0.35, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75]

export function getEffectiveWeight(item: WheelItem, historyIds: string[]): number {
  const index = historyIds.indexOf(item.id)
  if (index === -1) return item.weight

  const multiplier = RECENCY_PENALTY[Math.min(index, RECENCY_PENALTY.length - 1)]
  return item.weight * multiplier
}

export function pickWeightedItem(
  items: WheelItem[],
  historyIds: string[] = [],
): WheelItem | null {
  if (items.length === 0) return null

  const weights = items.map((item) => getEffectiveWeight(item, historyIds))
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  if (totalWeight <= 0) return items[0]

  let random = Math.random() * totalWeight

  for (let i = 0; i < items.length; i++) {
    random -= weights[i]
    if (random <= 0) return items[i]
  }

  return items[items.length - 1]
}
