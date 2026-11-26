// Yu-Gi-Oh! Sound FX (default ON) + Multi-OST Passionate Duelist / ARC-V / 5D's BGM engine
// Supports Web Audio API 0ms SFX decoding, Splash one-shot intro ("The Trump Card"), Per-Phase auto-crossfade BGM, and Manual OST selection.

export type PortfolioAudioPhase = 'standby' | 'main' | 'battle' | 'main2' | 'end'

export type BgmTrackId =
  | 'passionate-duelist'
  | 'unstable-thought'
  | 'zone-5ds'
  | 'resistance'
  | 'gods-anger'

export type BgmMode = 'auto-phase' | 'manual'

export interface BgmTrackMeta {
  id: BgmTrackId
  label: string
  subtitle: string
  src: string
}

export const BGM_TRACKS: BgmTrackMeta[] = [
  {
    id: 'unstable-thought',
    label: 'An Unstable Thought',
    subtitle: 'ARC-V · Home / Strategy',
    src: '/sfx/arcv-unstable-thought.mp3',
  },
  {
    id: 'passionate-duelist',
    label: 'Passionate Duelist',
    subtitle: 'DM Classic · The Deck',
    src: '/sfx/passionate-duelist.mp3',
  },
  {
    id: 'zone-5ds',
    label: 'Z-ONE Remix',
    subtitle: "5D's · Battle / Experience",
    src: '/sfx/zone-5ds-remix.mp3',
  },
  {
    id: 'resistance',
    label: 'Resistance',
    subtitle: 'ARC-V · Contact / Closer',
    src: '/sfx/arcv-resistance.mp3',
  },
  {
    id: 'gods-anger',
    label: "God's Anger",
    subtitle: 'Egyptian God · Bonus Theme',
    src: '/sfx/gods-anger.mp3',
  },
]

export const PHASE_BGM_MAP: Record<PortfolioAudioPhase, BgmTrackId> = {
  standby: 'unstable-thought',
  main: 'passionate-duelist',
  battle: 'zone-5ds',
  main2: 'unstable-thought',
  end: 'resistance',
}

const SPLASH_INTRO_SRC = '/sfx/trump-card-intro.mp3'
const SFX_URLS = ['/sfx/card-hover.mp3', '/sfx/card-pull.mp3', '/sfx/card-reveal.mp3'] as const
const DEFAULT_BGM_VOLUME = 0.25

const KEY_SFX = 'mh-sfx-enabled'
const KEY_BGM_MUTED = 'mh-bgm-muted'
const KEY_BGM_VOL = 'mh-bgm-volume'
const KEY_BGM_MODE = 'mh-bgm-mode'
const KEY_BGM_TRACK = 'mh-bgm-track'

function readStoredString(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function readStoredBool(key: string, fallback: boolean): boolean {
  const val = readStoredString(key)
  if (val === null) return fallback
  return val === 'true'
}

function readStoredVolume(): number {
  const raw = readStoredString(KEY_BGM_VOL)
  if (raw === null) return DEFAULT_BGM_VOLUME
  const parsed = Number.parseFloat(raw)
  if (!Number.isFinite(parsed)) return DEFAULT_BGM_VOLUME
  return Math.max(0, Math.min(1, parsed))
}

function readStoredMode(): BgmMode {
  return readStoredString(KEY_BGM_MODE) === 'manual' ? 'manual' : 'auto-phase'
}

function readStoredTrack(): BgmTrackId {
  const saved = readStoredString(KEY_BGM_TRACK) as BgmTrackId | null
  if (saved && BGM_TRACKS.some((t) => t.id === saved)) return saved
  return 'passionate-duelist'
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
  private bgmMode: BgmMode = readStoredMode()
  private activeTrackId: BgmTrackId = readStoredTrack()
  private currentPhase: PortfolioAudioPhase = 'standby'

  private cache: Record<string, HTMLAudioElement> = {}
  private audioCtx: AudioContext | null = null
  private rawSfxBytes: Record<string, ArrayBuffer> = {}
  private sfxBuffers: Record<string, AudioBuffer> = {}
  private sfxDecoding: Record<string, boolean> = {}

  private loopAudio: HTMLAudioElement | null = null
  private loopTrackId: BgmTrackId | null = null
  private splashAudio: HTMLAudioElement | null = null
  private fadeTimer: number | null = null
  private duckTimer: number | null = null
  private splashPending = false
  private inSplashStage = true
  private splashEnded = false
  private userPickedLoopOnSplash = false

  constructor() {
    if (typeof window === 'undefined') return
    this.warmAssets()
  }

  private warmAssets(): void {
    try {
      const splash = new Audio(SPLASH_INTRO_SRC)
      splash.loop = false
      splash.preload = 'auto'
      splash.addEventListener('ended', () => {
        this.splashEnded = true
      })
      splash.load()
      this.splashAudio = splash
    } catch {
      // Ignore environments without HTMLAudioElement
    }

    for (const url of SFX_URLS) {
      try {
        const el = new Audio(url)
        el.preload = 'auto'
        el.load()
        this.cache[url] = el
      } catch {
        // Ignore environments without HTMLAudioElement
      }

      if (typeof window.fetch === 'function') {
        void window
          .fetch(url)
          .then((res) => (res.ok ? res.arrayBuffer() : null))
          .then((buf) => {
            if (!buf) return
            this.rawSfxBytes[url] = buf
            if (this.audioCtx) {
              this.decodeSfxUrl(url)
            }
          })
          .catch(() => {
            // HTMLAudio fallback stays ready
          })
      }
    }
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      try {
        this.audioCtx = new Ctor()
      } catch {
        return null
      }
    }
    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume().catch(() => {
        // Autoplay gated until user gesture
      })
    }
    this.decodeAllSfxBuffers()
    return this.audioCtx
  }

  private decodeAllSfxBuffers(): void {
    for (const url of SFX_URLS) {
      this.decodeSfxUrl(url)
    }
  }

  private decodeSfxUrl(url: string): void {
    const ctx = this.audioCtx
    const raw = this.rawSfxBytes[url]
    if (!ctx || !raw || this.sfxBuffers[url] || this.sfxDecoding[url]) return
    this.sfxDecoding[url] = true
    try {
      void ctx
        .decodeAudioData(raw.slice(0))
        .then((decoded) => {
          this.sfxBuffers[url] = decoded
          this.sfxDecoding[url] = false
        })
        .catch(() => {
          this.sfxDecoding[url] = false
        })
    } catch {
      this.sfxDecoding[url] = false
    }
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled
  }

  public setSfxEnabled(next: boolean): void {
    this.sfxEnabled = next
    writeStored(KEY_SFX, String(next))
    if (next) {
      this.unlockAudio()
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
      this.splashPending = false
      this.stopAllBgm()
    } else {
      if (this.bgmVolume <= 0) {
        this.bgmVolume = DEFAULT_BGM_VOLUME
        writeStored(KEY_BGM_VOL, String(DEFAULT_BGM_VOLUME))
      }
      if (this.inSplashStage && !this.userPickedLoopOnSplash && !this.splashEnded) {
        this.playSplashIntro()
      } else {
        this.startLoopTrack(this.activeTrackId)
      }
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
      this.stopAllBgm()
      return
    }

    if (this.bgmMuted) {
      this.bgmMuted = false
      writeStored(KEY_BGM_MUTED, 'false')
    }

    this.clearFade()
    this.clearDuck()
    const splashPlaying = Boolean(this.splashAudio && !this.splashAudio.paused && !this.splashAudio.ended)
    const loopPlaying = Boolean(this.loopAudio && !this.loopAudio.paused)

    if (splashPlaying && this.splashAudio) {
      this.splashAudio.volume = Math.min(1, clamped + 0.05)
    }
    if (loopPlaying && this.loopAudio) {
      this.loopAudio.volume = clamped
    }
    if (!splashPlaying && !loopPlaying) {
      if (this.inSplashStage && !this.userPickedLoopOnSplash && !this.splashEnded) {
        this.playSplashIntro()
      } else {
        this.startLoopTrack(this.activeTrackId)
      }
    }
  }

  public getBgmMode(): BgmMode {
    return this.bgmMode
  }

  public setBgmMode(mode: BgmMode): void {
    this.bgmMode = mode
    writeStored(KEY_BGM_MODE, mode)
    if (mode === 'auto-phase') {
      const target = PHASE_BGM_MAP[this.currentPhase]
      if (!this.inSplashStage || this.userPickedLoopOnSplash) {
        this.crossfadeToTrack(target)
      } else {
        this.activeTrackId = target
        writeStored(KEY_BGM_TRACK, target)
      }
    }
  }

  public getActiveTrackId(): BgmTrackId {
    return this.activeTrackId
  }

  public selectTrack(trackId: BgmTrackId): void {
    this.bgmMode = 'manual'
    this.activeTrackId = trackId
    if (this.inSplashStage) {
      this.userPickedLoopOnSplash = true
    }
    writeStored(KEY_BGM_MODE, 'manual')
    writeStored(KEY_BGM_TRACK, trackId)
    this.stopSplashIntro()
    this.crossfadeToTrack(trackId)
  }

  public isEnabled(): boolean {
    return this.sfxEnabled
  }

  public setEnabled(next: boolean): void {
    this.setSfxEnabled(next)
    this.setBgmMuted(!next)
  }

  public enterSplashStage(): void {
    this.inSplashStage = true
    this.splashEnded = false
    this.userPickedLoopOnSplash = false
    this.pauseLoopBgm()
    this.playSplashIntro()
  }

  public leaveSplashStage(): void {
    this.inSplashStage = false
    this.userPickedLoopOnSplash = false
    this.stopSplashIntro()
  }

  public unlockAudio(): void {
    this.ensureAudioContext()
    if (this.bgmMuted || this.bgmVolume <= 0) return
    if (this.inSplashStage && !this.userPickedLoopOnSplash) {
      if (this.splashPending && !this.splashEnded) {
        this.playSplashIntro()
      }
    } else {
      this.ensureBgmPlaying()
    }
  }

  public playSplashIntro(): void {
    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') return
    this.pauseLoopBgm()

    try {
      if (!this.splashAudio) {
        const audio = new Audio(SPLASH_INTRO_SRC)
        audio.loop = false
        audio.preload = 'auto'
        audio.addEventListener('ended', () => {
          this.splashEnded = true
        })
        this.splashAudio = audio
      }

      if (!this.splashAudio.paused && !this.splashAudio.ended) return
      this.splashEnded = false
      this.splashAudio.currentTime = 0
      this.splashAudio.volume = Math.min(1, this.bgmVolume + 0.05)

      void this.splashAudio
        .play()
        .then(() => {
          this.splashPending = false
        })
        .catch(() => {
          this.splashPending = true
        })
    } catch {
      // Ignore environments without HTMLAudioElement
    }
  }

  public resumePendingSplashIfNeeded(): void {
    this.unlockAudio()
  }

  public stopSplashIntro(): void {
    this.splashPending = false
    this.clearDuck()
    if (this.splashAudio) {
      try {
        this.splashAudio.pause()
        this.splashAudio.currentTime = 0
      } catch {
        // ignore pause failure
      }
    }
  }

  public setPhaseBgm(phase: PortfolioAudioPhase): void {
    this.inSplashStage = false
    this.userPickedLoopOnSplash = false
    this.currentPhase = phase
    this.stopSplashIntro()
    const targetTrack = this.bgmMode === 'auto-phase' ? PHASE_BGM_MAP[phase] : this.activeTrackId
    if (this.loopTrackId === targetTrack && this.loopAudio && !this.loopAudio.paused) {
      return
    }
    this.crossfadeToTrack(targetTrack)
  }

  public ensureBgmPlaying(): void {
    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') return
    if (this.inSplashStage && !this.userPickedLoopOnSplash) {
      if (this.splashPending && !this.splashEnded) {
        this.playSplashIntro()
      }
      return
    }
    if (this.splashAudio && !this.splashAudio.paused && !this.splashAudio.ended) return
    if (this.loopAudio && !this.loopAudio.paused) return
    this.startLoopTrack(this.activeTrackId)
  }

  private clearFade(): void {
    if (this.fadeTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.fadeTimer)
      this.fadeTimer = null
    }
  }

  private clearDuck(): void {
    if (this.duckTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.duckTimer)
      this.duckTimer = null
    }
  }

  private duckSplashBriefly(durationMs = 1900): void {
    if (typeof window === 'undefined' || !this.splashAudio) return
    if (this.splashAudio.paused || this.splashAudio.ended) return
    this.clearDuck()
    this.splashAudio.volume = Math.max(0.05, this.bgmVolume * 0.45)
    this.duckTimer = window.setTimeout(() => {
      this.duckTimer = null
      if (this.splashAudio && !this.splashAudio.paused && !this.bgmMuted) {
        this.splashAudio.volume = Math.min(1, this.bgmVolume + 0.05)
      }
    }, durationMs)
  }

  private crossfadeToTrack(trackId: BgmTrackId): void {
    this.activeTrackId = trackId
    writeStored(KEY_BGM_TRACK, trackId)

    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') {
      this.pauseLoopBgm()
      return
    }

    if (this.loopTrackId === trackId && this.loopAudio && !this.loopAudio.paused) {
      return
    }

    const oldAudio = this.loopAudio
    this.clearFade()

    if (oldAudio && !oldAudio.paused) {
      const startVol = oldAudio.volume
      let step = 0
      const outSteps = 7
      this.fadeTimer = window.setInterval(() => {
        step += 1
        oldAudio.volume = Math.max(0, startVol * (1 - step / outSteps))
        if (step >= outSteps) {
          this.clearFade()
          try {
            oldAudio.pause()
          } catch {
            // ignore
          }
          this.startLoopTrack(trackId)
        }
      }, 40)
    } else {
      this.startLoopTrack(trackId)
    }
  }

  private startLoopTrack(trackId: BgmTrackId): void {
    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') return
    const meta = BGM_TRACKS.find((t) => t.id === trackId) ?? BGM_TRACKS[0]
    this.activeTrackId = meta.id

    try {
      if (!this.loopAudio || this.loopTrackId !== meta.id) {
        if (this.loopAudio) {
          try {
            this.loopAudio.pause()
          } catch {
            // ignore
          }
        }
        const nextAudio = new Audio(meta.src)
        nextAudio.loop = true
        nextAudio.preload = 'auto'
        nextAudio.volume = 0
        this.loopAudio = nextAudio
        this.loopTrackId = meta.id
      }

      const audio = this.loopAudio
      const target = this.bgmVolume
      this.clearFade()
      audio.volume = 0
      void audio
        .play()
        .then(() => {
          let step = 0
          const inSteps = 10
          this.fadeTimer = window.setInterval(() => {
            if (this.bgmMuted || !this.loopAudio || this.loopAudio !== audio) {
              this.clearFade()
              return
            }
            step += 1
            audio.volume = Math.min(this.bgmVolume, (target * step) / inSteps)
            if (step >= inSteps) {
              this.clearFade()
            }
          }, 42)
        })
        .catch(() => {
          // Wait until user gesture
        })
    } catch {
      // Ignore environments without HTMLAudioElement
    }
  }

  private pauseLoopBgm(): void {
    this.clearFade()
    if (this.loopAudio) {
      try {
        this.loopAudio.pause()
      } catch {
        // ignore
      }
    }
  }

  private stopAllBgm(): void {
    this.clearFade()
    this.stopSplashIntro()
    this.pauseLoopBgm()
  }

  private play(src: string, volume = 0.85): void {
    if (!this.sfxEnabled || typeof window === 'undefined') return
    const clampedVol = Math.max(0, Math.min(1, volume))
    const ctx = this.ensureAudioContext()
    const buffer = this.sfxBuffers[src]

    if (ctx && buffer) {
      try {
        const source = ctx.createBufferSource()
        const gain = ctx.createGain()
        source.buffer = buffer
        gain.gain.value = clampedVol
        source.connect(gain)
        gain.connect(ctx.destination)
        source.start(0)
        return
      } catch {
        // Fallback to preloaded HTMLAudioElement below
      }
    }

    try {
      let base = this.cache[src]
      if (!base) {
        base = new Audio(src)
        base.preload = 'auto'
        this.cache[src] = base
      }
      const clip =
        !base.paused && !base.ended ? (base.cloneNode(true) as HTMLAudioElement) : base
      clip.currentTime = 0
      clip.volume = clampedVol
      void clip.play().catch(() => {
        // Ignore browser autoplay gate
      })
    } catch {
      // Ignore environments without HTMLAudioElement
    }
  }

  public playPull(): void {
    this.unlockAudio()
    this.play('/sfx/card-pull.mp3', 1.0)
  }

  public playReveal(): void {
    this.unlockAudio()
    this.duckSplashBriefly(1900)
    this.play('/sfx/card-reveal.mp3', 1.0)
  }

  public playFlip(): void {
    this.unlockAudio()
    if (!this.inSplashStage) {
      this.ensureBgmPlaying()
    }
    this.play('/sfx/card-pull.mp3', 0.78)
  }

  public playHover(): void {
    this.unlockAudio()
    if (!this.inSplashStage) {
      this.ensureBgmPlaying()
    }
    this.play('/sfx/card-hover.mp3', 0.55)
  }
}

export const duelSfx = new DeckAudioEngine()
