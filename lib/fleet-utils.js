export function computeDaysToFull(dealer) {
  if (!dealer.fillRate || dealer.fillRate <= 0) return Infinity
  return Math.max(0, (dealer.maxCapacity - dealer.currentBatteryCount) / dealer.fillRate)
}

export function computeRiskLevel(dealer) {
  const days = computeDaysToFull(dealer)
  if (days < 3) return 'high'
  if (days <= 7) return 'medium'
  return 'low'
}

export function getRiskColor(risk) {
  switch (risk) {
    case 'high': return '#ef4444'
    case 'medium': return '#f59e0b'
    case 'low': return '#10b981'
    default: return '#6b7280'
  }
}

export function filterDealerships(dealers, filters) {
  let result = dealers

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.address && d.address.toLowerCase().includes(q)) ||
        (d.city && d.city.toLowerCase().includes(q))
    )
  }

  if (filters.risk) {
    result = result.filter((d) => computeRiskLevel(d) === filters.risk)
  }

  if (filters.daysFilter) {
    result = result.filter((d) => {
      const days = computeDaysToFull(d)
      if (filters.daysFilter === '<3') return days < 3
      if (filters.daysFilter === '3-7') return days >= 3 && days <= 7
      if (filters.daysFilter === '>7') return days > 7
      return true
    })
  }

  if (filters.pickupDueSoon) {
    result = result.filter((d) => computeDaysToFull(d) < 2)
  }

  // Sort by risk: high first
  const riskOrder = { high: 0, medium: 1, low: 2 }
  result.sort((a, b) => riskOrder[computeRiskLevel(a)] - riskOrder[computeRiskLevel(b)])

  return result
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3959 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function findNearestCenter(dealer, centers) {
  if (!centers.length) return null
  let nearest = centers[0]
  let minDist = haversineDistance(dealer.lat, dealer.lng, nearest.lat, nearest.lng)
  for (let i = 1; i < centers.length; i++) {
    const dist = haversineDistance(dealer.lat, dealer.lng, centers[i].lat, centers[i].lng)
    if (dist < minDist) {
      minDist = dist
      nearest = centers[i]
    }
  }
  return { center: nearest, distance: minDist }
}
