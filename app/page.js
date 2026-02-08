'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  function gradeColor(grade) {
    if (!grade) return '#6b7280'
    const g = grade.toUpperCase()
    if (g === 'A' || g === 'B') return '#16a34a'
    if (g === 'C' || g === 'D') return '#d97706'
    return '#dc2626'
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    setError(null)
    setIsAnalyzing(true)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUri = e.target.result
      setImage(dataUri)
      try {
        const res = await fetch('/api/analyze-item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUri }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Analysis failed')
        }
        const data = await res.json()
        setResult(data)
        setIsFlipped(true)
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.')
      } finally {
        setIsAnalyzing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setIsDragOver(false)
  }

  function handleReset() {
    setImage(null)
    setResult(null)
    setIsFlipped(false)
    setIsAnalyzing(false)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Build Something
            <span className="hero-highlight"> Amazing</span>
          </h1>
          <p className="hero-subtitle">
            The all-in-one platform to bring your ideas to life.
            Start building today with powerful tools and seamless experience.
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn btn-primary btn-large">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="btn btn-primary btn-large">
                  Get Started
                </Link>
                <Link href="/login" className="btn btn-secondary btn-large">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-shape"></div>
        </div>
      </section>

      {/* Impact Reveal Section */}
      <section className="impact-reveal">
        <h2 className="impact-reveal-title">What&apos;s Your Impact?</h2>
        <p className="impact-reveal-subtitle">
          Snap a photo of any recyclable item and discover its environmental story.
        </p>

        <div className="flip-card">
          <div className={`flip-card-inner${isFlipped ? ' flipped' : ''}`}>
            {/* Front Face */}
            <div
              className={`flip-card-front${isDragOver ? ' dragover' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              aria-label={image ? 'Image selected' : 'Upload an image for analysis'}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
              {isAnalyzing ? (
                <div className="flip-card-loading">
                  <div className="flip-card-spinner" />
                  <p>Analyzing your item...</p>
                </div>
              ) : (
                <div className="flip-card-upload">
                  <span className="flip-card-recycle-icon">&#9851;</span>
                  <p className="flip-card-upload-text">Drop a photo or click to upload</p>
                  <p className="flip-card-upload-hint">JPG, PNG, WebP supported</p>
                </div>
              )}
              {error && <p className="flip-card-error">{error}</p>}
            </div>

            {/* Back Face */}
            <div className="flip-card-back">
              {result && (
                <>
                  <div className="result-top">
                    <div
                      className="result-grade-circle"
                      style={{ borderColor: gradeColor(result.grade) }}
                    >
                      <span style={{ color: gradeColor(result.grade) }}>{result.grade}</span>
                    </div>
                    <h3 className="result-item-name">{result.itemName}</h3>
                    <span
                      className="result-recyclable-tag"
                      style={{
                        background: result.recyclable ? '#dcfce7' : '#fee2e2',
                        color: result.recyclable ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {result.recyclable ? 'Recyclable' : 'Not Recyclable'}
                    </span>
                  </div>

                  <div className="result-speech-bubble">
                    <p>{result.funFact}</p>
                  </div>

                  <div className="result-decomp">
                    <span className="result-decomp-label">Landfill decomposition</span>
                    <span className="result-decomp-value">{result.decompositionTime}</span>
                  </div>

                  <div className="result-bars">
                    {(() => {
                      const co2SavedKg = Number(result.co2SavedKg) || 0
                      const waterSavedL = Number(result.waterSavedL) || 0
                      const energySavedKwh = Number(result.energySavedKwh) || 0
                      return (
                        <>
                          <div className="result-bar-row">
                            <span className="result-bar-label">CO2 Saved</span>
                            <div className="result-bar-track">
                              <div
                                className="result-bar-fill result-bar-co2"
                                style={{
                                  width: `${Math.min((co2SavedKg / 30) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="result-bar-value">{co2SavedKg} kg</span>
                          </div>
                          <div className="result-bar-row">
                            <span className="result-bar-label">Water Saved</span>
                            <div className="result-bar-track">
                              <div
                                className="result-bar-fill result-bar-water"
                                style={{
                                  width: `${Math.min((waterSavedL / 100) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="result-bar-value">{waterSavedL} L</span>
                          </div>
                          <div className="result-bar-row">
                            <span className="result-bar-label">Energy Saved</span>
                            <div className="result-bar-track">
                              <div
                                className="result-bar-fill result-bar-energy"
                                style={{
                                  width: `${Math.min((energySavedKwh / 20) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="result-bar-value">{energySavedKwh} kWh</span>
                          </div>
                        </>
                      )
                    })()}
                  </div>

                  <button className="btn btn-primary flip-card-reset" onClick={handleReset}>
                    Try Another
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Optimized for speed and performance. Your experience will be seamless.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Enterprise-grade security to keep your data safe and protected.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Beautiful Design</h3>
            <p>Modern and intuitive interface that's a pleasure to use.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Scalable</h3>
            <p>Grows with your needs. From prototype to production.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to get started?</h2>
        <p>Join thousands of users who are already building amazing things.</p>
        {!isAuthenticated && (
          <Link href="/signup" className="btn btn-primary btn-large">
            Get Started Free
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 MyApp. All rights reserved.</p>
      </footer>
    </div>
  )
}
