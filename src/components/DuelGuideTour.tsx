import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import hansIdAvatar from '../images/web/michael-hans-id.jpg'
import { duelSfx } from '../utils/sfx'

export interface GuideTourStep {
  id: string
  targetSelector: string
  speaker?: string
  text: string
  fallbackSide?: 'top' | 'bottom'
  scrollTarget?: boolean
  isHeaderTarget?: boolean
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
  }, [open, steps])

  // Keep mobile topbar revealed and un-hidden while guided tour is open
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (open) {
      document.body.dataset.tourActive = 'true'
      window.dispatchEvent(new CustomEvent('mh-reveal-topbar'))
    } else {
      delete document.body.dataset.tourActive
    }
    return () => {
      delete document.body.dataset.tourActive
    }
  }, [open, stepIdx])

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

  // Auto-scroll target smoothly into safe viewport band & continuously measure during settle
  useLayoutEffect(() => {
    if (!open || !current) return

    if (current.isHeaderTarget) {
      window.dispatchEvent(new CustomEvent('mh-reveal-topbar'))
    }

    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const el = document.querySelector<HTMLElement | SVGElement>(current.targetSelector)
      if (!el) {
        setBox({ left: Math.round(vw / 2 - 60), top: Math.round(vh * 0.36), width: 120, height: 80, vw, vh })
        return
      }
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) {
        setBox({ left: Math.round(vw / 2 - 60), top: Math.round(vh * 0.36), width: 120, height: 80, vw, vh })
        return
      }
      const visTop = Math.max(8, Math.min(vh - 48, r.top))
      const rawBottom = Math.min(vh - 8, r.bottom)
      const maxH =
        current.scrollTarget === false
          ? rawBottom - visTop
          : Math.min(rawBottom - visTop, Math.round(vh * 0.44))
      const visHeight = Math.max(36, maxH)
      const visLeft = Math.max(8, r.left)
      const visWidth = Math.max(48, Math.min(vw - 16, r.right - visLeft))

      setBox({
        left: Math.round(visLeft),
        top: Math.round(visTop),
        width: Math.round(visWidth),
        height: Math.round(visHeight),
        vw,
        vh,
      })
    }

    if (current.scrollTarget !== false) {
      const el = document.querySelector<HTMLElement | SVGElement>(current.targetSelector)
      if (el) {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        const preferredTop =
          current.fallbackSide === 'top'
            ? Math.max(88, Math.round(vh * 0.48))
            : Math.max(88, Math.round((vh - Math.min(r.height, vh * 0.44)) * 0.34))
        const targetScrollY = Math.max(0, window.scrollY + r.top - preferredTop)
        if (Math.abs(targetScrollY - window.scrollY) > 12) {
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          window.scrollTo({ top: targetScrollY, behavior: reduced ? 'instant' : 'smooth' })
        }
      }
    }

    let raf = 0
    const schedule = () => {
      window.cancelAnimationFrame(raf)
      raf = window.requestAnimationFrame(measure)
    }

    measure()
    // Follow smooth scroll & CSS settles cleanly over 750ms
    const followInterval = window.setInterval(measure, 48)
    const stopFollowTimer = window.setTimeout(() => {
      window.clearInterval(followInterval)
      measure()
    }, 780)

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    const target = document.querySelector(current.targetSelector)
    if (observer && target) observer.observe(target)
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })

    return () => {
      window.clearInterval(followInterval)
      window.clearTimeout(stopFollowTimer)
      observer?.disconnect()
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
    }
  }, [current, open, stepIdx])

  if (!open || !current || !box || typeof document === 'undefined') return null

  const { left, top, width, height, vw, vh } = box
  const isMobile = vw < 640

  // Place cursor tip inside the lower-right edge of target so it clearly points at it without blocking center text
  const pointerX = Math.max(14, Math.min(vw - 38, left + Math.min(width * 0.78, width - 14)))
  const pointerY = Math.max(14, Math.min(vh - 38, top + Math.min(height * 0.74, height - 10)))

  const bubbleW = isMobile ? Math.min(352, vw - 24) : Math.min(410, vw - 32)
  const estH = 186
  const spaceAbove = top - 16
  const spaceBelow = vh - (top + height) - 16
  const spaceRight = vw - (left + width) - 16

  let bubbleLeft = isMobile
    ? Math.round((vw - bubbleW) / 2)
    : Math.max(16, Math.min(vw - bubbleW - 16, left + width / 2 - bubbleW / 2))

  let bubbleStyle: React.CSSProperties
  if (current.fallbackSide !== 'top' && spaceBelow >= estH + 16) {
    bubbleStyle = {
      left: bubbleLeft,
      top: Math.max(16, Math.min(vh - estH - 16, top + height + 16)),
      width: bubbleW,
    }
  } else if (spaceAbove >= estH + 16) {
    bubbleStyle = {
      left: bubbleLeft,
      top: Math.max(16, top - estH - 14),
      width: bubbleW,
    }
  } else if (!isMobile && spaceRight >= bubbleW + 24) {
    bubbleStyle = {
      left: left + width + 16,
      top: Math.max(72, Math.min(vh - estH - 16, top)),
      width: bubbleW,
    }
  } else if (spaceAbove >= spaceBelow) {
    bubbleStyle = { left: bubbleLeft, top: 68, width: bubbleW }
  } else {
    bubbleStyle = { left: bubbleLeft, bottom: 78, width: bubbleW }
  }

  const shownText = current.text.slice(0, typedLen)
  const isTypingDone = typedLen >= current.text.length

  const goNext = () => {
    duelSfx.playHover()
    if (stepIdx < steps.length - 1) {
      setStepIdx((s) => s + 1)
    } else {
      onClose()
    }
  }

  return createPortal(
    <div aria-live="polite" className="pointer-events-none fixed inset-0 z-[75]">
      {/* Target highlight box */}
      <div
        aria-hidden="true"
        style={{
          left: Math.max(4, left - 4),
          top: Math.max(4, top - 4),
          width: Math.max(40, Math.min(vw - 4 - Math.max(4, left - 4), width + 8)),
          height: Math.max(36, Math.min(vh - 4 - Math.max(4, top - 4), height + 8)),
        }}
        className="fixed rounded-[4px] border-2 border-sky-400/85 shadow-[0_0_18px_rgba(56,189,248,0.42)] transition-all duration-200"
      />

      {/* Animated Cursor Pointer Arrow */}
      <div
        aria-hidden="true"
        style={{
          transform: `translate3d(${pointerX}px, ${pointerY}px, 0)`,
          transition: 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="fixed left-0 top-0 z-10"
      >
        <div className="ygo-pointer-bob drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
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
        className="ygo-modal-summon pointer-events-auto fixed z-20 transition-all duration-200"
      >
        <div className="ygo-duel-bubble-frame">
          <div className="ygo-duel-bubble-inner px-4 py-3 sm:px-5 sm:py-3.5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <img
                  src={hansIdAvatar}
                  alt="Hans"
                  className="h-6 w-6 rounded-full border border-slate-800 bg-white object-cover object-top"
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
                {isTypingDone ? 'Click Next to continue' : 'Tap bubble to reveal'}
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
