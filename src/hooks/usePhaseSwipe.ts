import React, { useCallback, useRef, useState } from 'react'

interface PhaseMeta {
  label: string
}

interface UsePhaseSwipeOptions {
  currentIdx: number
  phases: PhaseMeta[]
  disabled: boolean
  onStep: (delta: -1 | 1) => void
}

export function usePhaseSwipe({
  currentIdx,
  phases,
  disabled,
  onStep,
}: UsePhaseSwipeOptions) {
  const [swipeHint, setSwipeHint] = useState<{ dir: 'prev' | 'next'; label: string } | null>(null)
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  const clearSwipeHint = useCallback(() => {
    touchRef.current = null
    setSwipeHint(null)
  }, [])

  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent<HTMLElement>) => {
      if (disabled || e.touches.length !== 1) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [role="dialog"], [data-no-phase-swipe]')) return
      const t = e.touches[0]
      touchRef.current = { x: t.clientX, y: t.clientY }
    },
    onTouchMove: (e: React.TouchEvent<HTMLElement>) => {
      const start = touchRef.current
      if (!start || e.touches.length !== 1) return
      const t = e.touches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      if (Math.abs(dx) > 22 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        const targetIdx = dx > 0 ? currentIdx - 1 : currentIdx + 1
        const nextMeta = phases[targetIdx]
        if (nextMeta) {
          setSwipeHint({ dir: dx > 0 ? 'prev' : 'next', label: nextMeta.label })
        }
      } else if (swipeHint) {
        setSwipeHint(null)
      }
    },
    onTouchEnd: (e: React.TouchEvent<HTMLElement>) => {
      const start = touchRef.current
      touchRef.current = null
      setSwipeHint(null)
      if (!start || e.changedTouches.length === 0) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      if (Math.abs(dx) > 58 && Math.abs(dx) > Math.abs(dy) * 1.65) {
        onStep(dx > 0 ? -1 : 1)
      }
    },
    onTouchCancel: clearSwipeHint,
  }

  return { swipeHint, clearSwipeHint, swipeHandlers }
}
