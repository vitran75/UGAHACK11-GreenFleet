'use client'

export default function FleetSearchBar({ value, onChange }) {
  return (
    <div className="fleet-search-bar">
      <span className="fleet-search-icon">&#128269;</span>
      <input
        className="fleet-search-input"
        type="text"
        placeholder="Search dealerships..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
