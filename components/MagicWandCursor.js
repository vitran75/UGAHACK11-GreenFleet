'use client'

import { useEffect, useRef } from 'react'

export default function MagicWandCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursorEl = cursorRef.current
    if (!cursorEl) return () => {}

    const moveCursor = (event) => {
      cursorEl.style.left = `${event.clientX}px`
      cursorEl.style.top = `${event.clientY}px`
    }

    const updateHoverState = (event) => {
      const target = event.target
      const isInteractive = !!target?.closest?.(
        'a, button, [role="button"], input, select, textarea, label, .cursor-hover'
      )
      cursorEl.classList.toggle('hovering', isInteractive)
    }

    let clickTimeoutId = null
    const startClick = () => {
      cursorEl.classList.add('clicking')
      if (clickTimeoutId) clearTimeout(clickTimeoutId)
      clickTimeoutId = setTimeout(() => {
        cursorEl.classList.remove('clicking')
      }, 300)
    }

    const endClick = () => {
      if (clickTimeoutId) clearTimeout(clickTimeoutId)
      cursorEl.classList.remove('clicking')
    }

    document.addEventListener('mousemove', moveCursor, { passive: true })
    document.addEventListener('pointerover', updateHoverState)
    document.addEventListener('pointerout', updateHoverState)
    document.addEventListener('mousedown', startClick)
    document.addEventListener('mouseup', endClick)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('pointerover', updateHoverState)
      document.removeEventListener('pointerout', updateHoverState)
      document.removeEventListener('mousedown', startClick)
      document.removeEventListener('mouseup', endClick)
      if (clickTimeoutId) clearTimeout(clickTimeoutId)
    }
  }, [])

  return <div className="magic-wand-cursor" ref={cursorRef} />
}
