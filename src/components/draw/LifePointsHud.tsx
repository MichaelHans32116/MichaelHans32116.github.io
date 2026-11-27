import React from 'react'
import hansIdAvatar from '../../images/web/michael-hans-id.jpg'

interface LifePointsHudProps {
  lpValue: number
}

export const LifePointsHud: React.FC<LifePointsHudProps> = ({ lpValue }) => {
  return (
    <div
      aria-label="Life Points 8000"
      className="pointer-events-none fixed bottom-3.5 left-3.5 z-30 flex items-center sm:bottom-6 sm:left-7"
    >
      <div className="relative z-10 h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-sky-300 bg-white shadow-[0_6px_18px_rgba(2,132,199,0.45)] sm:h-12 sm:w-12">
        <img
          src={hansIdAvatar}
          alt="Michael Hans"
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      </div>
      <div
        className="-ml-4 flex items-baseline gap-1.5 border-2 border-sky-300/85 py-1 pl-6 pr-3.5 shadow-[0_8px_22px_rgba(2,132,199,0.4)] sm:-ml-5 sm:gap-2 sm:py-1.5 sm:pl-7 sm:pr-5"
        style={{
          background: 'linear-gradient(100deg, #071326 0%, #0e2e5c 52%, #083d77 100%)',
          transform: 'skewX(-12deg)',
        }}
      >
        <span
          className="font-mono-tech text-[10px] font-bold tracking-wider text-sky-300 italic sm:text-xs"
          style={{ transform: 'skewX(12deg)' }}
        >
          LP:
        </span>
        <span
          className="font-mono-tech text-base font-extrabold tracking-tight text-white tabular-nums sm:text-xl"
          style={{ transform: 'skewX(12deg)' }}
        >
          {lpValue}
        </span>
      </div>
    </div>
  )
}
