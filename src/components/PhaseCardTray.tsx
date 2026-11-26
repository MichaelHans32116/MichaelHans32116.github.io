import { useCallback, useEffect, useState } from 'react'
import { Check, ChevronUp, RotateCcw } from 'lucide-react'
import buildbidCardImg from '../cards/custom/buildbid.jpeg'
import gatepassCardImg from '../cards/custom/gatepass.jpeg'
import topcitCardImg from '../cards/custom/topcit.jpeg'
import { duelSfx } from '../utils/sfx'
import { backCardUrl, frontCardUrl } from './HoloYugiohCard'

export type PortfolioPhase = 'standby' | 'main' | 'battle' | 'end'

interface PhaseCardItem {
  id: 'draw' | PortfolioPhase
  code: string
  label: string
  subtitle: string
  artSrc: string
  accent: string
}

const PHASE_CARDS: PhaseCardItem[] = [
  {
    id: 'draw',
    code: 'DP',
    label: 'Draw Phase',
    subtitle: 'Pull Card Intro',
    artSrc: backCardUrl,
    accent: '#475569',
  },
  {
    id: 'standby',
    code: 'SP',
    label: 'Home',
    subtitle: 'Standby & Profile',
    artSrc: frontCardUrl,
    accent: '#2563eb',
  },
  {
    id: 'main',
    code: 'MP1',
    label: 'Deck',
    subtitle: 'Projects & Proofs',
    artSrc: buildbidCardImg,
    accent: '#0f766e',
  },
  {
    id: 'battle',
    code: 'BP',
    label: 'Experience',
    subtitle: 'Field & Education',
    artSrc: gatepassCardImg,
    accent: '#9d174d',
  },
  {
    id: 'end',
    code: 'EP',
    label: 'Contact',
    subtitle: 'Links & Message',
    artSrc: topcitCardImg,
    accent: '#334155',
  },
]

function getVisibleCount(width: number): number {
  if (width < 520) return 1
  if (width < 768) return 2
  if (width < 1024) return 3
  return 5
}

interface PhaseCardTrayProps {
  activePhase: PortfolioPhase
  theme: 'light' | 'dark'
  onSelectPhase: (phase: PortfolioPhase) => void
  onReplayDraw: () => void
}

export function PhaseCardTray({ activePhase, theme, onSelectPhase, onReplayDraw }: PhaseCardTrayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openAnimKey, setOpenAnimKey] = useState(0)
  const [visibleCount, setVisibleCount] = useState<number>(() =>
    typeof window === 'undefined' ? 5 : getVisibleCount(window.innerWidth),
  )

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
    const onResize = () => {
      const nextCount = getVisibleCount(window.innerWidth)
      setVisibleCount(nextCount)
      syncWindowToIndex(highlightedIdx, nextCount)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [highlightedIdx, syncWindowToIndex])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const activeMeta = PHASE_CARDS[activeIdx]
  const highlightedCard = PHASE_CARDS[highlightedIdx] ?? activeMeta
  const visibleSlice = PHASE_CARDS.slice(windowStart, windowStart + visibleCount)

  const commitPhase = (item: PhaseCardItem) => {
    duelSfx.playFlip()
    setIsOpen(false)
    if (item.id === 'draw') {
      onReplayDraw()
      return
    }
    onSelectPhase(item.id)
  }

  const stepIndex = (delta: -1 | 1) => {
    duelSfx.playHover()
    const nextIdx = Math.max(0, Math.min(PHASE_CARDS.length - 1, highlightedIdx + delta))
    setHighlightedIdx(nextIdx)
    syncWindowToIndex(nextIdx, visibleCount)
  }

  return (
    <>
      {/* Smooth fade backdrop when dock tray is open */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 backdrop-blur-[1.5px] transition-opacity duration-300 ${
          isLight ? 'bg-slate-900/24' : 'bg-black/45'
        } ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <div
        className="pointer-events-none fixed bottom-0 left-1/2 z-40 w-[min(90vw,1320px)] -translate-x-1/2"
        role="region"
        aria-label="Duel Phase Card Switcher"
      >
        {/* Centered Prominent Toggle Handle (sketch-inspired "Choose your tab") */}
        <div className="relative z-10 -mb-[1px] flex justify-center">
          <button
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
            className={`pointer-events-auto group relative inline-flex items-center gap-3 rounded-t-[4px] border border-b-0 px-6 py-2.5 text-sm font-semibold tracking-wide backdrop-blur-md transition-all duration-200 sm:px-9 sm:py-3 ${
              isLight
                ? 'border-[#94a3b8] bg-[#ffffff]/96 text-[#181a1f] shadow-[0_-8px_24px_rgba(15,23,42,0.12)] hover:border-[#475569] hover:bg-[#f8fafc]'
                : 'border-[#94a3b8]/70 bg-[#0d1322]/96 text-slate-100 shadow-[0_-8px_24px_rgba(0,0,0,0.28)] hover:border-[#f1f5f9] hover:bg-[#131b30]'
            }`}
          >
            {/* Top metallic brushed silver accent line */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-3 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-85 ${
                isLight ? 'via-[#64748b]' : 'via-[#e2e8f0]'
              }`}
            />
            <span
              className={`h-2.5 w-2.5 rotate-45 rounded-[1px] border ${
                isLight
                  ? 'border-[#334155]/60 bg-[#647081] shadow-[0_0_6px_rgba(100,116,139,0.35)]'
                  : 'border-[#f8fafc]/80 bg-[#cbd5e1] shadow-[0_0_8px_rgba(226,232,240,0.65)]'
              }`}
            />
            <span>Choose your tab</span>
            <span
              className={`rounded-[2px] border px-2 py-0.5 font-mono-tech text-[11px] font-medium ${
                isLight
                  ? 'border-[#cbd5e1] bg-[#eeebe2] text-[#181a1f]'
                  : 'border-white/15 bg-white/10 text-[#e2e8f0]'
              }`}
            >
              {activeMeta.code} · {activeMeta.label}
            </span>
            <ChevronUp
              className={`h-4 w-4 transition-transform duration-300 ${
                isLight ? 'text-[#475569]' : 'text-[#cbd5e1]'
              } ${isOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </div>

        {/* Full 90vw Docked Drawer Shell (adapts seamlessly to Day / Night mode) */}
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
          {/* Thin Silver Top Rim on 90vw bar */}
          <div
            className={`h-[3px] w-full bg-gradient-to-r ${
              isLight
                ? 'from-slate-300/60 via-[#64748b]/85 to-slate-300/60'
                : 'from-slate-600/35 via-[#e2e8f0]/80 to-slate-600/35'
            }`}
          />

          {/* Subtle resting lip height when collapsed */}
          {!isOpen && <div className="h-2.5 w-full" aria-hidden="true" />}

          {/* Smooth CSS Grid-Row Reveal Container */}
          <div
            aria-hidden={!isOpen}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-3 pb-4 pt-3.5 sm:px-6 sm:pb-5 sm:pt-4">
                {/* Compact Header Strip */}
                <div
                  className={`mb-3 flex items-center justify-between gap-3 border-b pb-2 ${
                    isLight ? 'border-[#dedad0]' : 'border-white/12'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <span
                      className={`font-mono-tech text-[11px] uppercase tracking-[0.14em] ${
                        isLight ? 'text-[#475569]' : 'text-[#e2e8f0]'
                      }`}
                    >
                      Phase Tray
                    </span>
                    <span className={isLight ? 'text-[#94a3b8]' : 'text-white/30'}>·</span>
                    <span className={isLight ? 'text-[#4e5460]' : 'text-slate-300'}>
                      {highlightedCard.code} — {highlightedCard.label}
                    </span>
                  </div>
                  <span
                    className={`font-mono-tech text-[11px] ${
                      isLight ? 'text-[#647081]' : 'text-slate-400'
                    }`}
                  >
                    {highlightedIdx + 1} / {PHASE_CARDS.length}
                  </span>
                </div>

                {/* Face-Up Phase Cards Row + Brown Pendulum Diamond Arrows */}
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <button
                    type="button"
                    tabIndex={isOpen ? 0 : -1}
                    onClick={() => stepIndex(-1)}
                    disabled={highlightedIdx === 0}
                    aria-label="Previous phase card"
                    className="group relative flex h-12 w-10 shrink-0 items-center justify-center rounded-[2px] border border-[#cbd5e1]/85 bg-gradient-to-b from-[#8b5a2b] via-[#6b4220] to-[#3e230d] text-[#f1f5f9] shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-12"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-3.5 w-3.5 translate-x-0.5 rotate-45 border-b-2 border-l-2 border-[#f8fafc]"
                    />
                  </button>

                  <div className="flex flex-1 items-end justify-center gap-3 pt-2.5 sm:gap-5">
                    {visibleSlice.map((item, sliceIdx) => {
                      const cardIndex = PHASE_CARDS.findIndex((c) => c.id === item.id)
                      const isHighlighted = cardIndex === highlightedIdx
                      const isCurrentPhase = item.id === activePhase

                      const cardStateClass = isLight
                        ? isHighlighted
                          ? '-translate-y-2 scale-[1.03] border-[#475569] bg-[#ffffff] shadow-[0_12px_28px_rgba(71,85,105,0.24)]'
                          : 'border-[#cbd5e1] bg-[#ffffff]/92 opacity-85 hover:-translate-y-1 hover:border-[#64748b] hover:opacity-100'
                        : isHighlighted
                          ? '-translate-y-2 scale-[1.03] border-[#e2e8f0] bg-[#162038] shadow-[0_0_26px_rgba(226,232,240,0.34)]'
                          : 'border-white/15 bg-[#11192c]/90 opacity-80 hover:-translate-y-1 hover:border-slate-300/50 hover:opacity-100'

                      return (
                        <button
                          key={`${item.id}-${openAnimKey}`}
                          type="button"
                          tabIndex={isOpen ? 0 : -1}
                          onClick={() => {
                            if (isHighlighted) {
                              commitPhase(item)
                            } else {
                              duelSfx.playHover()
                              setHighlightedIdx(cardIndex)
                            }
                          }}
                          style={{ animationDelay: `${sliceIdx * 45}ms` }}
                          className={`ygo-card-deal-in group relative flex w-[132px] shrink-0 flex-col overflow-hidden rounded-[2px] border text-left transition-all duration-200 sm:w-[144px] lg:w-[152px] ${cardStateClass}`}
                        >
                          {/* Brushed-silver highlight sheen sweep on active/highlighted card */}
                          {isHighlighted && (
                            <span
                              aria-hidden="true"
                              className="ygo-card-sheen pointer-events-none absolute inset-y-0 z-10 w-16 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-[1px]"
                            />
                          )}

                          {/* Top Card Frame Bar */}
                          <div
                            className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold tracking-wider text-white"
                            style={{ backgroundColor: item.accent }}
                          >
                            <span className="font-mono-tech">{item.code}</span>
                            <span>{isCurrentPhase ? 'ACTIVE' : 'PHASE'}</span>
                          </div>

                          {/* Face-up Yu-Gi-Oh! Card Art */}
                          <div className="relative aspect-[59/86] w-full overflow-hidden bg-black/50">
                            <img
                              src={item.artSrc}
                              alt={`${item.label} face-up card`}
                              className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-[1.03]"
                            />
                            {item.id === 'draw' && (
                              <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-[2px] bg-black/75 px-1.5 py-0.5 font-mono-tech text-[9px] text-[#e2e8f0]">
                                <RotateCcw className="h-2.5 w-2.5" />
                                Intro
                              </span>
                            )}
                          </div>

                          {/* Card Label Footer */}
                          <div
                            className={`border-t px-2 py-1.5 ${
                              isLight ? 'border-[#e2dfd5]' : 'border-white/10'
                            }`}
                          >
                            <div
                              className={`truncate text-xs font-semibold ${
                                isLight ? 'text-[#181a1f]' : 'text-white'
                              }`}
                            >
                              {item.label}
                            </div>
                            <div
                              className={`truncate text-[10px] ${
                                isLight ? 'text-[#4e5460]' : 'text-slate-300/80'
                              }`}
                            >
                              {item.subtitle}
                            </div>
                          </div>
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
                    className="group relative flex h-12 w-10 shrink-0 items-center justify-center rounded-[2px] border border-[#cbd5e1]/85 bg-gradient-to-b from-[#8b5a2b] via-[#6b4220] to-[#3e230d] text-[#f1f5f9] shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 sm:h-14 sm:w-12"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-3.5 w-3.5 -translate-x-0.5 rotate-45 border-r-2 border-t-2 border-[#f8fafc]"
                    />
                  </button>
                </div>

                {/* Bottom Center Theme-Adaptive Confirmation Bar */}
                <div
                  className={`mt-3.5 flex items-center justify-center gap-3 border-t pt-3 ${
                    isLight ? 'border-[#dedad0]' : 'border-white/12'
                  }`}
                >
                  <button
                    type="button"
                    tabIndex={isOpen ? 0 : -1}
                    onClick={() => commitPhase(highlightedCard)}
                    className={`inline-flex min-w-[168px] items-center justify-center gap-2 rounded-[2px] border px-6 py-2 text-xs font-semibold tracking-wide shadow transition active:scale-[0.98] ${
                      isLight
                        ? 'border-[#181a1f] bg-[#181a1f] text-[#ffffff] hover:bg-[#2a2e38]'
                        : 'border-[#f8fafc] bg-gradient-to-b from-[#f1f5f9] to-[#cbd5e1] text-[#0b0e14] hover:brightness-105'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Select · {highlightedCard.label}</span>
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
