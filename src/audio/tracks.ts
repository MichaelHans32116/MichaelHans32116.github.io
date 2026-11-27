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
    subtitle: 'ARC-V (Home / Strategy)',
    src: '/sfx/arcv-unstable-thought.dat',
  },
  {
    id: 'passionate-duelist',
    label: 'Passionate Duelist',
    subtitle: 'DM Classic (The Deck)',
    src: '/sfx/passionate-duelist.dat',
  },
  {
    id: 'zone-5ds',
    label: 'Z-ONE Remix',
    subtitle: "5D's (Battle / Experience)",
    src: '/sfx/zone-5ds-remix.dat',
  },
  {
    id: 'resistance',
    label: 'Resistance',
    subtitle: 'ARC-V (Contact / Closer)',
    src: '/sfx/arcv-resistance.dat',
  },
  {
    id: 'gods-anger',
    label: "God's Anger",
    subtitle: 'Egyptian God (Bonus Theme)',
    src: '/sfx/gods-anger.dat',
  },
]

export const PHASE_BGM_MAP: Record<PortfolioAudioPhase, BgmTrackId> = {
  standby: 'unstable-thought',
  main: 'passionate-duelist',
  battle: 'zone-5ds',
  main2: 'unstable-thought',
  end: 'resistance',
}

export const SPLASH_INTRO_SRC = '/sfx/trump-card-intro.dat'
export const SFX_HOVER_SRC = '/sfx/card-hover.dat'
export const SFX_PULL_SRC = '/sfx/card-pull.dat'
export const SFX_REVEAL_SRC = '/sfx/card-reveal.dat'
export const SFX_URLS = [SFX_HOVER_SRC, SFX_PULL_SRC, SFX_REVEAL_SRC] as const
export const DEFAULT_BGM_VOLUME = 0.25
