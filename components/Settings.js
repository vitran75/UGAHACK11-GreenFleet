'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Settings() {
  const { user, updateProfile, logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [message, setMessage] = useState('')

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')

    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setMessage('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setPasswordError(err.message)
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Simulate account deletion - replace with actual API call
      logout()
    }
  }

  return (
    <div className="page-container">
      <h1>Settings</h1>

      {message && <div className="success-message">{message}</div>}

      {/* Preferences */}
      <div className="settings-section">
        <h2>Preferences</h2>

        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="notifications" style={{ marginBottom: 0 }}>Email Notifications</label>
          <input
            id="notifications"
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            style={{ width: 'auto' }}
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="settings-section">
        <h2>Change Password</h2>

        {passwordError && <div className="error-message">{passwordError}</div>}

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              id="confirmNewPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="settings-section">
        <h2 style={{ color: '#dc3545' }}>Danger Zone</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button onClick={handleDeleteAccount} className="btn btn-danger">
          Delete Account
        </button>
      </div>
    </div>
  )
}
