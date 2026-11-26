import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileDown,
  Github,
  Linkedin,
  Mail,
  Moon,
  Phone,
  RotateCcw,
  Send,
  Sun,
} from 'lucide-react'
import { AudioControls } from './components/AudioControls'
import { DeckCard } from './components/DeckCard'
import { DeckCardModal } from './components/DeckCardModal'
import { DrawPhase } from './components/DrawPhase'
import { DuelFieldBg } from './components/DuelFieldBg'
import { HoloYugiohCard } from './components/HoloYugiohCard'
import { PhaseCardTray, PortfolioPhase } from './components/PhaseCardTray'
import { TechToolkit } from './components/TechToolkit'
import {
  DECK_CARDS,
  DeckCardItem,
  DeckCategory,
  EDUCATION_INFO,
  EXPERIENCE_HIGHLIGHTS,
  PROFILE,
  SIDE_WORK_ARCHIVE,
  STANDOUT_HIGHLIGHTS,
} from './data/deckData'
import { duelSfx } from './utils/sfx'

type ThemeMode = 'light' | 'dark'

const NAV_PHASES: { id: PortfolioPhase; code: string; label: string; banner: string }[] = [
  { id: 'standby', code: 'SP', label: 'Home', banner: 'STANDBY PHASE' },
  { id: 'main', code: 'MP1', label: 'Deck', banner: 'MAIN PHASE 1' },
  { id: 'battle', code: 'BP', label: 'Experience', banner: 'BATTLE PHASE' },
  { id: 'end', code: 'EP', label: 'Contact', banner: 'END PHASE' },
]

export function App() {
  const [stage, setStage] = useState<'draw' | 'portfolio'>('draw')
  const [activePhase, setActivePhase] = useState<PortfolioPhase>('standby')
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem('mh-theme')
    return saved === 'dark' ? 'dark' : 'light'
  })
  const [sfxEnabled, setSfxEnabled] = useState(() => duelSfx.isSfxEnabled())
  const [bgmMuted, setBgmMuted] = useState(() => duelSfx.isBgmMuted())
  const [bgmVolume, setBgmVolume] = useState(() => duelSfx.getBgmVolume())
  const [deckFilter, setDeckFilter] = useState<DeckCategory>('all')
  const [selectedCard, setSelectedCard] = useState<DeckCardItem | null>(null)
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactNotice, setContactNotice] = useState<string | null>(null)
  const [phaseBanner, setPhaseBanner] = useState<{ code: string; banner: string; key: number } | null>(null)

  const portfolioRef = useRef<HTMLDivElement>(null)
  const phaseContainerRef = useRef<HTMLDivElement>(null)
  const bannerTimerRef = useRef<number | null>(null)

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
    duelSfx.playHover()
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

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

  const handleEnterPortfolio = useCallback(() => {
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

  useEffect(() => {
    return () => {
      if (bannerTimerRef.current) {
        window.clearTimeout(bannerTimerRef.current)
      }
    }
  }, [])

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

  const handleSendContactMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const cleanName = contactName.trim()
    const cleanEmail = contactEmail.trim()
    const cleanMsg = contactMessage.trim()
    if (!cleanName || !cleanEmail || !cleanMsg) {
      setContactNotice('Please fill out your name, email, and message first.')
      return
    }
    duelSfx.playFlip()
    const subject = encodeURIComponent(`Portfolio Inquiry from ${cleanName}`)
    const body = encodeURIComponent(`Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMsg}`)
    window.location.href = `mailto:${PROFILE.emailPersonal}?subject=${subject}&body=${body}`
    setContactNotice('Opening your mail app with your draft ready. You can also click Copy Email on the left.')
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

  const selectedIndex = selectedCard ? visibleCards.findIndex((c) => c.id === selectedCard.id) : -1

  const openCardById = useCallback((cardId: string) => {
    const found = DECK_CARDS.find((c) => c.id === cardId)
    if (found) {
      duelSfx.playHover()
      setSelectedCard(found)
    }
  }, [])

  const handlePrevCard = useCallback(() => {
    if (visibleCards.length === 0 || selectedIndex === -1) return
    const prevIdx = (selectedIndex - 1 + visibleCards.length) % visibleCards.length
    setSelectedCard(visibleCards[prevIdx])
  }, [selectedIndex, visibleCards])

  const handleNextCard = useCallback(() => {
    if (visibleCards.length === 0 || selectedIndex === -1) return
    const nextIdx = (selectedIndex + 1) % visibleCards.length
    setSelectedCard(visibleCards[nextIdx])
  }, [selectedIndex, visibleCards])

  if (stage === 'draw') {
    return (
      <DrawPhase
        onEnterPortfolio={handleEnterPortfolio}
        sfxEnabled={sfxEnabled}
        bgmMuted={bgmMuted}
        bgmVolume={bgmVolume}
        onToggleSfx={toggleSfx}
        onToggleBgmMute={toggleBgmMute}
        onChangeBgmVolume={changeBgmVolume}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  const renderDeckShelf = (title: string, cards: DeckCardItem[]) => (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <h2 className="font-editorial text-2xl text-[var(--text-main)]">{title}</h2>
        <span className="font-mono-tech text-xs text-[var(--text-muted)]">{cards.length}</span>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.id} className="ygo-deck-slot mx-auto flex w-full max-w-[270px] flex-col">
            <DeckCard item={card} onClick={() => setSelectedCard(card)} />
            <p className="mt-2.5 truncate text-center text-sm font-medium text-[var(--text-main)]">
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

      <PhaseCardTray
        activePhase={activePhase}
        theme={theme}
        onSelectPhase={switchPhase}
        onReplayDraw={handleReplayDraw}
      />

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

      {/* Minimal Calm Top Navbar (Cham-inspired spacing, sharp 2px geometry) */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <button
            type="button"
            onClick={() => {
              duelSfx.playHover()
              switchPhase('standby')
            }}
            className="flex items-center gap-2.5 text-left"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono-tech text-xs font-bold tracking-wider text-[var(--text-main)]">
              MH
            </span>
            <span className="text-sm font-semibold tracking-tight text-[var(--text-main)]">
              {PROFILE.shortName}
            </span>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav aria-label="Primary phase navigation" className="hidden items-center gap-7 md:flex">
            {NAV_PHASES.map((p) => {
              const isActive = activePhase === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    switchPhase(p.id)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`border-b-2 py-1 text-sm font-medium transition ${
                    isActive
                      ? 'border-[var(--accent-silver)] text-[var(--text-main)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReplayDraw}
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
              title="Return to Draw Phase (DP)"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Pull Card</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </button>

            <AudioControls
              compact
              bgmMuted={bgmMuted}
              bgmVolume={bgmVolume}
              sfxEnabled={sfxEnabled}
              onToggleBgmMute={toggleBgmMute}
              onChangeBgmVolume={changeBgmVolume}
              onToggleSfx={toggleSfx}
            />
          </div>
        </div>

        {/* Mobile Phase Bar */}
        <div className="flex items-center gap-5 overflow-x-auto border-t border-[var(--border-subtle)] px-5 py-2 md:hidden">
          {NAV_PHASES.map((p) => {
            const isActive = activePhase === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  duelSfx.playHover()
                  switchPhase(p.id)
                }}
                className={`shrink-0 border-b-2 pb-1 text-xs font-medium transition ${
                  isActive
                    ? 'border-[var(--accent-silver)] text-[var(--text-main)]'
                    : 'border-transparent text-[var(--text-secondary)]'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* ACTIVE PHASE VIEW */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div ref={phaseContainerRef}>
          {/* =========================================================
              SP · HOME (Calm Editorial Intro + Standouts + Education + TechToolkit)
              ========================================================= */}
          {activePhase === 'standby' && (
            <div className="space-y-20">
              {/* Hero Intro */}
              <section className="grid items-center gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
                <div className="mx-auto w-[min(260px,70vw)]">
                  <HoloYugiohCard flippable />
                </div>

                <div className="space-y-6">
                  <div className="space-y-3.5">
                    <h1 className="font-editorial text-4xl leading-tight text-[var(--text-main)] sm:text-5xl">
                      {PROFILE.heroHeadline}
                    </h1>
                    <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-base">
                      {PROFILE.heroBio}{' '}
                      Explore the{' '}
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
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        duelSfx.playHover()
                        switchPhase('end')
                      }}
                      className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-4 py-2 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>{PROFILE.emailPersonal}</span>
                    </button>

                    <a
                      href={`tel:${PROFILE.phoneTel}`}
                      className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 font-mono-tech text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)]"
                    >
                      <Phone className="h-3.5 w-3.5 text-[var(--accent-silver)]" />
                      <span>{PROFILE.phone}</span>
                    </a>

                    <a
                      href={PROFILE.githubMain}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)]"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                    </a>

                    <a
                      href={PROFILE.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)]"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      <span>Resume</span>
                    </a>
                  </div>
                </div>
              </section>

              {/* Standout Achievements Section (Clean Separated Editorial Rows) */}
              <section className="space-y-5 border-t border-[var(--border-subtle)] pt-12">
                <div className="flex items-baseline justify-between gap-4">
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
                      className="group flex w-full flex-col gap-1 py-4 text-left transition sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-silver)] sm:text-[15px]">
                          {item.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{item.issuer}</p>
                      </div>
                      <span className="shrink-0 font-mono-tech text-xs font-medium text-[var(--text-secondary)]">
                        {item.metric}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Education Section (Dedicated Clean Section) */}
              <section className="space-y-4 border-t border-[var(--border-subtle)] pt-12">
                <h2 className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--accent-silver)] uppercase">
                  Education
                </h2>

                <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
                  <div className="space-y-1.5">
                    <h3 className="font-editorial text-2xl text-[var(--text-main)]">
                      {EDUCATION_INFO.institution}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {EDUCATION_INFO.degree}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {EDUCATION_INFO.location} · {PROFILE.ojtWindow}
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                    {EDUCATION_INFO.honors.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--accent-silver)]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Cham-Inspired Technical Toolkit with Monochrome Icons */}
              <div className="border-t border-[var(--border-subtle)] pt-12">
                <TechToolkit />
              </div>

              <div className="flex justify-end border-t border-[var(--border-subtle)] pt-8">
                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    switchPhase('main')
                  }}
                  className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90"
                >
                  <span>Open Deck ({DECK_CARDS.length} Cards)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              MP1 · DECK (Clean 3 Separated Card-Type Shelves)
              ========================================================= */}
          {activePhase === 'main' && (
            <div className="space-y-14">
              <div className="flex flex-col justify-between gap-5 border-b border-[var(--border-subtle)] pb-6 md:flex-row md:items-end">
                <h1 className="font-editorial text-4xl text-[var(--text-main)]">The Deck</h1>

                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Deck categories">
                  {(
                    [
                      { id: 'all', label: `All (${DECK_CARDS.length})` },
                      { id: 'projects', label: `Projects (${trapCards.length})` },
                      { id: 'achievements', label: `Achievements (${spellCards.length})` },
                      { id: 'references', label: `References (${monsterCards.length})` },
                    ] as { id: DeckCategory; label: string }[]
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={deckFilter === tab.id}
                      onClick={() => {
                        duelSfx.playHover()
                        setDeckFilter(tab.id)
                      }}
                      className={`rounded-[2px] border px-3.5 py-1.5 text-xs font-medium transition ${
                        deckFilter === tab.id
                          ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {(deckFilter === 'all' || deckFilter === 'projects') &&
                renderDeckShelf('Trap Cards — Projects', trapCards)}

              {(deckFilter === 'all' || deckFilter === 'achievements') &&
                renderDeckShelf('Spell Cards — Achievements & Scholarships', spellCards)}

              {(deckFilter === 'all' || deckFilter === 'references') &&
                renderDeckShelf('Monster Cards — Character References', monsterCards)}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-8">
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
                  <span>Experience &amp; Side Deck</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              BP · EXPERIENCE & SIDE DECK
              ========================================================= */}
          {activePhase === 'battle' && (
            <div className="space-y-14">
              <div className="space-y-2 border-b border-[var(--border-subtle)] pb-6">
                <h1 className="font-editorial text-4xl text-[var(--text-main)]">
                  Experience &amp; Side Deck
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Internship delivery, production commits, and public web utilities.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {EXPERIENCE_HIGHLIGHTS.map((exp) => (
                  <article
                    key={exp.id}
                    className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-7"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                        {exp.period}
                      </span>
                      <span className="font-mono-tech text-[11px] font-semibold text-[var(--accent-silver)]">
                        {exp.badge}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-[var(--text-main)]">{exp.role}</h2>
                    <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                      {exp.company} · {exp.location}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--text-secondary)]">
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

              <section className="space-y-6">
                <h2 className="font-editorial text-2xl text-[var(--text-main)]">
                  Side Deck &amp; Collaborations
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {SIDE_WORK_ARCHIVE.map((item) => (
                    <article
                      key={item.id}
                      className="group overflow-hidden rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition hover:border-[var(--border-hover)]"
                    >
                      <div className="aspect-[16/9] overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="p-5">
                        <p className="font-mono-tech text-[11px] text-[var(--text-muted)]">{item.role}</p>
                        <h3 className="mt-1 text-base font-semibold text-[var(--text-main)]">{item.title}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">{item.summary}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
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

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-8">
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
                    switchPhase('end')
                  }}
                  className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90"
                >
                  <span>Contact &amp; GitHub</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              EP · CONTACT & GITHUB TRAIL (Cham-inspired calm 2-column layout)
              ========================================================= */}
          {activePhase === 'end' && (
            <div className="space-y-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
                {/* Left Column: Editorial Heading + Minimal Contact Links */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="font-mono-tech text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-silver)] uppercase">
                      END PHASE · OPEN FOR 600-HOUR OJT
                    </p>
                    <h1 className="font-editorial text-4xl text-[var(--text-main)] sm:text-[42px]">
                      Your turn &mdash; let&rsquo;s build.
                    </h1>
                    <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
                      Got an internship slot, a backend challenge, or a production system that needs steady hands? Drop a note directly and I&rsquo;ll get right back to you.
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

                    <div className="flex flex-wrap items-center gap-3 text-[var(--text-main)]">
                      <Mail className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                      <a
                        href={`mailto:${PROFILE.emailPersonal}`}
                        className="font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
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
                  className="space-y-4 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-7"
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
                      className="w-full rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none"
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
                      className="w-full rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none"
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
                      className="w-full resize-y rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none"
                    />
                  </div>

                  {contactNotice && (
                    <p className="rounded-[2px] border border-[var(--accent-silver)]/40 bg-[var(--bg-muted)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                      {contactNotice}
                    </p>
                  )}

                  <div className="pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-8">
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

      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-6 pb-24">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-5 text-xs text-[var(--text-muted)] sm:px-8">
          <span>{PROFILE.fullName}</span>
          <span>@MichaelHans32116 &amp; @hans32116</span>
        </div>
      </footer>

      <DeckCardModal
        item={selectedCard}
        onClose={() => setSelectedCard(null)}
        onPrev={visibleCards.length > 1 ? handlePrevCard : undefined}
        onNext={visibleCards.length > 1 ? handleNextCard : undefined}
        positionLabel={selectedIndex >= 0 ? `${selectedIndex + 1} / ${visibleCards.length}` : undefined}
      />
    </div>
  )
}

export default App
