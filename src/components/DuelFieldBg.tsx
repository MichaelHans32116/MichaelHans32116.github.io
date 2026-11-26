import React from 'react'

interface DuelFieldBgProps {
  variant?: 'splash' | 'arena'
}

const MAIN_MONSTER_X = [310, 476, 642, 808, 974]
const EMZ_X = [476, 974]

export const DuelFieldBg: React.FC<DuelFieldBgProps> = ({ variant = 'arena' }) => {
  const isSplash = variant === 'splash'

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
        className={`absolute inset-0 flex items-center justify-center ${
          isSplash ? 'duel-field-perspective opacity-85' : 'opacity-[0.26]'
        }`}
        style={{
          maskImage:
            'radial-gradient(ellipse 84% 78% at 50% 49%, rgba(0,0,0,0.95) 34%, transparent 88%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 84% 78% at 50% 49%, rgba(0,0,0,0.95) 34%, transparent 88%)',
        }}
      >
        <svg
          viewBox="0 0 1440 860"
          className="h-full w-full max-w-[1520px]"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Subtle Outer Arena Framing Lines */}
          <rect
            x="96"
            y="84"
            width="1248"
            height="692"
            rx="16"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="1.2"
            strokeDasharray="6 10"
            opacity="0.7"
          />

          {/* Center Horizon / Field Divider */}
          <line
            x1="120"
            y1="210"
            x2="1320"
            y2="210"
            stroke="var(--border-subtle)"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Extra Monster Zones (Slots 2 & 4) */}
          {EMZ_X.map((x) => (
            <g key={`emz-${x}`} transform={`translate(${x}, 118)`}>
              <rect
                x="0"
                y="0"
                width="132"
                height="168"
                rx="4"
                fill="none"
                stroke="var(--zone-monster)"
                strokeWidth="1.8"
              />
              <rect
                x="6"
                y="6"
                width="120"
                height="156"
                rx="2"
                fill="none"
                stroke="var(--zone-deck)"
                strokeWidth="0.9"
                strokeDasharray="4 4"
              />
              <path
                d="M 56 84 L 66 70 L 76 84 L 66 98 Z"
                fill="none"
                stroke="var(--zone-monster)"
                strokeWidth="1.2"
              />
            </g>
          ))}

          {/* Field Spell Zone (Left-Top Row) */}
          <g transform="translate(132, 326)">
            <rect
              x="0"
              y="0"
              width="132"
              height="182"
              rx="4"
              fill="none"
              stroke="var(--zone-field)"
              strokeWidth="1.8"
            />
            <circle
              cx="66"
              cy="91"
              r="30"
              fill="none"
              stroke="var(--zone-field)"
              strokeWidth="1.3"
            />
            <path
              d="M 66 57 L 75 82 L 100 91 L 75 100 L 66 125 L 57 100 L 32 91 L 57 82 Z"
              fill="none"
              stroke="var(--zone-field)"
              strokeWidth="1.2"
            />
          </g>

          {/* Extra Deck Zone (Left-Bottom Row) */}
          <g transform="translate(132, 540)">
            <rect
              x="0"
              y="0"
              width="132"
              height="182"
              rx="4"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.8"
            />
            <rect
              x="10"
              y="10"
              width="112"
              height="162"
              rx="2"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1"
              strokeDasharray="5 4"
            />
            <circle
              cx="66"
              cy="91"
              r="18"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.1"
            />
          </g>

          {/* 5 Main Monster Zones */}
          {MAIN_MONSTER_X.map((x) => (
            <g key={`mmz-${x}`} transform={`translate(${x}, 326)`}>
              <rect
                x="0"
                y="0"
                width="132"
                height="182"
                rx="4"
                fill="none"
                stroke="var(--zone-monster)"
                strokeWidth="1.8"
              />
              {/* Clean corner ticks */}
              <path
                d="M 10 24 L 10 10 L 24 10 M 108 10 L 122 10 L 122 24 M 10 158 L 10 172 L 24 172 M 108 172 L 122 172 L 122 158"
                fill="none"
                stroke="var(--zone-monster)"
                strokeWidth="1.5"
              />
              <rect
                x="24"
                y="49"
                width="84"
                height="84"
                rx="2"
                fill="none"
                stroke="var(--zone-monster)"
                strokeWidth="0.9"
                opacity="0.7"
              />
            </g>
          ))}

          {/* 5 Spell / Trap Zones (+ Left Blue Pendulum & Right Red Pendulum Diamonds) */}
          {MAIN_MONSTER_X.map((x, idx) => (
            <g key={`stz-${x}`} transform={`translate(${x}, 540)`}>
              <rect
                x="0"
                y="0"
                width="132"
                height="182"
                rx="4"
                fill="none"
                stroke="var(--zone-st)"
                strokeWidth="1.8"
              />
              <path
                d="M 10 24 L 10 10 L 24 10 M 108 10 L 122 10 L 122 24 M 10 158 L 10 172 L 24 172 M 108 172 L 122 172 L 122 158"
                fill="none"
                stroke="var(--zone-st)"
                strokeWidth="1.4"
              />
              {idx === 0 && (
                <polygon
                  points="44,91 82,66 82,116"
                  fill="none"
                  stroke="var(--zone-monster)"
                  strokeWidth="1.6"
                />
              )}
              {idx === 4 && (
                <polygon
                  points="88,91 50,66 50,116"
                  fill="none"
                  stroke="var(--zone-st)"
                  strokeWidth="1.6"
                />
              )}
            </g>
          ))}

          {/* Graveyard Zone (Right-Top Row) */}
          <g transform="translate(1152, 326)">
            <rect
              x="0"
              y="0"
              width="132"
              height="182"
              rx="4"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.6"
            />
            <circle
              cx="66"
              cy="91"
              r="28"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.2"
              strokeDasharray="6 4"
            />
          </g>

          {/* Main Deck Zone (Right-Bottom Row) */}
          <g transform="translate(1152, 540)">
            <rect
              x="0"
              y="0"
              width="132"
              height="182"
              rx="4"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.9"
            />
            <rect
              x="8"
              y="8"
              width="116"
              height="166"
              rx="2"
              fill="none"
              stroke="var(--zone-deck)"
              strokeWidth="1.1"
            />
            <ellipse
              cx="66"
              cy="91"
              rx="22"
              ry="34"
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
