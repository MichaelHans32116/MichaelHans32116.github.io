import React from 'react'
import { ThemeFlipDirection } from '../hooks/useThemeMode'

interface ThemeFlipOverlayProps {
  direction: ThemeFlipDirection
}

export const ThemeFlipOverlay: React.FC<ThemeFlipOverlayProps> = ({ direction }) => {
  if (!direction) return null
  const toDark = direction === 'to-dark'

  const LightGradientFace = () => (
    <div
      className="h-full w-full rounded-[3px] border border-[#cbd5e1] shadow-2xl"
      style={{
        background:
          'linear-gradient(155deg, #ffffff 0%, #ffffff 44%, #f4f1ea 74%, #ded8cc 100%)',
      }}
    />
  )

  const DarkGradientFace = () => (
    <div
      className="h-full w-full rounded-[3px] border border-[#94a3b8] shadow-2xl"
      style={{
        background:
          'linear-gradient(155deg, #273145 0%, #141a28 44%, #0b0f18 76%, #05070d 100%)',
      }}
    />
  )

  return (
    <div
      aria-hidden="true"
      className="ygo-theme-flip-stage pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-black/30 backdrop-blur-[1.5px]"
    >
      <div
        className={`relative h-[min(320px,52dvh)] w-[min(220px,58vw)] sm:h-[min(360px,58dvh)] sm:w-[min(250px,64vw)] ${
          toDark ? 'ygo-flip-to-dark' : 'ygo-flip-to-light'
        }`}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {toDark ? <LightGradientFace /> : <DarkGradientFace />}
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {toDark ? <DarkGradientFace /> : <LightGradientFace />}
        </div>
      </div>
    </div>
  )
}
