import { useEffect, useRef, useState } from 'react'
import { Check, Minus, Music, Plus, Volume2, VolumeX } from 'lucide-react'
import { BGM_TRACKS, BgmMode, BgmTrackId } from '../utils/sfx'

interface AudioControlsProps {
  bgmMuted: boolean
  bgmVolume: number
  bgmMode: BgmMode
  activeTrackId: BgmTrackId
  sfxEnabled: boolean
  onToggleBgmMute: () => void
  onChangeBgmVolume: (vol: number) => void
  onChangeBgmMode: (mode: BgmMode) => void
  onSelectTrack: (trackId: BgmTrackId) => void
  onToggleSfx: () => void
  compact?: boolean
}

export function AudioControls({
  bgmMuted,
  bgmVolume,
  bgmMode,
  activeTrackId,
  sfxEnabled,
  onToggleBgmMute,
  onChangeBgmVolume,
  onChangeBgmMode,
  onSelectTrack,
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
  const activeTrack = BGM_TRACKS.find((t) => t.id === activeTrackId) ?? BGM_TRACKS[0]

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Audio & BGM controls"
        aria-expanded={open}
        title="OST Selector, BGM Volume & Sound Effects"
        className={`inline-flex items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)] ${
          compact ? 'h-8 w-8' : 'h-8 w-8 shadow-sm sm:h-9 sm:w-9'
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
          className="ygo-modal-summon fixed inset-x-4 top-14 z-50 max-h-[76dvh] overflow-y-auto rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72"
        >
          {/* Active BGM Volume & Mute */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                  <Music className="h-3.5 w-3.5 shrink-0 text-[var(--accent-silver)]" />
                  <span className="truncate">{activeTrack.label}</span>
                </div>
                <p className="truncate pl-5 font-mono-tech text-[10px] text-[var(--text-muted)]">
                  {bgmMode === 'auto-phase' ? 'Auto by Phase' : 'Manual Pick'}
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleBgmMute}
                aria-label="Toggle BGM mute"
                className={`shrink-0 rounded-[2px] border px-2 py-0.5 font-mono-tech text-[10px] font-medium transition ${
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

          {/* OST Mode & Track Selector */}
          <div className="mt-3.5 space-y-2 border-t border-[var(--border-subtle)] pt-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono-tech text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                OST Selection
              </span>
              <div className="inline-flex rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => onChangeBgmMode('auto-phase')}
                  className={`rounded-[1px] px-2 py-0.5 font-medium transition ${
                    bgmMode === 'auto-phase'
                      ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Auto Phase
                </button>
                <button
                  type="button"
                  onClick={() => onChangeBgmMode('manual')}
                  className={`rounded-[1px] px-2 py-0.5 font-medium transition ${
                    bgmMode === 'manual'
                      ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Pick Track
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {BGM_TRACKS.map((track) => {
                const isSelected = track.id === activeTrackId
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => onSelectTrack(track.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-[2px] border px-2.5 py-1.5 text-left transition ${
                      isSelected
                        ? 'border-[var(--accent-silver)] bg-[var(--bg-muted)] text-[var(--text-main)]'
                        : 'border-transparent bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--bg-muted)]/50 hover:text-[var(--text-main)]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{track.label}</p>
                      <p className="truncate font-mono-tech text-[10px] text-[var(--text-muted)]">
                        {track.subtitle}
                      </p>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent-silver)]" />}
                  </button>
                )
              })}
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
