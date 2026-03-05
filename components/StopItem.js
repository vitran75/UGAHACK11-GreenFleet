'use client'

import { computeDaysToFull } from '@/lib/fleet-utils'

export default function StopItem({ stop }) {
  const days = computeDaysToFull(stop.dealer)

  return (
    <div className="stop-item">
      <span className="stop-number">{stop.order}</span>
      <div className="stop-info">
        <span className="stop-name">{stop.dealer.name}</span>
        <div className="stop-meta">
          <span>{stop.dealer.currentBatteryCount} batteries</span>
          <span>{days === Infinity ? '--' : Math.round(days)}d to full</span>
          <span>{Math.round(stop.distance)} mi</span>
        </div>
      </div>
    </div>
  )
}
