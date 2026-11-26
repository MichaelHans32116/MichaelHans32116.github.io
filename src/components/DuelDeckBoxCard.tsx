import React from 'react'
import { ChevronRight } from 'lucide-react'

export interface DuelDeckBoxCardProps {
  title: string
  deckTypeLabel: string
  boxCode: string
  countSummary: string
  tagline: string
  coverSrc: string
  coverMode?: 'cover-top' | 'cover-center' | 'contain-art'
  accent: string
  active?: boolean
  ctaLabel?: string
  compact?: boolean
  onClick: () => void
}

export const DuelDeckBoxCard: React.FC<DuelDeckBoxCardProps> = ({
  title,
  deckTypeLabel,
  boxCode,
  countSummary,
  tagline,
  coverSrc,
  coverMode = 'cover-top',
  accent,
  active = false,
  ctaLabel = 'Open Deck',
  compact = false,
  onClick,
}) => {
  const coverClass =
    coverMode === 'contain-art'
      ? 'absolute inset-0 h-full w-full object-contain bg-[#0b101d] p-2 transition duration-300 group-hover:scale-[1.03]'
      : coverMode === 'cover-center'
        ? 'absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.05]'
        : 'absolute inset-0 h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.05]'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex flex-col overflow-hidden rounded-[4px] border text-left transition-all duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-silver)] ${
        active
          ? 'border-[var(--accent-silver)] bg-[var(--bg-surface)] ring-2 ring-[var(--accent-silver)]/45 shadow-lg'
          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm hover:border-[var(--border-hover)] hover:shadow-md'
      }`}
    >
      {/* Top accent strip */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2.5px] opacity-90"
        style={{ backgroundColor: accent }}
      />

      {/* Dueling Nexus style deck art backdrop + centered 3D Deck Box */}
      <div
        className={`relative w-full overflow-hidden border-b border-[var(--border-subtle)] bg-[#0c101a] ${
          compact ? 'aspect-[16/9]' : 'aspect-[16/10]'
        }`}
      >
        <img
          src={coverSrc}
          alt={title}
          loading="lazy"
          className={coverClass}
          draggable={false}
        />

        {/* Scrim for depth so the 3D deck box stands out cleanly in Light and Dark themes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20 transition-opacity duration-200 group-hover:opacity-85"
        />

        {/* Deck type pill */}
        <span className="pointer-events-none absolute right-2 top-2 z-10 rounded-[2px] border border-white/20 bg-black/75 px-1.5 py-0.5 font-mono-tech text-[9.5px] font-semibold tracking-wider text-white uppercase backdrop-blur-xs">
          {deckTypeLabel}
        </span>

        {/* Centered 3D Deck Box SVG */}
        <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center p-2">
          <svg
            viewBox="0 0 112 132"
            aria-hidden="true"
            className="h-[78%] w-auto drop-shadow-[0_10px_18px_rgba(0,0,0,0.72)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.04]"
          >
            {/* Right side 3D bevel */}
            <polygon points="88,24 102,16 102,108 88,120" fill="#121826" stroke="#475569" strokeWidth="1.2" />
            {/* Top angled lid */}
            <polygon points="14,24 30,12 102,16 88,24" fill="#2c374f" stroke="#94a3b8" strokeWidth="1.2" />
            {/* Main front face */}
            <rect x="14" y="24" width="74" height="96" rx="3" fill="#1b2334" stroke="#64748b" strokeWidth="1.4" />
            {/* Lid flap line */}
            <path d="M 14 48 L 51 60 L 88 48" fill="#232d42" stroke={accent} strokeWidth="2.2" />
            {/* Center metallic emblem plate */}
            <polygon
              points="51,63 77,80 51,97 25,80"
              fill="#0c111d"
              stroke={accent}
              strokeWidth="2"
            />
            {/* Box badge code */}
            <text
              x="51"
              y="83.5"
              textAnchor="middle"
              fill="#f8fafc"
              fontSize={boxCode.length >= 5 ? '10.5' : '12'}
              fontWeight="800"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              letterSpacing="0.8"
            >
              {boxCode}
            </text>
            {/* Bottom trim */}
            <rect x="20" y="109" width="62" height="3.5" rx="1.5" fill={accent} opacity="0.85" />
          </svg>
        </div>
      </div>

      {/* Deck title, count summary & tagline */}
      <div className={compact ? 'px-3 py-2.5' : 'px-3.5 py-3'}>
        <h3 className="truncate text-sm font-semibold text-[var(--text-main)] sm:text-[15px]">
          {title}
        </h3>
        <p className="mt-0.5 font-mono-tech text-[11px] text-[var(--text-secondary)]">
          {countSummary}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-[var(--text-muted)]">
          {tagline}
        </p>
      </div>

      {/* Action footer bar (Dueling Nexus deck slot bar style) */}
      <div
        className={`mt-auto flex items-center justify-between border-t border-[var(--border-subtle)] px-3.5 py-2 text-[11px] font-medium ${
          active ? 'bg-[var(--bg-muted)] text-[var(--text-main)]' : 'bg-[var(--bg-muted)]/55 text-[var(--text-secondary)]'
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2 w-2 rotate-45 rounded-[1px]"
            style={{ backgroundColor: accent }}
          />
          <span>{active ? 'Selected' : 'Deck Box'}</span>
        </span>
        <span className="inline-flex items-center gap-0.5 font-semibold text-[var(--text-main)] transition-transform group-hover:translate-x-0.5">
          <span>{ctaLabel}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  )
}
