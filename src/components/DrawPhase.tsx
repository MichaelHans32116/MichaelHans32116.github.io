import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowRight, Briefcase, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { ACE_CARD, DUELIST_PROFILE } from '../data/portfolioData'
import { duelSfx } from '../utils/sfx'
import { CardBack } from './CardBack'
import { YuGiOhCard } from './YuGiOhCard'

interface DrawPhaseProps {
  onEnterField: () => void
  onEnterRecruiter: () => void
  sfxEnabled: boolean
  onToggleSfx: () => void
}

type DrawState = 'idle' | 'drawing' | 'revealed' | 'summoning'

export const DrawPhase: React.FC<DrawPhaseProps> = ({
  onEnterField,
  onEnterRecruiter,
  sfxEnabled,
  onToggleSfx,
}) => {
  const [phase, setPhase] = useState<DrawState>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const deckRef = useRef<HTMLButtonElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const flyingRef = useRef<HTMLDivElement>(null)
  const flipperRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const revealActionsRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const handleDraw = useCallback(() => {
    if (phase !== 'idle') return
    const deckEl = deckRef.current
    const targetEl = targetRef.current
    const flyingEl = flyingRef.current
    const flipperEl = flipperRef.current
    const flashEl = flashRef.current

    if (!deckEl || !targetEl || !flyingEl || !flipperEl) {
      setPhase('revealed')
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      duelSfx.playFlip()
      setPhase('revealed')
      return
    }

    setPhase('drawing')
    duelSfx.playDraw()

    const deckRect = deckEl.getBoundingClientRect()
    const targetRect = targetEl.getBoundingClientRect()

    const startX = deckRect.left + deckRect.width / 2 - (targetRect.left + targetRect.width / 2)
    const startY = deckRect.top + deckRect.height / 2 - (targetRect.top + targetRect.height / 2)
    const startScale = deckRect.width / targetRect.width

    tlRef.current?.kill()

    gsap.set(flyingEl, {
      opacity: 1,
      x: startX,
      y: startY,
      scale: startScale,
      rotateZ: -3,
      zIndex: 30,
    })
    gsap.set(flipperEl, { rotateY: 0 })
    if (flashEl) {
      gsap.set(flashEl, { xPercent: -140, opacity: 0 })
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('revealed')
      },
    })

    // 1. Lift crisp top card off the 3D deck stack
    tl.to(flyingEl, {
      x: startX - 24,
      y: startY - 56,
      scale: startScale * 1.1,
      rotateZ: -11,
      duration: 0.24,
      ease: 'power2.out',
    })
      // 2. Sweep in parabolic arc to center stage
      .to(flyingEl, {
        x: 0,
        y: 0,
        scale: 1,
        rotateZ: 0,
        duration: 0.56,
        ease: 'power3.out',
      })
      // 3. Synchronized 3D flip mid-flight
      .to(
        flipperEl,
        {
          rotateY: 180,
          duration: 0.52,
          ease: 'power2.inOut',
          onStart: () => {
            window.setTimeout(() => duelSfx.playFlip(), 180)
          },
        },
        '-=0.44',
      )

    // 4. Sharp antique-gold foil sweep across the revealed card
    if (flashEl) {
      tl.fromTo(
        flashEl,
        { xPercent: -140, opacity: 0.95 },
        { xPercent: 160, opacity: 0, duration: 0.55, ease: 'power2.out' },
        '-=0.14',
      )
    }

    tlRef.current = tl
  }, [phase])

  const handleSummon = useCallback(() => {
    if (phase === 'summoning') return
    setPhase('summoning')
    duelSfx.playSummon()

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current) {
      onEnterField()
      return
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.36,
      ease: 'power2.inOut',
      onComplete: onEnterField,
    })
  }, [onEnterField, phase])

  const handleRedraw = useCallback(() => {
    tlRef.current?.kill()
    duelSfx.playClick()
    setPhase('idle')
  }, [])

  // Fade in revealed action bar cleanly
  useEffect(() => {
    if (phase === 'revealed' && revealActionsRef.current) {
      gsap.fromTo(
        revealActionsRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.36, ease: 'power2.out' },
      )
    }
  }, [phase])

  // Keyboard shortcuts: Space/Enter to draw or summon, Escape to skip
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space' || e.code === 'Enter') {
        if (phase === 'idle') {
          e.preventDefault()
          handleDraw()
        } else if (phase === 'revealed') {
          e.preventDefault()
          handleSummon()
        }
      } else if (e.code === 'Escape') {
        e.preventDefault()
        onEnterField()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleDraw, handleSummon, onEnterField, phase])

  useEffect(() => {
    return () => {
      tlRef.current?.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="duel-mat-bg relative flex min-h-screen flex-col justify-between overflow-hidden px-4 py-5 sm:px-8 sm:py-6"
    >
      {/* Subtle architectural Duel Mat corner lines (static SVG -> zero CPU cost) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="0" y1="74" x2="100%" y2="74" stroke="#D4AF37" strokeWidth="0.6" strokeOpacity="0.4" />
        <line x1="0" y1="92%" x2="100%" y2="92%" stroke="#D4AF37" strokeWidth="0.6" strokeOpacity="0.3" />
      </svg>

      {/* Top Bar */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#D4AF37]/50 bg-[#10131c] font-display text-xs font-bold tracking-wider text-[#F3DA8B]">
            MH
          </div>
          <div>
            <p className="font-mono-tech text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">
              DUEL DISK OS // v2.6
            </p>
            <p className="text-xs text-[#98A2B3]">{DUELIST_PROFILE.fullName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleSfx}
            className="font-mono-tech inline-flex items-center gap-1.5 rounded-md border border-[#D4AF37]/25 bg-[#10131b]/90 px-2.5 py-1.5 text-[11px] text-[#c7cdd9] transition hover:border-[#D4AF37]/60 hover:text-[#F3DA8B]"
            title="Toggle synthesized sound effects"
          >
            {sfxEnabled ? <Volume2 className="h-3.5 w-3.5 text-[#D4AF37]" /> : <VolumeX className="h-3.5 w-3.5 text-[#7a8499]" />}
            <span className="hidden sm:inline">{sfxEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              duelSfx.playClick()
              onEnterRecruiter()
            }}
            className="font-mono-tech inline-flex items-center gap-1.5 rounded-md border border-[#4EA8DE]/35 bg-[#0e1726]/90 px-3 py-1.5 text-[11px] text-[#9bd3f5] transition hover:border-[#4EA8DE]/70 hover:bg-[#132238]"
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Recruiter View</span>
          </button>

          <button
            type="button"
            onClick={() => {
              duelSfx.playClick()
              onEnterField()
            }}
            className="font-mono-tech inline-flex items-center gap-1.5 rounded-md border border-[#2a3040] bg-[#10131b]/80 px-3 py-1.5 text-[11px] text-[#b4bccb] transition hover:border-[#D4AF37]/50 hover:text-white"
          >
            <span>Skip Intro</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Center Duel Mat Stage */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center py-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
        {/* Left Phase Indicator (Desktop) */}
        <div className="hidden flex-col items-start gap-4 lg:flex">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#11151e] px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
            <span className="font-mono-tech text-[10.5px] tracking-[0.18em] text-[#F3DA8B] uppercase">
              {phase === 'idle' ? 'TURN 01 · DRAW PHASE' : 'ACE CARD DRAWN'}
            </span>
          </div>
          <h1 className="font-display text-3xl leading-tight font-bold tracking-wide text-[#f2f4f8] xl:text-4xl">
            {phase === 'revealed' ? 'Michael Hans, Ready to Deploy.' : 'Draw From the Deck to Begin.'}
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-[#98A2B3]">
            {phase === 'revealed'
              ? 'Move your cursor across the Ace Card to inspect the 3D shadowbox and holographic foil, then summon to open the full engineering deck and Duel Terminal.'
              : 'An interactive duelist portfolio built around real full-stack systems, database security, and zero template fluff. Prefer a direct resume layout? Use Recruiter View anytime.'}
          </p>
          <div className="font-mono-tech flex items-center gap-4 border-t border-[#D4AF37]/18 pt-3 text-[11px] text-[#7f8a9e]">
            <span>LP 8000</span>
            <span>·</span>
            <span>BSIT 4TH YR</span>
            <span>·</span>
            <span>DOST-SEI</span>
          </div>
        </div>

        {/* Center Summon Zone + Drawn Ace Card */}
        <div className="flex flex-col items-center">
          {/* Mobile Header Copy */}
          <div className="mb-4 text-center lg:hidden">
            <span className="font-mono-tech inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#11151e] px-3 py-0.5 text-[10px] tracking-[0.16em] text-[#F3DA8B] uppercase">
              {phase === 'idle' ? 'TURN 01 · DRAW PHASE' : 'ACE MONSTER REVEALED'}
            </span>
            <h1 className="font-display mt-2 text-xl font-bold text-[#f2f4f8] sm:text-2xl">
              {phase === 'revealed' ? 'Michael Hans Magbojos' : 'Draw Your Opening Card'}
            </h1>
          </div>

          {/* Target Slot Container */}
          <div
            ref={targetRef}
            className="relative aspect-[59/86] w-[256px] sm:w-[292px]"
          >
            {/* Empty Etched Monster Zone Outline (visible while idle or mid-flight) */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center rounded-[0.8rem] border border-dashed transition-opacity duration-300 ${
                phase === 'revealed'
                  ? 'pointer-events-none border-transparent opacity-0'
                  : 'border-[#D4AF37]/38 bg-[#0c0f16]/75 opacity-100'
              }`}
            >
              <div className="pointer-events-none absolute inset-3 rounded-[0.55rem] border border-[#D4AF37]/15" />
              <div className="flex flex-col items-center px-6 text-center">
                <Sparkles className="mb-3 h-6 w-6 text-[#D4AF37]/70" />
                <p className="font-display text-sm font-semibold tracking-[0.16em] text-[#F3DA8B] uppercase">
                  ACE MONSTER ZONE
                </p>
                <p className="font-mono-tech mt-2 text-[11px] leading-relaxed text-[#8d97ab]">
                  {phase === 'drawing' ? 'Drawing from Main Deck...' : 'Click the Deck or press [SPACE]'}
                </p>
              </div>
            </div>

            {/* GSAP Flying Card Layer (Active ONLY during 'drawing') */}
            <div
              ref={flyingRef}
              className={`ygo-stage pointer-events-none absolute inset-0 ${
                phase === 'drawing' ? 'block' : 'hidden'
              }`}
            >
              <div
                ref={flipperRef}
                className="relative h-full w-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Face 1: Card Back */}
                <div className="ygo-face absolute inset-0">
                  <CardBack />
                </div>
                {/* Face 2: Ace Monster Card Front */}
                <div className="ygo-face ygo-face-back absolute inset-0 overflow-hidden rounded-[0.7rem]">
                  <YuGiOhCard
                    serial={ACE_CARD.serial}
                    cardName={ACE_CARD.cardName}
                    cardKind={ACE_CARD.cardKind}
                    attribute={ACE_CARD.attribute}
                    typeLine={ACE_CARD.typeLine}
                    levelOrRating={ACE_CARD.levelOrRating}
                    stars={ACE_CARD.stars}
                    atk={ACE_CARD.atk}
                    def={ACE_CARD.def}
                    artSrc={ACE_CARD.artSrc}
                    artMode={ACE_CARD.artMode}
                    effectText={ACE_CARD.effectText}
                    size="lg"
                    disableTilt
                  />
                  {/* Gold Foil Flash Sweep */}
                  <div
                    ref={flashRef}
                    className="draw-flash-sweep pointer-events-none absolute inset-0 z-30"
                  />
                </div>
              </div>
            </div>

            {/* Interactive Final Revealed Ace Card */}
            {phase === 'revealed' && (
              <div className="relative h-full w-full">
                <YuGiOhCard
                  serial={ACE_CARD.serial}
                  cardName={ACE_CARD.cardName}
                  cardKind={ACE_CARD.cardKind}
                  attribute={ACE_CARD.attribute}
                  typeLine={ACE_CARD.typeLine}
                  levelOrRating={ACE_CARD.levelOrRating}
                  stars={ACE_CARD.stars}
                  atk={ACE_CARD.atk}
                  def={ACE_CARD.def}
                  artSrc={ACE_CARD.artSrc}
                  artMode={ACE_CARD.artMode}
                  effectText={ACE_CARD.effectText}
                  backStats={ACE_CARD.backStats}
                  flippable
                  size="lg"
                />
              </div>
            )}
          </div>

          {/* Action Bar Under Card */}
          <div className="mt-5 flex min-h-[52px] flex-wrap items-center justify-center gap-3">
            {phase === 'idle' && (
              <button
                type="button"
                onClick={handleDraw}
                className="font-display inline-flex items-center gap-2 rounded-md border border-[#D4AF37]/80 bg-gradient-to-b from-[#d4af37] to-[#9d7c24] px-6 py-2.5 text-xs font-bold tracking-[0.16em] text-[#090a0d] uppercase shadow-[0_10px_28px_-10px_rgba(212,175,55,0.65)] transition hover:brightness-110 active:scale-[0.98]"
              >
                <span>Draw Ace Card</span>
                <span className="font-mono-tech rounded bg-[#090a0d]/20 px-1.5 py-0.5 text-[10px]">SPACE</span>
              </button>
            )}

            {phase === 'revealed' && (
              <div ref={revealActionsRef} className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSummon}
                  className="font-display inline-flex items-center gap-2 rounded-md border border-[#F3DA8B]/90 bg-gradient-to-b from-[#e0bc4c] to-[#a68327] px-6 py-2.5 text-xs font-bold tracking-[0.16em] text-[#090a0d] uppercase shadow-[0_12px_30px_-10px_rgba(212,175,55,0.7)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  <span>Summon to Field</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedraw}
                  className="font-mono-tech inline-flex items-center gap-1.5 rounded-md border border-[#D4AF37]/30 bg-[#11151f] px-3.5 py-2.5 text-xs text-[#cfd5e2] transition hover:border-[#D4AF37]/65 hover:text-[#F3DA8B]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Redraw</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Physical 3D Stacked Main Deck */}
        <div className="mt-6 flex flex-col items-center lg:mt-0 lg:items-end">
          <div className="flex flex-col items-center">
            <button
              ref={deckRef}
              type="button"
              onClick={handleDraw}
              disabled={phase !== 'idle'}
              aria-label="Draw card from Main Deck"
              className={`group relative aspect-[59/86] w-[124px] sm:w-[144px] focus:outline-none ${
                phase === 'idle' ? 'cursor-pointer' : 'cursor-default opacity-60'
              }`}
            >
              {/* 6 stacked cardstock depth layers */}
              {[6, 5, 4, 3, 2, 1].map((offset) => (
                <div
                  key={offset}
                  className="deck-stack-card pointer-events-none"
                  style={{
                    transform: `translate(${offset * 1.4}px, ${offset * 1.6}px)`,
                    opacity: 0.92 - offset * 0.08,
                  }}
                />
              ))}

              {/* Top Interactive Deck Card */}
              <div
                className={`relative h-full w-full rounded-[0.7rem] transition-transform duration-200 ${
                  phase === 'idle'
                    ? 'deck-top-pulse group-hover:-translate-y-2 group-hover:-rotate-2'
                    : ''
                }`}
              >
                <CardBack compact />
              </div>
            </button>

            <div className="mt-4 text-center">
              <p className="font-mono-tech text-[10.5px] font-semibold tracking-[0.18em] text-[#F3DA8B] uppercase">
                MAIN DECK · {phase === 'idle' ? '09' : '08'} CARDS
              </p>
              <p className="font-mono-tech mt-0.5 text-[10px] text-[#7e899e]">
                {phase === 'idle' ? 'Click stack to draw' : 'Ace Card on field'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Subtle Footer Strip */}
      <footer className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between text-[11px] text-[#7c879c]">
        <span className="font-mono-tech">CALAMBA, LAGUNA · PH</span>
        <span className="font-mono-tech hidden sm:inline">
          [SPACE] DRAW / SUMMON · [ESC] ENTER FIELD
        </span>
        <span className="font-mono-tech text-[#D4AF37]/85">600H OJT · DEC 2026</span>
      </footer>
    </div>
  )
}
