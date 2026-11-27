import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { duelSfx } from '../../audio'
import '../../styles/phase-tray.css'
import {
  computeVisibleCountForDock,
  findCustomPhaseCardUrl,
  getVisibleCount,
  PHASE_CARDS,
  PhaseCardItem,
  PortfolioPhase,
} from './phaseCards'
import { PhaseCardVisual } from './PhaseCardVisual'
import { PhaseTransitionPortal, PhaseTransitionState } from './PhaseTransitionPortal'

export type { PortfolioPhase }

interface PhaseCardTrayProps {
  activePhase: PortfolioPhase
  theme: 'light' | 'dark'
  onSelectPhase: (phase: PortfolioPhase) => void
  onReplayDraw: () => void
}

export function PhaseCardTray({
  activePhase,
  theme,
  onSelectPhase,
  onReplayDraw,
}: PhaseCardTrayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openAnimKey, setOpenAnimKey] = useState(0)
  const [transitionState, setTransitionState] = useState<PhaseTransitionState | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(() =>
    typeof window === 'undefined' ? 5 : getVisibleCount(window.innerWidth),
  )

  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const trayTouchStartRef = useRef<{ x: number; y: number } | null>(null)
  const trayBodyRef = useRef<HTMLDivElement>(null)

  const isLight = theme === 'light'
  const activeIdx = Math.max(
    1,
    PHASE_CARDS.findIndex((item) => item.id === activePhase),
  )
  const [highlightedIdx, setHighlightedIdx] = useState<number>(activeIdx)
  const [windowStart, setWindowStart] = useState<number>(0)

  const syncWindowToIndex = useCallback((idx: number, count: number) => {
    if (count >= PHASE_CARDS.length) {
      setWindowStart(0)
      return
    }
    setWindowStart((prev) => {
      if (idx < prev) return idx
      if (idx >= prev + count) return idx - count + 1
      return Math.min(prev, PHASE_CARDS.length - count)
    })
  }, [])

  useEffect(() => {
    setHighlightedIdx(activeIdx)
    syncWindowToIndex(activeIdx, visibleCount)
  }, [activeIdx, syncWindowToIndex, visibleCount])

  useEffect(() => {
    const updateCount = () => {
      const vw = window.innerWidth
      const cw = trayBodyRef.current?.clientWidth ?? 0
      const nextCount = computeVisibleCountForDock(cw, vw)
      setVisibleCount(nextCount)
      syncWindowToIndex(highlightedIdx, nextCount)
    }

    updateCount()
    window.addEventListener('resize', updateCount)
    const bodyEl = trayBodyRef.current
    const observer =
      typeof ResizeObserver !== 'undefined' && bodyEl
        ? new ResizeObserver(() => updateCount())
        : null
    if (observer && bodyEl) {
      observer.observe(bodyEl)
    }
    return () => {
      window.removeEventListener('resize', updateCount)
      observer?.disconnect()
    }
  }, [highlightedIdx, syncWindowToIndex])

  const commitPhase = useCallback(
    (item: PhaseCardItem) => {
      duelSfx.playFlip()
      const el = cardRefs.current[item.id]
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      setIsOpen(false)

      if (prefersReduced || !el || item.id === activePhase) {
        if (item.id === 'draw') onReplayDraw()
        else onSelectPhase(item.id)
        return
      }

      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        if (item.id === 'draw') onReplayDraw()
        else onSelectPhase(item.id)
        return
      }

      setTransitionState({
        item,
        customUrl: findCustomPhaseCardUrl(item.id),
        startRect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        vw: window.innerWidth,
        vh: window.innerHeight,
      })
    },
    [activePhase, onReplayDraw, onSelectPhase],
  )

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        duelSfx.playHover()
        setHighlightedIdx((prev) => {
          const next = Math.max(0, prev - 1)
          syncWindowToIndex(next, visibleCount)
          return next
        })
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        duelSfx.playHover()
        setHighlightedIdx((prev) => {
          const next = Math.min(PHASE_CARDS.length - 1, prev + 1)
          syncWindowToIndex(next, visibleCount)
          return next
        })
      } else if (e.key === 'Enter') {
        const chosen = PHASE_CARDS[highlightedIdx]
        if (chosen) {
          e.preventDefault()
          commitPhase(chosen)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commitPhase, highlightedIdx, isOpen, syncWindowToIndex, visibleCount])

  const activeMeta = PHASE_CARDS[activeIdx]
  const highlightedCard = PHASE_CARDS[highlightedIdx] ?? activeMeta
  const visibleSlice = PHASE_CARDS.slice(windowStart, windowStart + visibleCount)

  const stepIndex = (delta: -1 | 1) => {
    duelSfx.playHover()
    const nextIdx = Math.max(0, Math.min(PHASE_CARDS.length - 1, highlightedIdx + delta))
    setHighlightedIdx(nextIdx)
    syncWindowToIndex(nextIdx, visibleCount)
  }

  const clearTransition = useCallback(() => {
    setTransitionState(null)
  }, [])

  return (
    <>
      <PhaseTransitionPortal
        transition={transitionState}
        isLight={isLight}
        onSelectPhase={onSelectPhase}
        onReplayDraw={onReplayDraw}
        onDone={clearTransition}
      />

      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 backdrop-blur-[1.5px] transition-opacity duration-300 ${
          isLight ? 'bg-slate-900/24' : 'bg-black/45'
        } ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <div
        className="pointer-events-none fixed bottom-0 left-1/2 z-40 w-[min(92vw,1320px)] -translate-x-1/2 sm:w-[min(90vw,1320px)]"
        role="region"
        aria-label="Duel Phase Card Switcher"
      >
        <div className="relative z-10 -mb-[1px] flex items-end justify-center">
          <button
            id="tour-phase-dock"
            type="button"
            onClick={() => {
              duelSfx.playHover()
              setIsOpen((prev) => {
                const next = !prev
                if (next) {
                  setHighlightedIdx(activeIdx)
                  syncWindowToIndex(activeIdx, visibleCount)
                  setOpenAnimKey((k) => k + 1)
                }
                return next
              })
            }}
            aria-expanded={isOpen}
            className={`pointer-events-auto group relative inline-flex items-center gap-2 rounded-t-[4px] border border-b-0 px-3.5 py-2 text-xs font-semibold tracking-wide backdrop-blur-md transition-all duration-200 sm:gap-3 sm:px-9 sm:py-3 sm:text-sm ${
              isLight
                ? 'border-[#94a3b8] bg-[#ffffff]/96 text-[#181a1f] shadow-[0_-8px_24px_rgba(15,23,42,0.12)] hover:border-[#475569] hover:bg-[#f8fafc]'
                : 'border-[#94a3b8]/70 bg-[#0d1322]/96 text-slate-100 shadow-[0_-8px_24px_rgba(0,0,0,0.28)] hover:border-[#f1f5f9] hover:bg-[#131b30]'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-3 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-85 ${
                isLight ? 'via-[#64748b]' : 'via-[#e2e8f0]'
              }`}
            />
            <span
              className={`h-2 w-2 rotate-45 rounded-[1px] border sm:h-2.5 sm:w-2.5 ${
                isLight
                  ? 'border-[#334155]/60 bg-[#647081] shadow-[0_0_6px_rgba(100,116,139,0.35)]'
                  : 'border-[#f8fafc]/80 bg-[#cbd5e1] shadow-[0_0_8px_rgba(226,232,240,0.65)]'
              }`}
            />
            <span>Choose your tab</span>
            <span
              className={`max-w-[106px] truncate rounded-[2px] border px-1.5 py-0.5 font-mono-tech text-[10px] font-medium sm:max-w-none sm:px-2 sm:text-[11px] ${
                isLight
                  ? 'border-[#cbd5e1] bg-[#eeebe2] text-[#181a1f]'
                  : 'border-white/15 bg-white/10 text-[#e2e8f0]'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="opacity-70">{activeMeta.code}</span>
                <span>{activeMeta.label}</span>
              </span>
            </span>
            <ChevronUp
              className={`h-3.5 w-3.5 transition-transform duration-300 sm:h-4 sm:w-4 ${
                isLight ? 'text-[#475569]' : 'text-[#cbd5e1]'
              } ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </div>

        <div
          className={`pointer-events-auto rounded-t-[4px] border border-b-0 backdrop-blur-md transition-colors duration-200 ${
            isLight
              ? `bg-[#f8f6f0]/97 text-[#181a1f] shadow-[0_-18px_42px_rgba(15,23,42,0.16)] ${
                  isOpen ? 'border-[#64748b]' : 'border-[#94a3b8]/80'
                }`
              : `bg-[#0b101d]/96 text-slate-100 shadow-[0_-18px_48px_rgba(0,0,0,0.48)] ${
                  isOpen ? 'border-[#cbd5e1]/70' : 'border-[#94a3b8]/55'
                }`
          }`}
        >
          <div
            className={`h-[3px] w-full bg-gradient-to-r ${
              isLight
                ? 'from-slate-300/60 via-[#64748b]/85 to-slate-300/60'
                : 'from-slate-600/35 via-[#e2e8f0]/80 to-slate-600/35'
            }`}
          />

          {!isOpen && <div className="h-2.5 w-full" aria-hidden="true" />}

          <div
            aria-hidden={!isOpen}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div
                ref={trayBodyRef}
                className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain px-3 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4"
              >
                <div
                  className={`mb-3 flex items-center justify-between gap-3 border-b pb-2 ${
                    isLight ? 'border-[#dedad0]' : 'border-white/12'
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 text-xs">
                    <span
                      className={`shrink-0 font-mono-tech text-[11px] uppercase tracking-[0.14em] ${
                        isLight ? 'text-[#475569]' : 'text-[#e2e8f0]'
                      }`}
                    >
                      Phase Tray
                    </span>
                    <span
                      className={`truncate border-l pl-2 ${
                        isLight ? 'border-[#cbd5e1] text-[#4e5460]' : 'border-white/20 text-slate-300'
                      }`}
                    >
                      {highlightedCard.code} {highlightedCard.label}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 font-mono-tech text-[11px] ${
                      isLight ? 'text-[#647081]' : 'text-slate-400'
                    }`}
                  >
                    {highlightedIdx + 1} / {PHASE_CARDS.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <button
                    type="button"
                    tabIndex={isOpen ? 0 : -1}
                    onClick={() => stepIndex(-1)}
                    disabled={highlightedIdx === 0}
                    aria-label="Previous phase card"
                    className="group relative flex h-11 w-9 shrink-0 items-center justify-center rounded-[2px] border border-[#cbd5e1]/85 bg-gradient-to-b from-[#8b5a2b] via-[#6b4220] to-[#3e230d] text-[#f1f5f9] shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-12"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-3 w-3 translate-x-0.5 rotate-45 border-b-2 border-l-2 border-[#f8fafc] sm:h-3.5 sm:w-3.5"
                    />
                  </button>

                  <div
                    onTouchStart={(e) => {
                      const t = e.touches[0]
                      trayTouchStartRef.current = { x: t.clientX, y: t.clientY }
                    }}
                    onTouchEnd={(e) => {
                      const start = trayTouchStartRef.current
                      trayTouchStartRef.current = null
                      if (!start) return
                      const t = e.changedTouches[0]
                      const dx = t.clientX - start.x
                      const dy = t.clientY - start.y
                      if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy) * 1.3) {
                        stepIndex(dx < 0 ? 1 : -1)
                      }
                    }}
                    className="flex flex-1 items-end justify-center gap-3 pt-2.5 sm:gap-5"
                  >
                    {visibleSlice.map((item, sliceIdx) => {
                      const cardIndex = PHASE_CARDS.findIndex((c) => c.id === item.id)
                      const isHighlighted = cardIndex === highlightedIdx
                      const isCurrentPhase = item.id === activePhase
                      const customUrl = findCustomPhaseCardUrl(item.id)

                      const cardStateClass = isLight
                        ? isHighlighted
                          ? '-translate-y-2 scale-[1.03] border-[#475569] shadow-[0_12px_28px_rgba(71,85,105,0.24)]'
                          : 'border-[#cbd5e1] opacity-85 hover:-translate-y-1 hover:border-[#64748b] hover:opacity-100'
                        : isHighlighted
                          ? '-translate-y-2 scale-[1.03] border-[#e2e8f0] shadow-[0_0_26px_rgba(226,232,240,0.34)]'
                          : 'border-white/15 opacity-80 hover:-translate-y-1 hover:border-slate-300/50 hover:opacity-100'

                      return (
                        <button
                          key={`${item.id}-${openAnimKey}`}
                          ref={(node) => {
                            cardRefs.current[item.id] = node
                          }}
                          type="button"
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => commitPhase(item)}
                          onMouseEnter={() => setHighlightedIdx(cardIndex)}
                          style={{ animationDelay: `${sliceIdx * 45}ms` }}
                          className={`ygo-card-deal-in group relative flex w-[min(156px,46vw)] shrink-0 flex-col overflow-hidden rounded-[2px] border text-left transition-all duration-200 sm:w-[148px] lg:w-[158px] ${cardStateClass}`}
                        >
                          <PhaseCardVisual
                            item={item}
                            customUrl={customUrl}
                            isLight={isLight}
                            isCurrentPhase={isCurrentPhase}
                            isHighlighted={isHighlighted}
                          />
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    tabIndex={isOpen ? 0 : -1}
                    onClick={() => stepIndex(1)}
                    disabled={highlightedIdx === PHASE_CARDS.length - 1}
                    aria-label="Next phase card"
                    className="group relative flex h-11 w-9 shrink-0 items-center justify-center rounded-[2px] border border-[#cbd5e1]/85 bg-gradient-to-b from-[#8b5a2b] via-[#6b4220] to-[#3e230d] text-[#f1f5f9] shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-12"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-3 w-3 -translate-x-0.5 rotate-45 border-r-2 border-t-2 border-[#f8fafc] sm:h-3.5 sm:w-3.5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PhaseCardTray
