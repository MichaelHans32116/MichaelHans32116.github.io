import { BGM_TRACKS, BgmMode, BgmTrackId, DEFAULT_BGM_VOLUME } from './tracks'

export const KEY_SFX = 'mh-sfx-enabled'
export const KEY_BGM_MUTED = 'mh-bgm-muted'
export const KEY_BGM_VOL = 'mh-bgm-volume'
export const KEY_BGM_MODE = 'mh-bgm-mode'
export const KEY_BGM_TRACK = 'mh-bgm-track'

function readStoredString(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function readStoredBool(key: string, fallback: boolean): boolean {
  const val = readStoredString(key)
  if (val === null) return fallback
  return val === 'true'
}

export function readStoredVolume(): number {
  const raw = readStoredString(KEY_BGM_VOL)
  if (raw === null) return DEFAULT_BGM_VOLUME
  const parsed = Number.parseFloat(raw)
  if (!Number.isFinite(parsed)) return DEFAULT_BGM_VOLUME
  return Math.max(0, Math.min(1, parsed))
}

export function readStoredMode(): BgmMode {
  return readStoredString(KEY_BGM_MODE) === 'manual' ? 'manual' : 'auto-phase'
}

export function readStoredTrack(): BgmTrackId {
  const saved = readStoredString(KEY_BGM_TRACK) as BgmTrackId | null
  if (saved && BGM_TRACKS.some((t) => t.id === saved)) return saved
  return 'passionate-duelist'
}

export function writeStored(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore storage errors
  }
}
