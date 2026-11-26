import React, { useId, useRef, useState } from 'react'
import { Award, ClipboardCheck, ShieldCheck, UserCheck } from 'lucide-react'
import { CardCategory, DeckCardItem } from '../data/deckData'
import { duelSfx } from '../utils/sfx'

const customGlob = import.meta.glob('../cards/custom/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const templateGlob = import.meta.glob('../cards/templates/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function findCustomCardUrl(id: string): string | undefined {
  for (const [path, url] of Object.entries(customGlob)) {
    const filename = path.split('/').pop()?.toLowerCase() || ''
    const stem = filename.replace(/\.[^.]+$/, '')
    if (stem === id.toLowerCase()) return url
  }
  return undefined
}

function findTemplateUrl(category: CardCategory): string | undefined {
  const targetCandidates: Record<CardCategory, string[]> = {
    projects: ['project-frame'],
    achievements: ['achievement-frame'],
    references: ['reference-frame', 'about-frame'],
  }
  for (const target of targetCandidates[category]) {
    for (const [path, url] of Object.entries(templateGlob)) {
      const filename = path.split('/').pop()?.toLowerCase() || ''
      const stem = filename.replace(/\.[^.]+$/, '')
      if (stem === target) return url
    }
  }
  return undefined
}

interface DeckCardProps {
  item: DeckCardItem
  onClick?: () => void
  className?: string
  disableTilt?: boolean
}

export const DeckCard: React.FC<DeckCardProps> = ({
  item,
  onClick,
  className = '',
  disableTilt = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [interacting, setInteracting] = useState(false)
  const noiseFilterId = useId().replace(/:/g, '')

  const customUrl = findCustomCardUrl(item.id)
  const templateUrl = !customUrl ? findTemplateUrl(item.category) : undefined

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disableTilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

    const rotY = (px - 0.5) * 16
    const rotX = (0.5 - py) * 14
    const bgX = 25 + px * 50
    const bgY = 25 + py * 50

    const el = cardRef.current
    el.style.setProperty('--pointer-x', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--pointer-y', `${(py * 100).toFixed(1)}%`)
    el.style.setProperty('--bg-x', `${bgX.toFixed(1)}%`)
    el.style.setProperty('--bg-y', `${bgY.toFixed(1)}%`)
    el.style.setProperty('--rotate-x', `${rotX.toFixed(2)}deg`)
    el.style.setProperty('--rotate-y', `${rotY.toFixed(2)}deg`)
    el.style.setProperty('--holo-opacity', '1')
    if (!interacting) setInteracting(true)
  }

  const handlePointerLeave = () => {
    if (!cardRef.current) return
    const el = cardRef.current
    el.style.setProperty('--rotate-x', '0deg')
    el.style.setProperty('--rotate-y', '0deg')
    el.style.setProperty('--holo-opacity', '0')
    setInteracting(false)
  }

  const handleClick = () => {
    if (!onClick) return
    duelSfx.playHover()
    onClick()
  }

  const renderBadgeArt = () => {
    const iconClass = 'h-[16cqi] w-[16cqi] text-[#cbd5e1]'
    let Icon = ClipboardCheck
    if (item.id === 'hackforgov') Icon = ShieldCheck
    else if (item.id === 'isite-java' || item.id === 'dost-scholar') Icon = Award
    else if (item.category === 'references') Icon = UserCheck

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-[2.5cqi] bg-[radial-gradient(circle_at_50%_40%,#1d2536,#0c0f15_78%)] p-[6cqi] text-center">
        <Icon className={iconClass} />
        <span className="font-mono-tech text-[4cqi] font-semibold leading-tight text-[#f1f3f8]">
          {item.metricBadge || item.subtitle}
        </span>
      </div>
    )
  }

  const renderArtworkContent = () => {
    if (item.visualKind === 'logo' && item.imageSrc) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#f6f4ee] p-[8cqi]">
          <img
            src={item.imageSrc}
            alt={item.title}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            draggable={false}
          />
        </div>
      )
    }
    if (item.visualKind === 'screenshot' && item.imageSrc) {
      return (
        <img
          src={item.imageSrc}
          alt={item.title}
          className="h-full w-full object-cover object-top"
          loading="lazy"
          draggable={false}
        />
      )
    }
    return renderBadgeArt()
  }

  const isSpellOrTrap = item.ygoFrame === 'spell' || item.ygoFrame === 'trap'
  const attrOrbClass =
    item.ygoFrame === 'trap'
      ? 'ygo-attr-TRAP'
      : item.ygoFrame === 'spell'
      ? 'ygo-attr-SPELL'
      : item.ygoAttribute === 'EARTH'
      ? 'ygo-attr-EARTH'
      : 'ygo-attr-LIGHT'

  const attrTop =
    item.ygoFrame === 'trap'
      ? 'TRAP'
      : item.ygoFrame === 'spell'
      ? 'SPELL'
      : item.ygoAttribute || 'LIGHT'

  const attrKanji =
    item.ygoFrame === 'trap'
      ? '罠'
      : item.ygoFrame === 'spell'
      ? '魔'
      : item.ygoAttribute === 'EARTH'
      ? '地'
      : '光'

  return (
    <div className={`holo-stage ${className}`}>
      <div
        ref={cardRef}
        data-interacting={interacting ? 'true' : 'false'}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleClick()
          }
        }}
        aria-label={onClick ? `Inspect ${item.title}` : item.title}
        className={`${disableTilt ? '' : 'holo-card '}relative aspect-[59/86] w-full select-none overflow-hidden rounded-[2px] ${
          onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-silver)]' : ''
        }`}
        style={{ boxShadow: 'var(--card-shadow)' }}
      >
        {/* PRIORITY 1: Hans's exact downloaded Cardmaker PNG (pure image, zero rounded border!) */}
        {customUrl && (
          <div className="relative h-full w-full overflow-hidden rounded-[2px]">
            <img
              src={customUrl}
              alt={item.title}
              className="h-[103%] w-full object-cover object-top"
              draggable={false}
            />
          </div>
        )}

        {/* PRIORITY 2: Real blank Cardmaker template frame with auto-composited content */}
        {!customUrl && templateUrl && (
          <div className="relative h-full w-full overflow-hidden rounded-[2px]">
            <img
              src={templateUrl}
              alt=""
              className="h-[103%] w-full object-cover object-top"
              draggable={false}
            />

            <div className="pointer-events-none absolute left-[8.5%] right-[17%] top-[6.6%] flex h-[5.4%] items-center">
              <span className="truncate font-serif text-[5cqi] font-bold tracking-tight text-[#141414]">
                {item.title}
              </span>
            </div>

            <div className="pointer-events-none absolute left-[12%] top-[18.8%] flex aspect-square w-[76%] items-center justify-center overflow-hidden bg-[#101319]">
              {renderArtworkContent()}
            </div>

            <div className="pointer-events-none absolute bottom-[7.4%] left-[8.4%] right-[8.4%] flex h-[17.5%] flex-col justify-between overflow-hidden px-1 py-0.5 text-[#141414]">
              <p className="line-clamp-4 text-[3.6cqi] leading-[1.2] font-medium">{item.cardEffect}</p>
            </div>
          </div>
        )}

        {/* PRIORITY 3: Authentic Reverse-Engineered Series-10 Yu-Gi-Oh Frame (Container-Query Responsive) */}
        {!customUrl && !templateUrl && (
          <div className="ygo-real-shell">
            <div className={`ygo-real-inner ygo-pigment-${item.ygoFrame}`}>
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14] mix-blend-overlay"
                aria-hidden="true"
              >
                <filter id={noiseFilterId}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#${noiseFilterId})`} />
              </svg>

              <div className="ygo-title-plate relative z-10">
                <span className={`ygo-card-title truncate ${isSpellOrTrap ? 'ygo-title-light' : ''}`}>
                  {item.title}
                </span>
                <div className={`ygo-attr-orb ${attrOrbClass}`} title={attrTop}>
                  <span className="text-[1.7cqi] leading-none font-bold tracking-tight opacity-90">{attrTop}</span>
                  <span className="text-[3.4cqi] leading-none font-bold">{attrKanji}</span>
                </div>
              </div>

              <div className="ygo-subrow relative z-10">
                {item.ygoFrame === 'monster' ? (
                  Array.from({ length: Math.min(item.ygoStars ?? 7, 10) }).map((_, i) => (
                    <span key={i} className="ygo-star" aria-hidden="true">
                      ★
                    </span>
                  ))
                ) : (
                  <span className="ygo-st-badge">{item.ygoSubHeader}</span>
                )}
              </div>

              <div className="ygo-art-frame relative z-10">{renderArtworkContent()}</div>

              <div className="ygo-set-row relative z-10">
                <span>1st Edition</span>
                <span>{item.ygoSetCode}</span>
              </div>

              <div className="ygo-lore-box relative z-10">
                <div>
                  <p className="ygo-lore-type">[{item.ygoTypeLine}]</p>
                  <p className="ygo-lore-text line-clamp-4">{item.cardEffect}</p>
                </div>

                {item.ygoFrame === 'monster' && (
                  <div className="ygo-atkdef-bar">
                    <span>ATK/{item.ygoAtk ?? '2500'}</span>
                    <span>DEF/{item.ygoDef ?? '2100'}</span>
                  </div>
                )}
              </div>

              <div className="ygo-footer-bar relative z-10">
                <span>MH-DECK</span>
                <span>© 2026 FAITH Colleges</span>
                <span className="ygo-eye-seal" aria-hidden="true" />
              </div>
            </div>
          </div>
        )}

        {/* Shared poke-holo Foil + Specular Glare */}
        <div className="holo-shine absolute inset-0 rounded-[2px]" />
        <div className="holo-glare absolute inset-0 rounded-[2px]" />
      </div>
    </div>
  )
}
