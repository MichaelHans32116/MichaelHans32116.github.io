import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowDown, RotateCcw } from 'lucide-react'
import { BgmMode, BgmTrackId, duelSfx } from '../utils/sfx'
import { AudioControls } from './AudioControls'
import { DuelFieldBg } from './DuelFieldBg'
import { backCardUrl, frontCardUrl, HoloYugiohCard } from './HoloYugiohCard'
import { ThemeFlipButton } from './ThemeFlipButton'
import { YgoBrandEmblem } from './YgoBrandEmblem'

interface DrawPhaseProps {
  onEnterPortfolio: () => void
  sfxEnabled: boolean
  bgmMuted: boolean
  bgmVolume: number
  bgmMode: BgmMode
  activeTrackId: BgmTrackId
  onToggleSfx: () => void
  onToggleBgmMute: () => void
  onChangeBgmVolume: (vol: number) => void
  onChangeBgmMode: (mode: BgmMode) => void
  onSelectTrack: (trackId: BgmTrackId) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

type DrawState = 'idle' | 'animating' | 'revealed' | 'entering'
type IntroStage = 'logo' | 'your-turn' | 'gliding' | 'ready'

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
  bgmMode,
  activeTrackId,
  onToggleSfx,
  onToggleBgmMute,
  onChangeBgmVolume,
  onChangeBgmMode,
  onSelectTrack,
  theme,
  onToggleTheme,
}) => {
  const [phase, setPhase] = useState<DrawState>('idle')
  const [dragState, setDragState] = useState<'none' | 'pulling' | 'ready' | 'tap-hint'>('none')
  const [burstKey, setBurstKey] = useState(0)

  const [introStage, setIntroStage] = useState<IntroStage>(() => {
    if (typeof window === 'undefined') return 'logo'
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'ready' : 'logo'
  })
  const [logoLeaving, setLogoLeaving] = useState(false)
  const [turnLeaving, setTurnLeaving] = useState(false)
  const [lpValue, setLpValue] = useState(() => {
    if (typeof window === 'undefined') return 8000
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 8000 : 0
  })

  const rootRef = useRef<HTMLDivElement>(null)
  const deckLayerRef = useRef<HTMLDivElement>(null)
  const deckStageRef = useRef<HTMLDivElement>(null)
  const pulledCardRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const revealLayerRef = useRef<HTMLDivElement>(null)
  const popCardRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const currentDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const glideTlRef = useRef<gsap.core.Timeline | null>(null)
  const glideStartedRef = useRef(false)
  const logoTimerRef = useRef<number | null>(null)
  const lpStartedRef = useRef(false)

  const dismissLogoSplash = useCallback(() => {
    if (introStage !== 'logo') return
    if (logoTimerRef.current) {
      window.clearTimeout(logoTimerRef.current)
      logoTimerRef.current = null
    }
    setLogoLeaving(true)
    logoTimerRef.current = window.setTimeout(() => {
      setIntroStage((prev) => (prev === 'logo' ? 'your-turn' : prev))
    }, 220)
  }, [introStage])

  // Stage 1: MICHAEL HANS fiery Yu-Gi-Oh! crest -> Stage 2: YOUR TURN!
  useEffect(() => {
    if (introStage !== 'logo') return
    const fadeTimer = window.setTimeout(() => setLogoLeaving(true), 1150)
    const nextTimer = window.setTimeout(() => setIntroStage('your-turn'), 1450)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(nextTimer)
    }
  }, [introStage])

  // Animate Duel Links LP 0 -> 8000 once splash moves past logo (runs once, never restarts on glide/ready)
  useEffect(() => {
    if (introStage === 'logo' || lpStartedRef.current) return
    lpStartedRef.current = true
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setLpValue(8000)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 640
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setLpValue(Math.round(8000 * eased))
      if (p < 1) {
        raf = window.requestAnimationFrame(tick)
      }
    }
    raf = window.requestAnimationFrame(tick)
    return () => {
      // If component unmounts early, allow re-run only if not yet 8000
      window.cancelAnimationFrame(raf)
    }
  }, [introStage])

  const computeDeckOriginOffset = useCallback(() => {
    const deckEl = deckStageRef.current
    const slotEl = document.getElementById('duel-main-deck-zone')
    const vw = window.innerWidth
    const vh = window.innerHeight
    const deckRect = deckEl?.getBoundingClientRect()
    const deckCx = deckRect && deckRect.width > 0 && deckRect.width < vw * 0.8 ? deckRect.left + deckRect.width / 2 : vw / 2
    const deckCy = deckRect && deckRect.height > 0 && deckRect.height < vh * 0.8 ? deckRect.top + deckRect.height / 2 : vh * 0.45
    const deckW = deckRect && deckRect.width > 0 && deckRect.width < vw * 0.8 ? deckRect.width : Math.min(220, vw * 0.49)

    const isCompact = vw < 640
    const sliceScale = Math.max(Math.min(vw, 1520) / 1440, vh / 860) * 1.04
    let targetX = isCompact ? vw * 0.87 : vw / 2 + 498 * sliceScale * 1.02
    let targetY = isCompact ? vh * 0.61 : vh / 2 + 201 * sliceScale * 0.92
    let targetW = isCompact ? vw * 0.11 : 132 * sliceScale

    const minSlotPx = isCompact ? 24 : 30
    if (slotEl) {
      const slotRect = slotEl.getBoundingClientRect()
      if (slotRect.width > minSlotPx && slotRect.height > minSlotPx && slotRect.left > vw * 0.5) {
        targetX = slotRect.left + slotRect.width / 2
        targetY = slotRect.top + slotRect.height / 2
        targetW = slotRect.width
      }
    }

    const minScale = isCompact ? 0.22 : 0.46
    const scale = Math.max(minScale, Math.min(0.76, targetW / Math.max(1, deckW)))
    const scaledW = deckW * scale
    const scaledH = scaledW * (86 / 59)
    const minCenterX = deckCx + vw * (isCompact ? 0.12 : 0.16)
    const maxCenterX = vw - scaledW * 0.52 - 8
    const clampedTargetX = Math.max(minCenterX, Math.min(targetX, maxCenterX))
    const clampedTargetY = Math.max(
      deckCy + vh * (isCompact ? 0.04 : 0.1),
      Math.min(targetY, vh - scaledH * 0.5 - 12),
    )

    return {
      x: clampedTargetX - deckCx,
      y: clampedTargetY - deckCy,
      scale,
    }
  }, [])

  const startDeckGlide = useCallback(() => {
    if (glideStartedRef.current) return
    glideStartedRef.current = true
    setTurnLeaving(true)

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stageEl = deckStageRef.current
    const hintEl = hintRef.current

    if (prefersReduced || !stageEl) {
      if (stageEl) gsap.set(stageEl, { clearProps: 'all' })
      if (hintEl) gsap.set(hintEl, { opacity: 1, y: 0 })
      setIntroStage('ready')
      return
    }

    window.setTimeout(() => {
      setIntroStage((prev) => (prev === 'your-turn' ? 'gliding' : prev))
    }, 220)

    glideTlRef.current?.kill()
    const tl = gsap.timeline({
      onComplete: () => {
        setIntroStage('ready')
        gsap.set(stageEl, { clearProps: 'transform' })
        if (hintEl) {
          gsap.fromTo(
            hintEl,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.34, ease: 'power2.out' },
          )
        }
      },
    })

    tl.to(stageEl, {
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateZ: 0,
      duration: 0.78,
      ease: 'power3.inOut',
    })

    glideTlRef.current = tl
  }, [])

  // Pin 3D deck inside bottom-right Deck Zone during logo & YOUR TURN!, then glide on timer
  useLayoutEffect(() => {
    if ((introStage !== 'logo' && introStage !== 'your-turn') || glideStartedRef.current) return
    const stageEl = deckStageRef.current
    const hintEl = hintRef.current
    if (!stageEl) return

    const placeAtDeckSlot = () => {
      if (glideStartedRef.current || !deckStageRef.current) return
      gsap.set(deckStageRef.current, { x: 0, y: 0, scale: 1, rotateX: 0, rotateZ: 0 })
      const origin = computeDeckOriginOffset()
      gsap.set(deckStageRef.current, {
        x: origin.x,
        y: origin.y,
        scale: origin.scale,
        rotateX: 14,
        rotateZ: 4,
        opacity: 1,
      })
    }

    placeAtDeckSlot()
    const rafId = window.requestAnimationFrame(placeAtDeckSlot)
    if (hintEl) {
      gsap.set(hintEl, { opacity: 0, y: 10 })
    }

    let timer: number | undefined
    if (introStage === 'your-turn') {
      timer = window.setTimeout(() => {
        startDeckGlide()
      }, 1050)
    }

    return () => {
      window.cancelAnimationFrame(rafId)
      if (timer) window.clearTimeout(timer)
    }
  }, [computeDeckOriginOffset, introStage, startDeckGlide])

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
    if (phase !== 'idle' || introStage !== 'ready') return
    duelSfx.unlockAudio()
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
      deckStageRef.current,
      pulledCardRef.current,
      hintRef.current,
      revealLayerRef.current,
      popCardRef.current,
      actionsRef.current,
    ].filter(Boolean)
    if (els.length > 0) {
      gsap.killTweensOf(els)
      gsap.set(els, { clearProps: 'all' })
    }
    setIntroStage('ready')
    setPhase('idle')
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (introStage === 'logo') {
        if (e.code === 'Escape' || e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault()
          dismissLogoSplash()
        }
        return
      }
      if (introStage === 'your-turn') {
        if (e.code === 'Escape' || e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault()
          startDeckGlide()
        }
        return
      }
      if (introStage === 'ready' && phase === 'idle' && (e.code === 'ArrowDown' || e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        duelSfx.unlockAudio()
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
  }, [dismissLogoSplash, handleEnter, introStage, onEnterPortfolio, phase, runPullAndPopSequence, startDeckGlide])

  useEffect(() => {
    duelSfx.enterSplashStage()
    const unlock = () => {
      duelSfx.unlockAudio()
    }
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
      if (logoTimerRef.current) window.clearTimeout(logoTimerRef.current)
      tlRef.current?.kill()
      glideTlRef.current?.kill()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      onClick={() => {
        if (introStage === 'logo') {
          dismissLogoSplash()
          return
        }
        if (introStage === 'your-turn') {
          startDeckGlide()
          return
        }
        if (phase === 'revealed') {
          handleEnter()
        }
      }}
      className={`splash-canvas relative h-[100dvh] w-full overflow-hidden select-none ${
        phase === 'revealed' || introStage === 'logo' || introStage === 'your-turn' ? 'cursor-pointer' : ''
      }`}
    >
      {/* ARCHITECTURAL YU-GI-OH! DUEL FIELD PLAYMAT (SHARP & UNBLURRED CARDS) */}
      <DuelFieldBg variant="splash" />

      {/* STAGE 1: FIERY RED/METALLIC MICHAEL HANS YU-GI-OH! SPLASH LOGO */}
      {introStage === 'logo' && (
        <div
          onClick={(e) => {
            e.stopPropagation()
            dismissLogoSplash()
          }}
          data-leaving={logoLeaving ? 'true' : 'false'}
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
          </div>
        </div>
      )}

      {/* STAGE 2: NON-OPAQUE SILVER YU-GI-OH! "YOUR TURN!" SLASH OVERLAY */}
      {introStage === 'your-turn' && (
        <div
          data-leaving={turnLeaving ? 'true' : 'false'}
          className="ygo-turn-banner pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center px-6"
        >
          <div className="relative flex w-[min(560px,88vw)] flex-col items-center gap-3 py-5">
            <div
              aria-hidden="true"
              className="ygo-turn-line h-[1.5px] w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, var(--accent-silver) 28%, var(--accent-silver-bright) 50%, var(--accent-silver) 72%, transparent 100%)',
              }}
            />

            <div className="relative flex items-center justify-center overflow-hidden px-3 py-1">
              <h1
                className="ygo-turn-text relative select-none text-center text-[clamp(2.1rem,7.8vw,4rem)] font-black uppercase"
                style={{
                  fontFamily: 'var(--font-ygo-title)',
                  background: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 48%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter:
                    theme === 'dark'
                      ? 'drop-shadow(0 3px 0 #05070d) drop-shadow(0 0 22px rgba(226,232,240,0.42))'
                      : 'drop-shadow(0 2px 0 rgba(15,23,42,0.72)) drop-shadow(0 8px 20px rgba(15,23,42,0.22))',
                }}
              >
                YOUR TURN!
              </h1>
              <span className="ygo-logo-sheen pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/75 to-transparent blur-[2px]" />
            </div>

            <div
              aria-hidden="true"
              className="ygo-turn-line h-[1.5px] w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, var(--accent-silver) 28%, var(--accent-silver-bright) 50%, var(--accent-silver) 72%, transparent 100%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Anchored Top-Left Yu-Gi-Oh! Identity Emblem */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          duelSfx.playHover()
          if (introStage === 'logo') dismissLogoSplash()
          else if (introStage === 'your-turn') startDeckGlide()
        }}
        aria-label="Michael Hans"
        className="absolute left-4 top-3.5 z-[60] flex items-center text-left transition hover:brightness-105 active:scale-[0.98] sm:left-8 sm:top-5"
      >
        <YgoBrandEmblem />
      </button>

      {/* Top-Right Controls ("Skip intro" hides automatically once pulled!) */}
      <div
        className="absolute right-4 top-3.5 z-40 flex items-center gap-1.5 sm:right-7 sm:top-5 sm:gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <ThemeFlipButton theme={theme} onToggle={onToggleTheme} />

        <AudioControls
          bgmMuted={bgmMuted}
          bgmVolume={bgmVolume}
          bgmMode={bgmMode}
          activeTrackId={activeTrackId}
          sfxEnabled={sfxEnabled}
          onToggleBgmMute={onToggleBgmMute}
          onChangeBgmVolume={onChangeBgmVolume}
          onChangeBgmMode={onChangeBgmMode}
          onSelectTrack={onSelectTrack}
          onToggleSfx={onToggleSfx}
        />

        {phase === 'idle' && (
          <button
            type="button"
            onClick={() => {
              duelSfx.playHover()
              onEnterPortfolio()
            }}
            className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] shadow-sm transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)] sm:px-3.5 sm:py-2 sm:text-xs"
          >
            <span className="sm:hidden">Skip →</span>
            <span className="hidden sm:inline">Skip intro →</span>
          </button>
        )}
      </div>

      {/* Duel Links style LP: 8000 HUD at Bottom-Left */}
      {introStage !== 'logo' && phase !== 'entering' && (
        <div
          aria-label="Life Points 8000"
          className="pointer-events-none fixed bottom-3.5 left-3.5 z-30 flex items-center sm:bottom-6 sm:left-7"
        >
          <div className="relative z-10 h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-sky-300 bg-[#0b152a] shadow-[0_6px_18px_rgba(2,132,199,0.45)] sm:h-12 sm:w-12">
            <img
              src="/assets/michael-hans-avatar.jpg"
              alt="Michael Hans"
              className="h-full w-full object-cover object-top"
              draggable={false}
            />
          </div>
          <div
            className="-ml-4 flex items-baseline gap-1.5 border-2 border-sky-300/85 py-1 pl-6 pr-3.5 shadow-[0_8px_22px_rgba(2,132,199,0.4)] sm:-ml-5 sm:gap-2 sm:py-1.5 sm:pl-7 sm:pr-5"
            style={{
              background: 'linear-gradient(100deg, #071326 0%, #0e2e5c 52%, #083d77 100%)',
              transform: 'skewX(-12deg)',
            }}
          >
            <span
              className="font-mono-tech text-[10px] font-bold tracking-wider text-sky-300 italic sm:text-xs"
              style={{ transform: 'skewX(12deg)' }}
            >
              LP:
            </span>
            <span
              className="font-mono-tech text-base font-extrabold tracking-tight text-white tabular-nums sm:text-xl"
              style={{ transform: 'skewX(12deg)' }}
            >
              {lpValue}
            </span>
          </div>
        </div>
      )}

      {/* LAYER 1: 3D ANGLED STACKED DECK ON DUEL FIELD (GLIDES FROM BOTTOM-RIGHT SLOT -> CENTER!) */}
      <div
        ref={deckLayerRef}
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pt-16 pb-10 sm:px-4 sm:pb-8 ${
          phase === 'revealed' || phase === 'entering' ? 'pointer-events-none opacity-0' : ''
        }`}
      >
        <div
          id="tour-splash-deck"
          ref={deckStageRef}
          className="relative aspect-[59/86] w-[min(210px,52vw,calc(42dvh*59/86))] sm:w-[min(220px,49vw,calc(44dvh*59/86))]"
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
              tabIndex={phase === 'idle' && introStage === 'ready' ? 0 : -1}
              aria-label="Grab and pull card downward"
              className={`relative z-10 h-full w-full touch-none overflow-hidden rounded-[2px] shadow-[0_14px_26px_-10px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-silver)] ${
                introStage === 'ready' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              }`}
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
          ref={hintRef}
          className={`pointer-events-none mt-5 flex flex-col items-center text-center transition-opacity duration-200 sm:mt-7 ${
            phase === 'animating' ? 'opacity-0' : ''
          }`}
        >
          <div className="inline-flex items-center gap-2.5 rounded-[3px] border border-sky-300/65 bg-[#0b101d]/92 px-4 py-2 text-white shadow-[0_12px_28px_rgba(0,0,0,0.68)] backdrop-blur-md sm:gap-3 sm:px-5 sm:py-2.5">
            <ArrowDown
              className={`pull-arrow-bounce h-5 w-5 shrink-0 stroke-[2.5] transition-colors sm:h-6 sm:w-6 ${
                dragState === 'ready' ? 'text-sky-300' : 'text-white'
              }`}
            />
            <p
              className={`text-sm font-bold tracking-wide transition-colors sm:text-lg ${
                dragState === 'ready' ? 'text-sky-300' : 'text-white'
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
      </div>

      {/* LAYER 2: DEAD-CENTER REVEAL, CLICK ANYWHERE TO PROCEED */}
      <div
        ref={revealLayerRef}
        style={{ perspective: 1200 }}
        className={`absolute inset-0 z-20 flex items-center justify-center px-6 pt-16 pb-24 sm:px-4 sm:pb-16 ${
          phase === 'idle' ? 'pointer-events-none opacity-0' : ''
        }`}
      >
        <div
          ref={popCardRef}
          className="relative aspect-[59/86] w-[min(268px,62vw,calc(54dvh*59/86))] sm:w-[min(280px,68vw,calc(58dvh*59/86))]"
        >
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

        {/* Minimal Footer: Click anywhere to enter Home, or Pull again */}
        <div
          ref={actionsRef}
          className={`absolute inset-x-0 bottom-6 z-30 flex flex-col items-center gap-2.5 px-4 sm:bottom-7 sm:gap-3 ${
            phase === 'revealed' ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
          }`}
        >
          <p className="pointer-events-none rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]/92 px-3 py-1 text-xs font-medium tracking-wide text-[var(--text-main)] shadow-sm backdrop-blur-md">
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
