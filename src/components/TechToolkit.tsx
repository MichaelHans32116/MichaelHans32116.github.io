import React, { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { DECK_CARDS, DeckCardItem } from '../data/deckData'
import { duelSfx } from '../utils/sfx'

interface ToolEntry {
  name: string
  icon: React.ReactNode
}

interface ToolkitRow {
  category: string
  items: ToolEntry[]
}

interface SkillProofEntry {
  summary: string
  cardIds: string[]
}

interface TechToolkitProps {
  onOpenCard: (cardId: string) => void
}

const BadgeSvg: React.FC<{ text: string }> = ({ text }) => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize={text.length > 2 ? '8.5' : '11'}
      fontWeight="800"
      fontFamily="ui-monospace, monospace"
      fill="var(--bg-canvas)"
    >
      {text}
    </text>
  </svg>
)

const Shield5Svg: React.FC<{ label?: string }> = ({ label }) => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
    <path d="M3 2h18l-1.6 17.5L12 22l-7.4-2.5L3 2z" fill="currentColor" />
    {label && (
      <text
        x="12"
        y="14.5"
        textAnchor="middle"
        fontSize={label.length > 2 ? '7' : '11'}
        fontWeight="800"
        fontFamily="sans-serif"
        fill="var(--bg-canvas)"
      >
        {label}
      </text>
    )}
  </svg>
)

const PythonSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
    <path
      fill="currentColor"
      d="M11.9 2c-3.9 0-3.7 1.7-3.7 1.7v1.8h3.8v.6H6.7S4 5.8 4 9.7c0 3.9 2.3 3.8 2.3 3.8h1.4v-1.9s-.1-2.3 2.3-2.3h4s2.2 0 2.2-2.2V3.9S16.5 2 11.9 2zm-2 1.2a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"
    />
    <path
      fill="currentColor"
      opacity="0.78"
      d="M12.1 22c3.9 0 3.7-1.7 3.7-1.7v-1.8H12v-.6h5.3s2.7.3 2.7-3.6c0-3.9-2.3-3.8-2.3-3.8h-1.4v1.9s.1 2.3-2.3 2.3h-4s-2.2 0-2.2 2.2v3.2S7.5 22 12.1 22zm2-1.2a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
    />
  </svg>
)

const DbSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
    <ellipse cx="12" cy="6" rx="7.5" ry="3" fill="currentColor" fillOpacity="0.18" />
    <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
    <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
  </svg>
)

const ReactSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
    <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
  </svg>
)

const NextSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path
      d="M8.5 16V8l8.2 10.5M15.5 8v5.2"
      stroke="var(--bg-canvas)"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

const ExpoSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 18.5 11.4 5.8a.7.7 0 0 1 1.2 0l6.9 12.7" />
  </svg>
)

const TailwindSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C13.39 10.84 14.53 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.16 14.47 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.84 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.16 9.47 12 7 12z" />
  </svg>
)

const SupabaseSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M13.5 2.4c-.5-.7-1.6-.3-1.6.5v8.6h7.2c.9 0 1.4 1 .9 1.7l-9.5 12.2c-.5.7-1.6.3-1.6-.5v-8.6H1.7c-.9 0-1.4-1-.9-1.7L10.3 2.4z" transform="scale(0.86) translate(2 0)" />
  </svg>
)

const CloudSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6.5 19h11a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.4 9.5 4.2 4.2 0 0 0 6.5 19Z" />
  </svg>
)

const DockerSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M13 6h2.2v2.2H13V6zm-3 0h2.2v2.2H10V6zM7 6h2.2v2.2H7V6zm3 3h2.2v2.2H10V9zm3 0h2.2v2.2H13V9zm-6 0h2.2v2.2H7V9zm-3 0h2.2v2.2H4V9zm15.6 1.5c-.5-.4-1.6-.5-2.1-.3-.2-.9-.9-1.6-1.6-2.1l-.3-.2-.2.3c-.4.6-.5 1.5-.3 2.2.1.4.4.8.7 1.1H2.5c-.2 2.4.7 4.7 2.4 6.1 1.7 1.4 4.1 2 6.8 2 4.9 0 8.5-2.2 10.2-6.2.7 0 2.1 0 2.8-1.3.1-.1.4-.7.4-.7s-.9-.5-2.5-.9z" />
  </svg>
)

const GitSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m12 2.5 9.5 9.5-9.5 9.5L2.5 12 12 2.5z" />
    <circle cx="12" cy="9" r="1.4" fill="currentColor" />
    <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
    <circle cx="15.5" cy="12" r="1.4" fill="currentColor" />
    <path d="M12 10.4v3.7M13 10l1.6 1.2" />
  </svg>
)

const GithubSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.36 6.84 9.71.5.09.68-.22.68-.49v-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.9c.85 0 1.7.12 2.5.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.22 10.22 0 0 0 22 12.23C22 6.58 17.52 2 12 2z" />
  </svg>
)

const VercelSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M12 3.5 21 19.5H3L12 3.5z" />
  </svg>
)

const CpuSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="1.5" />
    <rect x="9.5" y="9.5" width="5" height="5" fill="currentColor" fillOpacity="0.25" />
    <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
  </svg>
)

const VisionSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8V5h3M18 5h3v3M21 16v3h-3M6 19H3v-3" />
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
  </svg>
)

const JavaSvg = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 11h10v4a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-4Z" />
    <path d="M16 12h2a2 2 0 0 1 0 4h-2" />
    <path d="M9 6c0-1.5 1.5-1.5 1.5-3M13 6c0-1.5 1.5-1.5 1.5-3" />
  </svg>
)

const TOOLKIT_ROWS: ToolkitRow[] = [
  {
    category: 'Languages',
    items: [
      { name: 'C#', icon: <BadgeSvg text="C#" /> },
      { name: 'TypeScript', icon: <BadgeSvg text="TS" /> },
      { name: 'Java', icon: <JavaSvg /> },
      { name: 'JavaScript', icon: <BadgeSvg text="JS" /> },
      { name: 'Python', icon: <PythonSvg /> },
      { name: 'SQL', icon: <DbSvg /> },
      { name: 'HTML', icon: <Shield5Svg label="5" /> },
      { name: 'CSS', icon: <Shield5Svg label="CSS" /> },
      { name: 'C++', icon: <BadgeSvg text="C++" /> },
    ],
  },
  {
    category: 'Frameworks & Databases',
    items: [
      { name: 'ASP.NET Core', icon: <BadgeSvg text=".NET" /> },
      { name: 'Next.js', icon: <NextSvg /> },
      { name: 'React', icon: <ReactSvg /> },
      { name: 'React Native', icon: <ReactSvg /> },
      { name: 'Expo', icon: <ExpoSvg /> },
      { name: 'Tailwind CSS', icon: <TailwindSvg /> },
      { name: 'PostgreSQL', icon: <DbSvg /> },
      { name: 'Supabase', icon: <SupabaseSvg /> },
      { name: 'MariaDB', icon: <DbSvg /> },
      { name: 'SQL Server', icon: <DbSvg /> },
    ],
  },
  {
    category: 'Cloud, IoT & Tools',
    items: [
      { name: 'AWS', icon: <CloudSvg /> },
      { name: 'Azure', icon: <CloudSvg /> },
      { name: 'Docker', icon: <DockerSvg /> },
      { name: 'Nginx', icon: <BadgeSvg text="NGX" /> },
      { name: 'Git', icon: <GitSvg /> },
      { name: 'GitHub', icon: <GithubSvg /> },
      { name: 'Raspberry Pi', icon: <CpuSvg /> },
      { name: 'YOLO11', icon: <VisionSvg /> },
      { name: 'Vercel', icon: <VercelSvg /> },
    ],
  },
]

const SKILL_PROOFS: Record<string, SkillProofEntry> = {
  'C#': {
    summary: 'My go-to backend language for internal manufacturing apps at Moriroku and the unified church API.',
    cardIds: ['gatepass', 'hrad', 'howconnect'],
  },
  TypeScript: {
    summary: 'Used across all 458 commits on BuildBid for typed forms, quote tables, and server actions.',
    cardIds: ['buildbid'],
  },
  Java: {
    summary: 'Got 65/65 (6th nationwide) at the ISITE-CodeChum competition and validated in TOPCIT.',
    cardIds: ['isite-java', 'topcit'],
  },
  JavaScript: {
    summary: 'Powers the client logic and interactive frontends on HowConnect and collaborative Vercel builds.',
    cardIds: ['howconnect', 'collabs'],
  },
  Python: {
    summary: 'Runs computer vision capture scripts on Raspberry Pi and the signature compression helper at Moriroku.',
    cardIds: ['insectra', 'gatepass', 'hackforgov'],
  },
  SQL: {
    summary: 'My daily focus: normalized table schemas, stored procedures, views, and strict RLS privacy rules.',
    cardIds: ['buildbid', 'gatepass', 'hrad', 'howconnect', 'topcit'],
  },
  HTML: {
    summary: 'Semantic markup and printable A6 slip layouts shipped across client and internship builds.',
    cardIds: ['gatepass', 'collabs'],
  },
  CSS: {
    summary: 'Fixed responsive layout bugs and built the UI framing across multiple live team sites.',
    cardIds: ['collabs', 'buildbid'],
  },
  'C++': {
    summary: 'Used during university data structures practice and algorithmic problem solving.',
    cardIds: ['isite-java', 'topcit'],
  },
  'ASP.NET Core': {
    summary: 'Shipped REST APIs and JWT auth flows on .NET 8 during my 248-hour internship at Moriroku.',
    cardIds: ['gatepass', 'hrad', 'howconnect'],
  },
  'Next.js': {
    summary: 'Built the full BuildBid marketplace frontend and route handlers across 72+ sprint phases.',
    cardIds: ['buildbid'],
  },
  React: {
    summary: 'Core UI layer behind BuildBid and several interactive web frontends.',
    cardIds: ['buildbid', 'collabs'],
  },
  'React Native': {
    summary: 'Built mobile companion apps for InsecTra farm monitoring and House of Worship LB.',
    cardIds: ['insectra', 'howconnect'],
  },
  Expo: {
    summary: 'Packaged Android builds and shared REST API sync for HoW Connect.',
    cardIds: ['howconnect', 'insectra'],
  },
  'Tailwind CSS': {
    summary: 'Styled responsive dashboards and mobile views on BuildBid without bloated CSS sheets.',
    cardIds: ['buildbid'],
  },
  PostgreSQL: {
    summary: 'Locked down rival bids and phone numbers right inside SQL Row Level Security policies.',
    cardIds: ['buildbid', 'insectra'],
  },
  Supabase: {
    summary: 'Handled auth, storage buckets, and Postgres RLS enforcement in production on BuildBid.',
    cardIds: ['buildbid'],
  },
  MariaDB: {
    summary: 'Backed Moriroku GatePass and HRAD ticketing with containerized schemas and stored procedures.',
    cardIds: ['gatepass', 'hrad'],
  },
  'SQL Server': {
    summary: 'Unified database for HowConnect plus Azure SQL setups on team web apps.',
    cardIds: ['howconnect', 'collabs'],
  },
  AWS: {
    summary: 'Deployed InsecTra across EC2, Application Load Balancer, Auto Scaling, RDS, and S3.',
    cardIds: ['insectra'],
  },
  Azure: {
    summary: 'Wired cloud SQL Server instances and app hosting for Gabay Halaman and StarQueen.',
    cardIds: ['collabs'],
  },
  Docker: {
    summary: 'Containerized both .NET 8 systems and MariaDB instances for predictable deployments.',
    cardIds: ['gatepass', 'hrad'],
  },
  Nginx: {
    summary: 'Configured reverse proxy routing in front of live API services on Linux servers.',
    cardIds: ['insectra', 'gatepass'],
  },
  Git: {
    summary: 'Daily branch management, conflict resolution, and CI checks across team repos.',
    cardIds: ['buildbid', 'howconnect', 'collabs'],
  },
  GitHub: {
    summary: 'Managed 458 commits, pull requests, and GitHub Actions test workflows.',
    cardIds: ['buildbid', 'howconnect'],
  },
  'Raspberry Pi': {
    summary: 'Set up the solar-powered field trap unit capturing images and syncing counts over mobile data.',
    cardIds: ['insectra'],
  },
  YOLO11: {
    summary: 'Trained and ran object detection to spot and count melon fruit flies right on the edge.',
    cardIds: ['insectra'],
  },
  Vercel: {
    summary: 'Shipped production web portals and team builds with fast preview links.',
    cardIds: ['buildbid', 'howconnect', 'collabs'],
  },
}

export const TechToolkit: React.FC<TechToolkitProps> = ({ onOpenCard }) => {
  const [selectedSkill, setSelectedSkill] = useState<string>('C#')

  const activeProof = SKILL_PROOFS[selectedSkill] ?? SKILL_PROOFS['C#']

  const linkedCards = useMemo(() => {
    return activeProof.cardIds
      .map((id) => DECK_CARDS.find((card) => card.id === id))
      .filter((card): card is DeckCardItem => Boolean(card))
  }, [activeProof])

  const activeIcon = useMemo(() => {
    for (const row of TOOLKIT_ROWS) {
      const match = row.items.find((t) => t.name === selectedSkill)
      if (match) return match.icon
    }
    return null
  }, [selectedSkill])

  return (
    <section id="tour-toolkit" className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--accent-silver)] uppercase">
          Technical Toolkit
        </h2>
        <span className="text-xs text-[var(--text-muted)]">
          Tap any skill to inspect matching cards
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-6">
        {/* Left: Clickable Skill Buttons */}
        <div className="space-y-4 sm:space-y-5">
          {TOOLKIT_ROWS.map((row) => (
            <div key={row.category} className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wide text-[var(--text-main)] sm:text-sm">
                {row.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {row.items.map((tool) => {
                  const isActive = tool.name === selectedSkill
                  const proofCount = SKILL_PROOFS[tool.name]?.cardIds.length ?? 0
                  return (
                    <button
                      key={tool.name}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        duelSfx.playHover()
                        setSelectedSkill(tool.name)
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-[3px] border px-2.5 py-1.5 text-[12.5px] font-medium transition sm:px-3 sm:text-[13px] ${
                        isActive
                          ? 'border-[var(--accent-silver)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {tool.icon}
                      <span>{tool.name}</span>
                      {proofCount > 0 && (
                        <span
                          className={`rounded-[2px] px-1 py-0.5 font-mono-tech text-[10px] leading-none ${
                            isActive
                              ? 'bg-white/20 text-current'
                              : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                          }`}
                        >
                          {proofCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Dynamic Proof Panel updating cleanly on skill selection */}
        <div
          key={selectedSkill}
          className="ygo-media-fade rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 lg:sticky lg:top-20"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2 text-[var(--text-main)]">
              {activeIcon}
              <h3 className="text-base font-semibold">{selectedSkill}</h3>
            </div>
            <span className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-2 py-0.5 font-mono-tech text-[10.5px] font-medium text-[var(--text-secondary)]">
              {linkedCards.length} {linkedCards.length === 1 ? 'card' : 'cards'}
            </span>
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-sm">
            {activeProof.summary}
          </p>

          <div className="mt-4 space-y-2">
            {linkedCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onOpenCard(card.id)}
                className="group flex w-full items-center justify-between gap-3 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/45 px-3 py-2.5 text-left transition hover:border-[var(--accent-silver)] hover:bg-[var(--bg-muted)]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-silver)]">
                    {card.title}
                  </p>
                  <p className="truncate font-mono-tech text-[11px] text-[var(--text-muted)]">
                    {card.typeTag} · {card.subtitle}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-main)]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
