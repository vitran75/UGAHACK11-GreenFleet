'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import DashboardLayout from '@/components/DashboardLayout'
import RouteCard from '@/components/RouteCard'
import StopItem from '@/components/StopItem'
import { getMockLocations, subscribeToMockData } from '@/lib/mock-data'
import { planRoutes } from '@/lib/route-planner'
import { computeDaysToFull } from '@/lib/fleet-utils'

const DispatchMap = dynamic(() => import('@/components/DispatchMap'), { ssr: false })

function DispatchContent() {
  const [dealerships, setDealerships] = useState([])
  const [recyclingCenters, setRecyclingCenters] = useState([])
  const [routes, setRoutes] = useState([])
  const [selectedRouteId, setSelectedRouteId] = useState(null)

  useEffect(() => {
    const updateLocations = () => {
      const allMockLocations = getMockLocations();
      setDealerships(allMockLocations.filter((d) => d.type === 'dealership'));
      setRecyclingCenters(allMockLocations.filter((d) => d.type === 'zero-waste'));
    };

    updateLocations(); // Initial load
    const unsubscribe = subscribeToMockData(updateLocations);
    return () => unsubscribe();
  }, [])

  useEffect(() => {
    if (dealerships.length && recyclingCenters.length) {
      const planned = planRoutes(dealerships, recyclingCenters, {
        maxStops: 8,
        maxBatteries: 900,
        maxMiles: 250,
        urgencyDays: 7,
      })
      setRoutes(planned)
      if (planned.length) setSelectedRouteId(planned[0].id)
    }
  }, [dealerships, recyclingCenters])

  const selectedRoute = routes.find((r) => r.id === selectedRouteId)
  const totalPickups = routes.reduce((sum, r) => sum + r.stops.length, 0)
  const totalBatteries = routes.reduce((sum, r) => sum + r.totalBatteries, 0)
  const totalMiles = routes.reduce((sum, r) => sum + r.totalMiles, 0)

  return (
    <div className="dispatch-container">
      <div className="dispatch-top-bar">
        <h2 className="dispatch-title">Route Dispatch</h2>
        <div className="dispatch-summary">
          <span className="dispatch-stat">{totalPickups} pickups suggested in next 7 days</span>
          <span className="dispatch-stat">{totalBatteries} total batteries</span>
          <span className="dispatch-stat">{routes.length} routes</span>
          <span className="dispatch-stat">{totalMiles} total miles</span>
        </div>
      </div>
      <div className="dispatch-body">
        <div className="dispatch-panel">
          <h3 className="dispatch-panel-title">Routes</h3>
          {routes.length === 0 && (
            <p className="dispatch-empty">No pickups needed in the next 7 days.</p>
          )}
          {routes.map((r) => (
            <RouteCard
              key={r.id}
              route={r}
              selected={r.id === selectedRouteId}
              onClick={setSelectedRouteId}
            />
          ))}
        </div>
        <div className="dispatch-map">
          <DispatchMap
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
          />
        </div>
        <div className="dispatch-stops">
          <h3 className="dispatch-panel-title">
            {selectedRoute ? `${selectedRoute.name} Stops` : 'Select a route'}
          </h3>
          {selectedRoute && (
            <>
              <p className="dispatch-route-dest">
                Destination: {selectedRoute.center.name}
              </p>
              {selectedRoute.stops.map((stop) => (
                <StopItem key={stop.dealer.id} stop={stop} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DispatchPage() {
  return (
    <DashboardLayout>
      <DispatchContent />
    </DashboardLayout>
  )
}
