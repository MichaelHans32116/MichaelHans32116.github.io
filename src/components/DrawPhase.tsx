import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowDown, Moon, RotateCcw, Sun } from 'lucide-react'
import { duelSfx } from '../utils/sfx'
import { AudioControls } from './AudioControls'
import { DuelFieldBg } from './DuelFieldBg'
import { backCardUrl, frontCardUrl, HoloYugiohCard } from './HoloYugiohCard'

interface DrawPhaseProps {
  onEnterPortfolio: () => void
  sfxEnabled: boolean
  bgmMuted: boolean
  bgmVolume: number
  onToggleSfx: () => void
  onToggleBgmMute: () => void
  onChangeBgmVolume: (vol: number) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

type DrawState = 'idle' | 'animating' | 'revealed' | 'entering'

const SUMMON_SPARKS = Array.from({ length: 18 }).map((_, idx) => ({
  angle: `${idx * 20}deg`,
  dist: `${-(130 + (idx % 3) * 44)}px`,
  color: idx % 3 === 0 ? '#93c5fd' : '#e2e8f0',
  size: idx % 2 === 0 ? 6 : 4,
}))

export const DrawPhase: React.FC<DrawPhaseProps> = ({
  onEnterPortfolio,
  sfxEnabled,
  bgmMuted,
  bgmVolume,
  onToggleSfx,
  onToggleBgmMute,
  onChangeBgmVolume,
  theme,
  onToggleTheme,
}) => {
  const [phase, setPhase] = useState<DrawState>('idle')
  const [dragState, setDragState] = useState<'none' | 'pulling' | 'ready' | 'tap-hint'>('none')
  const [burstKey, setBurstKey] = useState(0)

  const [introActive, setIntroActive] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [introLeaving, setIntroLeaving] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const deckLayerRef = useRef<HTMLDivElement>(null)
  const pulledCardRef = useRef<HTMLDivElement>(null)
  const revealLayerRef = useRef<HTMLDivElement>(null)
  const popCardRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const currentDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const dismissIntro = useCallback(() => {
    setIntroLeaving(true)
    window.setTimeout(() => {
      setIntroActive(false)
    }, 240)
  }, [])

  useEffect(() => {
    if (!introActive) return
    const fadeTimer = window.setTimeout(() => setIntroLeaving(true), 1180)
    const hideTimer = window.setTimeout(() => setIntroActive(false), 1560)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [introActive])

  const getPullThreshold = () => Math.min(130, Math.max(85, window.innerHeight * 0.16))

  const runPullAndPopSequence = useCallback((startX = 0, startY = 0) => {
    setPhase('animating')
    setDragState('none')
    pointerStartRef.current = null
    duelSfx.playPull()

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const deckLayer = deckLayerRef.current
    const pulledEl = pulledCardRef.current
    const revealLayer = revealLayerRef.current
    const popEl = popCardRef.current
    const actionsEl = actionsRef.current

    if (prefersReduced || !deckLayer || !pulledEl || !revealLayer || !popEl) {
      duelSfx.playReveal()
      setBurstKey((k) => k + 1)
      setPhase('revealed')
      return
    }

    tlRef.current?.kill()

    gsap.set(deckLayer, { opacity: 1, scale: 1 })
    gsap.set(pulledEl, {
      x: startX,
      y: startY,
      z: startY > 0 ? 24 : 0,
      rotateX: startY > 0 ? -9 : 0,
      rotateZ: startX * 0.05,
      opacity: 1,
    })
    gsap.set(revealLayer, { opacity: 1 })
    gsap.set(popEl, {
      y: window.innerHeight * 0.78,
      scale: 0.72,
      rotateX: 24,
      rotateZ: -3,
      opacity: 0,
    })
    if (actionsEl) {
      gsap.set(actionsEl, { opacity: 0, y: 12 })
    }

    const tl = gsap.timeline()

    tl.to(pulledEl, {
      y: window.innerHeight + 300,
      z: 48,
      rotateX: -14,
      x: startX * 1.35,
      rotateZ: startX >= 0 ? 7 : -7,
      duration: 0.4,
      ease: 'power2.in',
    })
      .to(
        deckLayer,
        {
          opacity: 0,
          scale: 0.94,
          duration: 0.22,
          ease: 'power2.out',
        },
        '-=0.10',
      )
      .to(popEl, {
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateZ: 0,
        opacity: 1,
        duration: 0.78,
        ease: 'back.out(1.65)',
        onStart: () => {
          duelSfx.playReveal()
          duelSfx.ensureBgmPlaying()
        },
      })
      .call(
        () => {
          setBurstKey((k) => k + 1)
        },
        undefined,
        '-=0.34',
      )
      .call(() => {
        setPhase('revealed')
        if (actionsRef.current) {
          gsap.to(actionsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.34,
            ease: 'power2.out',
          })
        }
      })

    tlRef.current = tl
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 'idle' || introActive) return
    duelSfx.ensureBgmPlaying()
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
    currentDragRef.current = { x: 0, y: 0 }
    setDragState('pulling')
    e.currentTarget.setPointerCapture(e.pointerId)
    if (pulledCardRef.current) {
      gsap.killTweensOf(pulledCardRef.current)
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 'idle' || !pointerStartRef.current || !pulledCardRef.current) return

    const dx = e.clientX - pointerStartRef.current.x
    const dy = e.clientY - pointerStartRef.current.y
    const maxPull = Math.max(220, window.innerHeight * 0.36)
    const threshold = getPullThreshold()

    const clampedY = Math.max(-18, Math.min(maxPull, dy))
    const clampedX = Math.max(-44, Math.min(44, dx * 0.4))
    const lift = Math.min(1, Math.max(0, clampedY / threshold))
    currentDragRef.current = { x: clampedX, y: clampedY }

    gsap.set(pulledCardRef.current, {
      x: clampedX,
      y: clampedY,
      z: lift * 26,
      rotateX: -lift * 10,
      rotateZ: clampedX * 0.06,
    })

    if (clampedY >= threshold) {
      if (dragState !== 'ready') setDragState('ready')
    } else if (dragState !== 'pulling') {
      setDragState('pulling')
    }
  }

  const handlePointerUp = () => {
    if (phase !== 'idle' || !pointerStartRef.current || !pulledCardRef.current) return
    const { x, y } = currentDragRef.current
    const threshold = getPullThreshold()
    pointerStartRef.current = null

    if (y >= threshold) {
      runPullAndPopSequence(x, y)
      return
    }

    setDragState(y < 16 ? 'tap-hint' : 'none')
    gsap.to(pulledCardRef.current, {
      x: 0,
      y: 0,
      z: 0,
      rotateX: 0,
      rotateZ: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.65)',
    })

    if (y < 16) {
      window.setTimeout(() => {
        setDragState((prev) => (prev === 'tap-hint' ? 'none' : prev))
      }, 950)
    }
  }

  const handleEnter = useCallback(() => {
    if (phase === 'entering') return
    setPhase('entering')
    duelSfx.playHover()

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !rootRef.current) {
      onEnterPortfolio()
      return
    }

    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.28,
      ease: 'power2.inOut',
      onComplete: onEnterPortfolio,
    })
  }, [onEnterPortfolio, phase])

  const handlePullAgain = useCallback(() => {
    tlRef.current?.kill()
    duelSfx.playHover()
    setBurstKey(0)
    setDragState('none')
    pointerStartRef.current = null
    currentDragRef.current = { x: 0, y: 0 }

    const els = [
      deckLayerRef.current,
      pulledCardRef.current,
      revealLayerRef.current,
      popCardRef.current,
      actionsRef.current,
    ].filter(Boolean)
    if (els.length > 0) {
      gsap.killTweensOf(els)
      gsap.set(els, { clearProps: 'all' })
    }
    setPhase('idle')
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (introActive) {
        if (e.code === 'Escape' || e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault()
          dismissIntro()
        }
        return
      }
      if (phase === 'idle' && (e.code === 'ArrowDown' || e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        duelSfx.ensureBgmPlaying()
        runPullAndPopSequence(0, 28)
      } else if (phase === 'revealed' && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault()
        handleEnter()
      } else if (e.code === 'Escape') {
        e.preventDefault()
        onEnterPortfolio()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dismissIntro, handleEnter, introActive, onEnterPortfolio, phase, runPullAndPopSequence])

  useEffect(() => {
    return () => {
      tlRef.current?.kill()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      onClick={() => {
        if (phase === 'revealed') {
          handleEnter()
        }
      }}
      className={`splash-canvas relative h-[100dvh] w-full overflow-hidden select-none ${
        phase === 'revealed' ? 'cursor-pointer' : ''
      }`}
    >
      {/* ARCHITECTURAL YU-GI-OH! DUEL FIELD PLAYMAT */}
      <DuelFieldBg variant="splash" />

      {/* BUILDBID-STYLE YU-GI-OH! LOGO INTRO (~1.5s, click or key to skip) */}
      {introActive && (
        <div
          onClick={(e) => {
            e.stopPropagation()
            dismissIntro()
          }}
          data-leaving={introLeaving ? 'true' : 'false'}
          role="button"
          tabIndex={0}
          aria-label="Skip opening emblem"
          className="ygo-splash-intro splash-canvas fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center px-6"
        >
          <div className="ygo-logo-enter relative flex flex-col items-center">
            <div className="relative flex items-center justify-center px-6 py-4">
              <svg
                viewBox="0 0 560 170"
                className="h-auto w-[min(440px,84vw)] drop-shadow-[0_14px_26px_rgba(0,0,0,0.42)]"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ygoFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--logo-flame-top)" />
                    <stop offset="55%" stopColor="var(--logo-flame-mid)" />
                    <stop offset="100%" stopColor="var(--logo-flame-dark)" />
                  </linearGradient>
                  <linearGradient id="ygoSilverRim" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                </defs>
                <polygon
                  points="24,96 76,34 114,56 168,14 218,52 280,10 342,52 392,14 446,56 484,34 536,96 474,116 502,156 402,130 342,162 280,126 218,162 158,130 58,156 86,116"
                  fill="url(#ygoFlameGrad)"
                  stroke="var(--logo-stroke)"
                  strokeWidth="8"
                  strokeLinejoin="miter"
                />
                <polygon
                  points="58,94 98,52 132,68 176,34 220,64 280,28 340,64 384,34 428,68 462,52 502,94 454,110 472,138 394,118 340,144 280,114 220,144 166,118 88,138 106,110"
                  fill="none"
                  stroke="url(#ygoSilverRim)"
                  strokeWidth="2.4"
                  opacity="0.82"
                />
              </svg>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <span
                  className="relative select-none px-4 text-center text-[clamp(1.65rem,6.2vw,3.1rem)] font-black tracking-[0.06em] uppercase"
                  style={{
                    fontFamily: 'var(--font-ygo-title)',
                    color: '#f8fafc',
                    WebkitTextStroke: '1.8px #111111',
                    textShadow:
                      '0 2px 0 #111111, 0 4px 0 rgba(0,0,0,0.65), 0 0 18px rgba(226, 232, 240, 0.45)',
                  }}
                >
                  MICHAEL HANS
                </span>
                <span className="ygo-logo-sheen pointer-events-none absolute inset-y-2 w-20 bg-gradient-to-r from-transparent via-white/75 to-transparent blur-[2px]" />
              </div>
            </div>

            <p className="mt-1 font-mono-tech text-[11px] font-semibold tracking-[0.28em] text-[var(--text-secondary)] uppercase">
              DUELIST PORTFOLIO
            </p>
          </div>
        </div>
      )}

      {/* Top-Right Controls ("Skip intro" hides automatically once pulled!) */}
      <div
        className="absolute right-4 top-4 z-40 flex items-center gap-2 sm:right-7 sm:top-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] shadow-sm transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
          title={theme === 'light' ? 'Switch to Dark Field' : 'Switch to Light Field'}
          aria-label="Toggle color theme"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <AudioControls
          bgmMuted={bgmMuted}
          bgmVolume={bgmVolume}
          sfxEnabled={sfxEnabled}
          onToggleBgmMute={onToggleBgmMute}
          onChangeBgmVolume={onChangeBgmVolume}
          onToggleSfx={onToggleSfx}
        />

        {phase === 'idle' && (
          <button
            type="button"
            onClick={() => {
              duelSfx.playHover()
              onEnterPortfolio()
            }}
            className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] shadow-sm transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
          >
            Skip intro →
          </button>
        )}
      </div>

      {/* LAYER 1: 3D ANGLED STACKED DECK ON DUEL FIELD + LARGE ARROW DOWN + "Pull your card" */}
      <div
        ref={deckLayerRef}
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pb-8 ${
          phase === 'revealed' || phase === 'entering' ? 'pointer-events-none opacity-0' : ''
        }`}
      >
        <div
          className="relative aspect-[59/86] w-[min(220px,49vw,calc(44dvh*59/86))]"
          style={{ perspective: '1150px' }}
        >
          <div
            className="relative h-full w-full"
            style={{
              transform: 'rotateX(24deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[4px] bg-black/35 blur-lg"
              style={{
                transform: 'translateZ(-24px) translateY(10px) scale(0.98)',
              }}
            />

            {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((layer) => (
              <div
                key={layer}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2px] border-b border-[#d6b77b]/35 bg-[#1a130b]"
                style={{
                  transform: `translateZ(${-layer * 2.3}px)`,
                  opacity: 0.98 - layer * 0.03,
                }}
              >
                <img
                  src={backCardUrl}
                  alt=""
                  className="h-full w-full object-cover brightness-90"
                  draggable={false}
                />
              </div>
            ))}

            <div
              ref={pulledCardRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              role="button"
              tabIndex={phase === 'idle' && !introActive ? 0 : -1}
              aria-label="Grab and pull card downward"
              className="relative z-10 h-full w-full cursor-grab touch-none overflow-hidden rounded-[2px] shadow-[0_14px_26px_-10px_rgba(0,0,0,0.45)] active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-silver)]"
            >
              <img
                src={backCardUrl}
                alt="Yu-Gi-Oh Card Back"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>

        <div
          className={`pointer-events-none mt-8 flex flex-col items-center gap-2.5 text-center transition-opacity duration-200 ${
            phase === 'animating' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <ArrowDown
            className={`pull-arrow-bounce h-12 w-12 stroke-[2.25] transition-colors ${
              dragState === 'ready' ? 'text-[var(--accent-silver)]' : 'text-[var(--text-main)]'
            }`}
          />
          <p
            className={`text-xl font-bold tracking-wide transition-colors sm:text-2xl ${
              dragState === 'ready' ? 'text-[var(--accent-silver)]' : 'text-[var(--text-main)]'
            }`}
          >
            {dragState === 'ready'
              ? 'Release to draw!'
              : dragState === 'tap-hint'
              ? 'Drag downward'
              : 'Pull your card'}
          </p>
        </div>
      </div>

      {/* LAYER 2: DEAD-CENTER REVEAL — CLICK ANYWHERE TO PROCEED */}
      <div
        ref={revealLayerRef}
        style={{ perspective: 1200 }}
        className={`absolute inset-0 z-20 flex items-center justify-center px-4 pb-16 ${
          phase === 'idle' ? 'pointer-events-none opacity-0' : ''
        }`}
      >
        <div ref={popCardRef} className="relative aspect-[59/86] w-[min(280px,68vw,calc(58dvh*59/86))]">
          {burstKey > 0 && (
            <div
              key={burstKey}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex h-[min(540px,130vw)] w-[min(540px,130vw)] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              <div className="summon-flash absolute inset-12 rounded-full" />
              <div className="summon-rays absolute inset-0 rounded-full" />
              <div className="summon-ring absolute h-[52%] w-[52%] rounded-full" />
              {SUMMON_SPARKS.map((spark, i) => (
                <span
                  key={i}
                  className="summon-spark absolute rounded-full"
                  style={
                    {
                      width: `${spark.size}px`,
                      height: `${spark.size}px`,
                      backgroundColor: spark.color,
                      boxShadow: `0 0 10px ${spark.color}`,
                      '--spark-angle': spark.angle,
                      '--spark-dist': spark.dist,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          )}

          <div className="relative z-10 h-full w-full">
            {phase === 'revealed' || phase === 'entering' ? (
              <HoloYugiohCard flippable={false} />
            ) : (
              <div className="h-full w-full overflow-hidden rounded-[2px] shadow-[0_24px_60px_-14px_rgba(0,0,0,0.48)]">
                <img
                  src={frontCardUrl}
                  alt="Michael Hans Magbojos Card"
                  className="h-[103%] w-full object-cover object-top"
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Minimal Footer — Click anywhere to enter Home, or Pull again */}
        <div
          ref={actionsRef}
          className={`absolute inset-x-0 bottom-7 z-30 flex flex-col items-center gap-3 px-4 ${
            phase === 'revealed' ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
          }`}
        >
          <p className="pointer-events-none text-xs font-medium tracking-wide text-[var(--text-secondary)]">
            Click anywhere to continue
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handlePullAgain()
            }}
            className="inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] shadow-sm transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Pull again</span>
          </button>
        </div>
      </div>
    </div>
  )
}
