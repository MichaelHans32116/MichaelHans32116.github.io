import bpExperienceDarkPreview from '../../images/phase-previews/bp-experience-dark.png'
import bpExperiencePreview from '../../images/phase-previews/bp-experience.png'
import dpDrawDarkPreview from '../../images/phase-previews/dp-draw-dark.png'
import dpDrawPreview from '../../images/phase-previews/dp-draw.png'
import epContactDarkPreview from '../../images/phase-previews/ep-contact-dark.png'
import epContactPreview from '../../images/phase-previews/ep-contact.png'
import mp1DeckDarkPreview from '../../images/phase-previews/mp1-deck-dark.png'
import mp1DeckPreview from '../../images/phase-previews/mp1-deck.png'
import mp2AboutDarkPreview from '../../images/phase-previews/mp2-about-dark.png'
import mp2AboutPreview from '../../images/phase-previews/mp2-about.png'
import spHomeDarkPreview from '../../images/phase-previews/sp-home-dark.png'
import spHomePreview from '../../images/phase-previews/sp-home.png'
import { PortfolioPhase } from '../../data'

export type { PortfolioPhase }

export interface PhaseCardItem {
  id: 'draw' | PortfolioPhase
  code: string
  label: string
  subtitle: string
  previewLightSrc: string
  previewDarkSrc: string
  accent: string
}

const customPhaseGlob = import.meta.glob('../../cards/phases/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export function findCustomPhaseCardUrl(id: string): string | undefined {
  for (const [path, url] of Object.entries(customPhaseGlob)) {
    const filename = path.split('/').pop()?.toLowerCase() || ''
    const stem = filename.replace(/\.[^.]+$/, '')
    if (stem === id.toLowerCase()) return url
  }
  return undefined
}

export const PHASE_CARDS: PhaseCardItem[] = [
  {
    id: 'draw',
    code: 'DP',
    label: 'Draw Phase',
    subtitle: 'Pull Card Intro',
    previewLightSrc: dpDrawPreview,
    previewDarkSrc: dpDrawDarkPreview,
    accent: '#475569',
  },
  {
    id: 'standby',
    code: 'SP',
    label: 'Home',
    subtitle: 'Standby & Profile',
    previewLightSrc: spHomePreview,
    previewDarkSrc: spHomeDarkPreview,
    accent: '#2563eb',
  },
  {
    id: 'main',
    code: 'MP1',
    label: 'Deck',
    subtitle: 'Main & Side Deck',
    previewLightSrc: mp1DeckPreview,
    previewDarkSrc: mp1DeckDarkPreview,
    accent: '#0f766e',
  },
  {
    id: 'battle',
    code: 'BP',
    label: 'Experience',
    subtitle: 'Internship & Field Work',
    previewLightSrc: bpExperiencePreview,
    previewDarkSrc: bpExperienceDarkPreview,
    accent: '#9d174d',
  },
  {
    id: 'main2',
    code: 'MP2',
    label: 'About Me',
    subtitle: 'Faith, Friends & Hobbies',
    previewLightSrc: mp2AboutPreview,
    previewDarkSrc: mp2AboutDarkPreview,
    accent: '#4f46e5',
  },
  {
    id: 'end',
    code: 'EP',
    label: 'Contact',
    subtitle: 'Send Message & Links',
    previewLightSrc: epContactPreview,
    previewDarkSrc: epContactDarkPreview,
    accent: '#334155',
  },
]

export function getVisibleCount(width: number): number {
  if (width < 520) return 1
  if (width < 768) return 2
  if (width < 980) return 3
  if (width < 1240) return 4
  return 5
}

export function computeVisibleCountForDock(containerWidth: number, viewportWidth: number): number {
  if (containerWidth <= 0) return getVisibleCount(viewportWidth)
  const isSm = viewportWidth >= 640
  const isLg = viewportWidth >= 1024
  const arrowFootprint = isSm ? 48 * 2 + 32 : 36 * 2 + 16
  const cardWidth = isLg ? 158 : isSm ? 148 : Math.min(156, viewportWidth * 0.46)
  const gap = isSm ? 20 : 12
  const available = Math.max(0, containerWidth - arrowFootprint - 12)
  const fit = Math.floor((available + gap) / (cardWidth + gap))
  return Math.max(1, Math.min(PHASE_CARDS.length, fit))
}
