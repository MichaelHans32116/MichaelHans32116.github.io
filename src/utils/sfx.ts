// Clean MP3 sound + Passionate Duelist OST engine using real files from public/sfx/ (muted by default).
// Fails gracefully if the user hasn't dropped MP3 files yet — zero synthetic beeps.

const BGM_SRC = '/sfx/passionate-duelist.mp3'
const BGM_TARGET_VOLUME = 0.22

class DeckAudioEngine {
  private enabled = false
  private cache: Record<string, HTMLAudioElement> = {}
  private bgm: HTMLAudioElement | null = null
  private fadeTimer: number | null = null

  public isEnabled(): boolean {
    return this.enabled
  }

  public setEnabled(next: boolean): void {
    this.enabled = next
    if (next) {
      this.play('/sfx/card-hover.mp3', 0.35)
      this.startBgm()
    } else {
      this.stopBgm()
    }
  }

  public ensureBgmPlaying(): void {
    if (!this.enabled || typeof window === 'undefined') return
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
    if (!this.enabled || typeof window === 'undefined') return
    try {
      if (!this.bgm) {
        const audio = new Audio(BGM_SRC)
        audio.loop = true
        audio.preload = 'auto'
        audio.volume = 0
        this.bgm = audio
      }

      const audio = this.bgm
      this.clearFade()
      audio.volume = 0
      void audio
        .play()
        .then(() => {
          let step = 0
          const steps = 15 // ~600ms smooth fade-in
          this.fadeTimer = window.setInterval(() => {
            if (!this.enabled || !this.bgm) {
              this.clearFade()
              return
            }
            step += 1
            const nextVol = Math.min(BGM_TARGET_VOLUME, (BGM_TARGET_VOLUME * step) / steps)
            this.bgm.volume = nextVol
            if (step >= steps) {
              this.clearFade()
            }
          }, 40)
        })
        .catch(() => {
          // Ignore missing BGM file or browser autoplay restriction until next user gesture
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

  private play(src: string, volume = 0.65): void {
    if (!this.enabled || typeof window === 'undefined') return
    try {
      let base = this.cache[src]
      if (!base) {
        base = new Audio(src)
        base.preload = 'auto'
        this.cache[src] = base
      }
      const clip = base.cloneNode(true) as HTMLAudioElement
      clip.volume = volume
      void clip.play().catch(() => {
        // Ignore missing audio file or browser autoplay restriction silently
      })
    } catch {
      // Ignore environments without HTMLAudioElement
    }
  }

  public playPull(): void {
    this.ensureBgmPlaying()
    this.play('/sfx/card-pull.mp3', 0.72)
  }

  public playReveal(): void {
    this.ensureBgmPlaying()
    this.play('/sfx/card-reveal.mp3', 0.75)
  }

  public playFlip(): void {
    this.ensureBgmPlaying()
    this.play('/sfx/card-pull.mp3', 0.5)
  }

  public playHover(): void {
    this.ensureBgmPlaying()
    this.play('/sfx/card-hover.mp3', 0.35)
  }
}

export const duelSfx = new DeckAudioEngine()
