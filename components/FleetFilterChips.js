'use client'

export default function FleetFilterChips({ filters, onToggle }) {
  const chips = [
    { key: 'risk', value: 'high', label: 'High Risk' },
    { key: 'risk', value: 'medium', label: 'Medium' },
    { key: 'risk', value: 'low', label: 'Low' },
    { key: 'daysFilter', value: '<3', label: '< 3 days' },
    { key: 'daysFilter', value: '3-7', label: '3-7 days' },
    { key: 'daysFilter', value: '>7', label: '> 7 days' },
    { key: 'pickupDueSoon', value: true, label: 'Pickup < 48h' },
  ]

  return (
    <div className="fleet-chips-row">
      {chips.map((chip) => {
        const isActive = filters[chip.key] === chip.value
        return (
          <button
            key={chip.label}
            className={`fleet-chip ${isActive ? 'active' : ''}`}
            onClick={() => onToggle(chip.key, isActive ? null : chip.value)}
          >
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
