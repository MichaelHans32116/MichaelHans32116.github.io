export type DeckCategory = 'all' | 'projects' | 'achievements' | 'references' | 'side'
export type CardCategory = 'projects' | 'achievements' | 'references'
export type YgoCardFrame = 'trap' | 'spell' | 'monster'
export type VisualKind = 'logo' | 'screenshot' | 'badge-icon'
export type PortfolioPhase = 'standby' | 'main' | 'battle' | 'main2' | 'end'

export interface DeckLink {
  label: string
  url: string
  kind: 'live' | 'github' | 'mobile' | 'zip'
}

export interface DeckPreviewImage {
  src: string
  label: string
}

export interface DeckCardItem {
  id: string
  category: CardCategory
  ygoFrame: YgoCardFrame
  ygoTypeLine: string
  ygoSubHeader: string
  ygoAttribute?: 'LIGHT' | 'EARTH'
  ygoStars?: number
  ygoAtk?: string
  ygoDef?: string
  ygoSetCode: string
  typeTag: string
  title: string
  subtitle: string
  cardEffect: string
  visualKind: VisualKind
  imageSrc?: string
  previewImages?: DeckPreviewImage[]
  supportingImage?: string
  supportingCaption?: string
  videoSrc?: string
  period: string
  roleOrIssuer: string
  metricBadge?: string
  stack?: string[]
  details: {
    headingA: string
    bodyA: string
    headingB: string
    bodyB: string
    bullets: string[]
  }
  links: DeckLink[]
  note?: string
}

export interface SideWorkItem {
  id: string
  title: string
  role: string
  summary: string
  image: string
  links: DeckLink[]
}

export interface ExperienceHighlight {
  id: string
  role: string
  company: string
  location: string
  period: string
  badge: string
  points: string[]
}

export interface StandoutHighlight {
  id: string
  cardId: string
  title: string
  metric: string
  issuer: string
}

export interface ExperiencePhotoHighlight {
  id: string
  src: string
  label: string
  caption: string
  cardId: string
}

export interface LifeDeckPhoto {
  src: string
  title: string
  caption: string
  objectMode?: 'cover-top' | 'cover-center' | 'contain-art'
}

export interface LifeDeckItem {
  id: string
  title: string
  deckTypeLabel: string
  boxCode: string
  countSummary: string
  tagline: string
  story: string
  coverSrc: string
  coverMode?: 'cover-top' | 'cover-center' | 'contain-art'
  accent: string
  photos: LifeDeckPhoto[]
}

export interface GuideTourStep {
  id: string
  targetSelector: string
  speaker?: string
  text: string
  fallbackSide?: 'top' | 'bottom'
  scrollTarget?: boolean
  isHeaderTarget?: boolean
}
