'use client'

export default function Sparkline({ data, maxCapacity, fillRate, forecastDays = 7 }) {
  if (!data || data.length === 0) return null

  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
  const totalDays = sorted.length + forecastDays
  const W = 280
  const H = 80
  const padX = 4
  const padY = 8
  const usableW = W - padX * 2
  const usableH = H - padY * 2
  const maxVal = Math.max(maxCapacity || 100, ...sorted.map((d) => d.count)) * 1.05

  const xScale = (i) => padX + (i / (totalDays - 1)) * usableW
  const yScale = (v) => padY + usableH - (v / maxVal) * usableH

  // Historical polyline
  const histPoints = sorted.map((d, i) => `${xScale(i)},${yScale(d.count)}`).join(' ')

  // Forecast polyline
  const lastCount = sorted[sorted.length - 1]?.count || 0
  const rate = fillRate || 0
  const forecastPts = []
  forecastPts.push(`${xScale(sorted.length - 1)},${yScale(lastCount)}`)
  for (let i = 1; i <= forecastDays; i++) {
    const projected = Math.min(lastCount + rate * i, maxCapacity || Infinity)
    forecastPts.push(`${xScale(sorted.length - 1 + i)},${yScale(projected)}`)
  }
  const forecastLine = forecastPts.join(' ')

  // Max capacity line
  const capY = yScale(maxCapacity || maxVal)

  return (
    <svg className="sparkline-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {/* Capacity threshold */}
      <line
        x1={padX} y1={capY} x2={W - padX} y2={capY}
        stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"
      />
      {/* Historical data */}
      <polyline
        fill="none" stroke="#3b82f6" strokeWidth="2"
        points={histPoints}
      />
      {/* Forecast */}
      <polyline
        fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,3"
        points={forecastLine}
      />
    </svg>
  )
}
