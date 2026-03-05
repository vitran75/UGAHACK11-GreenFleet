'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields')
      }
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page-wrapper">
      {/* ── Pure-CSS White Bulldog ── */}
      <div className="bulldog">
        <div className="bulldog-tail"></div>
        <div className="bulldog-body">
          <div className="bulldog-leg bulldog-leg--bl"></div>
          <div className="bulldog-leg bulldog-leg--br"></div>
          <div className="bulldog-leg bulldog-leg--fl"></div>
          <div className="bulldog-leg bulldog-leg--fr"></div>
          <div className="bulldog-collar"></div>
        </div>
        <div className="bulldog-head">
          <div className="bulldog-ear bulldog-ear--l"></div>
          <div className="bulldog-ear bulldog-ear--r"></div>
          <div className="bulldog-face">
            <div className="bulldog-eye bulldog-eye--l"><div className="bulldog-pupil"></div></div>
            <div className="bulldog-eye bulldog-eye--r"><div className="bulldog-pupil"></div></div>
            <div className="bulldog-muzzle">
              <div className="bulldog-nose"></div>
              <div className="bulldog-mouth"></div>
              <div className="bulldog-jowl bulldog-jowl--l"></div>
              <div className="bulldog-jowl bulldog-jowl--r"></div>
            </div>
            <div className="bulldog-tongue"></div>
          </div>
        </div>
      </div>

      <div className="auth-container">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your GreenFleet account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-btn-loading"><span className="spinner"></span> Logging in...</span>
            ) : 'Login'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <p className="auth-link">
          Don&#39;t have an account? <Link href="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}
