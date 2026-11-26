import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { duelSfx } from '../utils/sfx'

export interface GuideTourStep {
  id: string
  targetSelector: string
  speaker?: string
  text: string
  fallbackSide?: 'top' | 'bottom'
}

interface DuelGuideTourProps {
  open: boolean
  steps: GuideTourStep[]
  onClose: () => void
}

interface TargetBox {
  left: number
  top: number
  width: number
  height: number
  vw: number
  vh: number
}

export const DuelGuideTour: React.FC<DuelGuideTourProps> = ({ open, steps, onClose }) => {
  const [stepIdx, setStepIdx] = useState(0)
  const [typedLen, setTypedLen] = useState(0)
  const [box, setBox] = useState<TargetBox | null>(null)

  const current = steps[stepIdx] ?? steps[0]

  useEffect(() => {
    if (open) {
      setStepIdx(0)
      setTypedLen(0)
    }
  }, [open])

  // Typewriter reveal for Duel Links speech bubble
  useEffect(() => {
    if (!open || !current) return
    const full = current.text
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setTypedLen(full.length)
      return
    }
    setTypedLen(0)
    const timer = window.setInterval(() => {
      setTypedLen((prev) => {
        if (prev >= full.length) {
          window.clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, 20)
    return () => window.clearInterval(timer)
  }, [current, open, stepIdx])

  // Escape to skip tour
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, open])

  // Measure target rect & follow scroll/resize
  useLayoutEffect(() => {
    if (!open || !current) return
    let raf = 0

    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const el = document.querySelector<HTMLElement | SVGElement>(current.targetSelector)
      if (!el) {
        setBox({ left: vw / 2 - 60, top: vh * 0.36, width: 120, height: 80, vw, vh })
        return
      }
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) {
        setBox({ left: vw / 2 - 60, top: vh * 0.36, width: 120, height: 80, vw, vh })
        return
      }
      setBox({
        left: Math.max(8, r.left),
        top: Math.max(8, r.top),
        width: Math.min(vw - 16, r.width),
        height: Math.min(vh - 16, r.height),
        vw,
        vh,
      })
    }

    const schedule = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(measure)
    }

    measure()
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    const target = document.querySelector(current.targetSelector)
    if (observer && target) observer.observe(target)
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })

    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
    }
  }, [current, open, stepIdx])

  if (!open || !current || !box || typeof document === 'undefined') return null

  const { left, top, width, height, vw, vh } = box
  const isMobile = vw < 640

  // Pointer lands cleanly near top-left/center edge of target without covering center
  const pointerX = Math.max(18, Math.min(vw - 44, left + width * 0.32))
  const pointerY = Math.max(18, Math.min(vh - 44, top + Math.min(28, height * 0.28)))

  // Position speech bubble so it avoids the highlighted element & bottom dock
  const bubbleW = isMobile ? Math.min(360, vw - 24) : Math.min(420, vw - 32)
  const targetInLowerHalf = top + height * 0.5 > vh * 0.54
  const bubbleLeft = isMobile
    ? Math.round((vw - bubbleW) / 2)
    : Math.max(16, Math.min(vw - bubbleW - 16, left + width / 2 - bubbleW / 2))

  let bubbleStyle: React.CSSProperties
  if (isMobile) {
    bubbleStyle = targetInLowerHalf
      ? { left: bubbleLeft, top: 68, width: bubbleW }
      : { left: bubbleLeft, bottom: 76, width: bubbleW }
  } else if (targetInLowerHalf || current.fallbackSide === 'top') {
    const preferredTop = Math.max(72, Math.min(top - 178, vh - 210))
    bubbleStyle = { left: bubbleLeft, top: preferredTop, width: bubbleW }
  } else {
    const preferredTop = Math.max(72, Math.min(top + height + 18, vh - 196))
    bubbleStyle = { left: bubbleLeft, top: preferredTop, width: bubbleW }
  }

  const shownText = current.text.slice(0, typedLen)
  const isTypingDone = typedLen >= current.text.length

  const goNext = () => {
    duelSfx.playHover()
    if (!isTypingDone) {
      setTypedLen(current.text.length)
      return
    }
    if (stepIdx < steps.length - 1) {
      setStepIdx((s) => s + 1)
    } else {
      onClose()
    }
  }

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-[75]"
    >
      {/* Target highlight box */}
      <div
        aria-hidden="true"
        style={{
          left: Math.max(4, left - 4),
          top: Math.max(4, top - 4),
          width: Math.min(vw - 8, width + 8),
          height: Math.min(vh - 8, height + 8),
        }}
        className="fixed rounded-[4px] border-2 border-sky-400/85 shadow-[0_0_18px_rgba(56,189,248,0.42)] transition-all duration-300"
      />

      {/* Animated Cursor Pointer Arrow */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${pointerX}px, ${pointerY}px, 0)`,
          transition: 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="fixed left-0 top-0 z-10"
      >
        <div className="ygo-pointer-bob drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
          <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
            <path
              d="M4 3L23 11.5L14.5 14.5L11.5 23L4 3Z"
              fill="#38bdf8"
              stroke="#0f172a"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Duel Links Chamfered Speech Bubble */}
      <div
        role="dialog"
        aria-label="Interactive walkthrough"
        style={bubbleStyle}
        onClick={() => {
          if (!isTypingDone) setTypedLen(current.text.length)
        }}
        className="ygo-modal-summon pointer-events-auto fixed z-20 transition-all duration-300"
      >
        <div className="ygo-duel-bubble-frame">
          <div className="ygo-duel-bubble-inner px-4 py-3 sm:px-5 sm:py-3.5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/michael-hans-avatar.jpg"
                  alt="Hans"
                  className="h-6 w-6 rounded-full border border-slate-800 object-cover object-top"
                />
                <span className="font-mono-tech text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  {current.speaker || 'Hans'}
                </span>
                <span className="rounded-[2px] bg-slate-100 px-1.5 py-0.5 font-mono-tech text-[10px] font-semibold text-slate-600">
                  {stepIdx + 1} / {steps.length}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  duelSfx.playHover()
                  onClose()
                }}
                className="rounded-[2px] px-2 py-0.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Skip
              </button>
            </div>

            <p className="mt-2.5 min-h-[3rem] text-[13.5px] leading-snug font-medium text-slate-900 sm:text-sm">
              {shownText}
              {!isTypingDone && <span className="ygo-type-cursor" aria-hidden="true" />}
            </p>

            <div className="mt-2.5 flex items-center justify-between gap-2 pt-1">
              <span className="text-[10.5px] font-medium text-slate-500">
                {isTypingDone ? 'Pick Next or explore on your own' : 'Tap to complete text'}
              </span>

              <div className="flex items-center gap-1.5">
                {stepIdx > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      duelSfx.playHover()
                      setStepIdx((s) => Math.max(0, s - 1))
                    }}
                    className="rounded-[2px] border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  className="rounded-[2px] bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  {stepIdx === steps.length - 1 ? 'Got it' : 'Next ->'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
