import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw) as T
    } catch {
      // ignore
    }
    return initialValue
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    },
    [key],
  )

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key || event.newValue === null) return
      try {
        setStoredValue(JSON.parse(event.newValue) as T)
      } catch {
        // ignore
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [storedValue, setValue] as const
}
