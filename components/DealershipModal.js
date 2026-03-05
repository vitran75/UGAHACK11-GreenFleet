'use client'

import { useState, useEffect } from 'react'

const EMPTY = {
  name: '',
  type: 'dealership',
  address: '',
  city: '',
  state: '',
  country: 'US',
  lat: '',
  lng: '',
  currentBatteryCount: 0,
  maxCapacity: 0,
  fillRate: 0,
}

export default function DealershipModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    setForm(initialData ? { ...EMPTY, ...initialData } : EMPTY)
  }, [initialData, open])

  if (!open) return null

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((f) => ({
      ...f,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Location' : 'Add Location'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={form.type} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}>
              <option value="dealership">Dealership</option>
              <option value="recycling">Recycling Center</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="state">State</label>
              <input id="state" name="state" value={form.state} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input id="country" name="country" value={form.country} onChange={handleChange} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lat">Latitude</label>
              <input id="lat" name="lat" type="number" step="any" value={form.lat} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lng">Longitude</label>
              <input id="lng" name="lng" type="number" step="any" value={form.lng} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="currentBatteryCount">Current Batteries</label>
              <input id="currentBatteryCount" name="currentBatteryCount" type="number" value={form.currentBatteryCount} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="maxCapacity">Max Capacity</label>
              <input id="maxCapacity" name="maxCapacity" type="number" value={form.maxCapacity} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="fillRate">Fill Rate/day</label>
              <input id="fillRate" name="fillRate" type="number" value={form.fillRate} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Changes' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
