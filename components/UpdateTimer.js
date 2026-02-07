'use client'

import { useEffect, useState } from 'react'
import { getNextUpdateAt, subscribeToMockData } from '@/lib/mock-data'

export default function UpdateTimer() {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, getNextUpdateAt() - Date.now()))

  useEffect(() => {
    const updateRemaining = () => {
      setRemainingMs(Math.max(0, getNextUpdateAt() - Date.now()))
    }

    updateRemaining()
    const unsubscribe = subscribeToMockData(updateRemaining)
    const id = setInterval(updateRemaining, 250)

    return () => {
      unsubscribe()
      clearInterval(id)
    }
  }, [])

  const totalSeconds = Math.ceil(remainingMs / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = String(totalSeconds % 60).padStart(2, '0')

  return (
    <div className="update-timer" aria-live="polite">
      Next update: {mins}:{secs}
    </div>
  )
}
