import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ArrowRight,
  Check,
  Compass,
  Copy,
  Download,
  ExternalLink,
  FileDown,
  Github,
  Linkedin,
  Mail,
  Phone,
  RotateCcw,
  Send,
} from 'lucide-react'
import { AboutMePhase } from './components/AboutMePhase'
import { AudioControls } from './components/AudioControls'
import { DeckCard } from './components/DeckCard'
import { DeckCardModal } from './components/DeckCardModal'
import { DrawPhase } from './components/DrawPhase'
import { DuelDeckBoxCard } from './components/DuelDeckBoxCard'
import { DuelFieldBg } from './components/DuelFieldBg'
import { DuelGuideTour, GuideTourStep } from './components/DuelGuideTour'
import { HoloYugiohCard } from './components/HoloYugiohCard'
import { MobileHeaderMotion } from './components/MobileHeaderMotion'
import { PhaseCardTray, PortfolioPhase } from './components/PhaseCardTray'
import { TechToolkit } from './components/TechToolkit'
import { ThemeFlipButton } from './components/ThemeFlipButton'
import { YgoBrandEmblem } from './components/YgoBrandEmblem'
import {
  DECK_BOX_COVERS,
  DECK_CARDS,
  DeckCardItem,
  DeckCategory,
  EDUCATION_INFO,
  EXPERIENCE_HIGHLIGHTS,
  OJT_EXPERIENCE_PHOTOS,
  PROFILE,
  SIDE_WORK_ARCHIVE,
  STANDOUT_HIGHLIGHTS,
} from './data/deckData'
import { BgmMode, BgmTrackId, duelSfx } from './utils/sfx'

type ThemeMode = 'light' | 'dark'

const NAV_PHASES: { id: PortfolioPhase; code: string; label: string; banner: string }[] = [
  { id: 'standby', code: 'SP', label: 'Home', banner: 'STANDBY PHASE' },
  { id: 'main', code: 'MP1', label: 'Deck', banner: 'MAIN PHASE 1' },
  { id: 'battle', code: 'BP', label: 'Experience', banner: 'BATTLE PHASE' },
  { id: 'main2', code: 'MP2', label: 'About Me', banner: 'MAIN PHASE 2' },
  { id: 'end', code: 'EP', label: 'Contact', banner: 'END PHASE' },
]

const PORTFOLIO_TOUR_STEPS: GuideTourStep[] = [
  {
    id: 'home-card',
    targetSelector: '#tour-hero-card',
    speaker: 'Hans',
    text: "Hey, I'm Hans! Tap my card anytime to flip it, or skim my intro right here.",
    fallbackSide: 'bottom',
  },
  {
    id: 'home-toolkit',
    targetSelector: '#tour-toolkit',
    speaker: 'Hans',
    text: 'Click any skill in my toolkit and the proof panel beside it updates with the real systems I built.',
    fallbackSide: 'top',
  },
  {
    id: 'home-dock',
    targetSelector: '#tour-phase-dock',
    speaker: 'Hans',
    text: 'Use this bottom dock (or swipe left and right on your phone) to move between Deck, Experience, About Me, and Contact.',
    fallbackSide: 'top',
  },
  {
    id: 'home-controls',
    targetSelector: '#tour-controls',
    speaker: 'Hans',
    text: 'Switch Light and Dark theme, change Yu-Gi-Oh BGM tracks, or replay this guide anytime up here.',
    fallbackSide: 'bottom',
  },
]

const PORTFOLIO_TOUR_KEY = 'mh-portfolio-tour-v1'

export function App() {
  const [stage, setStage] = useState<'draw' | 'portfolio'>('draw')
  const [activePhase, setActivePhase] = useState<PortfolioPhase>('standby')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    try {
      const saved = window.localStorage.getItem('mh-theme')
      return saved === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  const [sfxEnabled, setSfxEnabled] = useState(() => duelSfx.isSfxEnabled())
  const [bgmMuted, setBgmMuted] = useState(() => duelSfx.isBgmMuted())
  const [bgmVolume, setBgmVolume] = useState(() => duelSfx.getBgmVolume())
  const [bgmMode, setBgmMode] = useState<BgmMode>(() => duelSfx.getBgmMode())
  const [activeTrackId, setActiveTrackId] = useState<BgmTrackId>(() => duelSfx.getActiveTrackId())
  const [themeFlipDir, setThemeFlipDir] = useState<'to-dark' | 'to-light' | null>(null)
  const [deckFilter, setDeckFilter] = useState<DeckCategory>('projects')
  const [selectedCard, setSelectedCard] = useState<DeckCardItem | null>(null)
  const [modalScope, setModalScope] = useState<'deck' | 'standouts'>('deck')
  const [portfolioTourOpen, setPortfolioTourOpen] = useState(false)
  const [swipeHint, setSwipeHint] = useState<{ dir: 'prev' | 'next'; label: string } | null>(null)
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSending, setContactSending] = useState(false)
  const [contactStatus, setContactStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [contactNotice, setContactNotice] = useState<string | null>(null)
  const [phaseBanner, setPhaseBanner] = useState<{ code: string; banner: string; key: number } | null>(null)

  const portfolioRef = useRef<HTMLDivElement>(null)
  const phaseContainerRef = useRef<HTMLDivElement>(null)
  const bannerTimerRef = useRef<number | null>(null)
  const themeFlipSwapRef = useRef<number | null>(null)
  const themeFlipEndRef = useRef<number | null>(null)
  const mainTouchRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      window.localStorage.setItem('mh-theme', theme)
    } catch {
      // ignore storage failure
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    duelSfx.playFlip()
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
      return
    }

    if (themeFlipSwapRef.current) window.clearTimeout(themeFlipSwapRef.current)
    if (themeFlipEndRef.current) window.clearTimeout(themeFlipEndRef.current)

    const nextDir = theme === 'light' ? 'to-dark' : 'to-light'
    setThemeFlipDir(nextDir)
    themeFlipSwapRef.current = window.setTimeout(() => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }, 310)
    themeFlipEndRef.current = window.setTimeout(() => {
      setThemeFlipDir(null)
    }, 640)
  }, [theme])

  const toggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev
      duelSfx.setSfxEnabled(next)
      return next
    })
  }, [])

  const toggleBgmMute = useCallback(() => {
    setBgmMuted((prev) => {
      const next = !prev
      duelSfx.setBgmMuted(next)
      setBgmVolume(duelSfx.getBgmVolume())
      return next
    })
  }, [])

  const changeBgmVolume = useCallback((vol: number) => {
    duelSfx.setBgmVolume(vol)
    setBgmVolume(duelSfx.getBgmVolume())
    setBgmMuted(duelSfx.isBgmMuted())
  }, [])

  const changeBgmMode = useCallback((mode: BgmMode) => {
    duelSfx.playHover()
    duelSfx.setBgmMode(mode)
    setBgmMode(duelSfx.getBgmMode())
    setActiveTrackId(duelSfx.getActiveTrackId())
  }, [])

  const selectBgmTrack = useCallback((trackId: BgmTrackId) => {
    duelSfx.playHover()
    duelSfx.selectTrack(trackId)
    setBgmMode(duelSfx.getBgmMode())
    setActiveTrackId(duelSfx.getActiveTrackId())
    setBgmMuted(duelSfx.isBgmMuted())
  }, [])

  const handleEnterPortfolio = useCallback(() => {
    duelSfx.leaveSplashStage()
    setActivePhase('standby')
    setStage('portfolio')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleReplayDraw = useCallback(() => {
    setSelectedCard(null)
    setStage('draw')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const switchPhase = useCallback((nextPhase: PortfolioPhase) => {
    setSelectedCard(null)
    setPortfolioTourOpen(false)
    setSwipeHint(null)
    setActivePhase(nextPhase)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    const meta = NAV_PHASES.find((p) => p.id === nextPhase)
    if (meta) {
      if (bannerTimerRef.current) {
        window.clearTimeout(bannerTimerRef.current)
      }
      setPhaseBanner({ code: meta.code, banner: meta.banner, key: Date.now() })
      bannerTimerRef.current = window.setTimeout(() => {
        setPhaseBanner(null)
      }, 780)
    }
  }, [])

  const currentPhaseIdx = NAV_PHASES.findIndex((p) => p.id === activePhase)
  const canStepPrev = currentPhaseIdx > 0
  const canStepNext = currentPhaseIdx >= 0 && currentPhaseIdx < NAV_PHASES.length - 1

  const stepPortfolioPhase = useCallback(
    (delta: -1 | 1) => {
      const idx = NAV_PHASES.findIndex((p) => p.id === activePhase)
      if (idx === -1) return
      const next = NAV_PHASES[idx + delta]
      if (next) switchPhase(next.id)
    },
    [activePhase, switchPhase],
  )

  const closePortfolioTour = useCallback(() => {
    setPortfolioTourOpen(false)
    try {
      window.localStorage.setItem(PORTFOLIO_TOUR_KEY, 'done')
    } catch {
      // ignore storage failure
    }
  }, [])

  useEffect(() => {
    if (stage !== 'portfolio' || activePhase !== 'standby') return
    let seen = false
    try {
      seen = window.localStorage.getItem(PORTFOLIO_TOUR_KEY) === 'done'
    } catch {
      seen = false
    }
    if (seen) return
    const timer = window.setTimeout(() => {
      setPortfolioTourOpen(true)
    }, 520)
    return () => window.clearTimeout(timer)
  }, [activePhase, stage])

  useEffect(() => {
    return () => {
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current)
      if (themeFlipSwapRef.current) window.clearTimeout(themeFlipSwapRef.current)
      if (themeFlipEndRef.current) window.clearTimeout(themeFlipEndRef.current)
    }
  }, [])

  useEffect(() => {
    if (stage === 'portfolio') {
      duelSfx.setPhaseBgm(activePhase)
      setActiveTrackId(duelSfx.getActiveTrackId())
    }
  }, [activePhase, stage])

  useEffect(() => {
    if (stage === 'portfolio' && phaseContainerRef.current) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return
      gsap.fromTo(
        phaseContainerRef.current,
        { opacity: 0, y: 18, scale: 0.992 },
        { opacity: 1, y: 0, scale: 1, duration: 0.36, ease: 'power3.out', clearProps: 'transform' },
      )
    }
  }, [activePhase, stage])

  useEffect(() => {
    if (stage !== 'portfolio' || activePhase !== 'main') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const slots = document.querySelectorAll('.ygo-deck-slot')
    if (slots.length === 0) return
    gsap.fromTo(
      slots,
      { opacity: 0, y: 22, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.36, stagger: 0.045, ease: 'power3.out', clearProps: 'transform' },
    )
  }, [activePhase, deckFilter, stage])

  const copyValue = async (kind: 'email' | 'phone', val: string) => {
    try {
      await navigator.clipboard.writeText(val)
      duelSfx.playHover()
      setCopiedField(kind)
      window.setTimeout(() => setCopiedField(null), 1800)
    } catch {
      // ignore clipboard blocked
    }
  }

  const handleSendContactMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const cleanName = contactName.trim()
    const cleanEmail = contactEmail.trim()
    const cleanMsg = contactMessage.trim()
    if (!cleanName || !cleanEmail || !cleanMsg) {
      setContactStatus('error')
      setContactNotice('Please fill out your name, email, and message first.')
      return
    }

    setContactSending(true)
    setContactStatus('idle')
    setContactNotice(null)
    duelSfx.playFlip()

    try {
      const resp = await fetch(`https://formsubmit.co/ajax/${PROFILE.emailPersonal}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          message: cleanMsg,
          _subject: `Portfolio Inquiry from ${cleanName}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })

      const payload = (await resp.json().catch(() => null)) as
        | { success?: boolean | string; message?: string }
        | null
      const isAccepted =
        resp.ok && (payload?.success === true || payload?.success === 'true')

      if (!isAccepted) {
        throw new Error(payload?.message || `HTTP ${resp.status}`)
      }

      setContactStatus('sent')
      setContactNotice(
        `Message sent to ${PROFILE.emailPersonal}. I'll reply soon.`,
      )
      setContactName('')
      setContactEmail('')
      setContactMessage('')
    } catch {
      setContactStatus('error')
      setContactNotice(
        'Could not confirm direct delivery, so your draft was kept intact. Use "Open in Gmail Web" below or "Copy Email" on the left.',
      )
    } finally {
      setContactSending(false)
    }
  }

  const trapCards = useMemo(() => DECK_CARDS.filter((c) => c.category === 'projects'), [])
  const spellCards = useMemo(() => DECK_CARDS.filter((c) => c.category === 'achievements'), [])
  const monsterCards = useMemo(() => DECK_CARDS.filter((c) => c.category === 'references'), [])

  const visibleCards = useMemo(() => {
    if (deckFilter === 'projects') return trapCards
    if (deckFilter === 'achievements') return spellCards
    if (deckFilter === 'references') return monsterCards
    return [...trapCards, ...spellCards, ...monsterCards]
  }, [deckFilter, monsterCards, spellCards, trapCards])

  const standoutCards = useMemo(
    () =>
      STANDOUT_HIGHLIGHTS.map((h) => DECK_CARDS.find((c) => c.id === h.cardId)).filter(
        (c): c is DeckCardItem => Boolean(c),
      ),
    [],
  )

  const activeModalCards = modalScope === 'standouts' ? standoutCards : visibleCards
  const selectedIndex = selectedCard ? activeModalCards.findIndex((c) => c.id === selectedCard.id) : -1
  const canStepModal = activeModalCards.length > 1 && selectedIndex >= 0

  const openCardById = useCallback((cardId: string) => {
    const found = DECK_CARDS.find((c) => c.id === cardId)
    if (found) {
      duelSfx.playHover()
      setModalScope('standouts')
      setSelectedCard(found)
    }
  }, [])

  const handlePrevCard = useCallback(() => {
    if (activeModalCards.length === 0 || selectedIndex === -1) return
    const prevIdx = (selectedIndex - 1 + activeModalCards.length) % activeModalCards.length
    setSelectedCard(activeModalCards[prevIdx])
  }, [activeModalCards, selectedIndex])

  const handleNextCard = useCallback(() => {
    if (activeModalCards.length === 0 || selectedIndex === -1) return
    const nextIdx = (selectedIndex + 1) % activeModalCards.length
    setSelectedCard(activeModalCards[nextIdx])
  }, [activeModalCards, selectedIndex])

  const renderThemeFlipOverlay = () => {
    if (!themeFlipDir) return null
    const toDark = themeFlipDir === 'to-dark'

    const LightGradientFace = () => (
      <div
        className="h-full w-full rounded-[3px] border border-[#cbd5e1] shadow-2xl"
        style={{
          background:
            'linear-gradient(155deg, #ffffff 0%, #ffffff 44%, #f4f1ea 74%, #ded8cc 100%)',
        }}
      />
    )

    const DarkGradientFace = () => (
      <div
        className="h-full w-full rounded-[3px] border border-[#94a3b8] shadow-2xl"
        style={{
          background:
            'linear-gradient(155deg, #273145 0%, #141a28 44%, #0b0f18 76%, #05070d 100%)',
        }}
      />
    )

    return (
      <div
        aria-hidden="true"
        className="ygo-theme-flip-stage pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-black/30 backdrop-blur-[1.5px]"
      >
        <div
          className={`relative h-[min(320px,52dvh)] w-[min(220px,58vw)] sm:h-[min(360px,58dvh)] sm:w-[min(250px,64vw)] ${
            toDark ? 'ygo-flip-to-dark' : 'ygo-flip-to-light'
          }`}
        >
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            {toDark ? <LightGradientFace /> : <DarkGradientFace />}
          </div>
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {toDark ? <DarkGradientFace /> : <LightGradientFace />}
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'draw') {
    return (
      <>
        {renderThemeFlipOverlay()}
        <DrawPhase
          onEnterPortfolio={handleEnterPortfolio}
          sfxEnabled={sfxEnabled}
          bgmMuted={bgmMuted}
          bgmVolume={bgmVolume}
          bgmMode={bgmMode}
          activeTrackId={activeTrackId}
          onToggleSfx={toggleSfx}
          onToggleBgmMute={toggleBgmMute}
          onChangeBgmVolume={changeBgmVolume}
          onChangeBgmMode={changeBgmMode}
          onSelectTrack={selectBgmTrack}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </>
    )
  }

  const renderDeckShelf = (title: string, cards: DeckCardItem[]) => (
    <section className="space-y-5 sm:space-y-6">
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border-subtle)] pb-2.5">
        <h2 className="font-editorial text-xl leading-snug text-[var(--text-main)] sm:text-2xl">{title}</h2>
        <span className="shrink-0 font-mono-tech text-xs text-[var(--text-muted)]">{cards.length}</span>
      </div>

      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-9">
        {cards.map((card) => (
          <div
            key={card.id}
            className="ygo-deck-slot flex w-[min(252px,78vw)] flex-col sm:w-[248px] lg:w-[270px]"
          >
            <DeckCard
              item={card}
              onClick={() => {
                setModalScope('deck')
                setSelectedCard(card)
              }}
            />
            <p className="mt-2.5 text-center text-sm leading-snug font-medium text-[var(--text-main)]">
              {card.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div
      ref={portfolioRef}
      className="relative flex min-h-screen flex-col bg-[var(--bg-canvas)] text-[var(--text-main)]"
    >
      <DuelFieldBg variant="arena" />
      <MobileHeaderMotion resetKey={activePhase} />

      {renderThemeFlipOverlay()}

      <PhaseCardTray
        activePhase={activePhase}
        theme={theme}
        onSelectPhase={switchPhase}
        onReplayDraw={handleReplayDraw}
        onStepPhase={stepPortfolioPhase}
        canStepPrev={canStepPrev}
        canStepNext={canStepNext}
      />

      {swipeHint && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed top-1/2 z-50 -translate-y-1/2 rounded-[3px] border border-[var(--accent-silver)]/70 bg-[var(--bg-surface)]/92 px-3 py-1.5 font-mono-tech text-[11px] font-semibold text-[var(--text-main)] shadow-lg backdrop-blur-md ${
            swipeHint.dir === 'prev' ? 'left-3' : 'right-3'
          }`}
        >
          {swipeHint.dir === 'prev' ? `← ${swipeHint.label}` : `${swipeHint.label} →`}
        </div>
      )}

      {/* Non-blocking Master Duel Phase Slash Banner */}
      {phaseBanner && (
        <div
          key={phaseBanner.key}
          aria-live="polite"
          className="ygo-phase-banner pointer-events-none fixed left-1/2 top-16 z-40 -translate-x-1/2 rounded-[2px] border border-[var(--accent-silver)]/60 bg-[var(--bg-surface)]/92 px-5 py-1.5 shadow-md backdrop-blur-md"
        >
          <span className="font-mono-tech text-[11px] font-semibold tracking-[0.22em] text-[var(--text-main)] uppercase">
            <span className="text-[var(--accent-silver)]">{phaseBanner.code}</span> · {phaseBanner.banner}
          </span>
        </div>
      )}

      {/* Minimal Clean Top Header: hides cleanly on phone downward scroll like InsecTra */}
      <header
        id="portfolio-topbar"
        className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/92 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3.5 py-2.5 sm:gap-4 sm:px-8 sm:py-3.5">
          <button
            type="button"
            onClick={() => {
              duelSfx.playHover()
              switchPhase('standby')
            }}
            aria-label="Michael Hans Home"
            className="flex items-center text-left transition hover:brightness-105 active:scale-[0.98]"
          >
            <YgoBrandEmblem />
          </button>

          {/* Utility Controls */}
          <div id="tour-controls" className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                duelSfx.playHover()
                if (activePhase !== 'standby') switchPhase('standby')
                window.setTimeout(() => setPortfolioTourOpen(true), 120)
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5"
              title="Guided page tour"
              aria-label="Start guided page tour"
            >
              <Compass className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tour</span>
            </button>

            <button
              type="button"
              onClick={handleReplayDraw}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5"
              title="Return to Draw Phase (DP)"
              aria-label="Return to Draw Phase"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Pull Card</span>
            </button>

            <ThemeFlipButton compact theme={theme} onToggle={toggleTheme} />

            <AudioControls
              compact
              bgmMuted={bgmMuted}
              bgmVolume={bgmVolume}
              bgmMode={bgmMode}
              activeTrackId={activeTrackId}
              sfxEnabled={sfxEnabled}
              onToggleBgmMute={toggleBgmMute}
              onChangeBgmVolume={changeBgmVolume}
              onChangeBgmMode={changeBgmMode}
              onSelectTrack={selectBgmTrack}
              onToggleSfx={toggleSfx}
            />
          </div>
        </div>
      </header>

      {/* ACTIVE PHASE VIEW (supports mobile swipe left/right between phases) */}
      <main
        onTouchStart={(e) => {
          if (selectedCard || portfolioTourOpen || e.touches.length !== 1) return
          const target = e.target as HTMLElement | null
          if (target?.closest('input, textarea, select, [role="dialog"], [data-no-phase-swipe]')) return
          const t = e.touches[0]
          mainTouchRef.current = { x: t.clientX, y: t.clientY }
        }}
        onTouchMove={(e) => {
          const start = mainTouchRef.current
          if (!start || e.touches.length !== 1) return
          const t = e.touches[0]
          const dx = t.clientX - start.x
          const dy = t.clientY - start.y
          if (Math.abs(dx) > 22 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            const targetIdx = dx > 0 ? currentPhaseIdx - 1 : currentPhaseIdx + 1
            const nextMeta = NAV_PHASES[targetIdx]
            if (nextMeta) {
              setSwipeHint({ dir: dx > 0 ? 'prev' : 'next', label: nextMeta.label })
            }
          } else if (swipeHint) {
            setSwipeHint(null)
          }
        }}
        onTouchEnd={(e) => {
          const start = mainTouchRef.current
          mainTouchRef.current = null
          setSwipeHint(null)
          if (!start || e.changedTouches.length === 0) return
          const t = e.changedTouches[0]
          const dx = t.clientX - start.x
          const dy = t.clientY - start.y
          if (Math.abs(dx) > 58 && Math.abs(dx) > Math.abs(dy) * 1.65) {
            stepPortfolioPhase(dx > 0 ? -1 : 1)
          }
        }}
        onTouchCancel={() => {
          mainTouchRef.current = null
          setSwipeHint(null)
        }}
        className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-8 sm:py-12"
      >
        <div ref={phaseContainerRef}>
          {/* =========================================================
              SP · HOME (Direct Conversational Intro + Standouts + Education + Interactive Toolkit)
              ========================================================= */}
          {activePhase === 'standby' && (
            <div className="space-y-10 sm:space-y-14 lg:space-y-16">
              {/* Hero Intro */}
              <section className="grid items-center gap-6 sm:gap-10 lg:grid-cols-[248px_1fr] lg:gap-12">
                <div
                  id="tour-hero-card"
                  className="mx-auto w-[min(190px,52vw)] sm:w-[236px] lg:w-[248px]"
                >
                  <HoloYugiohCard flippable />
                </div>

                <div className="space-y-4 text-left sm:space-y-5">
                  <div className="space-y-3">
                    <h1 className="font-editorial text-[1.75rem] leading-[1.15] text-[var(--text-main)] sm:text-[2.6rem]">
                      {PROFILE.heroHeadline}
                    </h1>
                    <p className="max-w-2xl text-[14.5px] leading-[1.75] text-[var(--text-secondary)] sm:text-[15.5px]">
                      I&apos;m a{' '}
                      <span className="inline-flex items-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono-tech text-[12px] font-semibold text-[var(--text-main)]">
                        full-stack
                      </span>{' '}
                      developer &amp; 4th-year DOST-SEI scholar at FAITH Colleges. I build{' '}
                      <span className="inline-flex items-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono-tech text-[12px] font-semibold text-[var(--text-main)]">
                        web &amp; mobile
                      </span>{' '}
                      apps with{' '}
                      <span className="inline-flex items-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono-tech text-[12px] font-semibold text-[var(--text-main)]">
                        SQL security
                      </span>
                      , shipped plant tools at Moriroku PH, and keep my work simple for the people using it. Check out my{' '}
                      <button
                        type="button"
                        onClick={() => {
                          duelSfx.playHover()
                          switchPhase('main')
                        }}
                        className="font-medium text-[var(--text-main)] underline decoration-[var(--accent-silver)] underline-offset-4 hover:text-[var(--accent-silver)]"
                      >
                        deck
                      </button>{' '}
                      to inspect shipped systems, credentials, and references, review field{' '}
                      <button
                        type="button"
                        onClick={() => {
                          duelSfx.playHover()
                          switchPhase('battle')
                        }}
                        className="font-medium text-[var(--text-main)] underline decoration-[var(--accent-silver)] underline-offset-4 hover:text-[var(--accent-silver)]"
                      >
                        experience
                      </button>
                      , read{' '}
                      <button
                        type="button"
                        onClick={() => {
                          duelSfx.playHover()
                          switchPhase('main2')
                        }}
                        className="font-medium text-[var(--text-main)] underline decoration-[var(--accent-silver)] underline-offset-4 hover:text-[var(--accent-silver)]"
                      >
                        about me
                      </button>
                      , or jump to{' '}
                      <button
                        type="button"
                        onClick={() => {
                          duelSfx.playHover()
                          switchPhase('end')
                        }}
                        className="font-medium text-[var(--text-main)] underline decoration-[var(--accent-silver)] underline-offset-4 hover:text-[var(--accent-silver)]"
                      >
                        contact
                      </button>
                      .
                    </p>
                  </div>

                  {/* Clean Sharp Direct Contact Row */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:gap-2.5 lg:justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        duelSfx.playHover()
                        switchPhase('end')
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90 sm:w-auto sm:py-2"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{PROFILE.emailPersonal}</span>
                    </button>

                    <a
                      href={`tel:${PROFILE.phoneTel}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 font-mono-tech text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)] sm:flex-none sm:px-3.5"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--accent-silver)]" />
                      <span>{PROFILE.phone}</span>
                    </a>

                    <a
                      href={PROFILE.githubMain}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)] sm:flex-none sm:px-3.5"
                    >
                      <Github className="h-3.5 w-3.5 shrink-0" />
                      <span>GitHub</span>
                    </a>

                    <a
                      href={PROFILE.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)] sm:flex-none sm:px-3.5"
                    >
                      <FileDown className="h-3.5 w-3.5 shrink-0" />
                      <span>Resume</span>
                    </a>
                  </div>
                </div>
              </section>

              {/* Standout Achievements Section (Clean Separated Editorial Rows) */}
              <section className="space-y-4 border-t border-[var(--border-subtle)] pt-8 sm:space-y-5 sm:pt-12">
                <div className="flex flex-wrap items-baseline justify-between gap-2 sm:gap-4">
                  <h2 className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--accent-silver)] uppercase">
                    Standout Achievements
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      duelSfx.playHover()
                      setDeckFilter('achievements')
                      switchPhase('main')
                    }}
                    className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)]"
                  >
                    View Spell Cards →
                  </button>
                </div>

                <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
                  {STANDOUT_HIGHLIGHTS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openCardById(item.cardId)}
                      className="group flex w-full flex-col gap-1 py-3.5 text-left transition sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-silver)] sm:text-[15px]">
                          {item.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{item.issuer}</p>
                      </div>
                      <span className="shrink-0 font-mono-tech text-[11px] font-medium text-[var(--accent-silver)] sm:text-xs sm:text-[var(--text-secondary)]">
                        {item.metric}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Education Section (Dedicated Clean Section) */}
              <section className="space-y-4 border-t border-[var(--border-subtle)] pt-8 sm:pt-12">
                <h2 className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--accent-silver)] uppercase">
                  Education
                </h2>

                <div className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:gap-6">
                  <div className="space-y-1.5">
                    <h3 className="font-editorial text-xl leading-snug text-[var(--text-main)] sm:text-2xl">
                      {EDUCATION_INFO.institution}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {EDUCATION_INFO.degree}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {EDUCATION_INFO.location} · {PROFILE.ojtWindow}
                    </p>
                  </div>

                  <ul className="space-y-2 text-[13px] text-[var(--text-secondary)] sm:text-sm">
                    {EDUCATION_INFO.honors.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--accent-silver)]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Interactive Technical Toolkit: Click any skill to inspect matching builds */}
              <div className="border-t border-[var(--border-subtle)] pt-8 sm:pt-12">
                <TechToolkit onOpenCard={openCardById} />
              </div>

              <div className="flex justify-center border-t border-[var(--border-subtle)] pt-6 sm:justify-end sm:pt-8">
                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    switchPhase('main')
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90 sm:w-auto"
                >
                  <span>Open Deck ({DECK_CARDS.length} Cards)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              MP1 · DECK (Segregated Main Deck Cards & Side Deck)
              ========================================================= */}
          {activePhase === 'main' && (
            <div className="space-y-10 sm:space-y-14">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
                <div className="space-y-1">
                  <h1 className="font-editorial text-3xl text-[var(--text-main)] sm:text-4xl">The Deck</h1>
                  <p className="font-mono-tech text-[11px] text-[var(--text-muted)]">
                    MAIN DECK ({DECK_CARDS.length}) · SIDE DECK ({SIDE_WORK_ARCHIVE.length})
                  </p>
                </div>

                <button
                  type="button"
                  aria-pressed={deckFilter === 'all'}
                  onClick={() => {
                    duelSfx.playHover()
                    setDeckFilter('all')
                  }}
                  className={`rounded-[2px] border px-3.5 py-2 text-xs font-medium transition ${
                    deckFilter === 'all'
                      ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Show All ({DECK_CARDS.length + SIDE_WORK_ARCHIVE.length})
                </button>
              </div>

              {/* Dueling Nexus style Deck Box Selector */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" role="tablist" aria-label="Deck Boxes">
                {(
                  [
                    {
                      id: 'projects',
                      title: 'Projects Deck',
                      deckTypeLabel: 'TRAP DECK',
                      boxCode: 'TRAP',
                      countSummary: `Main ${trapCards.length} · Trap Cards`,
                      tagline: 'Production apps & systems',
                      coverSrc: DECK_BOX_COVERS.projects,
                      accent: '#a22c6a',
                    },
                    {
                      id: 'achievements',
                      title: 'Achievements Deck',
                      deckTypeLabel: 'SPELL DECK',
                      boxCode: 'SPELL',
                      countSummary: `Main ${spellCards.length} · Spell Cards`,
                      tagline: 'Certifications, CTF & scholarships',
                      coverSrc: DECK_BOX_COVERS.achievements,
                      accent: '#157766',
                    },
                    {
                      id: 'references',
                      title: 'References Deck',
                      deckTypeLabel: 'MONSTER DECK',
                      boxCode: 'MNSTR',
                      countSummary: `Main ${monsterCards.length} · Monster Cards`,
                      tagline: 'Supervisors, coaches & panelists',
                      coverSrc: DECK_BOX_COVERS.references,
                      accent: '#b56831',
                    },
                    {
                      id: 'side',
                      title: 'Side Deck',
                      deckTypeLabel: 'SIDE DECK',
                      boxCode: 'SIDE',
                      countSummary: `Side ${SIDE_WORK_ARCHIVE.length} · Utilities & Collabs`,
                      tagline: 'Coursework tools & web games',
                      coverSrc: DECK_BOX_COVERS.side,
                      accent: '#475569',
                    },
                  ] as const
                ).map((box) => {
                  const isActive = deckFilter === box.id
                  return (
                    <DuelDeckBoxCard
                      key={box.id}
                      title={box.title}
                      deckTypeLabel={box.deckTypeLabel}
                      boxCode={box.boxCode}
                      countSummary={box.countSummary}
                      tagline={box.tagline}
                      coverSrc={box.coverSrc}
                      accent={box.accent}
                      active={isActive}
                      compact
                      ctaLabel={isActive ? 'Show All' : 'Filter Deck'}
                      onClick={() => {
                        duelSfx.playHover()
                        setDeckFilter((prev) => (prev === box.id ? 'all' : box.id))
                      }}
                    />
                  )
                })}
              </div>

              {(deckFilter === 'all' || deckFilter === 'projects') &&
                renderDeckShelf('Main Deck · Trap Cards (Projects)', trapCards)}

              {(deckFilter === 'all' || deckFilter === 'achievements') &&
                renderDeckShelf('Main Deck · Spell Cards (Achievements & Scholarships)', spellCards)}

              {(deckFilter === 'all' || deckFilter === 'references') &&
                renderDeckShelf('Main Deck · Monster Cards (Character References)', monsterCards)}

              {(deckFilter === 'all' || deckFilter === 'side') && (
                <section className="space-y-5 border-t border-dashed border-[var(--border-hover)] pt-8 sm:space-y-6 sm:pt-10">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border-subtle)] pb-2.5">
                    <div>
                      <p className="font-mono-tech text-[10px] font-semibold tracking-[0.16em] text-[var(--accent-silver)] uppercase">
                        SIDE DECK ZONE · UTILITIES &amp; COLLABS
                      </p>
                      <h2 className="mt-1 font-editorial text-xl leading-snug text-[var(--text-main)] sm:text-2xl">
                        Side Deck: Tools, Coursework &amp; Collaborations
                      </h2>
                    </div>
                    <span className="shrink-0 font-mono-tech text-xs text-[var(--text-muted)]">
                      {SIDE_WORK_ARCHIVE.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
                    {SIDE_WORK_ARCHIVE.map((item, idx) => (
                      <article
                        key={item.id}
                        className="group relative flex w-[min(320px,88vw)] flex-col overflow-hidden rounded-[2px] border border-[var(--border-hover)] bg-[var(--bg-surface)] p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent-silver)] hover:shadow-lg sm:w-[290px] lg:w-[300px]"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2 rounded-[1px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-2.5 py-1">
                          <span className="truncate font-mono-tech text-[10px] font-semibold tracking-wider text-[var(--accent-silver)] uppercase">
                            SIDE-{String(idx + 1).padStart(3, '0')}
                          </span>
                          <span className="flex items-center gap-1.5 font-mono-tech text-[10px] text-[var(--text-muted)]">
                            <span className="h-2 w-2 rotate-45 rounded-[1px] bg-[var(--accent-silver)]" />
                            SIDE DECK
                          </span>
                        </div>

                        <div className="relative aspect-[16/9] overflow-hidden rounded-[1px] border border-[var(--border-hover)] bg-[var(--bg-muted)]">
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-all duration-500 group-hover:left-[150%]"
                          />
                        </div>

                        <div className="mt-2.5 flex flex-1 flex-col justify-between rounded-[1px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/45 p-3">
                          <div>
                            <p className="font-mono-tech text-[10px] text-[var(--text-muted)]">{item.role}</p>
                            <h3 className="mt-0.5 text-sm font-semibold text-[var(--text-main)]">{item.title}</h3>
                            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{item.summary}</p>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-2.5">
                            {item.links.map((link) => (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-silver)] hover:underline"
                              >
                                {link.kind === 'github' && <Github className="h-3.5 w-3.5" />}
                                {link.kind === 'live' && <ExternalLink className="h-3.5 w-3.5" />}
                                {link.kind === 'zip' && <Download className="h-3.5 w-3.5" />}
                                <span>{link.label}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 sm:pt-8">
                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    switchPhase('standby')
                  }}
                  className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
                >
                  ← Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    switchPhase('battle')
                  }}
                  className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90"
                >
                  <span>Experience &amp; Field Work</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              BP · EXPERIENCE (Internship Delivery + Real Field Photos)
              ========================================================= */}
          {activePhase === 'battle' && (
            <div className="space-y-10 sm:space-y-14">
              <div className="space-y-2 border-b border-[var(--border-subtle)] pb-5 sm:pb-6">
                <p className="font-mono-tech text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-silver)] uppercase">
                  BATTLE PHASE · EXPERIENCE
                </p>
                <h1 className="font-editorial text-3xl text-[var(--text-main)] sm:text-4xl">
                  Experience &amp; Field Record
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Enterprise internship delivery at Moriroku Philippines, 458-commit startup engineering at BuildBid, and field deployments.
                </p>
              </div>

              <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                {EXPERIENCE_HIGHLIGHTS.map((exp) => (
                  <article
                    key={exp.id}
                    className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                        {exp.period}
                      </span>
                      <span className="font-mono-tech text-[11px] font-semibold text-[var(--accent-silver)]">
                        {exp.badge}
                      </span>
                    </div>
                    <h2 className="mt-2.5 text-base font-semibold text-[var(--text-main)] sm:mt-3 sm:text-lg">{exp.role}</h2>
                    <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                      {exp.company} · {exp.location}
                    </p>
                    <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                      {exp.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--accent-silver)]" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              {/* Moriroku OJT Team & Completion Strip */}
              <section className="space-y-4 border-t border-[var(--border-subtle)] pt-8 sm:space-y-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--accent-silver)] uppercase">
                    Moriroku Philippines OJT Moments
                  </h2>
                  <span className="text-xs text-[var(--text-muted)]">Click any photo to open its card</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {OJT_EXPERIENCE_PHOTOS.map((shot) => (
                    <button
                      key={shot.id}
                      type="button"
                      onClick={() => openCardById(shot.cardId)}
                      className="group flex flex-col overflow-hidden rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-left transition hover:-translate-y-0.5 hover:border-[var(--accent-silver)] hover:shadow-md"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]">
                        <img
                          src={shot.src}
                          alt={shot.label}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-3.5">
                        <p className="text-sm font-semibold text-[var(--text-main)]">{shot.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">{shot.caption}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 sm:pt-8">
                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    setDeckFilter('projects')
                    switchPhase('main')
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-silver)] hover:underline"
                >
                  <span>Inspect InsecTra, HackForGov, and CodeChum cards in The Deck</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 sm:pt-8">
                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    switchPhase('main')
                  }}
                  className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
                >
                  ← Deck
                </button>
                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    switchPhase('main2')
                  }}
                  className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90"
                >
                  <span>About Me</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              MP2 · ABOUT ME (Playful Personal Voice & Photo Chapters)
              ========================================================= */}
          {activePhase === 'main2' && (
            <AboutMePhase
              onPrevPhase={() => switchPhase('battle')}
              onNextPhase={() => switchPhase('end')}
            />
          )}

          {/* =========================================================
              EP · CONTACT & GITHUB TRAIL (Cham-inspired calm 2-column layout)
              ========================================================= */}
          {activePhase === 'end' && (
            <div className="space-y-9 sm:space-y-12">
              <div className="grid gap-7 sm:gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
                {/* Left Column: Editorial Heading + Minimal Contact Links */}
                <div className="space-y-5 sm:space-y-6">
                  <div className="space-y-2.5 sm:space-y-3">
                    <p className="font-mono-tech text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-silver)] uppercase">
                      END PHASE · OPEN FOR 600-HOUR OJT
                    </p>
                    <h1 className="font-editorial text-[2rem] leading-tight text-[var(--text-main)] sm:text-[42px]">
                      Your turn. Let&rsquo;s build.
                    </h1>
                    <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                      Looking for a 600-hour OJT intern or help on a web or backend system? Send a message here and I&rsquo;ll get back to you.
                    </p>
                    <p className="font-mono-tech text-xs text-[var(--text-muted)]">
                      {PROFILE.ojtWindow} · {PROFILE.location}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-[var(--border-subtle)] pt-5 text-sm">
                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                      <Github className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>GitHub:</span>
                        <a
                          href={PROFILE.githubMain}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
                        >
                          @MichaelHans32116
                        </a>
                        <span className="text-[var(--text-muted)]">/</span>
                        <a
                          href={PROFILE.githubAlt}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
                        >
                          @hans32116
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                      <Linkedin className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                      <a
                        href={PROFILE.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
                      >
                        <span>LinkedIn: {PROFILE.shortName}</span>
                        <ExternalLink className="h-3 w-3 text-[var(--text-muted)]" />
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-[var(--text-main)] sm:gap-3">
                      <Mail className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                      <a
                        href={`mailto:${PROFILE.emailPersonal}`}
                        className="break-all font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
                      >
                        {PROFILE.emailPersonal}
                      </a>
                      <button
                        type="button"
                        onClick={() => copyValue('email', PROFILE.emailPersonal)}
                        className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
                      >
                        {copiedField === 'email' ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedField === 'email' ? 'Email Copied' : 'Copy Email'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[var(--text-main)]">
                      <Phone className="h-4 w-4 shrink-0 text-[var(--accent-silver)]" />
                      <a
                        href={`tel:${PROFILE.phoneTel}`}
                        className="font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
                      >
                        {PROFILE.phone}
                      </a>
                    </div>

                    <div className="pt-2">
                      <a
                        href={PROFILE.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-main)] transition hover:border-[var(--border-hover)]"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        <span>Resume PDF</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sharp Cham-Style Contact Form */}
                <form
                  onSubmit={handleSendContactMessage}
                  className="space-y-4 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-7"
                >
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="block font-mono-tech text-xs font-medium text-[var(--text-secondary)]"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name..."
                      className="w-full rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="block font-mono-tech text-xs font-medium text-[var(--text-secondary)]"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Your email..."
                      className="w-full rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block font-mono-tech text-xs font-medium text-[var(--text-secondary)]"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Your message..."
                      className="w-full resize-y rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none sm:text-sm"
                    />
                  </div>

                  {contactNotice && (
                    <p
                      className={`rounded-[2px] border px-3 py-2 text-xs ${
                        contactStatus === 'sent'
                          ? 'border-emerald-500/45 bg-emerald-500/10 text-[var(--text-main)]'
                          : 'border-[var(--accent-silver)]/45 bg-[var(--bg-muted)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {contactNotice}
                    </p>
                  )}

                  <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <button
                      type="submit"
                      disabled={contactSending}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{contactSending ? 'Sending...' : 'Send Message'}</span>
                    </button>

                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        PROFILE.emailPersonal,
                      )}&su=${encodeURIComponent(
                        `Portfolio Inquiry${contactName.trim() ? ` from ${contactName.trim()}` : ''}`,
                      )}&body=${encodeURIComponent(contactMessage.trim())}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)] sm:w-auto"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Open in Gmail Web</span>
                    </a>
                  </div>
                </form>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 sm:pt-8">
                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    switchPhase('main2')
                  }}
                  className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
                >
                  ← About Me
                </button>
                <button
                  type="button"
                  onClick={handleReplayDraw}
                  className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Replay Draw Phase</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-5 pb-24 sm:py-6 sm:pb-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1.5 px-5 text-center text-xs text-[var(--text-muted)] sm:flex-row sm:gap-2 sm:px-8 sm:text-left">
          <span>{PROFILE.fullName}</span>
          <span>@MichaelHans32116 &amp; @hans32116</span>
        </div>
      </footer>

      <DeckCardModal
        item={selectedCard}
        onClose={() => setSelectedCard(null)}
        onPrev={canStepModal ? handlePrevCard : undefined}
        onNext={canStepModal ? handleNextCard : undefined}
        positionLabel={canStepModal ? `${selectedIndex + 1} / ${activeModalCards.length}` : undefined}
      />

      <DuelGuideTour
        open={portfolioTourOpen}
        steps={PORTFOLIO_TOUR_STEPS}
        onClose={closePortfolioTour}
      />
    </div>
  )
}

export default App
