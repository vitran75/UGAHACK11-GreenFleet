'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    try {
      await updateProfile({ name, email })
      setIsEditing(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('')
      alert(err.message)
    }
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    setIsEditing(false)
  }

  const getInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <div className="page-container">
      <h1>Profile</h1>

      {message && <div className="success-message">{message}</div>}

      <div className="profile-avatar">
        {getInitial()}
      </div>

      {!isEditing ? (
        <>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#999' }}>
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Edit Profile
          </button>
        </>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>
              Save Changes
            </button>
            <button onClick={handleCancel} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
