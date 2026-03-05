'use client'

function buildSeries(dealers, history, simDay, daysBack = 7, daysForward = 7) {
  const totalDays = daysBack + daysForward + 1
  const series = []

  const historyByDay = new Map()
  const sortedHistory = [...(history || [])].sort((a, b) => a.day - b.day)
  sortedHistory.forEach((h) => {
    historyByDay.set(h.day, h.total)
  })

  const currentTotal = dealers.reduce((sum, d) => sum + (d.currentBatteryCount || 0), 0)
  const latestHistory = sortedHistory.length ? sortedHistory[sortedHistory.length - 1].total : null

  for (let i = 0; i < totalDays; i++) {
    const dayOffset = i - daysBack
    const label =
      dayOffset === 0 ? 'Today' : dayOffset > 0 ? `+${dayOffset}d` : `${dayOffset}d`
    const dayKey = simDay + dayOffset

    let batteries = 0
    if (dayOffset <= 0) {
      if (dayOffset === 0) {
        batteries = latestHistory ?? currentTotal
      } else {
        batteries = historyByDay.get(dayKey) ?? 0
      }
    } else {
      batteries = dealers.reduce((sum, d) => {
        const fill = d.fillRate || 0
        const max = d.maxCapacity || 0
        const projected = Math.min(
          max,
          Math.max(0, (d.currentBatteryCount || 0) + fill * dayOffset)
        )
        return sum + projected
      }, 0)
    }

    series.push({ label, value: batteries })
  }

  return series
}

function formatShort(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return `${Math.round(value)}`
}

export default function ImpactTrendChart({ dealers, history, simDay }) {
  const series = buildSeries(dealers, history, simDay)
  if (!series.length) return null

  const fixedRows = 12
  const totalCapacity = dealers.reduce((sum, d) => sum + (d.maxCapacity || 0), 0)
  const rawMax = Math.max(...series.map((d) => d.value))
  const capacityStep = totalCapacity ? Math.ceil(totalCapacity / fixedRows) : Math.ceil(rawMax / fixedRows)
  const roundedStep = Math.ceil(capacityStep / 10) * 10
  const dotValue = Math.max(10, roundedStep)
  const maxValue = dotValue * fixedRows
  const midValue = Math.round(maxValue / 2)
  const lowValue = Math.round(maxValue / 4)

  return (
    <div className="impact-chart">
      <div className="impact-chart-header">
        <div>
          <h3>Projected Battery Volume</h3>
          <p>Each dot ≈ {dotValue} batteries (past 7 days vs next 7 days)</p>
        </div>
        <div className="impact-chart-metric">
          <span>Total Today</span>
          <strong>{formatShort(series[7].value)}</strong>
        </div>
      </div>
      <div className="impact-dot-chart">
        <div className="impact-dot-axis">
          <span className="impact-axis-title">Batteries</span>
          <span>{formatShort(maxValue)}</span>
          <span>{formatShort(midValue)}</span>
          <span>{formatShort(lowValue)}</span>
          <span>0</span>
        </div>
        <div className="impact-dot-stage">
          <div
            className="impact-dot-grid"
            style={{
              gridTemplateColumns: `repeat(${series.length}, minmax(0, 1fr))`,
              ['--impact-rows']: fixedRows,
            }}
          >
            {series.map((day, idx) => {
              const dots = Math.min(fixedRows, Math.ceil(day.value / dotValue))
              const xLabel =
                idx === 0 ? '-7d' : idx === 7 ? 'Today' : idx === series.length - 1 ? '+7d' : ''
              return (
                <div key={day.label} className="impact-dot-column">
                  {Array.from({ length: dots }).map((_, i) => (
                    <span key={i} className="impact-dot" />
                  ))}
                  <span className="impact-dot-value">{formatShort(day.value)}</span>
                  {xLabel && <span className="impact-dot-x">{xLabel}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
