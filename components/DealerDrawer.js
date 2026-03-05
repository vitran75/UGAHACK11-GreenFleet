'use client'

import { computeDaysToFull, computeRiskLevel, getRiskColor } from '@/lib/fleet-utils'
import Sparkline from './Sparkline'

export default function DealerDrawer({
  dealer,
  batteryHistory,
  open,
  onClose,
  onSchedulePickup,
  onEdit,
}) {
  if (!dealer) return null

  const daysToFull = computeDaysToFull(dealer)
  const risk = computeRiskLevel(dealer)
  const riskColor = getRiskColor(risk)
  const pct = dealer.maxCapacity
    ? Math.round((dealer.currentBatteryCount / dealer.maxCapacity) * 100)
    : 0

  let anomaly = false
  let confidence = 0; // Default confidence

  if (batteryHistory && batteryHistory.length > 0) {
    const recentHistory = (batteryHistory || [])
      .sort((a, b) => new Date(b.date || b.recorded_date) - new Date(a.date || a.recorded_date))
      .slice(0, 4) // need 4 points to get 3 deltas

    if (recentHistory.length >= 2 && dealer.fillRate > 0) {
      const newest = recentHistory[0]?.count ?? recentHistory[0]?.battery_count ?? 0
      const oldest = recentHistory[Math.min(3, recentHistory.length - 1)]?.count ?? recentHistory[Math.min(3, recentHistory.length - 1)]?.battery_count ?? 0
      const daySpan = Math.min(3, recentHistory.length - 1)
      const recentRate = (newest - oldest) / daySpan
      anomaly = recentRate > dealer.fillRate * 2
    }

    // Confidence based on data availability
    confidence = batteryHistory.length >= 7 ? 92 : batteryHistory.length >= 3 ? 78 : 60
  }

  // Map history for sparkline
  const sparkData = (batteryHistory || []).map((h) => ({
    date: h.recorded_date || h.date,
    count: h.battery_count ?? h.count,
  }))

  return (
    <div className={`dealer-drawer ${open ? 'open' : ''}`}>
      <div className="drawer-header">
        <h3 className="drawer-title">{dealer.name}</h3>
        <button className="drawer-close" onClick={onClose}>&times;</button>
      </div>
      <div className="drawer-body">
        <div className="drawer-badges">
          <span className={`risk-badge risk-${risk}`}>
            {risk === 'high' ? 'High Risk' : risk === 'medium' ? 'Medium Risk' : 'Low Risk'}
          </span>
          {anomaly && <span className="anomaly-badge">Anomaly detected</span>}
        </div>

        <div className="drawer-days-block">
          <span className="drawer-days-number" style={{ color: riskColor }}>
            {daysToFull === Infinity ? '--' : Math.round(daysToFull)}
          </span>
          <span className="drawer-days-label">days until full</span>
          <span className="drawer-confidence">{confidence}% confidence</span>
        </div>

        {sparkData.length > 0 && (
          <div className="drawer-sparkline">
            <span className="drawer-section-label">Battery Trend (14d + forecast)</span>
            <Sparkline
              data={sparkData}
              maxCapacity={dealer.maxCapacity}
              fillRate={dealer.fillRate}
              forecastDays={7}
            />
          </div>
        )}

        <div className="drawer-stats">
          <div className="drawer-stat-row">
            <span className="drawer-stat-label">Current Batteries</span>
            <span className="drawer-stat-value">{dealer.currentBatteryCount}</span>
          </div>
          <div className="drawer-stat-row">
            <span className="drawer-stat-label">Max Capacity</span>
            <span className="drawer-stat-value">{dealer.maxCapacity}</span>
          </div>
          <div className="drawer-stat-row">
            <span className="drawer-stat-label">Fill Rate</span>
            <span className="drawer-stat-value">{dealer.fillRate}/day</span>
          </div>
          <div className="drawer-capacity-bar">
            <div
              className="drawer-capacity-bar-fill"
              style={{ width: `${pct}%`, background: riskColor }}
            />
          </div>
          <span className="drawer-stat-pct" style={{ color: riskColor }}>{pct}% full</span>
        </div>

        <div className="drawer-location">
          <span className="drawer-section-label">Location</span>
          <p className="drawer-address">{dealer.address}</p>
          <p className="drawer-city">{dealer.city}, {dealer.state}</p>
          <p className="drawer-coords">{dealer.lat?.toFixed(4)}, {dealer.lng?.toFixed(4)}</p>
        </div>

        <div className="drawer-actions">
          <button className="btn btn-primary" onClick={() => onSchedulePickup(dealer)}>
            Schedule Pickup
          </button>
          <button className="btn btn-secondary" onClick={() => onEdit(dealer)}>
            Edit Location
          </button>
        </div>
      </div>
    </div>
  )
}
