import { RotateCcw } from 'lucide-react'
import { PhaseCardItem } from './phaseCards'

interface PhaseCardVisualProps {
  item: PhaseCardItem
  customUrl?: string
  isLight: boolean
  isCurrentPhase: boolean
  isHighlighted: boolean
}

export function PhaseCardVisual({
  item,
  customUrl,
  isLight,
  isCurrentPhase,
  isHighlighted,
}: PhaseCardVisualProps) {
  if (customUrl) {
    return (
      <div className="relative aspect-[59/86] w-full overflow-hidden bg-black/40">
        <img
          src={customUrl}
          alt={`${item.label} tab preview card`}
          className="h-[103%] w-full object-cover object-top"
          draggable={false}
        />
      </div>
    )
  }

  return (
    <div
      className={`flex flex-1 flex-col ${
        isLight ? 'bg-[#f4f1e8] text-[#181a1f]' : 'bg-[#0f1628] text-slate-100'
      }`}
    >
      {isHighlighted && (
        <span
          aria-hidden="true"
          className="ygo-card-sheen pointer-events-none absolute inset-y-0 z-10 w-16 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-[1px]"
        />
      )}

      <div
        className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold tracking-wider text-white"
        style={{ backgroundColor: item.accent }}
      >
        <span className="font-mono-tech">{item.code}</span>
        <span>{isCurrentPhase ? 'ACTIVE' : 'PHASE'}</span>
      </div>

      <div className="p-1.5">
        <div
          className={`relative aspect-[59/60] w-full overflow-hidden rounded-[1px] border ${
            isLight
              ? 'border-[#94a3b8] bg-white shadow-inner'
              : 'border-[#64748b]/70 bg-[#070b14] shadow-inner'
          }`}
        >
          <img
            src={isLight ? item.previewLightSrc : item.previewDarkSrc}
            alt={`${item.label} tab preview card`}
            className="h-full w-full object-cover object-top transition duration-200 group-hover:scale-[1.04]"
            draggable={false}
          />
          {item.id === 'draw' && (
            <span className="absolute right-1 top-1 inline-flex items-center gap-1 rounded-[2px] bg-black/75 px-1.5 py-0.5 font-mono-tech text-[9px] text-[#e2e8f0]">
              <RotateCcw className="h-2.5 w-2.5" />
              Intro
            </span>
          )}
        </div>
      </div>

      <div
        className={`mt-auto border-t px-2 py-1.5 ${
          isLight ? 'border-[#d6d1c4] bg-[#ebe6d8]' : 'border-white/10 bg-[#141d34]'
        }`}
      >
        <div className={`truncate text-xs font-semibold ${isLight ? 'text-[#181a1f]' : 'text-white'}`}>
          {item.label}
        </div>
        <div
          className={`truncate text-[10px] ${isLight ? 'text-[#4e5460]' : 'text-slate-300/80'}`}
        >
          {item.subtitle}
        </div>
      </div>
    </div>
  )
}
