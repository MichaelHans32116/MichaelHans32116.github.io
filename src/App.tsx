import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Compass, RotateCcw } from 'lucide-react'
import { duelSfx } from './audio'
import { AudioControls } from './components/AudioControls'
import { DuelFieldBg } from './components/DuelFieldBg'
import { MobileHeaderMotion } from './components/MobileHeaderMotion'
import { ThemeFlipButton } from './components/ThemeFlipButton'
import { ThemeFlipOverlay } from './components/ThemeFlipOverlay'
import { YgoBrandEmblem } from './components/YgoBrandEmblem'
import {
  DECK_CARDS,
  DeckCardItem,
  DeckCategory,
  PORTFOLIO_TOUR_KEY,
  PortfolioPhase,
  PROFILE,
  TOUR_STEPS_BY_PHASE,
} from './data'
import { useDuelAudio } from './hooks/useDuelAudio'
import { usePhaseSwipe } from './hooks/usePhaseSwipe'
import { useThemeMode } from './hooks/useThemeMode'

const DrawPhase = lazy(() => import('./components/draw/DrawPhase'))
const PhaseCardTray = lazy(() => import('./components/tray/PhaseCardTray'))
const DeckCardModal = lazy(() => import('./components/DeckCardModal'))
const DuelGuideTour = lazy(() => import('./components/walkthrough/DuelGuideTour'))
const HomeSection = lazy(() => import('./sections/HomeSection'))
const DeckSection = lazy(() => import('./sections/DeckSection'))
const ExperienceSection = lazy(() => import('./sections/ExperienceSection'))
const AboutSection = lazy(() => import('./sections/AboutSection'))
const ContactSection = lazy(() => import('./sections/ContactSection'))

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
  const [deckFilter, setDeckFilter] = useState<DeckCategory>('projects')
  const [selectedCard, setSelectedCard] = useState<DeckCardItem | null>(null)
  const [portfolioTourOpen, setPortfolioTourOpen] = useState(false)
  const [phaseBanner, setPhaseBanner] = useState<{
    code: string
    banner: string
    key: number
  } | null>(null)

  const { theme, themeFlipDir, toggleTheme } = useThemeMode()
  const {
    sfxEnabled,
    bgmMuted,
    bgmVolume,
    bgmMode,
    activeTrackId,
    setActiveTrackId,
    toggleSfx,
    toggleBgmMute,
    changeBgmVolume,
    changeBgmMode,
    selectBgmTrack,
  } = useDuelAudio()

  const phaseContainerRef = useRef<HTMLDivElement>(null)
  const bannerTimerRef = useRef<number | null>(null)

  const handleEnterPortfolio = useCallback(() => {
    duelSfx.leaveSplashStage()
    setActivePhase('standby')
    setStage('portfolio')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleReplayDraw = useCallback(() => {
    setSelectedCard(null)
    setPortfolioTourOpen(false)
    setStage('draw')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const switchPhase = useCallback((nextPhase: PortfolioPhase) => {
    setSelectedCard(null)
    setPortfolioTourOpen(false)
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

  const { swipeHint, clearSwipeHint, swipeHandlers } = usePhaseSwipe({
    currentIdx: currentPhaseIdx,
    phases: NAV_PHASES,
    disabled: Boolean(selectedCard) || portfolioTourOpen,
    onStep: stepPortfolioPhase,
  })

  const handleSelectPhaseFromTray = useCallback(
    (phase: PortfolioPhase) => {
      clearSwipeHint()
      switchPhase(phase)
    },
    [clearSwipeHint, switchPhase],
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
    }, 600)
    return () => window.clearTimeout(timer)
  }, [activePhase, stage])

  useEffect(() => {
    return () => {
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (stage === 'portfolio') {
      duelSfx.setPhaseBgm(activePhase)
      setActiveTrackId(duelSfx.getActiveTrackId())
    }
  }, [activePhase, setActiveTrackId, stage])

  useEffect(() => {
    if (stage === 'portfolio' && phaseContainerRef.current) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return
      gsap.fromTo(
        phaseContainerRef.current,
        { opacity: 0, y: 18, scale: 0.992 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.36,
          ease: 'power3.out',
          clearProps: 'transform',
        },
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
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.36,
        stagger: 0.045,
        ease: 'power3.out',
        clearProps: 'transform',
      },
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

  if (stage === 'draw') {
    return (
      <>
        <ThemeFlipOverlay direction={themeFlipDir} />
        <Suspense fallback={null}>
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
        </Suspense>
      </>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--bg-canvas)] text-[var(--text-main)]">
      <DuelFieldBg variant="arena" />
      <MobileHeaderMotion resetKey={activePhase} />
      <ThemeFlipOverlay direction={themeFlipDir} />

      <Suspense fallback={null}>
        <PhaseCardTray
          activePhase={activePhase}
          theme={theme}
          onSelectPhase={handleSelectPhaseFromTray}
          onReplayDraw={handleReplayDraw}
        />
      </Suspense>

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
              onClick={() => {
                duelSfx.playHover()
                setPortfolioTourOpen(true)
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

      <main
        {...swipeHandlers}
        className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-8 sm:py-12"
      >
        <div ref={phaseContainerRef}>
          <Suspense fallback={null}>
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
          </Suspense>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-5 pb-24 sm:py-6 sm:pb-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1.5 px-5 text-center text-xs text-[var(--text-muted)] sm:flex-row sm:gap-2 sm:px-8 sm:text-left">
          <span>{PROFILE.fullName}</span>
          <span>@MichaelHans32116 &amp; @hans32116</span>
        </div>
      </footer>

      <Suspense fallback={null}>
        <DeckCardModal item={selectedCard} onClose={() => setSelectedCard(null)} />
        <DuelGuideTour
          open={portfolioTourOpen}
          steps={TOUR_STEPS_BY_PHASE[activePhase]}
          onClose={closePortfolioTour}
        />
      </Suspense>
    </div>
  )
}

export default App
