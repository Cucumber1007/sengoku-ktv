export type WheelCategory =
  | 'control'
  | 'singing_reward'
  | 'singing_penalty'
  | 'vote'
  | 'drink'
  | 'food'
  | 'neutral'

export interface WheelItemModes {
  alcohol: boolean
  food: boolean
  brutal: boolean
  interaction: boolean
}

export interface WheelItem {
  id: string
  title: string
  description: string
  category: WheelCategory
  tags: string[]
  modes: WheelItemModes
  weight: number
}

export interface AppSettings {
  alcohol: boolean
  food: boolean
  brutal: boolean
  interaction: boolean
}

export interface HistoryRecord {
  id: string
  title: string
  description: string
  category: string
  createdAt: string
}

export type WheelStatus = 'idle' | 'spinning' | 'result'

export const DEFAULT_SETTINGS: AppSettings = {
  alcohol: false,
  food: false,
  brutal: false,
  interaction: false,
}

export const CATEGORY_LABELS: Record<WheelCategory, string> = {
  control: '控場',
  singing_reward: '唱歌福利',
  singing_penalty: '唱歌懲罰',
  vote: '投票',
  drink: '酒水',
  food: '食物',
  neutral: '一般',
}
