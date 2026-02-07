'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useSidebar } from '@/context/SidebarContext'
import UpdateTimer from '@/components/UpdateTimer'

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth()
  const { sidebarOpen, toggleSidebar } = useSidebar()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U'
  }

  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-brand">
            <Link href="/">MyApp</Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {isAuthenticated && (
          <button
            className={`hamburger-btn ${sidebarOpen ? 'open' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        )}
        <div className="navbar-brand">
          <Link href="/">MyApp</Link>
        </div>
      </div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <UpdateTimer />
            {/* User Dropdown */}
            <div className="dropdown" ref={dropdownRef}>
              <button
                className="dropdown-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="avatar-small">{getInitial()}</span>
                <span className="user-name">{user?.name}</span>
                <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link
                    href="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">⚙️</span>
                    Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false)
                      logout()
                    }}
                    className="dropdown-item dropdown-item-danger"
                  >
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/about">About</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup" className="btn btn-primary btn-small">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
