import React from 'react'

interface TurnBannerOverlayProps {
  leaving: boolean
  theme: 'light' | 'dark'
}

export const TurnBannerOverlay: React.FC<TurnBannerOverlayProps> = ({ leaving, theme }) => {
  return (
    <div
      data-leaving={leaving ? 'true' : 'false'}
      className="ygo-turn-banner pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center px-6"
    >
      <div className="relative flex w-[min(560px,88vw)] flex-col items-center gap-3 py-5">
        <div
          aria-hidden="true"
          className="ygo-turn-line h-[1.5px] w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--accent-silver) 28%, var(--accent-silver-bright) 50%, var(--accent-silver) 72%, transparent 100%)',
          }}
        />

        <div className="relative flex items-center justify-center overflow-hidden px-3 py-1">
          <h1
            className="ygo-turn-text relative select-none text-center text-[clamp(2.1rem,7.8vw,4rem)] font-black uppercase"
            style={{
              fontFamily: 'var(--font-ygo-title)',
              background: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 48%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter:
                theme === 'dark'
                  ? 'drop-shadow(0 3px 0 #05070d) drop-shadow(0 0 22px rgba(226,232,240,0.42))'
                  : 'drop-shadow(0 2px 0 rgba(15,23,42,0.72)) drop-shadow(0 8px 20px rgba(15,23,42,0.22))',
            }}
          >
            YOUR TURN!
          </h1>
          <span className="ygo-logo-sheen pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/75 to-transparent blur-[2px]" />
        </div>

        <div
          aria-hidden="true"
          className="ygo-turn-line h-[1.5px] w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--accent-silver) 28%, var(--accent-silver-bright) 50%, var(--accent-silver) 72%, transparent 100%)',
          }}
        />
      </div>
    </div>
  )
}
