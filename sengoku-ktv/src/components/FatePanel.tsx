import { useEffect, useId, useRef, useState } from 'react'
import type { AppSettings, WheelCategory, WheelItem } from '../types/wheel'
import { CATEGORY_LABELS } from '../types/wheel'
import { countEnabledItems, createCustomItem, isCustomItem } from '../utils/wheelPool'

interface FatePanelProps {
  settings: AppSettings
  allItems: WheelItem[]
  customItems: WheelItem[]
  disabledIds: string[]
  onCustomItemsChange: (items: WheelItem[]) => void
  onDisabledIdsChange: (ids: string[]) => void
  forceOpen?: boolean
}

const CATEGORY_OPTIONS: WheelCategory[] = [
  'control',
  'singing_penalty',
  'vote',
  'drink',
  'food',
  'neutral',
]

export function FatePanel({
  settings,
  allItems,
  customItems,
  disabledIds,
  onCustomItemsChange,
  onDisabledIdsChange,
  forceOpen = false,
}: FatePanelProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<WheelCategory>('neutral')
  const panelRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const isOpen = forceOpen || open

  const { enabled, total } = countEnabledItems(allItems, settings, disabledIds)
  const disabledSet = new Set(disabledIds)

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

  const toggleItem = (id: string) => {
    if (disabledSet.has(id)) {
      onDisabledIdsChange(disabledIds.filter((itemId) => itemId !== id))
      return
    }
    onDisabledIdsChange([...disabledIds, id])
  }

  const handleAddCustom = () => {
    if (!title.trim() || !description.trim()) return

    const item = createCustomItem(title, description, category)
    onCustomItemsChange([...customItems, item])
    setTitle('')
    setDescription('')
    setCategory('neutral')
  }

  const handleDeleteCustom = (id: string) => {
    onCustomItemsChange(customItems.filter((item) => item.id !== id))
    onDisabledIdsChange(disabledIds.filter((itemId) => itemId !== id))
  }

  return (
    <section className="mode-panel fate-panel" aria-label="命運管理" ref={panelRef} data-guide="fate">
      <button
        type="button"
        className="mode-panel__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={listId}
      >
        <span className="mode-panel__trigger-label">命運管理</span>
        <span className="mode-panel__summary">
          {enabled}/{total} 啟用
        </span>
        <span className={`mode-panel__chevron ${isOpen ? 'mode-panel__chevron--open' : ''}`}>
          ▾
        </span>
      </button>

      <div
        id={listId}
        className={`mode-panel__dropdown ${isOpen ? 'mode-panel__dropdown--open' : ''}`}
        hidden={!isOpen}
      >
        <div className="fate-panel__section">
          <h3 className="fate-panel__heading">自訂命運</h3>
          <div className="fate-form">
            <input
              type="text"
              className="fate-form__input"
              placeholder="命運名稱，例如：天命在我"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={24}
            />
            <textarea
              className="fate-form__textarea"
              placeholder="效果說明，例如：下一首歌由你指定兩位開場"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
              rows={2}
            />
            <select
              className="fate-form__select"
              value={category}
              onChange={(e) => setCategory(e.target.value as WheelCategory)}
            >
              {CATEGORY_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABELS[value]}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="fate-form__submit"
              onClick={handleAddCustom}
              disabled={!title.trim() || !description.trim()}
            >
              新增自訂命運
            </button>
          </div>
        </div>

        <div className="fate-panel__section">
          <h3 className="fate-panel__heading">命運開關</h3>
          <p className="fate-panel__hint">關閉的項目不會出現在轉盤中</p>
          <ul className="fate-list">
            {allItems.map((item) => {
              const enabled = !disabledSet.has(item.id)
              const custom = isCustomItem(item)

              return (
                <li key={item.id} className="fate-list__item">
                  <label className="fate-list__toggle">
                    <input
                      type="checkbox"
                      className="mode-toggle__input"
                      checked={enabled}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className="mode-toggle__switch" aria-hidden="true" />
                    <span className="fate-list__text">
                      <span className="fate-list__title-row">
                        <span className="fate-list__title">{item.title}</span>
                        <span
                          className={`fate-list__badge ${custom ? 'fate-list__badge--custom' : ''}`}
                        >
                          {custom ? '自訂' : '預設'}
                        </span>
                      </span>
                      <span className="fate-list__desc">{item.description}</span>
                    </span>
                  </label>
                  {custom && (
                    <button
                      type="button"
                      className="fate-list__delete"
                      onClick={() => handleDeleteCustom(item.id)}
                      aria-label={`刪除 ${item.title}`}
                    >
                      刪除
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
