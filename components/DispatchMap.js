'use client'

import { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function DispatchMap({ routes, selectedRouteId, onSelectRoute }) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const routeLayersRef = useRef(new Map())

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

    routeLayersRef.current.forEach((layerGroup) => {
      layerGroup.markers.forEach((m) => m.remove())
      layerGroup.polyline.remove()
    })
    routeLayersRef.current.clear()

    if (!routes || !routes.length) return

    routes.forEach((route) => {
      const markers = []

      // Recycling center marker
      const centerIcon = L.divIcon({
        className: 'fleet-marker',
        html: `<div class="fleet-marker-center" style="border-color:${route.color}">&#9851;</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const centerMarker = L.marker([route.center.lat, route.center.lng], { icon: centerIcon })
        .addTo(map)
        .bindPopup(`<strong>${route.center.name}</strong><br/>Recycling Center`)
      markers.push(centerMarker)

      // Build polyline coords: center -> stops -> center
      const coords = [[route.center.lat, route.center.lng]]
      route.stops.forEach((stop) => {
        coords.push([stop.dealer.lat, stop.dealer.lng])

        // Stop marker with number
        const stopIcon = L.divIcon({
          className: 'fleet-marker',
          html: `<div class="fleet-marker-stop" style="background:${route.color}">${stop.order}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        const stopMarker = L.marker([stop.dealer.lat, stop.dealer.lng], { icon: stopIcon })
          .addTo(map)
          .bindPopup(
            `<strong>${stop.dealer.name}</strong><br/>${stop.dealer.currentBatteryCount} batteries<br/>${Math.round(stop.distance)} mi from prev`
          )
        markers.push(stopMarker)
      })
      coords.push([route.center.lat, route.center.lng])

      const polyline = L.polyline(coords, {
        color: route.color,
        weight: 3,
        opacity: 1,
      }).addTo(map)

      polyline.on('click', () => onSelectRoute?.(route.id))

      routeLayersRef.current.set(route.id, { markers, polyline })
    })

    // Fit bounds
    const allCoords = routes.flatMap((r) => [
      [r.center.lat, r.center.lng],
      ...r.stops.map((s) => [s.dealer.lat, s.dealer.lng]),
    ])
    if (allCoords.length) {
      map.fitBounds(allCoords, { padding: [30, 30] })
    }
  }, [routes, onSelectRoute])

  useEffect(() => {
    routeLayersRef.current.forEach((layerGroup, id) => {
      const isSelected = id === selectedRouteId
      const opacity = selectedRouteId && !isSelected ? 0.25 : 1
      layerGroup.markers.forEach((m) => m.setOpacity(opacity))
      layerGroup.polyline.setStyle({
        weight: isSelected ? 4 : 2,
        opacity,
        dashArray: isSelected ? null : '6,4',
      })
    })

    if (!selectedRouteId) return
    const map = mapRef.current
    const group = routeLayersRef.current.get(selectedRouteId)
    if (!map || !group) return

    const bounds = group.polyline.getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12, animate: true })
    }
  }, [selectedRouteId])

  return <div ref={containerRef} className="dispatch-map-leaflet" />
}
