import React from 'react'

interface LogoSplashOverlayProps {
  leaving: boolean
  onDismiss: () => void
}

export const LogoSplashOverlay: React.FC<LogoSplashOverlayProps> = ({ leaving, onDismiss }) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onDismiss()
      }}
      data-leaving={leaving ? 'true' : 'false'}
      role="button"
      tabIndex={0}
      aria-label="Skip opening emblem"
      className="ygo-splash-intro splash-canvas fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center px-6"
    >
      <div className="ygo-logo-enter relative flex flex-col items-center">
        <div className="relative flex items-center justify-center px-6 py-4">
          <svg
            viewBox="0 0 560 170"
            className="h-auto w-[min(440px,84vw)] drop-shadow-[0_14px_26px_rgba(0,0,0,0.42)]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ygoFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--logo-flame-top)" />
                <stop offset="55%" stopColor="var(--logo-flame-mid)" />
                <stop offset="100%" stopColor="var(--logo-flame-dark)" />
              </linearGradient>
              <linearGradient id="ygoSilverRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
            <polygon
              points="24,96 76,34 114,56 168,14 218,52 280,10 342,52 392,14 446,56 484,34 536,96 474,116 502,156 402,130 342,162 280,126 218,162 158,130 58,156 86,116"
              fill="url(#ygoFlameGrad)"
              stroke="var(--logo-stroke)"
              strokeWidth="8"
              strokeLinejoin="miter"
            />
            <polygon
              points="58,94 98,52 132,68 176,34 220,64 280,28 340,64 384,34 428,68 462,52 502,94 454,110 472,138 394,118 340,144 280,114 220,144 166,118 88,138 106,110"
              fill="none"
              stroke="url(#ygoSilverRim)"
              strokeWidth="2.4"
              opacity="0.82"
            />
          </svg>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span
              className="relative select-none px-4 text-center text-[clamp(1.65rem,6.2vw,3.1rem)] font-black tracking-[0.06em] uppercase"
              style={{
                fontFamily: 'var(--font-ygo-title)',
                color: '#f8fafc',
                WebkitTextStroke: '1.8px #111111',
                textShadow:
                  '0 2px 0 #111111, 0 4px 0 rgba(0,0,0,0.65), 0 0 18px rgba(226, 232, 240, 0.45)',
              }}
            >
              MICHAEL HANS
            </span>
            <span className="ygo-logo-sheen pointer-events-none absolute inset-y-2 w-20 bg-gradient-to-r from-transparent via-white/75 to-transparent blur-[2px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
