'use client'

import { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { computeRiskLevel, getRiskColor } from '@/lib/fleet-utils'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function NearbyMap({
  dealerships,
  recyclingCenters = [],
  zeroWasteLocations = [],
  selectedId,
  onSelectDealership,
}) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const dealerMarkersRef = useRef(new Map())
  const centerMarkersRef = useRef([])

  useEffect(() => {
    if (mapRef.current) return

    const map = L.map(containerRef.current).setView([39.8283, -98.5795], 4)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear existing markers
    dealerMarkersRef.current.forEach((marker) => marker.remove())
    dealerMarkersRef.current.clear()
    centerMarkersRef.current.forEach((marker) => marker.remove())
    centerMarkersRef.current = []

    // Dealership markers (colored circles by risk)
    dealerships.forEach((d) => {
      const risk = computeRiskLevel(d)
      const color = getRiskColor(risk)
      const icon = L.divIcon({
        className: 'fleet-marker',
        html: `<div class="fleet-marker-dot" style="background:${color};border-color:${color}"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })

      const marker = L.marker([d.lat, d.lng], { icon }).addTo(map)
      marker.bindPopup(
        `<strong>${d.name}</strong><br/>${d.address}<br/>Batteries: ${d.currentBatteryCount} / ${d.maxCapacity}`
      )
      marker.on('click', () => onSelectDealership?.(d.id))
      dealerMarkersRef.current.set(d.id, marker)
    })

    // Recycling center markers (blue squares)
    recyclingCenters.forEach((c) => {
      const icon = L.divIcon({
        className: 'fleet-marker',
        html: `<div class="fleet-marker-center">&#9851;</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([c.lat, c.lng], { icon }).addTo(map)
      marker.bindPopup(`<strong>${c.name}</strong><br/>Recycling Center`)
      centerMarkersRef.current.push(marker)
    })

    // Zero-waste locations (green squares)
    zeroWasteLocations.forEach((c) => {
      const icon = L.divIcon({
        className: 'fleet-marker',
        html: `<div class="fleet-marker-zero">&#9851;</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const marker = L.marker([c.lat, c.lng], { icon }).addTo(map)
      marker.bindPopup(`<strong>${c.name}</strong><br/>Zero Waste Location`)
      centerMarkersRef.current.push(marker)
    })

    // Fit bounds
    const all = [...dealerships, ...recyclingCenters, ...zeroWasteLocations]
    if (all.length) {
      const bounds = all.map((d) => [d.lat, d.lng])
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 })
    }
  }, [dealerships, recyclingCenters, zeroWasteLocations, onSelectDealership])

  useEffect(() => {
    dealerMarkersRef.current.forEach((marker, id) => {
      const el = marker.getElement()
      const dot = el?.querySelector('.fleet-marker-dot')
      if (!dot) return
      if (id === selectedId) {
        dot.classList.add('fleet-marker-pulse')
      } else {
        dot.classList.remove('fleet-marker-pulse')
      }
    })
    if (!selectedId) {
      dealerMarkersRef.current.forEach((marker) => marker.closePopup())
      return
    }
    const selectedMarker = dealerMarkersRef.current.get(selectedId)
    if (selectedMarker) {
      selectedMarker.openPopup()
      const map = mapRef.current
      if (map) {
        const target = selectedMarker.getLatLng()
        const currentZoom = map.getZoom()
        const nextZoom = Math.max(currentZoom, 10)
        map.setView(target, nextZoom, { animate: true })
      }
    }
  }, [selectedId])

  return <div ref={containerRef} className="nearby-map-leaflet" />
}
