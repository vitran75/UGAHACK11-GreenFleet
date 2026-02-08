'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import DashboardLayout from '@/components/DashboardLayout'
import DealershipModal from '@/components/DealershipModal'
import FleetSearchBar from '@/components/FleetSearchBar'
import FleetFilterChips from '@/components/FleetFilterChips'
import DealerDrawer from '@/components/DealerDrawer'
import { getMockLocations, subscribeToMockData, simulatePickup, addLocation, updateLocation } from '@/lib/mock-data'
import {
  computeDaysToFull,
  computeRiskLevel,
  getRiskColor,
  filterDealerships,
} from '@/lib/fleet-utils'

const NearbyMap = dynamic(() => import('@/components/NearbyMap'), { ssr: false })

function NearbyContent() {
  const [allLocations, setAllLocations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDealership, setEditingDealership] = useState(null)
  const [batteryHistory, setBatteryHistory] = useState([])

  // Filters
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    risk: null,
    daysFilter: null,
    pickupDueSoon: null,
  })

  const dealerships = allLocations.filter((d) => d.type && d.type.includes('dealership'))
  const recyclingCenters = allLocations.filter((d) => d.type && d.type.includes('recycling'))
  const zeroWasteLocations = allLocations.filter((d) => d.type === 'zero-waste')
  const filteredDealers = filterDealerships(dealerships, { ...filters, search })

  const selectedDealer = allLocations.find((d) => d.id === selectedId)
  const drawerOpen = !!selectedDealer && selectedDealer.type === 'dealership'

  useEffect(() => {
    const updateLocations = () => {
      setAllLocations(getMockLocations());
    };
    updateLocations(); // Initial load
    const unsubscribe = subscribeToMockData(updateLocations);
    return () => unsubscribe();
  }, [])

  // We are not simulating battery history with mock data for now
  // useEffect(() => {
  //   if (selectedId && selectedDealer?.type === 'dealership') {
  //     fetchHistory(selectedId)
  //   }
  // }, [selectedId, selectedDealer?.type, fetchHistory])

  const handleSelect = (id) => {
    setSelectedId(selectedId === id ? null : id)
  }

  const handleAdd = () => {
    setEditingDealership(null)
    setModalOpen(true)
  }

  const handleEdit = (d) => {
    setEditingDealership(d)
    setModalOpen(true)
  }

  const handleSave = async (formData) => {
    if (editingDealership) {
      updateLocation(editingDealership.id, formData)
    } else {
      addLocation(formData)
    }
    setModalOpen(false)
  }

  const handleSchedulePickup = async (dealer) => {
    simulatePickup(dealer.id);
    alert(`Pickup simulated for ${dealer.name}`)
  }

  const handleFilterToggle = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className={`fleet-container ${drawerOpen ? 'drawer-open' : ''}`}>
      <div className="fleet-panel">
        <div className="fleet-panel-header">
          <h2 className="fleet-panel-title">Fleet Overview</h2>
          <button className="btn-add-location" onClick={handleAdd}>+ Add Location</button>
        </div>
        <FleetSearchBar value={search} onChange={setSearch} />
        <FleetFilterChips filters={filters} onToggle={handleFilterToggle} />
        <div className="fleet-list">
          {filteredDealers.map((d) => {
            const risk = computeRiskLevel(d)
            const riskColor = getRiskColor(risk)
            const days = computeDaysToFull(d)
            const pct = d.maxCapacity
              ? Math.round((d.currentBatteryCount / d.maxCapacity) * 100)
              : 0
            return (
              <div
                key={d.id}
                className={`fleet-card ${selectedId === d.id ? 'selected' : ''}`}
                onClick={() => handleSelect(d.id)}
              >
                <div className="fleet-card-top">
                  <span className="fleet-risk-dot" style={{ background: riskColor }} />
                  <span className="fleet-card-name">{d.name}</span>
                </div>
                <span className="fleet-card-days" style={{ color: riskColor }}>
                  {days === Infinity ? '--' : Math.round(days)} days to full
                </span>
                <div className="fleet-card-bar">
                  <div
                    className="fleet-card-bar-fill"
                    style={{ width: `${pct}%`, background: riskColor }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="fleet-map-wrapper">
        <NearbyMap
          dealerships={filteredDealers}
          recyclingCenters={recyclingCenters}
          zeroWasteLocations={zeroWasteLocations}
          selectedId={selectedId}
          onSelectDealership={handleSelect}
        />
      </div>
      <DealerDrawer
        dealer={selectedDealer}
        batteryHistory={batteryHistory}
        open={drawerOpen}
        onClose={() => setSelectedId(null)}
        onSchedulePickup={handleSchedulePickup}
        onEdit={handleEdit}
      />
      <DealershipModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingDealership}
      />
    </div>
  )
}

export default function NearbyPage() {
  return (
    <DashboardLayout>
      <NearbyContent />
    </DashboardLayout>
  )
}
