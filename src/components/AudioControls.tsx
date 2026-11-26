import { useEffect, useRef, useState } from 'react'
import { Minus, Music, Plus, Volume2, VolumeX } from 'lucide-react'

interface AudioControlsProps {
  bgmMuted: boolean
  bgmVolume: number
  sfxEnabled: boolean
  onToggleBgmMute: () => void
  onChangeBgmVolume: (vol: number) => void
  onToggleSfx: () => void
  compact?: boolean
}

export function AudioControls({
  bgmMuted,
  bgmVolume,
  sfxEnabled,
  onToggleBgmMute,
  onChangeBgmVolume,
  onToggleSfx,
  compact = false,
}: AudioControlsProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const effectiveBgmPct = bgmMuted ? 0 : Math.round(bgmVolume * 100)
  const isAllMuted = bgmMuted && !sfxEnabled

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Audio & BGM controls"
        aria-expanded={open}
        title="BGM Volume, Mute & Sound Effects"
        className={`inline-flex items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)] ${
          compact ? 'h-8 w-8' : 'h-9 w-9 shadow-sm'
        }`}
      >
        {isAllMuted ? (
          <VolumeX className="h-3.5 w-3.5" />
        ) : (
          <Volume2
            className={`h-3.5 w-3.5 ${
              !bgmMuted && bgmVolume > 0 ? 'text-[var(--accent-silver)]' : ''
            }`}
          />
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Audio mixer"
          className="ygo-modal-summon absolute right-0 top-full z-50 mt-2 w-64 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-xl"
        >
          {/* Passionate Duelist BGM Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                <Music className="h-3.5 w-3.5 text-[var(--accent-silver)]" />
                <span>BGM · Passionate Duelist</span>
              </div>
              <button
                type="button"
                onClick={onToggleBgmMute}
                aria-label="Toggle BGM mute"
                className={`rounded-[2px] border px-2 py-0.5 font-mono-tech text-[10px] font-medium transition ${
                  bgmMuted
                    ? 'border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-muted)]'
                    : 'border-[var(--accent-silver)] bg-[var(--bg-muted)] text-[var(--text-main)]'
                }`}
              >
                {bgmMuted ? 'Muted' : 'Playing'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChangeBgmVolume(Math.max(0, +(bgmVolume - 0.1).toFixed(2)))}
                aria-label="Decrease BGM volume"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
              >
                <Minus className="h-3 w-3" />
              </button>

              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={effectiveBgmPct}
                onChange={(e) => onChangeBgmVolume(Number(e.target.value) / 100)}
                aria-label="BGM volume"
                className="h-1.5 flex-1 cursor-pointer accent-[var(--accent-silver)]"
              />

              <button
                type="button"
                onClick={() => onChangeBgmVolume(Math.min(1, +(bgmVolume + 0.1).toFixed(2)))}
                aria-label="Increase BGM volume"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
              >
                <Plus className="h-3 w-3" />
              </button>

              <span className="w-9 text-right font-mono-tech text-[11px] text-[var(--text-secondary)]">
                {effectiveBgmPct}%
              </span>
            </div>
          </div>

          {/* Independent Sound Effects Toggle (Default ON) */}
          <div className="mt-3.5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
            <div>
              <p className="text-xs font-semibold text-[var(--text-main)]">Card Sound Effects</p>
              <p className="text-[10px] text-[var(--text-muted)]">Draw &amp; reveal SFX (Default On)</p>
            </div>
            <button
              type="button"
              onClick={onToggleSfx}
              aria-label="Toggle sound effects"
              className={`rounded-[2px] border px-2.5 py-1 font-mono-tech text-[11px] font-semibold transition ${
                sfxEnabled
                  ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-muted)]'
              }`}
            >
              {sfxEnabled ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
