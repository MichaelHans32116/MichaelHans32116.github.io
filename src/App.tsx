import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  Award,
  Briefcase,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileDown,
  GitBranch,
  Github,
  Linkedin,
  Mail,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { CardInspectorModal } from './components/CardInspectorModal'
import { DrawPhase } from './components/DrawPhase'
import { DuelTerminal } from './components/DuelTerminal'
import { RecruiterView } from './components/RecruiterView'
import { YuGiOhCard } from './components/YuGiOhCard'
import {
  ACE_CARD,
  CREDENTIAL_TRAPS,
  DUELIST_PROFILE,
  EXPERIENCE_SPELLS,
  PROJECT_CARDS,
  ProjectCardData,
  ProjectFilter,
  SIDE_DECK_ARCHIVE,
  SKILL_SPELLS,
} from './data/portfolioData'
import { duelSfx } from './utils/sfx'

export function App() {
  const [stage, setStage] = useState<'draw' | 'field'>('draw')
  const [viewMode, setViewMode] = useState<'duelist' | 'recruiter'>('duelist')
  const [sfxEnabled, setSfxEnabled] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [filter, setFilter] = useState<ProjectFilter>('all')
  const [inspectedProject, setInspectedProject] = useState<ProjectCardData | null>(null)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const fieldRef = useRef<HTMLDivElement>(null)

  const handleToggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev
      duelSfx.setEnabled(next)
      return next
    })
  }, [])

  const handleSetSfx = useCallback((next: boolean) => {
    setSfxEnabled(next)
    duelSfx.setEnabled(next)
  }, [])

  const handleEnterField = useCallback(() => {
    setViewMode('duelist')
    setStage('field')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleEnterRecruiter = useCallback(() => {
    setViewMode('recruiter')
    setStage('field')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleReplayDraw = useCallback(() => {
    setInspectedProject(null)
    setTerminalOpen(false)
    setStage('draw')
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  // Crisp entrance animation when entering the Main Duel Field
  useEffect(() => {
    if (stage === 'field' && viewMode === 'duelist' && fieldRef.current) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return
      gsap.fromTo(
        fieldRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      )
    }
  }, [stage, viewMode])

  const filteredProjects = PROJECT_CARDS.filter((p) => {
    if (filter === 'all') return true
    return p.filterGroup === filter
  })

  const copyPersonalEmail = async () => {
    try {
      await navigator.clipboard.writeText(DUELIST_PROFILE.emailPersonal)
      setCopiedEmail(true)
      duelSfx.playClick()
      window.setTimeout(() => setCopiedEmail(false), 2000)
    } catch {
      // Clipboard blocked fallback
    }
  }

  if (stage === 'draw') {
    return (
      <DrawPhase
        onEnterField={handleEnterField}
        onEnterRecruiter={handleEnterRecruiter}
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
      />
    )
  }

  return (
    <div className={terminalOpen ? 'pb-[290px]' : 'pb-14'}>
      {viewMode === 'recruiter' ? (
        <RecruiterView
          onSwitchToDuelist={() => setViewMode('duelist')}
          onReplayDraw={handleReplayDraw}
          onInspectProject={(p) => setInspectedProject(p)}
          onOpenTerminal={() => setTerminalOpen(true)}
        />
      ) : (
        <div ref={fieldRef} className="duel-mat-bg min-h-screen text-[#ECEEF2]">
          {/* Sticky Duel Disk Header */}
          <header className="sticky top-0 z-30 border-b border-[#D4AF37]/20 bg-[#08090c]/92 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <a href="#ace" className="group flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-[#D4AF37]/55 bg-[#10131c] font-display text-xs font-bold tracking-wider text-[#F3DA8B] transition group-hover:border-[#F3DA8B]">
                  MH
                </div>
                <div className="leading-tight">
                  <span className="font-display block text-xs font-bold tracking-[0.12em] text-[#f3f5f9]">
                    MICHAEL HANS
                  </span>
                  <span className="font-mono-tech block text-[9.5px] tracking-[0.14em] text-[#D4AF37]/85">
                    LP {DUELIST_PROFILE.lp} // DUELIST
                  </span>
                </div>
              </a>

              <nav className="hidden items-center gap-5 text-xs font-medium text-[#98A2B3] lg:flex">
                <a href="#ace" className="transition hover:text-[#F3DA8B]">
                  Ace Card
                </a>
                <a href="#projects" className="transition hover:text-[#F3DA8B]">
                  Monster Zone
                </a>
                <a href="#deck-specs" className="transition hover:text-[#F3DA8B]">
                  Spell &amp; Trap
                </a>
                <a href="#archive" className="transition hover:text-[#F3DA8B]">
                  Side Deck
                </a>
                <a href="#contact" className="transition hover:text-[#F3DA8B]">
                  Contact
                </a>
              </nav>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleReplayDraw}
                  className="font-mono-tech inline-flex items-center gap-1 rounded border border-[#2a3142] bg-[#10141e] px-2.5 py-1.5 text-[10.5px] text-[#c5ccd9] transition hover:border-[#D4AF37]/60 hover:text-[#F3DA8B]"
                  title="Replay opening card draw"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Draw</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleSfx}
                  className="font-mono-tech inline-flex items-center gap-1 rounded border border-[#2a3142] bg-[#10141e] px-2 py-1.5 text-[10.5px] text-[#c5ccd9] transition hover:border-[#D4AF37]/60 hover:text-[#F3DA8B]"
                  title="Toggle sound effects"
                >
                  {sfxEnabled ? (
                    <Volume2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5 text-[#7a8499]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playClick()
                    setViewMode('recruiter')
                  }}
                  className="font-mono-tech inline-flex items-center gap-1.5 rounded border border-[#4EA8DE]/40 bg-[#0e1929] px-2.5 py-1.5 text-[10.5px] font-medium text-[#9bd3f5] transition hover:border-[#4EA8DE]/80 hover:bg-[#13243b]"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Recruiter View</span>
                  <span className="sm:hidden">HR</span>
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl space-y-24 px-4 py-10 sm:px-6 sm:py-14">
            {/* ZONE 01: ACE MONSTER HERO */}
            <section
              id="ace"
              className="grid items-center gap-10 lg:grid-cols-[310px_1fr] lg:gap-12"
            >
              {/* Drawn Interactive 3D Shadowbox Ace Card */}
              <div className="mx-auto flex w-full max-w-[300px] flex-col items-center">
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
                <p className="font-mono-tech mt-3 text-[10px] tracking-[0.14em] text-[#8d97ab] uppercase">
                  Hover to tilt · Click card to flip dossier
                </p>
              </div>

              {/* Hero Editorial Copy */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono-tech inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#14120c] px-3 py-1 text-[10.5px] font-medium tracking-[0.14em] text-[#F3DA8B] uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                    MAIN PHASE 1 · ACTIVE ON FIELD
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#4EA8DE]">
                    {DUELIST_PROFILE.ojtWindow}
                  </span>
                </div>

                <div>
                  <h1 className="font-display text-3xl leading-[1.15] font-bold tracking-wide text-[#f5f6fa] sm:text-4xl lg:text-[2.65rem]">
                    {DUELIST_PROFILE.heroHeadline}
                  </h1>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#b5bece] sm:text-base">
                    {DUELIST_PROFILE.heroBio}
                  </p>
                </div>

                {/* Verified Proof Chips */}
                <div className="flex flex-wrap gap-2">
                  {DUELIST_PROFILE.proofPills.map((pill) => (
                    <span
                      key={pill}
                      className="font-mono-tech rounded border border-[#D4AF37]/22 bg-[#10141e] px-2.5 py-1 text-[11px] text-[#dce1ec]"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={DUELIST_PROFILE.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-display inline-flex items-center gap-2 rounded-md border border-[#F3DA8B]/80 bg-gradient-to-b from-[#dfb948] to-[#9f7d22] px-5 py-2.5 text-xs font-bold tracking-[0.12em] text-[#08090c] uppercase shadow-[0_12px_28px_-12px_rgba(212,175,55,0.65)] transition hover:brightness-110"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Download Resume (PDF)</span>
                  </a>

                  <a
                    href="#projects"
                    className="font-mono-tech inline-flex items-center gap-2 rounded-md border border-[#D4AF37]/35 bg-[#111621] px-4 py-2.5 text-xs font-semibold text-[#eceef2] transition hover:border-[#D4AF37]/75 hover:text-[#F3DA8B]"
                  >
                    <span>Inspect Monster Zone</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      duelSfx.playClick()
                      setTerminalOpen(true)
                    }}
                    className="font-mono-tech inline-flex items-center gap-2 rounded-md border border-[#293245] bg-[#0d111a] px-4 py-2.5 text-xs text-[#9bd3f5] transition hover:border-[#4EA8DE]/65"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Open Duel CLI</span>
                  </button>
                </div>

                {/* Quick Metric Strip */}
                <div className="grid grid-cols-3 gap-3 border-t border-[#D4AF37]/16 pt-5 sm:max-w-lg">
                  <div>
                    <p className="font-display text-lg font-bold text-[#F3DA8B]">248h</p>
                    <p className="font-mono-tech text-[10px] text-[#8d97ab]">Moriroku Intern · Outstanding</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-[#F3DA8B]">458</p>
                    <p className="font-mono-tech text-[10px] text-[#8d97ab]">BuildBid Production Commits</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-[#F3DA8B]">410/1000</p>
                    <p className="font-mono-tech text-[10px] text-[#8d97ab]">TOPCIT Level 3 (IITP)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ZONE 02: MONSTER ZONE (FEATURED PROJECTS) */}
            <section id="projects" className="space-y-7">
              <div className="flex flex-col justify-between gap-4 border-b border-[#D4AF37]/18 pb-5 md:flex-row md:items-end">
                <div>
                  <p className="font-mono-tech text-[11px] tracking-[0.18em] text-[#D4AF37] uppercase">
                    ZONE 01 · EXTRA &amp; MAIN MONSTER DECK
                  </p>
                  <h2 className="font-display mt-1 text-2xl font-bold text-[#f4f6fa] sm:text-3xl">
                    Summonable Engineering Projects
                  </h2>
                  <p className="mt-1.5 text-sm text-[#98A2B3]">
                    Click any card to open the Card Inspector for full system architecture, verified outcomes, and live links.
                  </p>
                </div>

                {/* Role Filter Tabs */}
                <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter projects by role">
                  {(
                    [
                      { id: 'all', label: `All (${PROJECT_CARDS.length})` },
                      { id: 'author', label: 'Author / Ace (4)' },
                      { id: 'coauthor', label: 'Co-Author (3)' },
                      { id: 'qa', label: 'QA (1)' },
                    ] as { id: ProjectFilter; label: string }[]
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={filter === tab.id}
                      onClick={() => {
                        duelSfx.playClick()
                        setFilter(tab.id)
                      }}
                      className={`font-mono-tech rounded border px-3 py-1.5 text-[11px] transition ${
                        filter === tab.id
                          ? 'border-[#D4AF37]/80 bg-[#1c180e] font-semibold text-[#F3DA8B]'
                          : 'border-[#232a3a] bg-[#0e121b] text-[#98A2B3] hover:border-[#D4AF37]/35 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Cards Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="group flex flex-col">
                    <YuGiOhCard
                      serial={project.serial}
                      cardName={project.cardName}
                      cardKind={project.cardKind}
                      attribute={project.attribute}
                      typeLine={project.typeLine}
                      levelOrRating={project.levelOrRating}
                      stars={project.stars}
                      atk={project.atk}
                      def={project.def}
                      artSrc={project.artSrc}
                      artMode={project.artMode}
                      pedestalTone={project.pedestalTone}
                      effectText={project.effectText}
                      subtitle={project.roleBadge}
                      size="md"
                      onClick={() => setInspectedProject(project)}
                    />
                    <div className="mt-2.5 flex items-center justify-between px-1">
                      <span className="truncate text-xs font-semibold text-[#e6e9f0]">
                        {project.projectTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          duelSfx.playClick()
                          setInspectedProject(project)
                        }}
                        className="font-mono-tech shrink-0 text-[10.5px] text-[#D4AF37] transition hover:text-[#F3DA8B]"
                      >
                        Inspect →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ZONE 03: SPELL & TRAP ZONES (EXPERIENCE, STACK, CREDENTIALS) */}
            <section id="deck-specs" className="space-y-12">
              <div className="border-b border-[#D4AF37]/18 pb-5">
                <p className="font-mono-tech text-[11px] tracking-[0.18em] text-[#1D9A78] uppercase">
                  ZONE 02 · FIELD SPELLS, LOADOUT &amp; COUNTER TRAPS
                </p>
                <h2 className="font-display mt-1 text-2xl font-bold text-[#f4f6fa] sm:text-3xl">
                  Experience, Stack &amp; Verified Credentials
                </h2>
              </div>

              {/* Field Spells: Experience */}
              <div className="grid gap-5 md:grid-cols-2">
                {EXPERIENCE_SPELLS.map((exp) => (
                  <article
                    key={exp.id}
                    className="relative overflow-hidden rounded-xl border border-[#1D9A78]/35 bg-[#0d1218] p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono-tech text-[10px] font-semibold tracking-[0.16em] text-[#34d399] uppercase">
                        {exp.cardCode}
                      </span>
                      <span className="font-mono-tech rounded border border-[#D4AF37]/40 bg-[#1a160c] px-2.5 py-0.5 text-[10px] font-semibold text-[#F3DA8B]">
                        {exp.tag}
                      </span>
                    </div>
                    <h3 className="font-display mt-2.5 text-lg font-bold text-white">{exp.title}</h3>
                    <p className="font-mono-tech mt-0.5 text-[11px] text-[#4EA8DE]">
                      {exp.org} · {exp.period}
                    </p>
                    <p className="mt-1 text-xs text-[#8d97ab]">{exp.location}</p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#cfd5e2]">
                      {exp.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34d399]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              {/* Quick-Play Spells: Engineering Stack (No Fake Progress Bars!) */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {SKILL_SPELLS.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-xl border border-[#D4AF37]/20 bg-[#0e121a] p-5"
                  >
                    <p className="font-mono-tech text-[9.5px] tracking-[0.16em] text-[#1D9A78] uppercase">
                      {group.spellType}
                    </p>
                    <h3 className="font-display mt-1 text-sm font-bold text-[#F3DA8B]">{group.title}</h3>
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="font-mono-tech rounded border border-[#232a3b] bg-[#131824] px-2 py-1 text-[10.5px] text-[#d6dce8]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Counter Traps: Competitions & Certifications */}
              <div className="grid gap-4 md:grid-cols-2">
                {CREDENTIAL_TRAPS.map((cred) => (
                  <div
                    key={cred.id}
                    className="rounded-xl border border-[#B83B5E]/35 bg-[#120e14] p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono-tech text-[9.5px] tracking-[0.16em] text-[#e07492] uppercase">
                          {cred.cardCode}
                        </p>
                        <h3 className="font-display mt-1 flex items-center gap-2 text-base font-bold text-white">
                          <Award className="h-4 w-4 text-[#D4AF37]" />
                          <span>{cred.title}</span>
                        </h3>
                      </div>
                      <span className="font-mono-tech shrink-0 rounded border border-[#D4AF37]/40 bg-[#19140c] px-2.5 py-1 text-[11px] font-bold text-[#F3DA8B]">
                        {cred.metric}
                      </span>
                    </div>
                    <p className="font-mono-tech mt-1.5 text-[11px] text-[#98A2B3]">
                      {cred.issuer} · {cred.date}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#cfd5e2]">{cred.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ZONE 04: SIDE DECK & DUAL GITHUB TRAIL */}
            <section id="archive" className="space-y-8">
              <div className="flex flex-col justify-between gap-4 border-b border-[#D4AF37]/18 pb-5 md:flex-row md:items-end">
                <div>
                  <p className="font-mono-tech text-[11px] tracking-[0.18em] text-[#4EA8DE] uppercase">
                    ZONE 03 · SIDE DECK &amp; CONTRIBUTION TRAIL
                  </p>
                  <h2 className="font-display mt-1 text-2xl font-bold text-[#f4f6fa] sm:text-3xl">
                    Additional Builds &amp; GitHub Accounts
                  </h2>
                </div>
              </div>

              {/* Transparent Dual GitHub Trail */}
              <div className="grid gap-4 rounded-xl border border-[#242c3d] bg-[#0e121b] p-5 md:grid-cols-3">
                <div>
                  <p className="font-mono-tech flex items-center gap-1.5 text-[10.5px] font-semibold tracking-wider text-[#D4AF37] uppercase">
                    <GitBranch className="h-3.5 w-3.5" />
                    Two Accounts, One Trail
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#b7bfd0]">
                    Main work lives on{' '}
                    <a
                      href={DUELIST_PROFILE.githubMain}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tech text-[#4EA8DE] hover:underline"
                    >
                      @MichaelHans32116
                    </a>
                    , while debug builds and Expo runs also appear under{' '}
                    <a
                      href={DUELIST_PROFILE.githubAlt}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tech text-[#4EA8DE] hover:underline"
                    >
                      @hans32116
                    </a>
                    .
                  </p>
                </div>
                <div className="rounded-lg border border-[#1f2636] bg-[#121722] p-4">
                  <p className="font-mono-tech text-[10px] text-[#8d97ab] uppercase">Primary Account</p>
                  <p className="mt-1 font-semibold text-white">@MichaelHans32116</p>
                  <p className="mt-1 text-xs text-[#98A2B3]">
                    BuildBid (458 commits), portfolio deployments, academic builds, and public repositories.
                  </p>
                </div>
                <div className="rounded-lg border border-[#1f2636] bg-[#121722] p-4">
                  <p className="font-mono-tech text-[10px] text-[#8d97ab] uppercase">Alt / Debug Account</p>
                  <p className="mt-1 font-semibold text-white">@hans32116</p>
                  <p className="mt-1 text-xs text-[#98A2B3]">
                    Expo mobile builds, Pro/debug sessions, and workflow test branches.
                  </p>
                </div>
              </div>

              {/* 7 Side Deck Compact Preview Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SIDE_DECK_ARCHIVE.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-xl border border-[#1f2636] bg-[#0e121a] transition hover:border-[#D4AF37]/45"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden bg-[#090b10]">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-mono-tech text-[10px] tracking-wider text-[#8d97ab] uppercase">
                        {item.role}
                      </p>
                      <h3 className="mt-1 text-sm font-bold text-white">{item.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#98A2B3]">{item.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {item.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono-tech inline-flex items-center gap-1 text-[11px] font-medium text-[#F3DA8B] hover:underline"
                          >
                            {link.kind === 'github' && <Github className="h-3 w-3" />}
                            {link.kind === 'live' && <ExternalLink className="h-3 w-3" />}
                            {link.kind === 'zip' && <Download className="h-3 w-3" />}
                            <span>{link.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* ZONE 05: END PHASE (CONTACT) */}
            <section
              id="contact"
              className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#121620] via-[#0d1017] to-[#13110c] p-6 sm:p-9"
            >
              <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
                <div>
                  <p className="font-mono-tech text-[11px] tracking-[0.18em] text-[#D4AF37] uppercase">
                    END PHASE · DIRECT TRANSMISSION
                  </p>
                  <h2 className="font-display mt-1.5 text-2xl font-bold text-white sm:text-3xl">
                    Ready for Technical Screening &amp; OJT Placement.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#b2bac9]">
                    Open for our mandatory 600-hour second-semester BSIT internship ({DUELIST_PROFILE.ojtWindow}) across
                    Laguna, Makati, BGC, Ortigas, or hybrid setups. Reach out directly by email or inspect the resume PDF.
                  </p>
                  <p className="font-mono-tech mt-3 flex items-center gap-2 text-xs text-[#8d97ab]">
                    <ShieldCheck className="h-4 w-4 text-[#34d399]" />
                    <span>Calamba City, Laguna · {DUELIST_PROFILE.phone}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={`mailto:${DUELIST_PROFILE.emailPersonal}`}
                    className="font-mono-tech inline-flex items-center justify-center gap-2 rounded-md border border-[#F3DA8B]/80 bg-gradient-to-b from-[#dfb948] to-[#9f7d22] px-4 py-2.5 text-xs font-bold text-[#08090c] transition hover:brightness-110"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{DUELIST_PROFILE.emailPersonal}</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={copyPersonalEmail}
                      className="font-mono-tech inline-flex items-center justify-center gap-1.5 rounded-md border border-[#2a3245] bg-[#10141e] px-3 py-2 text-xs text-[#dce1ec] transition hover:border-[#D4AF37]/60 hover:text-[#F3DA8B]"
                    >
                      {copiedEmail ? <Check className="h-3.5 w-3.5 text-[#34d399]" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                    </button>

                    <a
                      href={DUELIST_PROFILE.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tech inline-flex items-center justify-center gap-1.5 rounded-md border border-[#2a3245] bg-[#10141e] px-3 py-2 text-xs text-[#dce1ec] transition hover:border-[#D4AF37]/60 hover:text-[#F3DA8B]"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      <span>Resume PDF</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={DUELIST_PROFILE.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tech inline-flex items-center justify-center gap-1.5 rounded-md border border-[#2a3245] bg-[#10141e] px-3 py-2 text-xs text-[#dce1ec] transition hover:border-[#4EA8DE]/65"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      <span>LinkedIn</span>
                    </a>

                    <a
                      href={DUELIST_PROFILE.githubMain}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tech inline-flex items-center justify-center gap-1.5 rounded-md border border-[#2a3245] bg-[#10141e] px-3 py-2 text-xs text-[#dce1ec] transition hover:border-[#4EA8DE]/65"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="border-t border-[#1b2130] py-6">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 text-[11px] text-[#7a8499] sm:px-6">
              <span className="font-mono-tech">
                {DUELIST_PROFILE.fullName} · Built with React, TypeScript, Tailwind &amp; GSAP
              </span>
              <span className="font-mono-tech">
                Press <kbd className="rounded border border-[#2a3245] px-1.5 py-0.5 text-[#F3DA8B]">`</kbd> or{' '}
                <kbd className="rounded border border-[#2a3245] px-1.5 py-0.5 text-[#F3DA8B]">Ctrl+K</kbd> for Duel CLI
              </span>
            </div>
          </footer>
        </div>
      )}

      {/* Project Card Inspector Modal */}
      <CardInspectorModal project={inspectedProject} onClose={() => setInspectedProject(null)} />

      {/* Non-Overlapping Collapsible Duel Disk CMD Terminal */}
      <DuelTerminal
        open={terminalOpen}
        onToggleOpen={() => setTerminalOpen((prev) => !prev)}
        onReplayDraw={handleReplayDraw}
        onSummonProject={(proj) => setInspectedProject(proj)}
        onSetMode={(mode) => setViewMode(mode)}
        onSetSfx={handleSetSfx}
        sfxEnabled={sfxEnabled}
        viewMode={viewMode}
      />
    </div>
  )
}

export default App
