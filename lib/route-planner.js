import { computeDaysToFull, haversineDistance, findNearestCenter } from './fleet-utils'

const ROUTE_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
]

const DEFAULTS = {
  maxStops: 8,
  maxBatteries: 900,
  maxMiles: 250,
  urgencyDays: 7,
}

export function planRoutes(dealerships, recyclingCenters, opts = {}) {
  const config = { ...DEFAULTS, ...opts }

  // Filter dealerships needing pickup within configured days
  const urgent = dealerships.filter((d) => computeDaysToFull(d) <= config.urgencyDays)

  if (!urgent.length || !recyclingCenters.length) return []

  // Group by nearest recycling center
  const groups = {}
  urgent.forEach((dealer) => {
    const { center, distance } = findNearestCenter(dealer, recyclingCenters)
    if (!groups[center.id]) {
      groups[center.id] = { center, dealers: [] }
    }
    groups[center.id].dealers.push({ dealer, distToCenter: distance })
  })

  const routes = []
  let routeIndex = 0

  Object.values(groups).forEach((group) => {
    // Sort by urgency (lowest daysToFull first)
    group.dealers.sort((a, b) => computeDaysToFull(a.dealer) - computeDaysToFull(b.dealer))

    const remaining = [...group.dealers]

    while (remaining.length > 0) {
      const ordered = []
      let currentLat = group.center.lat
      let currentLng = group.center.lng
      let totalMiles = 0
      let totalBatteries = 0

      while (remaining.length > 0 && ordered.length < config.maxStops) {
        let nearestIdx = -1
        let nearestDist = Infinity

        for (let j = 0; j < remaining.length; j++) {
          const dist = haversineDistance(
            currentLat,
            currentLng,
            remaining[j].dealer.lat,
            remaining[j].dealer.lng
          )
          if (dist < nearestDist) {
            nearestDist = dist
            nearestIdx = j
          }
        }

        if (nearestIdx === -1) break

        const picked = remaining[nearestIdx]
        const projectedMiles =
          totalMiles +
          nearestDist +
          haversineDistance(picked.dealer.lat, picked.dealer.lng, group.center.lat, group.center.lng)
        const projectedBatteries = totalBatteries + (picked.dealer.currentBatteryCount || 0)

        if (
          ordered.length > 0 &&
          (projectedMiles > config.maxMiles || projectedBatteries > config.maxBatteries)
        ) {
          break
        }

        remaining.splice(nearestIdx, 1)
        ordered.push({
          dealer: picked.dealer,
          order: ordered.length + 1,
          distance: nearestDist,
        })
        totalMiles += nearestDist
        totalBatteries = projectedBatteries
        currentLat = picked.dealer.lat
        currentLng = picked.dealer.lng
      }

      if (!ordered.length) {
        const picked = remaining.shift()
        if (picked) {
          ordered.push({
            dealer: picked.dealer,
            order: 1,
            distance: haversineDistance(
              group.center.lat,
              group.center.lng,
              picked.dealer.lat,
              picked.dealer.lng
            ),
          })
        }
      }

      const returnDist = ordered.length
        ? haversineDistance(currentLat, currentLng, group.center.lat, group.center.lng)
        : 0
      const totalMilesWithReturn = totalMiles + returnDist

      if (ordered.length) {
        routes.push({
          id: `route-${routeIndex + 1}`,
          name: `Route ${routeIndex + 1}`,
          center: group.center,
          stops: ordered,
          totalMiles: Math.round(totalMilesWithReturn),
          totalBatteries: ordered.reduce((sum, s) => sum + (s.dealer.currentBatteryCount || 0), 0),
          color: ROUTE_COLORS[routeIndex % ROUTE_COLORS.length],
        })
        routeIndex++
      }
    }
  })

  return routes
}
