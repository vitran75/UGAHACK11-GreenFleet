'use client'

export default function RouteCard({ route, selected, onClick }) {
  return (
    <div
      className={`route-card ${selected ? 'selected' : ''}`}
      onClick={() => onClick(route.id)}
    >
      <div className="route-card-header">
        <span className="route-card-swatch" style={{ background: route.color }} />
        <span className="route-card-name">{route.name}</span>
      </div>
      <p className="route-card-center">To: {route.center.name}</p>
      <div className="route-card-stats">
        <span>{route.stops.length} stops</span>
        <span>{route.totalBatteries} batteries</span>
        <span>{route.totalMiles} mi</span>
      </div>
    </div>
  )
}
