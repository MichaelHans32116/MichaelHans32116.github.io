import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { RotateCcw } from 'lucide-react'
import { AudioControls } from './components/AudioControls'
import { DeckCardModal } from './components/DeckCardModal'
import { DrawPhase } from './components/DrawPhase'
import { DuelFieldBg } from './components/DuelFieldBg'
import { MobileHeaderMotion } from './components/MobileHeaderMotion'
import { PhaseCardTray, PortfolioPhase } from './components/PhaseCardTray'
import { ThemeFlipButton } from './components/ThemeFlipButton'
import { YgoBrandEmblem } from './components/YgoBrandEmblem'
import { DECK_CARDS, DeckCardItem, DeckCategory, PROFILE } from './data/deckData'
import { AboutSection } from './sections/AboutSection'
import { ContactSection } from './sections/ContactSection'
import { DeckSection } from './sections/DeckSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { HomeSection } from './sections/HomeSection'
import { BgmMode, BgmTrackId, duelSfx } from './utils/sfx'

type ThemeMode = 'light' | 'dark'

const NAV_PHASES: { id: PortfolioPhase; code: string; label: string; banner: string }[] = [
  { id: 'standby', code: 'SP', label: 'Home', banner: 'STANDBY PHASE' },
  { id: 'main', code: 'MP1', label: 'Deck', banner: 'MAIN PHASE 1' },
  { id: 'battle', code: 'BP', label: 'Experience', banner: 'BATTLE PHASE' },
  { id: 'main2', code: 'MP2', label: 'About Me', banner: 'MAIN PHASE 2' },
  { id: 'end', code: 'EP', label: 'Contact', banner: 'END PHASE' },
]

export function App() {
  const [stage, setStage] = useState<'draw' | 'portfolio'>('draw')
  const [activePhase, setActivePhase] = useState<PortfolioPhase>('standby')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    try {
      return window.localStorage.getItem('mh-theme') === 'dark' ? 'dark' : 'light'
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
  const [swipeHint, setSwipeHint] = useState<{ dir: 'prev' | 'next'; label: string } | null>(null)
  const [phaseBanner, setPhaseBanner] = useState<{ code: string; banner: string; key: number } | null>(null)

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

  const stepPortfolioPhase = useCallback(
    (delta: -1 | 1) => {
      const idx = NAV_PHASES.findIndex((p) => p.id === activePhase)
      if (idx === -1) return
      const next = NAV_PHASES[idx + delta]
      if (next) switchPhase(next.id)
    },
    [activePhase, switchPhase],
  )

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

  const trapCards = useMemo(() => DECK_CARDS.filter((c) => c.category === 'projects'), [])
  const spellCards = useMemo(() => DECK_CARDS.filter((c) => c.category === 'achievements'), [])
  const monsterCards = useMemo(() => DECK_CARDS.filter((c) => c.category === 'references'), [])

  const openCardById = useCallback((cardId: string) => {
    const found = DECK_CARDS.find((c) => c.id === cardId)
    if (found) {
      duelSfx.playHover()
      setSelectedCard(found)
    }
  }, [])

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

  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--bg-canvas)] text-[var(--text-main)]">
      <DuelFieldBg variant="arena" />
      <MobileHeaderMotion resetKey={activePhase} />

      {renderThemeFlipOverlay()}

      <PhaseCardTray
        activePhase={activePhase}
        theme={theme}
        onSelectPhase={switchPhase}
        onReplayDraw={handleReplayDraw}
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

      {phaseBanner && (
        <div
          key={phaseBanner.key}
          aria-live="polite"
          className="ygo-phase-banner pointer-events-none fixed left-1/2 top-16 z-40 -translate-x-1/2 rounded-[2px] border border-[var(--accent-silver)]/60 bg-[var(--bg-surface)]/92 px-5 py-1.5 shadow-md backdrop-blur-md"
        >
          <span className="inline-flex items-center gap-2 font-mono-tech text-[11px] font-semibold tracking-[0.22em] text-[var(--text-main)] uppercase">
            <span className="text-[var(--accent-silver)]">{phaseBanner.code}</span>
            <span>{phaseBanner.banner}</span>
          </span>
        </div>
      )}

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

          <div id="tour-controls" className="flex items-center gap-1.5 sm:gap-2">
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

      <main
        onTouchStart={(e) => {
          if (selectedCard || e.touches.length !== 1) return
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
          {activePhase === 'standby' && (
            <HomeSection
              onOpenCard={openCardById}
              onGoContact={() => {
                duelSfx.playHover()
                switchPhase('end')
              }}
            />
          )}

          {activePhase === 'main' && (
            <DeckSection
              deckFilter={deckFilter}
              onChangeFilter={setDeckFilter}
              onSelectCard={setSelectedCard}
              trapCards={trapCards}
              spellCards={spellCards}
              monsterCards={monsterCards}
            />
          )}

          {activePhase === 'battle' && <ExperienceSection onOpenCard={openCardById} />}

          {activePhase === 'main2' && <AboutSection />}

          {activePhase === 'end' && <ContactSection />}
        </div>
      </main>

      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-5 pb-24 sm:py-6 sm:pb-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1.5 px-5 text-center text-xs text-[var(--text-muted)] sm:flex-row sm:gap-2 sm:px-8 sm:text-left">
          <span>{PROFILE.fullName}</span>
          <span>@MichaelHans32116 &amp; @hans32116</span>
        </div>
      </footer>

      <DeckCardModal item={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  )
}

export default App
