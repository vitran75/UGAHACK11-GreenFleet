'use client'

import { useEffect, useRef, useState } from 'react'
import MagicWandCursor from '@/components/MagicWandCursor'

const SPLASH_KEY = 'arcane_splash_seen_fullscreen_v1'

export default function ClientLayoutShell({ children }) {
  const [showSplash, setShowSplash] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const hasSeen = window.localStorage.getItem(SPLASH_KEY)
    if (!hasSeen) {
      setShowSplash(true)
      document.body.classList.add('splash-active')
    }
  }, [])

  useEffect(() => {
    if (!showSplash || !videoRef.current) return
    const tryPlay = async () => {
      try {
        await videoRef.current.play()
      } catch {
        // Autoplay may be blocked; allow user click to start.
      }
    }
    tryPlay()
  }, [showSplash])

  useEffect(() => {
    if (!showSplash) {
      document.body.classList.remove('splash-active')
    }
  }, [showSplash])

  const finishSplash = () => {
    setIsFading(true)
    window.localStorage.setItem(SPLASH_KEY, '1')
    window.setTimeout(() => {
      setShowSplash(false)
      setIsFading(false)
    }, 700)
  }

  return (
    <>
      {children}
      {showSplash ? (
        <div
          className={`splash-screen${isFading ? ' fade-out' : ''}`}
          onClick={() => {
            if (videoRef.current) videoRef.current.play().catch(() => {})
          }}
        >
          <video
            className="splash-video"
            src="/Full_Screen_Video_Generation.mp4"
            autoPlay
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            preload="auto"
            onEnded={finishSplash}
            onCanPlay={() => {
              if (videoRef.current) videoRef.current.play().catch(() => {})
            }}
            ref={videoRef}
          />
        </div>
      ) : (
        <MagicWandCursor />
      )}
    </>
  )
}
