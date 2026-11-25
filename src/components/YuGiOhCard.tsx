import React, { useRef, useState } from 'react'
import { ArtMode, CardAttribute, CardKind } from '../data/portfolioData'
import { duelSfx } from '../utils/sfx'

export interface YuGiOhCardProps {
  serial: string
  cardName: string
  cardKind: CardKind
  attribute: CardAttribute
  typeLine: string
  levelOrRating: string
  stars: number
  atk: string
  def: string
  artSrc: string
  artMode: ArtMode
  pedestalTone?: 'cobalt-gold' | 'emerald-gold'
  effectText: string
  subtitle?: string
  backStats?: { label: string; value: string }[]
  flippable?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
  disableTilt?: boolean
}

const ATTRIBUTE_STYLES: Record<CardAttribute, { bg: string; ring: string; short: string }> = {
  LIGHT: { bg: 'from-[#f6e29c] via-[#d4af37] to-[#876b22]', ring: 'border-[#f6e29c]/70 text-[#12100a]', short: 'LGT' },
  DARK: { bg: 'from-[#6b528c] via-[#3d2957] to-[#1a1126]', ring: 'border-[#b99ce0]/60 text-[#f2ebfc]', short: 'DRK' },
  EARTH: { bg: 'from-[#c69d6b] via-[#8b6339] to-[#4a321a]', ring: 'border-[#e5c294]/60 text-[#fdf6ec]', short: 'ERT' },
  WATER: { bg: 'from-[#5cb8e8] via-[#256d9c] to-[#0f344f]', ring: 'border-[#9ad8f7]/65 text-[#edf8ff]', short: 'WTR' },
  WIND: { bg: 'from-[#56c49b] via-[#1f7d5e] to-[#0d3b2c]', ring: 'border-[#95e8c9]/65 text-[#ebfff7]', short: 'WND' },
  FIRE: { bg: 'from-[#e57c58] via-[#a63d28] to-[#4f190f]', ring: 'border-[#f7b197]/65 text-[#fff2ed]', short: 'FIR' },
}

export const YuGiOhCard: React.FC<YuGiOhCardProps> = ({
  serial,
  cardName,
  cardKind,
  attribute,
  typeLine,
  levelOrRating,
  stars,
  atk,
  def,
  artSrc,
  artMode,
  pedestalTone = 'cobalt-gold',
  effectText,
  subtitle,
  backStats,
  flippable = false,
  size = 'md',
  onClick,
  className = '',
  disableTilt = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [interacting, setInteracting] = useState(false)
  const [flipped, setFlipped] = useState(false)

  const attr = ATTRIBUTE_STYLES[attribute]

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disableTilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const clampedX = Math.max(0, Math.min(1, px))
    const clampedY = Math.max(0, Math.min(1, py))

    const rotY = (clampedX - 0.5) * 18
    const rotX = (0.5 - clampedY) * 16
    const parX = (clampedX - 0.5) * 12
    const parY = (clampedY - 0.5) * 10

    const el = cardRef.current
    el.style.setProperty('--pointer-x', `${(clampedX * 100).toFixed(1)}%`)
    el.style.setProperty('--pointer-y', `${(clampedY * 100).toFixed(1)}%`)
    el.style.setProperty('--rotate-x', `${rotX.toFixed(2)}deg`)
    el.style.setProperty('--rotate-y', `${rotY.toFixed(2)}deg`)
    el.style.setProperty('--parallax-x', `${parX.toFixed(2)}px`)
    el.style.setProperty('--parallax-y', `${parY.toFixed(2)}px`)
    el.style.setProperty('--holo-opacity', '1')
    if (!interacting) setInteracting(true)
  }

  const handlePointerLeave = () => {
    if (!cardRef.current) return
    const el = cardRef.current
    el.style.setProperty('--rotate-x', '0deg')
    el.style.setProperty('--rotate-y', '0deg')
    el.style.setProperty('--parallax-x', '0px')
    el.style.setProperty('--parallax-y', '0px')
    el.style.setProperty('--holo-opacity', '0')
    setInteracting(false)
  }

  const handleCardClick = () => {
    if (flippable && backStats) {
      duelSfx.playFlip()
      setFlipped((prev) => !prev)
      return
    }
    if (onClick) {
      duelSfx.playClick()
      onClick()
    }
  }

  const isCompact = size === 'sm'
  const isLarge = size === 'lg'

  return (
    <div className={`ygo-stage ${className}`}>
      <div
        ref={cardRef}
        data-interacting={interacting ? 'true' : 'false'}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleCardClick}
        role={onClick || flippable ? 'button' : undefined}
        tabIndex={onClick || flippable ? 0 : undefined}
        onKeyDown={(e) => {
          if ((onClick || flippable) && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleCardClick()
          }
        }}
        aria-label={flippable ? `${cardName} — click to flip card` : `${cardName} — inspect card`}
        className={`ygo-card-tilt relative aspect-[59/86] w-full select-none ${
          onClick || flippable ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]' : ''
        }`}
      >
        <div className="ygo-flipper relative h-full w-full" data-flipped={flipped ? 'true' : 'false'}>
          {/* CARD FRONT */}
          <div
            className={`ygo-face ygo-frame-${cardKind} relative flex h-full w-full flex-col overflow-hidden rounded-[0.7rem] ${
              isLarge ? 'p-3 sm:p-3.5' : isCompact ? 'p-2' : 'p-2.5'
            }`}
          >
            {/* Secret Rare holographic foil overlay */}
            <div className="ygo-holo-foil absolute inset-0 z-20 rounded-[0.7rem]" />

            {/* Top Name Plate */}
            <div className="relative z-10 flex items-center justify-between gap-1.5 rounded-[0.3rem] border border-[#D4AF37]/40 bg-[#0b0d13]/85 px-2 py-1 shadow-inner">
              <div className="min-w-0 flex-1">
                <h3
                  className={`font-display truncate font-bold tracking-[0.04em] text-[#f4e4b3] ${
                    isLarge ? 'text-[13px] sm:text-[14.5px]' : isCompact ? 'text-[10px]' : 'text-[11px] sm:text-[11.5px]'
                  }`}
                >
                  {cardName}
                </h3>
              </div>
              <span
                className={`font-mono-tech flex shrink-0 items-center justify-center rounded-full border bg-gradient-to-br font-bold shadow-sm ${attr.bg} ${attr.ring} ${
                  isLarge ? 'h-5.5 w-5.5 text-[7.5px]' : 'h-4.5 w-4.5 text-[6.5px]'
                }`}
                title={`Attribute: ${attribute}`}
              >
                {attr.short}
              </span>
            </div>

            {/* Level Stars / Rank / Link Strip */}
            <div
              className={`relative z-10 flex items-center justify-between px-1 ${
                isLarge ? 'my-1.5' : 'my-1'
              }`}
            >
              <span className="font-mono-tech text-[8.5px] tracking-[0.14em] text-[#D4AF37]/80 uppercase">
                {cardKind === 'ACE' ? 'ACE MONSTER' : `${cardKind} MONSTER`}
              </span>
              <div className="flex items-center gap-[2px]">
                {cardKind === 'LINK' ? (
                  <span className="font-mono-tech rounded border border-[#4EA8DE]/45 bg-[#0c1d35] px-1.5 py-[1px] text-[8.5px] font-semibold tracking-wider text-[#8fd0f8]">
                    {levelOrRating}
                  </span>
                ) : (
                  Array.from({ length: Math.min(stars, 8) }).map((_, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center justify-center rounded-full border ${
                        cardKind === 'XYZ'
                          ? 'border-[#f3da8b]/75 bg-[#0b0d12] text-[#f3da8b]'
                          : 'border-[#f3da8b]/75 bg-gradient-to-b from-[#d95d2b] to-[#7c230f] text-[#ffe9a6]'
                      } ${isLarge ? 'h-3.5 w-3.5 text-[8px]' : 'h-2.5 w-2.5 text-[6.5px]'}`}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Artwork Window */}
            <div className="relative z-10 aspect-square w-full overflow-hidden rounded-[0.28rem] border-[1.5px] border-[#b79438]/65 bg-[#090b10] shadow-[inset_0_0_24px_rgba(0,0,0,0.85)]">
              {artMode === 'cutout-shadowbox' && (
                <>
                  {/* Parallax Obsidian-Gold-Cobalt Chamber Backdrop */}
                  <div className="shadowbox-bg-layer absolute inset-0">
                    <svg
                      viewBox="0 0 400 400"
                      className="h-full w-full"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <radialGradient id="aceChamber" cx="50%" cy="46%" r="60%">
                          <stop offset="0%" stopColor="#1e3554" />
                          <stop offset="46%" stopColor="#121a2a" />
                          <stop offset="100%" stopColor="#07090e" />
                        </radialGradient>
                        <radialGradient id="aceHalo" cx="50%" cy="44%" r="44%">
                          <stop offset="0%" stopColor="#f3da8b" stopOpacity="0.42" />
                          <stop offset="45%" stopColor="#4ea8de" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#07090e" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect width="400" height="400" fill="url(#aceChamber)" />
                      <circle cx="200" cy="178" r="170" fill="url(#aceHalo)" />
                      {/* Geometric astrolabe rings behind Hans */}
                      <g fill="none" stroke="#d4af37" strokeOpacity="0.34">
                        <circle cx="200" cy="182" r="142" strokeWidth="1.2" />
                        <circle cx="200" cy="182" r="120" strokeWidth="0.9" strokeDasharray="5 5" />
                        <circle cx="200" cy="182" r="96" stroke="#4ea8de" strokeOpacity="0.35" strokeWidth="1" />
                        <polygon points="200,32 350,182 200,332 50,182" strokeWidth="0.9" strokeOpacity="0.28" />
                        <polygon points="200,56 326,182 200,308 74,182" stroke="#4ea8de" strokeOpacity="0.22" strokeWidth="0.8" />
                      </g>
                      {/* Perspective floor lines */}
                      <g stroke="#d4af37" strokeOpacity="0.14" strokeWidth="0.8">
                        <line x1="0" y1="305" x2="400" y2="305" />
                        <line x1="0" y1="340" x2="400" y2="340" />
                        <line x1="0" y1="372" x2="400" y2="372" />
                        <line x1="200" y1="220" x2="20" y2="400" />
                        <line x1="200" y1="220" x2="110" y2="400" />
                        <line x1="200" y1="220" x2="290" y2="400" />
                        <line x1="200" y1="220" x2="380" y2="400" />
                      </g>
                    </svg>
                  </div>
                  {/* Real Transparent Cutout Subject (pops forward in 3D parallax!) */}
                  <div className="shadowbox-subject-layer absolute inset-x-0 bottom-0 top-2 flex items-end justify-center px-2">
                    <img
                      src={artSrc}
                      alt={cardName}
                      className="max-h-full w-auto object-contain object-bottom"
                      draggable={false}
                    />
                  </div>
                  {/* Bottom matte vignette for seamless shoulder grounding */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#080a0f]/80 via-[#080a0f]/25 to-transparent" />
                </>
              )}

              {artMode === 'logo-pedestal' && (
                <div
                  className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
                    pedestalTone === 'emerald-gold'
                      ? 'bg-[radial-gradient(circle_at_50%_45%,rgba(29,154,120,0.22),rgba(8,12,14,0.98)_72%)]'
                      : 'bg-[radial-gradient(circle_at_50%_45%,rgba(37,109,180,0.28),rgba(8,11,18,0.98)_72%)]'
                  }`}
                >
                  {/* Precision technical grid behind official brand mark */}
                  <svg
                    viewBox="0 0 300 300"
                    className="shadowbox-bg-layer absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <g
                      fill="none"
                      stroke={pedestalTone === 'emerald-gold' ? '#34d399' : '#4ea8de'}
                      strokeOpacity="0.16"
                      strokeWidth="0.9"
                    >
                      <circle cx="150" cy="150" r="112" />
                      <circle cx="150" cy="150" r="88" strokeDasharray="4 5" stroke="#d4af37" strokeOpacity="0.32" />
                      <line x1="20" y1="150" x2="280" y2="150" />
                      <line x1="150" y1="20" x2="150" y2="280" />
                    </g>
                    <g stroke="#d4af37" strokeOpacity="0.28" strokeWidth="1" fill="none">
                      <path d="M18 38 L18 18 L38 18" />
                      <path d="M282 38 L282 18 L262 18" />
                      <path d="M18 262 L18 282 L38 282" />
                      <path d="M282 262 L282 282 L262 282" />
                    </g>
                  </svg>

                  {/* Official Project Logo */}
                  <div
                    className={`shadowbox-subject-layer relative z-10 flex items-center justify-center rounded-xl ${
                      pedestalTone === 'emerald-gold'
                        ? 'bg-[#f4f7f5]/95 p-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.65)] ring-1 ring-[#D4AF37]/40'
                        : 'p-4'
                    }`}
                  >
                    <img
                      src={artSrc}
                      alt={cardName}
                      className={`object-contain ${
                        pedestalTone === 'emerald-gold' ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-28 w-28 sm:h-32 sm:w-32 drop-shadow-[0_12px_20px_rgba(0,0,0,0.75)]'
                      }`}
                      draggable={false}
                    />
                  </div>
                </div>
              )}

              {artMode === 'screenshot' && (
                <div className="relative h-full w-full bg-[#090c12]">
                  <img
                    src={artSrc}
                    alt={cardName}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090c]/85 via-transparent to-[#08090c]/25" />
                  {subtitle && (
                    <span className="font-mono-tech absolute bottom-1.5 left-1.5 rounded border border-[#D4AF37]/40 bg-[#08090c]/85 px-1.5 py-0.5 text-[8px] tracking-wider text-[#f3da8b] uppercase">
                      {subtitle}
                    </span>
                  )}
                </div>
              )}

              {/* Specular art glare */}
              <div className="ygo-art-glint absolute inset-0" />
            </div>

            {/* Set Serial Line */}
            <div className="relative z-10 mt-1 flex items-center justify-between px-0.5">
              <span className="font-mono-tech text-[7.5px] tracking-[0.14em] text-[#98a2b3]/80 uppercase">
                1ST EDITION
              </span>
              <span className="font-mono-tech text-[8px] font-semibold tracking-[0.12em] text-[#d4af37]/90">
                {serial}
              </span>
            </div>

            {/* Effect Text Box */}
            <div
              className={`relative z-10 mt-1 flex flex-1 flex-col justify-between rounded-[0.28rem] border border-[#b79438]/50 bg-[#0b0d13]/92 ${
                isLarge ? 'p-2.5' : isCompact ? 'p-1.5' : 'p-2'
              }`}
            >
              <div>
                <p
                  className={`font-display font-bold tracking-[0.06em] text-[#f3da8b] ${
                    isLarge ? 'text-[9.5px] sm:text-[10px]' : 'text-[8px]'
                  }`}
                >
                  [{typeLine}]
                </p>
                <p
                  className={`mt-1 leading-[1.35] text-[#d3d8e2] ${
                    isLarge
                      ? 'text-[10.5px] sm:text-[11px]'
                      : isCompact
                      ? 'line-clamp-3 text-[8.5px]'
                      : 'line-clamp-3 text-[9.5px]'
                  }`}
                >
                  {effectText}
                </p>
              </div>

              {/* ATK / DEF Footer */}
              <div className="mt-1.5 flex items-center justify-between border-t border-[#d4af37]/25 pt-1">
                <span className="font-mono-tech text-[7px] text-[#788296]">©2026 MH-OS</span>
                <div
                  className={`font-mono-tech flex items-center gap-2 font-bold tracking-wider text-[#f4e4b3] ${
                    isLarge ? 'text-[10.5px] sm:text-[11px]' : 'text-[9px]'
                  }`}
                >
                  <span>ATK/{atk}</span>
                  <span>{cardKind === 'LINK' ? def : `DEF/${def}`}</span>
                  {/* Gold Eye-of-Anubis authenticity square */}
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-[2px] bg-gradient-to-br from-[#fff0b3] via-[#d4af37] to-[#7a5d17] shadow-[0_0_6px_rgba(212,175,55,0.6)]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OPTIONAL FLIPPED BACK (Quick Dossier Stats on Ace Card) */}
          {flippable && backStats && (
            <div className="ygo-face ygo-face-back ygo-frame-ACE absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[0.7rem] p-3.5">
              <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-2">
                <div>
                  <p className="font-mono-tech text-[9px] tracking-[0.16em] text-[#4ea8de] uppercase">
                    DUELIST DOSSIER
                  </p>
                  <h4 className="font-display text-sm font-bold text-[#f3da8b]">MICHAEL HANS</h4>
                </div>
                <span className="font-mono-tech rounded border border-[#d4af37]/40 bg-[#0c0f16] px-2 py-0.5 text-[9px] text-[#f3da8b]">
                  LP 8000
                </span>
              </div>

              <dl className="my-2 space-y-2">
                {backStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded border border-[#d4af37]/18 bg-[#0b0e14]/90 px-2.5 py-1.5"
                  >
                    <dt className="font-mono-tech text-[8.5px] tracking-[0.14em] text-[#8d97ab] uppercase">
                      {stat.label}
                    </dt>
                    <dd className="mt-0.5 text-[11px] font-semibold text-[#eceef2]">{stat.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="font-mono-tech text-center text-[9px] tracking-[0.12em] text-[#d4af37]/80 uppercase">
                Click card to flip back
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
