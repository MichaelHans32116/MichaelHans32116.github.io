import {
  KEY_BGM_MODE,
  KEY_BGM_MUTED,
  KEY_BGM_TRACK,
  KEY_BGM_VOL,
  KEY_SFX,
  readStoredBool,
  readStoredMode,
  readStoredTrack,
  readStoredVolume,
  writeStored,
} from './storage'
import {
  BGM_TRACKS,
  BgmMode,
  BgmTrackId,
  DEFAULT_BGM_VOLUME,
  PHASE_BGM_MAP,
  PortfolioAudioPhase,
  SFX_HOVER_SRC,
  SFX_PULL_SRC,
  SFX_REVEAL_SRC,
  SFX_URLS,
  SPLASH_INTRO_SRC,
} from './tracks'

class DeckAudioEngine {
  private sfxEnabled: boolean = readStoredBool(KEY_SFX, true)
  private bgmMuted: boolean = readStoredBool(KEY_BGM_MUTED, false)
  private bgmVolume: number = readStoredVolume()
  private bgmMode: BgmMode = readStoredMode()
  private activeTrackId: BgmTrackId = readStoredTrack()
  private currentPhase: PortfolioAudioPhase = 'standby'

  private audioCtx: AudioContext | null = null
  private rawBytes: Record<string, ArrayBuffer> = {}
  private decodedBuffers: Record<string, AudioBuffer> = {}
  private fetchPromises: Record<string, Promise<ArrayBuffer | null> | undefined> = {}
  private decodePromises: Record<string, Promise<AudioBuffer | null> | undefined> = {}

  private loopSource: AudioBufferSourceNode | null = null
  private loopGain: GainNode | null = null
  private loopTrackId: BgmTrackId | null = null
  private loopPlaying = false
  private loopPending = false
  private loopRequestId = 0

  private splashSource: AudioBufferSourceNode | null = null
  private splashGain: GainNode | null = null
  private splashPlaying = false
  private splashPlayId = 0
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
    // Only warm the small SFX and splash payloads via fetch() to avoid heavy BGM fetches on load
    for (const url of SFX_URLS) {
      void this.fetchRaw(url)
    }
    void this.fetchRaw(SPLASH_INTRO_SRC)
  }

  private fetchRaw(url: string): Promise<ArrayBuffer | null> {
    if (this.rawBytes[url]) {
      return Promise.resolve(this.rawBytes[url])
    }
    const existing = this.fetchPromises[url]
    if (existing) return existing
    if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
      return Promise.resolve(null)
    }
    const promise = window
      .fetch(url)
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((buf) => {
        if (buf) {
          this.rawBytes[url] = buf
        }
        return buf
      })
      .catch(() => null)
      .finally(() => {
        delete this.fetchPromises[url]
      })
    this.fetchPromises[url] = promise
    return promise
  }

  private async loadBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.decodedBuffers[url]) {
      return this.decodedBuffers[url]
    }
    const existingDecode = this.decodePromises[url]
    if (existingDecode) return existingDecode

    const promise = (async () => {
      const raw = await this.fetchRaw(url)
      const ctx = this.ensureAudioContext()
      if (!raw || !ctx) return null
      try {
        const decoded = await ctx.decodeAudioData(raw.slice(0))
        this.decodedBuffers[url] = decoded
        return decoded
      } catch {
        return null
      }
    })().finally(() => {
      delete this.decodePromises[url]
    })

    this.decodePromises[url] = promise
    return promise
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
    return this.audioCtx
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled
  }

  public setSfxEnabled(next: boolean): void {
    this.sfxEnabled = next
    writeStored(KEY_SFX, String(next))
    if (next) {
      this.unlockAudio()
      this.play(SFX_HOVER_SRC, 0.55)
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
      this.loopPending = false
      this.stopAllBgm()
    } else {
      if (this.bgmVolume <= 0) {
        this.bgmVolume = DEFAULT_BGM_VOLUME
        writeStored(KEY_BGM_VOL, String(DEFAULT_BGM_VOLUME))
      }
      if (this.inSplashStage && !this.userPickedLoopOnSplash && !this.splashEnded) {
        this.playSplashIntro()
      } else {
        this.startLoopTrack(this.activeTrackId, false)
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

    this.clearDuck()
    const now = this.audioCtx?.currentTime ?? 0

    if (this.splashPlaying && this.splashGain && this.audioCtx) {
      this.splashGain.gain.cancelScheduledValues(now)
      this.splashGain.gain.setValueAtTime(Math.min(1, clamped + 0.05), now)
    }
    if (this.loopPlaying && this.loopGain && this.audioCtx) {
      this.loopGain.gain.cancelScheduledValues(now)
      this.loopGain.gain.setValueAtTime(clamped, now)
    }
    if (!this.splashPlaying && !this.loopPlaying) {
      if (this.inSplashStage && !this.userPickedLoopOnSplash && !this.splashEnded) {
        this.playSplashIntro()
      } else {
        this.startLoopTrack(this.activeTrackId, false)
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
    this.stopLoopNode(0)
    this.playSplashIntro()
  }

  public leaveSplashStage(): void {
    this.inSplashStage = false
    this.userPickedLoopOnSplash = false
    this.stopSplashIntro()
  }

  public unlockAudio(): void {
    const ctx = this.ensureAudioContext()
    const onReady = () => {
      if (this.bgmMuted || this.bgmVolume <= 0) return
      if (this.inSplashStage && !this.userPickedLoopOnSplash) {
        if (this.splashPending && !this.splashEnded) {
          this.playSplashIntro()
        }
      } else {
        this.ensureBgmPlaying()
      }
    }

    if (ctx && ctx.state === 'suspended') {
      void ctx
        .resume()
        .then(onReady)
        .catch(() => {
          // Still awaiting gesture
        })
      return
    }
    onReady()
  }

  public playSplashIntro(): void {
    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') return
    this.stopLoopNode(0)
    if (this.splashPlaying) return

    const ctx = this.ensureAudioContext()
    void this.loadBuffer(SPLASH_INTRO_SRC)

    if (!ctx || ctx.state !== 'running') {
      this.splashPending = true
      if (ctx) {
        void ctx
          .resume()
          .then(() => {
            if (
              this.splashPending &&
              this.inSplashStage &&
              !this.userPickedLoopOnSplash &&
              !this.bgmMuted &&
              !this.splashEnded
            ) {
              this.splashPending = false
              this.playSplashIntro()
            }
          })
          .catch(() => {
            // Autoplay gated until user gesture
          })
      }
      return
    }

    const playId = ++this.splashPlayId
    this.splashEnded = false
    this.splashPending = false

    void this.loadBuffer(SPLASH_INTRO_SRC).then((buffer) => {
      if (
        !buffer ||
        playId !== this.splashPlayId ||
        this.bgmMuted ||
        this.bgmVolume <= 0 ||
        !this.inSplashStage ||
        this.userPickedLoopOnSplash ||
        !this.audioCtx ||
        this.audioCtx.state !== 'running'
      ) {
        return
      }

      try {
        const source = this.audioCtx.createBufferSource()
        const gain = this.audioCtx.createGain()
        source.buffer = buffer
        source.loop = false
        gain.gain.setValueAtTime(Math.min(1, this.bgmVolume + 0.05), this.audioCtx.currentTime)
        source.connect(gain)
        gain.connect(this.audioCtx.destination)

        source.onended = () => {
          if (playId === this.splashPlayId) {
            this.splashPlaying = false
            this.splashEnded = true
            this.splashSource = null
            this.splashGain = null
          }
          try {
            source.disconnect()
            gain.disconnect()
          } catch {
            // ignore cleanup errors
          }
        }

        this.splashSource = source
        this.splashGain = gain
        this.splashPlaying = true
        source.start(0)
      } catch {
        this.splashPlaying = false
      }
    })
  }

  public resumePendingSplashIfNeeded(): void {
    this.unlockAudio()
  }

  public stopSplashIntro(): void {
    this.splashPlayId += 1
    this.splashPending = false
    this.splashPlaying = false
    this.clearDuck()

    const source = this.splashSource
    const gain = this.splashGain
    this.splashSource = null
    this.splashGain = null

    if (source) {
      try {
        source.onended = null
        source.stop()
        source.disconnect()
      } catch {
        // ignore stop errors
      }
    }
    if (gain) {
      try {
        gain.disconnect()
      } catch {
        // ignore disconnect errors
      }
    }
  }

  public setPhaseBgm(phase: PortfolioAudioPhase): void {
    this.inSplashStage = false
    this.userPickedLoopOnSplash = false
    this.currentPhase = phase
    this.stopSplashIntro()
    const targetTrack = this.bgmMode === 'auto-phase' ? PHASE_BGM_MAP[phase] : this.activeTrackId
    if (this.loopTrackId === targetTrack && this.loopPlaying) {
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
    if (this.splashPlaying || this.loopPlaying) return
    this.startLoopTrack(this.activeTrackId, false)
  }

  private clearDuck(): void {
    if (this.duckTimer !== null && typeof window !== 'undefined') {
      window.clearTimeout(this.duckTimer)
      this.duckTimer = null
    }
  }

  private duckSplashBriefly(durationMs = 1900): void {
    if (typeof window === 'undefined' || !this.splashPlaying || !this.splashGain || !this.audioCtx) {
      return
    }
    this.clearDuck()
    const now = this.audioCtx.currentTime
    const ducked = Math.max(0.05, this.bgmVolume * 0.45)
    this.splashGain.gain.cancelScheduledValues(now)
    this.splashGain.gain.setValueAtTime(this.splashGain.gain.value, now)
    this.splashGain.gain.linearRampToValueAtTime(ducked, now + 0.08)

    this.duckTimer = window.setTimeout(() => {
      this.duckTimer = null
      if (this.splashPlaying && this.splashGain && this.audioCtx && !this.bgmMuted) {
        const t = this.audioCtx.currentTime
        this.splashGain.gain.cancelScheduledValues(t)
        this.splashGain.gain.setValueAtTime(this.splashGain.gain.value, t)
        this.splashGain.gain.linearRampToValueAtTime(Math.min(1, this.bgmVolume + 0.05), t + 0.22)
      }
    }, durationMs)
  }

  private crossfadeToTrack(trackId: BgmTrackId): void {
    this.activeTrackId = trackId
    writeStored(KEY_BGM_TRACK, trackId)

    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') {
      this.stopLoopNode(0)
      return
    }

    if (this.loopTrackId === trackId && this.loopPlaying) {
      return
    }

    this.startLoopTrack(trackId, true)
  }

  private startLoopTrack(trackId: BgmTrackId, fadeOutOld = false): void {
    if (this.bgmMuted || this.bgmVolume <= 0 || typeof window === 'undefined') return
    const meta = BGM_TRACKS.find((t) => t.id === trackId) ?? BGM_TRACKS[0]
    this.activeTrackId = meta.id

    const reqId = ++this.loopRequestId
    const ctx = this.ensureAudioContext()
    if (!ctx) return

    if (ctx.state !== 'running') {
      void this.loadBuffer(meta.src)
      this.loopPending = true
      void ctx
        .resume()
        .then(() => {
          if (
            this.loopPending &&
            !this.bgmMuted &&
            this.bgmVolume > 0 &&
            (!this.inSplashStage || this.userPickedLoopOnSplash)
          ) {
            this.loopPending = false
            this.startLoopTrack(this.activeTrackId, false)
          }
        })
        .catch(() => {
          // Wait until user gesture
        })
      return
    }

    void this.loadBuffer(meta.src).then((buffer) => {
      if (
        !buffer ||
        reqId !== this.loopRequestId ||
        this.bgmMuted ||
        this.bgmVolume <= 0 ||
        (this.inSplashStage && !this.userPickedLoopOnSplash) ||
        !this.audioCtx ||
        this.audioCtx.state !== 'running'
      ) {
        return
      }

      this.stopLoopNode(fadeOutOld ? 0.28 : 0)

      try {
        const now = this.audioCtx.currentTime
        const source = this.audioCtx.createBufferSource()
        const gain = this.audioCtx.createGain()
        source.buffer = buffer
        source.loop = true
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.linearRampToValueAtTime(this.bgmVolume, now + 0.42)
        source.connect(gain)
        gain.connect(this.audioCtx.destination)

        this.loopSource = source
        this.loopGain = gain
        this.loopTrackId = meta.id
        this.loopPlaying = true
        this.loopPending = false
        source.start(0)
      } catch {
        this.loopPlaying = false
      }
    })
  }

  private stopLoopNode(fadeOutSec = 0): void {
    const oldSource = this.loopSource
    const oldGain = this.loopGain
    this.loopSource = null
    this.loopGain = null
    this.loopPlaying = false

    if (!oldSource) {
      if (oldGain) {
        try {
          oldGain.disconnect()
        } catch {
          // ignore
        }
      }
      return
    }

    if (fadeOutSec > 0 && oldGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime
        oldGain.gain.cancelScheduledValues(now)
        oldGain.gain.setValueAtTime(Math.max(0.0001, oldGain.gain.value), now)
        oldGain.gain.linearRampToValueAtTime(0.0001, now + fadeOutSec)
        window.setTimeout(() => {
          try {
            oldSource.stop()
            oldSource.disconnect()
            oldGain.disconnect()
          } catch {
            // ignore
          }
        }, Math.round((fadeOutSec + 0.05) * 1000))
        return
      } catch {
        // Fall through to immediate stop
      }
    }

    try {
      oldSource.stop()
      oldSource.disconnect()
    } catch {
      // ignore
    }
    if (oldGain) {
      try {
        oldGain.disconnect()
      } catch {
        // ignore
      }
    }
  }

  private stopAllBgm(): void {
    this.loopRequestId += 1
    this.stopSplashIntro()
    this.stopLoopNode(0)
  }

  private play(src: string, volume = 0.85): void {
    if (!this.sfxEnabled || typeof window === 'undefined') return
    const clampedVol = Math.max(0, Math.min(1, volume))
    const ctx = this.ensureAudioContext()
    if (!ctx) return

    const playBuffer = (buffer: AudioBuffer) => {
      if (!this.audioCtx || !this.sfxEnabled) return
      try {
        const source = this.audioCtx.createBufferSource()
        const gain = this.audioCtx.createGain()
        source.buffer = buffer
        gain.gain.value = clampedVol
        source.connect(gain)
        gain.connect(this.audioCtx.destination)
        source.start(0)
      } catch {
        // Ignore AudioBuffer playback errors
      }
    }

    const cached = this.decodedBuffers[src]
    if (cached) {
      playBuffer(cached)
      return
    }

    void this.loadBuffer(src).then((buffer) => {
      if (buffer && this.sfxEnabled && this.audioCtx) {
        playBuffer(buffer)
      }
    })
  }

  public playPull(): void {
    this.unlockAudio()
    this.play(SFX_PULL_SRC, 1.0)
  }

  public playReveal(): void {
    this.unlockAudio()
    this.duckSplashBriefly(1900)
    this.play(SFX_REVEAL_SRC, 1.0)
  }

  public playFlip(): void {
    this.unlockAudio()
    if (!this.inSplashStage) {
      this.ensureBgmPlaying()
    }
    this.play(SFX_PULL_SRC, 0.78)
  }

  public playHover(): void {
    this.unlockAudio()
    if (!this.inSplashStage) {
      this.ensureBgmPlaying()
    }
    this.play(SFX_HOVER_SRC, 0.55)
  }
}

export const duelSfx = new DeckAudioEngine()
