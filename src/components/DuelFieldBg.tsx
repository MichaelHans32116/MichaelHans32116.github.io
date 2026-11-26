import React, { useEffect, useState } from 'react'
import cardBackImg from '../cards/back-image-yugioh.jpg'
import adAstraCard from '../cards/custom/ad-astra.jpeg'
import buildbidCard from '../cards/custom/buildbid.jpeg'
import dostCard from '../cards/custom/dost-scholar.jpeg'
import gatepassCard from '../cards/custom/gatepass.jpeg'
import hackforgovCard from '../cards/custom/hackforgov.jpeg'
import insectraCard from '../cards/custom/insectra.jpeg'
import adeCard from '../cards/custom/ref-ade.jpeg'
import angelicaCard from '../cards/custom/ref-angelica.jpeg'
import lyndonCard from '../cards/custom/ref-lyndon.jpeg'
import topcitCard from '../cards/custom/topcit.jpeg'

interface DuelFieldBgProps {
  variant?: 'splash' | 'arena'
}

const DESKTOP_MONSTER_X = [310, 476, 642, 808, 974]
const DESKTOP_EMZ_X = [476, 974]
const MOBILE_MONSTER_X = [166, 302, 438, 574, 710]
const MOBILE_EMZ_X = [302, 574]

const MONSTER_SLOT_CARDS: Partial<Record<number, { src: string; label: string }>> = {
  0: { src: lyndonCard, label: 'Lyndon Lauren A. Balois' },
  1: { src: adeCard, label: 'Ade Salsona' },
  3: { src: angelicaCard, label: 'Angelica Evangelista' },
}

const ST_SLOT_CARDS: Partial<Record<number, { src: string; label: string }>> = {
  0: { src: buildbidCard, label: 'BuildBid Continuous Trap' },
  1: { src: insectraCard, label: 'InsecTra Counter Trap' },
  2: { src: topcitCard, label: 'TOPCIT Continuous Spell' },
  3: { src: hackforgovCard, label: 'HackForGov 5 Quick-Play Spell' },
  4: { src: gatepassCard, label: 'Moriroku GatePass Counter Trap' },
}

export const DuelFieldBg: React.FC<DuelFieldBgProps> = ({ variant = 'arena' }) => {
  const isSplash = variant === 'splash'
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 639px)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setIsCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const slotW = isCompact ? 124 : 132
  const slotH = isCompact ? 166 : 182
  const emzH = isCompact ? 148 : 168
  const arenaRect = isCompact
    ? { x: 8, y: 14, w: 984, h: 552, rx: 12 }
    : { x: 96, y: 84, w: 1248, h: 692, rx: 16 }
  const horizonY = isCompact ? 196 : 210
  const horizonX1 = isCompact ? 20 : 120
  const horizonX2 = isCompact ? 980 : 1320
  const emzY = isCompact ? 32 : 118
  const row1Y = isCompact ? 212 : 326
  const row2Y = isCompact ? 394 : 540
  const fieldX = isCompact ? 20 : 132
  const deckX = isCompact ? 856 : 1152
  const mmzX = isCompact ? MOBILE_MONSTER_X : DESKTOP_MONSTER_X
  const emzX = isCompact ? MOBILE_EMZ_X : DESKTOP_EMZ_X

  const cx = slotW / 2
  const cy = slotH / 2

  const renderSlotCard = (src: string, opacity = 0.9) => (
    <g opacity={opacity}>
      <rect
        x="4"
        y="4"
        width={slotW - 8}
        height={slotH - 8}
        rx="2"
        fill="#0b0d12"
        stroke="var(--accent-silver)"
        strokeWidth="1.2"
        strokeOpacity="0.55"
      />
      <image
        href={src}
        x="6"
        y="6"
        width={slotW - 12}
        height={slotH - 12}
        preserveAspectRatio="xMidYMid slice"
      />
    </g>
  )

  const cornerMarksD = `M 10 24 L 10 10 L 24 10 M ${slotW - 24} 10 L ${slotW - 10} 10 L ${slotW - 10} 24 M 10 ${slotH - 24} L 10 ${slotH - 10} L 24 ${slotH - 10} M ${slotW - 24} ${slotH - 10} L ${slotW - 10} ${slotH - 10} L ${slotW - 10} ${slotH - 24}`

  const perspectiveClass = isSplash
    ? isCompact
      ? 'duel-field-perspective-mobile opacity-90'
      : 'duel-field-perspective opacity-90'
    : 'opacity-[0.26]'

  const maskValue = isCompact
    ? 'none'
    : isSplash
      ? 'radial-gradient(ellipse 94% 90% at 50% 50%, rgba(0,0,0,0.96) 58%, transparent 100%)'
      : 'radial-gradient(ellipse 84% 78% at 50% 49%, rgba(0,0,0,0.95) 34%, transparent 88%)'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Subtle Playmat Micro-Dot Grid */}
      <div
        className={`duel-field-grid absolute inset-0 ${
          isSplash ? 'opacity-50' : 'opacity-20'
        }`}
      />

      {/* Ambient Playmat Lighting */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 58% at 50% 45%, var(--splash-aura-2) 0%, var(--splash-aura-1) 44%, transparent 78%)',
        }}
      />

      {/* Architectural Yu-Gi-Oh! Duel Field Zones Blueprint */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${perspectiveClass}`}
        style={{
          maskImage: maskValue,
          WebkitMaskImage: maskValue,
        }}
      >
        <svg
          viewBox={isCompact ? '0 0 1000 580' : '0 0 1440 860'}
          className={isCompact ? 'h-auto w-[96%] max-w-[600px]' : 'h-full w-full max-w-[1520px]'}
          preserveAspectRatio={isCompact ? 'xMidYMid meet' : 'xMidYMid slice'}
        >
          {/* Outer Arena Framing Lines */}
          <rect
            x={arenaRect.x}
            y={arenaRect.y}
            width={arenaRect.w}
            height={arenaRect.h}
            rx={arenaRect.rx}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="1.2"
            strokeDasharray="6 10"
            opacity="0.7"
          />

          {/* Center Horizon / Field Divider */}
          <line
            x1={horizonX1}
            y1={horizonY}
            x2={horizonX2}
            y2={horizonY}
            stroke="var(--border-subtle)"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Extra Monster Zones (Slots 2 & 4) */}
          {emzX.map((x) => (
            <g key={`emz-${x}`} transform={`translate(${x}, ${emzY})`}>
              <rect
                x="0"
                y="0"
                width={slotW}
                height={emzH}
                rx="4"
                fill="none"
                stroke="var(--zone-monster)"
                strokeWidth="1.8"
              />
              <rect
                x="6"
                y="6"
                width={slotW - 12}
                height={emzH - 12}
                rx="2"
                fill="none"
                stroke="var(--zone-deck)"
                strokeWidth="0.9"
                strokeDasharray="4 4"
              />
              <path
                d={`M ${cx - 10} ${emzH / 2} L ${cx} ${emzH / 2 - 14} L ${cx + 10} ${emzH / 2} L ${cx} ${emzH / 2 + 14} Z`}
                fill="none"
                stroke="var(--zone-monster)"
                strokeWidth="1.2"
              />
            </g>
          ))}

          {/* Field Spell Zone (Left-Top Row): Ad Astra Field Spell on Splash */}
          <g transform={`translate(${fieldX}, ${row1Y})`}>
            <rect
              x="0"
              y="0"
              width={slotW}
              height={slotH}
              rx="4"
              fill="none"
              stroke="var(--zone-field)"
              strokeWidth="1.8"
            />
            <circle
              cx={cx}
              cy={cy}
              r={isCompact ? 26 : 30}
              fill="none"
              stroke="var(--zone-field)"
              strokeWidth="1.3"
            />
            <path
              d={`M ${cx} ${cy - 32} L ${cx + 9} ${cy - 9} L ${cx + 32} ${cy} L ${cx + 9} ${cy + 9} L ${cx} ${cy + 32} L ${cx - 9} ${cy + 9} L ${cx - 32} ${cy} L ${cx - 9} ${cy - 9} Z`}
              fill="none"
              stroke="var(--zone-field)"
              strokeWidth="1.2"
            />
            {isSplash && renderSlotCard(adAstraCard, 0.88)}
          </g>

          {/* Extra Deck Zone (Left-Bottom Row): Facedown Stack on Splash */}
          <g transform={`translate(${fieldX}, ${row2Y})`}>
            <rect
              x="0"
              y="0"
              width={slotW}
              height={slotH}
              rx="4"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.8"
            />
            <rect
              x="10"
              y="10"
              width={slotW - 20}
              height={slotH - 20}
              rx="2"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1"
              strokeDasharray="5 4"
            />
            <circle
              cx={cx}
              cy={cy}
              r="18"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.1"
            />
            {isSplash && (
              <>
                <rect
                  x="8"
                  y="8"
                  width={slotW - 10}
                  height={slotH - 10}
                  rx="2"
                  fill="#171009"
                  stroke="#94a3b8"
                  strokeOpacity="0.3"
                />
                {renderSlotCard(cardBackImg, 0.86)}
              </>
            )}
          </g>

          {/* 5 Main Monster Zones */}
          {mmzX.map((x, idx) => {
            const placed = isSplash ? MONSTER_SLOT_CARDS[idx] : undefined
            return (
              <g key={`mmz-${x}`} transform={`translate(${x}, ${row1Y})`}>
                <rect
                  x="0"
                  y="0"
                  width={slotW}
                  height={slotH}
                  rx="4"
                  fill="none"
                  stroke="var(--zone-monster)"
                  strokeWidth="1.8"
                />
                <path
                  d={cornerMarksD}
                  fill="none"
                  stroke="var(--zone-monster)"
                  strokeWidth="1.5"
                />
                <rect
                  x={cx - 40}
                  y={cy - 40}
                  width="80"
                  height="80"
                  rx="2"
                  fill="none"
                  stroke="var(--zone-monster)"
                  strokeWidth="0.9"
                  opacity="0.7"
                />
                {placed && renderSlotCard(placed.src, 0.82)}
              </g>
            )
          })}

          {/* 5 Spell / Trap Zones (+ Left Blue Pendulum & Right Red Pendulum Markers) */}
          {mmzX.map((x, idx) => {
            const placed = isSplash ? ST_SLOT_CARDS[idx] : undefined
            return (
              <g key={`stz-${x}`} transform={`translate(${x}, ${row2Y})`}>
                <rect
                  x="0"
                  y="0"
                  width={slotW}
                  height={slotH}
                  rx="4"
                  fill="none"
                  stroke="var(--zone-st)"
                  strokeWidth="1.8"
                />
                <path
                  d={cornerMarksD}
                  fill="none"
                  stroke="var(--zone-st)"
                  strokeWidth="1.4"
                />
                {idx === 0 && (
                  <polygon
                    points={`${cx - 20},${cy} ${cx + 16},${cy - 24} ${cx + 16},${cy + 24}`}
                    fill="none"
                    stroke="var(--zone-monster)"
                    strokeWidth="1.6"
                  />
                )}
                {idx === 4 && (
                  <polygon
                    points={`${cx + 20},${cy} ${cx - 16},${cy - 24} ${cx - 16},${cy + 24}`}
                    fill="none"
                    stroke="var(--zone-st)"
                    strokeWidth="1.6"
                  />
                )}
                {placed && renderSlotCard(placed.src, 0.85)}
              </g>
            )
          })}

          {/* Graveyard Zone (Right-Top Row) */}
          <g transform={`translate(${deckX}, ${row1Y})`}>
            <rect
              x="0"
              y="0"
              width={slotW}
              height={slotH}
              rx="4"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.6"
            />
            <circle
              cx={cx}
              cy={cy}
              r={isCompact ? 24 : 28}
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.2"
              strokeDasharray="6 4"
            />
            {isSplash && renderSlotCard(dostCard, 0.56)}
          </g>

          {/* Main Deck Zone (Right-Bottom Row): Starting anchor for the 3D Deck Glide */}
          <g transform={`translate(${deckX}, ${row2Y})`}>
            <rect
              id="duel-main-deck-zone"
              x="0"
              y="0"
              width={slotW}
              height={slotH}
              rx="4"
              fill="none"
              stroke={isSplash ? 'var(--accent-silver)' : 'var(--zone-deck)'}
              strokeWidth={isSplash ? '2.2' : '1.9'}
              opacity={isSplash ? '0.9' : '1'}
            />
            <rect
              x="8"
              y="8"
              width={slotW - 16}
              height={slotH - 16}
              rx="2"
              fill="none"
              stroke={isSplash ? 'var(--accent-silver)' : 'var(--zone-deck)'}
              strokeWidth="1.1"
              strokeDasharray={isSplash ? '5 4' : undefined}
              opacity={isSplash ? '0.75' : '1'}
            />
            <ellipse
              cx={cx}
              cy={cy}
              rx={isCompact ? 20 : 22}
              ry={isCompact ? 30 : 34}
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.2"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
