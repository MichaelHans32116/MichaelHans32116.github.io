import React from 'react'

interface CardBackProps {
  className?: string
  compact?: boolean
}

export const CardBack: React.FC<CardBackProps> = ({ className = '', compact = false }) => {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[0.7rem] bg-[#0a0c11] select-none ${className}`}
      style={{
        boxShadow:
          'inset 0 0 0 2px #07080b, inset 0 0 0 3.5px rgba(212,175,55,0.52), 0 18px 36px -14px rgba(0,0,0,0.88)',
      }}
    >
      <svg
        viewBox="0 0 260 380"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="goldFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3da8b" />
            <stop offset="45%" stopColor="#c9a23b" />
            <stop offset="75%" stopColor="#856924" />
            <stop offset="100%" stopColor="#e8cc7a" />
          </linearGradient>

          <radialGradient id="obsidianCore" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1b2334" />
            <stop offset="45%" stopColor="#10131b" />
            <stop offset="100%" stopColor="#07080c" />
          </radialGradient>

          <radialGradient id="vortexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.28" />
            <stop offset="42%" stopColor="#4ea8de" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#08090c" stopOpacity="0" />
          </radialGradient>

          <pattern id="microGrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#d4af37" strokeOpacity="0.06" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* Base cardstock + subtle architectural texture */}
        <rect width="260" height="380" fill="url(#obsidianCore)" />
        <rect width="260" height="380" fill="url(#microGrid)" />

        {/* Outer metallic filigree border */}
        <rect
          x="10"
          y="10"
          width="240"
          height="360"
          rx="8"
          fill="none"
          stroke="url(#goldFrame)"
          strokeWidth="1.6"
          strokeOpacity="0.82"
        />
        <rect
          x="17"
          y="17"
          width="226"
          height="346"
          rx="5"
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.7"
          strokeOpacity="0.42"
        />

        {/* Notched corner flourishes */}
        <g stroke="url(#goldFrame)" strokeWidth="1.2" fill="none" opacity="0.85">
          <path d="M17 37 L37 17 M22 46 L46 22" />
          <path d="M243 37 L223 17 M238 46 L214 22" />
          <path d="M17 343 L37 363 M22 334 L46 358" />
          <path d="M243 343 L223 363 M238 334 L214 358" />
        </g>

        {/* Vertical axis circuit traces */}
        <g stroke="#d4af37" strokeWidth="0.75" opacity="0.32" fill="none">
          <line x1="130" y1="24" x2="130" y2="86" />
          <line x1="130" y1="294" x2="130" y2="356" />
          <line x1="30" y1="190" x2="54" y2="190" />
          <line x1="206" y1="190" x2="230" y2="190" />
          <circle cx="130" cy="40" r="3" fill="#d4af37" fillOpacity="0.45" />
          <circle cx="130" cy="340" r="3" fill="#d4af37" fillOpacity="0.45" />
        </g>

        {/* Central Millennium-Astrolabe Vortex */}
        <circle cx="130" cy="190" r="92" fill="url(#vortexGlow)" />

        {/* Outer rotated diamond & rings */}
        <ellipse
          cx="130"
          cy="190"
          rx="74"
          ry="108"
          fill="none"
          stroke="url(#goldFrame)"
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />
        <ellipse
          cx="130"
          cy="190"
          rx="62"
          ry="94"
          fill="none"
          stroke="#4ea8de"
          strokeWidth="0.8"
          strokeDasharray="4 4"
          strokeOpacity="0.48"
        />
        <circle
          cx="130"
          cy="190"
          r="52"
          fill="#090b10"
          fillOpacity="0.85"
          stroke="url(#goldFrame)"
          strokeWidth="1.4"
        />

        {/* Sacred geometry 8-point star */}
        <g stroke="url(#goldFrame)" strokeWidth="0.9" fill="none" opacity="0.75">
          <polygon points="130,132 146,174 188,190 146,206 130,248 114,206 72,190 114,174" />
          <polygon
            points="130,148 164,190 130,232 96,190"
            stroke="#4ea8de"
            strokeOpacity="0.55"
            strokeWidth="0.85"
          />
        </g>

        {/* Inner golden crest + subtle MH emblem */}
        <polygon
          points="130,164 152,190 130,216 108,190"
          fill="#0e121a"
          stroke="url(#goldFrame)"
          strokeWidth="1.4"
        />
        <circle cx="130" cy="190" r="14" fill="none" stroke="#f3da8b" strokeWidth="0.9" strokeOpacity="0.75" />
        {!compact && (
          <text
            x="130"
            y="194"
            textAnchor="middle"
            fill="#f3da8b"
            fontSize="11.5"
            fontFamily="Cinzel, Georgia, serif"
            fontWeight="700"
            letterSpacing="1.6"
          >
            MH
          </text>
        )}

        {/* Top & bottom subtle plate marks */}
        <path d="M98 62 L130 50 L162 62 L130 74 Z" fill="none" stroke="#d4af37" strokeWidth="0.85" strokeOpacity="0.55" />
        <path d="M98 318 L130 306 L162 318 L130 330 Z" fill="none" stroke="#d4af37" strokeWidth="0.85" strokeOpacity="0.55" />
      </svg>
    </div>
  )
}
