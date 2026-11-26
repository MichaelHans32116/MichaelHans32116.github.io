import React, { useId } from 'react'

interface YgoBrandEmblemProps {
  className?: string
}

export const YgoBrandEmblem: React.FC<YgoBrandEmblemProps> = ({ className = '' }) => {
  const uid = useId().replace(/:/g, '')
  const flameId = `ygo-brand-flame-${uid}`
  const rimId = `ygo-brand-rim-${uid}`
  const silverId = `ygo-brand-silver-${uid}`

  return (
    <svg
      viewBox="0 0 300 72"
      aria-label="Michael Hans"
      className={`h-8 w-auto drop-shadow-[0_3px_8px_rgba(0,0,0,0.28)] sm:h-9 ${className}`}
    >
      <defs>
        <linearGradient id={flameId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--logo-flame-top)" />
          <stop offset="55%" stopColor="var(--logo-flame-mid)" />
          <stop offset="100%" stopColor="var(--logo-flame-dark)" />
        </linearGradient>
        <linearGradient id={rimId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id={silverId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <polygon
        points="8,36 32,12 52,22 76,6 102,20 150,4 198,20 224,6 248,22 268,12 292,36 264,46 276,64 222,52 192,68 150,52 108,68 78,52 24,64 36,46"
        fill={`url(#${flameId})`}
        stroke="var(--logo-stroke)"
        strokeWidth="4.5"
        strokeLinejoin="miter"
      />
      <polygon
        points="22,36 42,18 60,26 80,14 104,25 150,11 196,25 220,14 240,26 258,18 278,36 254,43 262,56 218,46 190,59 150,46 110,59 82,46 38,56 46,43"
        fill="none"
        stroke={`url(#${rimId})`}
        strokeWidth="1.4"
        opacity="0.88"
      />

      <text
        x="150"
        y="43"
        textAnchor="middle"
        fontFamily="var(--font-ygo-title)"
        fontSize="24"
        fontWeight="900"
        letterSpacing="1.6"
        fill={`url(#${silverId})`}
        stroke="#0b0d12"
        strokeWidth="3.6"
        paintOrder="stroke fill"
      >
        MICHAEL HANS
      </text>
    </svg>
  )
}
