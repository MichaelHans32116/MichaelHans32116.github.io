// Yu-Gi-Oh! Sound FX (default ON) + Passionate Duelist OST (mute & independent volume control)
// Uses trimmed & mastered MP3 clips from public/sfx/ and handles browser autoplay policies gracefully.

const BGM_SRC = '/sfx/passionate-duelist.mp3'
const DEFAULT_BGM_VOLUME = 0.25

const KEY_SFX = 'mh-sfx-enabled'
const KEY_BGM_MUTED = 'mh-bgm-muted'
const KEY_BGM_VOL = 'mh-bgm-volume'

function readStoredBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback
  try {
    const val = window.localStorage.getItem(key)
    if (val === null) return fallback
    return val === 'true'
  } catch {
    return fallback
  }
}

function readStoredVolume(): number {
  if (typeof window === 'undefined') return DEFAULT_BGM_VOLUME
  try {
    const raw = window.localStorage.getItem(KEY_BGM_VOL)
    if (raw === null) return DEFAULT_BGM_VOLUME
    const parsed = Number.parseFloat(raw)
    if (!Number.isFinite(parsed)) return DEFAULT_BGM_VOLUME
    return Math.max(0, Math.min(1, parsed))
  } catch {
    return DEFAULT_BGM_VOLUME
  }
}

function writeStored(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore storage errors
  }
}

class DeckAudioEngine {
  private sfxEnabled: boolean = readStoredBool(KEY_SFX, true)
  private bgmMuted: boolean = readStoredBool(KEY_BGM_MUTED, false)
  private bgmVolume: number = readStoredVolume()
  private cache: Record<string, HTMLAudioElement> = {}
  private bgm: HTMLAudioElement | null = null
  private fadeTimer: number | null = null

  public isSfxEnabled(): boolean {
    return this.sfxEnabled
  }

  public setSfxEnabled(next: boolean): void {
    this.sfxEnabled = next
    writeStored(KEY_SFX, String(next))
    if (next) {
      this.play('/sfx/card-hover.mp3', 0.55)
    }
  }

  public isBgmMuted(): boolean {
    return this.bgmMuted
  }

  public setBgmMuted(muted: boolean): void {
    this.bgmMuted = muted
    writeStored(KEY_BGM_MUTED, String(muted))
    if (muted) {
      this.stopBgm()
    } else {
      if (this.bgmVolume <= 0) {
        this.bgmVolume = DEFAULT_BGM_VOLUME
        writeStored(KEY_BGM_VOL, String(DEFAULT_BGM_VOLUME))
      }
      this.startBgm()
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolume
  }

  public setBgmVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol))
    this.bgmVolume = clamped
    writeStored(KEY_BGM_VOL, clamped.toFixed(2))

    if (clamped === 0) {
      this.bgmMuted = true
      writeStored(KEY_BGM_MUTED, 'true')
      this.stopBgm()
      return
    }

    if (this.bgmMuted) {
      this.bgmMuted = false
      writeStored(KEY_BGM_MUTED, 'false')
    }

    this.clearFade()
    if (!this.bgm || this.bgm.paused) {
      this.startBgm()
    } else {
      this.bgm.volume = clamped
    }
  }

  // Backwards-compatible aliases
  public isEnabled(): boolean {
    return this.sfxEnabled
  }

  public setEnabled(next: boolean): void {
    this.setSfxEnabled(next)
    this.setBgmMuted(!next)
  }

  public ensureBgmPlaying(): void {
    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') return
    if (this.bgm && !this.bgm.paused) return
    this.startBgm()
  }

  private clearFade(): void {
    if (this.fadeTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.fadeTimer)
      this.fadeTimer = null
    }
  }

  private startBgm(): void {
    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') return
    try {
      if (!this.bgm) {
        const audio = new Audio(BGM_SRC)
        audio.loop = true
        audio.preload = 'auto'
        audio.volume = 0
        this.bgm = audio
      }

      const audio = this.bgm
      const target = this.bgmVolume
      this.clearFade()
      audio.volume = 0
      void audio
        .play()
        .then(() => {
          let step = 0
          const steps = 12
          this.fadeTimer = window.setInterval(() => {
            if (this.bgmMuted || !this.bgm) {
              this.clearFade()
              return
            }
            step += 1
            const nextVol = Math.min(this.bgmVolume, (target * step) / steps)
            this.bgm.volume = nextVol
            if (step >= steps) {
              this.clearFade()
            }
          }, 40)
        })
        .catch(() => {
          // Wait until next user gesture to satisfy browser autoplay gate
        })
    } catch {
      // Ignore environments without HTMLAudioElement
    }
  }

  private stopBgm(): void {
    this.clearFade()
    if (this.bgm) {
      try {
        this.bgm.pause()
      } catch {
        // ignore pause failure
      }
    }
  }

  private play(src: string, volume = 0.85): void {
    if (!this.sfxEnabled || typeof window === 'undefined') return
    try {
      let base = this.cache[src]
      if (!base) {
        base = new Audio(src)
        base.preload = 'auto'
        this.cache[src] = base
      }
      const clip = base.cloneNode(true) as HTMLAudioElement
      clip.volume = Math.max(0, Math.min(1, volume))
      void clip.play().catch(() => {
        // Ignore missing audio file or browser autoplay block silently
      })
    } catch {
      // Ignore environments without HTMLAudioElement
    }
  }

  public playPull(): void {
    this.ensureBgmPlaying()
    this.play('/sfx/card-pull.mp3', 1.0)
  }

  public playReveal(): void {
    this.ensureBgmPlaying()
    this.play('/sfx/card-reveal.mp3', 1.0)
  }

  public playFlip(): void {
    this.ensureBgmPlaying()
    this.play('/sfx/card-pull.mp3', 0.78)
  }

  public playHover(): void {
    this.ensureBgmPlaying()
    this.play('/sfx/card-hover.mp3', 0.55)
  }
}

export const duelSfx = new DeckAudioEngine()
