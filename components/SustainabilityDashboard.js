'use client'

import { useEffect, useRef, useState } from 'react'
import { getBatteryHistory, getMockLocations, getTotalBatteriesRecycled, getSimulatedDay, subscribeToMockData } from '@/lib/mock-data'
import { computeDaysToFull, computeRiskLevel } from '@/lib/fleet-utils'
import Link from 'next/link'
import ImpactTrendChart from '@/components/ImpactTrendChart'

const CO2_SAVED_PER_BATTERY_KG = 15
const MATERIAL_RECOVERED_PER_BATTERY_KG = 10
const WATER_SAVED_PER_BATTERY_L = 20

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

export default function SustainabilityDashboard() {
  const [snapshot, setSnapshot] = useState(() => ({
    dealers: [],
    centers: [],
    totalRecycled: 0,
    history: [],
    simDay: 0,
  }))

  useEffect(() => {
    const update = () => {
      const all = getMockLocations()
      setSnapshot({
        dealers: all.filter((d) => d.type === 'dealership'),
        centers: all.filter((d) => d.type === 'zero-waste'),
        totalRecycled: getTotalBatteriesRecycled(),
        history: getBatteryHistory(),
        simDay: getSimulatedDay(),
      })
    }

    update()
    const unsubscribe = subscribeToMockData(update)
    return () => unsubscribe()
  }, [])

  const { dealers, centers, totalRecycled, history, simDay } = snapshot
  const pickupsSuggested = dealers.filter((d) => computeDaysToFull(d) <= 7).length
  const highRisk = dealers.filter((d) => computeRiskLevel(d) === 'high').length
  const mediumRisk = dealers.filter((d) => computeRiskLevel(d) === 'medium').length
  const totalBatteriesInField = dealers.reduce((sum, d) => sum + (d.currentBatteryCount || 0), 0)
  const totalCapacity = dealers.reduce((sum, d) => sum + (d.maxCapacity || 0), 0)
  const utilizationPct = totalCapacity ? (totalBatteriesInField / totalCapacity) * 100 : 0

  const daysToFullList = dealers
    .map((d) => computeDaysToFull(d))
    .filter((d) => Number.isFinite(d))
  const avgDaysToFull = daysToFullList.length
    ? daysToFullList.reduce((sum, v) => sum + v, 0) / daysToFullList.length
    : 0

  const co2SavedKg = totalRecycled * CO2_SAVED_PER_BATTERY_KG
  const materialRecoveredKg = totalRecycled * MATERIAL_RECOVERED_PER_BATTERY_KG
  const waterSavedL = totalRecycled * WATER_SAVED_PER_BATTERY_L
  const estimatedPickupUrgencyScore = Math.round(
    (highRisk * 2 + mediumRisk * 1) * 10
  )

  const urgentDealers = [...dealers]
    .map((d) => ({ ...d, days: computeDaysToFull(d) }))
    .filter((d) => Number.isFinite(d.days))
    .sort((a, b) => a.days - b.days)
    .slice(0, 5)

  const [chatMessages, setChatMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  function gatherFleetContext() {
    return {
      summary: {
        totalDealerships: dealers.length,
        totalRecycled,
        batteriesInField: totalBatteriesInField,
        co2AvoidedKg: Math.round(co2SavedKg),
        waterSavedL: Math.round(waterSavedL),
        materialRecoveredKg: Math.round(materialRecoveredKg),
      },
      dealerships: dealers.map((d) => ({
        name: d.name,
        city: d.city,
        state: d.state,
        currentBatteryCount: d.currentBatteryCount,
        maxCapacity: d.maxCapacity,
        fillRate: d.fillRate,
        daysToFull: parseFloat(computeDaysToFull(d).toFixed(1)),
        riskLevel: computeRiskLevel(d),
        utilizationPct: parseFloat(((d.currentBatteryCount / d.maxCapacity) * 100).toFixed(1)),
      })),
      recyclingCenters: centers.map((c) => ({
        name: c.name,
        city: c.city,
        state: c.state,
      })),
    }
  }

  async function sendMessage(messageText) {
    const text = messageText || inputValue.trim()
    if (!text || isLoading) return

    setChatMessages((prev) => [...prev, { role: 'user', content: text }])
    setInputValue('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, fleetContext: gatherFleetContext() }),
      })
      const data = await res.json()
      if (res.ok) {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.error || 'Something went wrong.' }])
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="impact-dashboard-v2">
      <header className="impact-header">
        <div>
          <p className="impact-kicker">Sustainability Overview</p>
          <h1>Impact Control Center</h1>
        </div>
      </header>

      <section className="impact-kpis-v2">
        <div className="impact-kpi-card">
          <span className="impact-kpi-label">Batteries Recycled</span>
          <span className="impact-kpi-value">{formatNumber(totalRecycled)}</span>
          <span className="impact-kpi-sub">Est. CO₂ avoided: {formatNumber(Math.round(co2SavedKg))} kg</span>
        </div>
        <div className="impact-kpi-card">
          <span className="impact-kpi-label">Pickups Suggested (7d)</span>
          <span className="impact-kpi-value">{formatNumber(pickupsSuggested)}</span>
          <span className="impact-kpi-sub">Urgency score: {formatNumber(estimatedPickupUrgencyScore)}</span>
        </div>
        <div className="impact-kpi-card">
          <span className="impact-kpi-label">Batteries in Field</span>
          <span className="impact-kpi-value">{formatNumber(totalBatteriesInField)}</span>
          <span className="impact-kpi-sub">Utilization: {utilizationPct.toFixed(1)}%</span>
        </div>
        <div className="impact-kpi-card">
          <span className="impact-kpi-label">Water Saved (L)</span>
          <span className="impact-kpi-value">{formatNumber(Math.round(waterSavedL))}</span>
          <span className="impact-kpi-sub">Material recovered: {formatNumber(Math.round(materialRecoveredKg))} kg</span>
        </div>
      </section>

      <section className="impact-layout">
        <div className="impact-main">
          <div className="impact-panel impact-panel-chart">
          <ImpactTrendChart dealers={dealers} history={history} simDay={simDay} />
          </div>
          <div className="impact-panel">
            <div className="impact-panel-header">
              <h2>Operational Pulse</h2>
              <span className="impact-pill">Live</span>
            </div>
            <div className="impact-metrics-grid">
              <div>
                <p>Avg. days to full</p>
                <strong>{avgDaysToFull ? avgDaysToFull.toFixed(1) : '--'} days</strong>
              </div>
              <div>
                <p>Dealers at risk</p>
                <strong>{formatNumber(highRisk)}</strong>
                <span>Medium: {formatNumber(mediumRisk)}</span>
              </div>
              <div>
                <p>Active centers</p>
                <strong>{formatNumber(centers.length)}</strong>
              </div>
              <div>
                <p>Recovered material</p>
                <strong>{formatNumber(Math.round(materialRecoveredKg))} kg</strong>
              </div>
            </div>
          </div>
        </div>

        <aside className="impact-side">
          <div className="impact-panel">
            <div className="impact-panel-header">
              <h2>Priority Pickups</h2>
              <Link href="/nearby" className="impact-link">See all</Link>
            </div>
            <ul className="impact-task-list">
              {urgentDealers.map((dealer) => (
                <li key={dealer.id}>
                  <div>
                    <strong>{dealer.name}</strong>
                    <span>{dealer.city}, {dealer.state}</span>
                  </div>
                  <div className="impact-task-meta">
                    <span>{Math.max(0, Math.round(dealer.days))}d to full</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="impact-panel impact-assistant">
            <div className="impact-assistant-header">
              <h2>GreenFleet AI</h2>
              <span className="impact-pill">Live</span>
            </div>
            <div className="impact-assistant-chat">
              {chatMessages.length === 0 && (
                <div className="chat-empty">Ask me anything about your fleet, routes, or sustainability impact.</div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className="chat-message">
                  <span className={`chat-role ${msg.role === 'user' ? 'chat-role-user' : 'chat-role-assistant'}`}>
                    {msg.role === 'user' ? 'You' : 'GreenFleet AI'}
                  </span>
                  {msg.content}
                </div>
              ))}
              {isLoading && <div className="chat-loading">Thinking...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-inline-actions">
              <button disabled={isLoading} onClick={() => sendMessage('Generate a sustainability impact report summarizing recycled batteries, CO₂ avoided, water saved, and material recovered.')}>Generate report</button>
              <button disabled={isLoading} onClick={() => sendMessage('Tell me a fun and surprising fact about battery recycling or sustainability.')}>Fun fact</button>
            </div>
            <div className="chat-inline-input">
              <input
                placeholder="Ask something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                disabled={isLoading}
              />
              <button onClick={() => sendMessage()} disabled={isLoading}>Send</button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
