import type { HistoryRecord } from '../types/wheel'

interface HistoryListProps {
  records: HistoryRecord[]
  onClear: () => void
}

function formatTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistoryList({ records, onClear }: HistoryListProps) {
  const handleClear = () => {
    if (records.length === 0) return
    if (window.confirm('確定清除歷史紀錄？所有命運出現機率將恢復初始。')) {
      onClear()
    }
  }

  return (
    <section className="history" aria-label="歷史紀錄" data-guide="history">
      <div className="history__header">
        <h2 className="section-title">歷史紀錄</h2>
        <button
          type="button"
          className="history__clear"
          onClick={handleClear}
          disabled={records.length === 0}
        >
          清除紀錄
        </button>
      </div>

      {records.length === 0 ? (
        <p className="history__empty">尚無紀錄，點擊轉盤開始合戰！</p>
      ) : (
        <ul className="history__list">
          {records.map((record) => (
            <li key={`${record.id}-${record.createdAt}`} className="history__item">
              <div className="history__item-header">
                <span className="history__title">{record.title}</span>
                <time className="history__time" dateTime={record.createdAt}>
                  {formatTime(record.createdAt)}
                </time>
              </div>
              <p className="history__description">{record.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
