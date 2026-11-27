import { GuideTourStep, PortfolioPhase } from './types'

export const PORTFOLIO_TOUR_KEY = 'mh-portfolio-tour-v1'

export const TOUR_STEPS_BY_PHASE: Record<PortfolioPhase, GuideTourStep[]> = {
  standby: [
    {
      id: 'home-card',
      targetSelector: '#tour-hero-card',
      speaker: 'Hans',
      text: "Hey, I'm Hans! Tap my card anytime to flip it, or skim my intro right here.",
      fallbackSide: 'bottom',
      scrollTarget: true,
    },
    {
      id: 'home-toolkit',
      targetSelector: '#tour-toolkit-skills',
      speaker: 'Hans',
      text: 'Click any skill here and the proof panel beside it updates with the real systems I built.',
      fallbackSide: 'bottom',
      scrollTarget: true,
    },
    {
      id: 'home-dock',
      targetSelector: '#tour-phase-dock',
      speaker: 'Hans',
      text: 'Open Choose your tab here (or swipe left and right on mobile) for a 1-click jump to Deck, Experience, About Me, or Contact.',
      fallbackSide: 'top',
      scrollTarget: false,
    },
    {
      id: 'home-controls',
      targetSelector: '#tour-controls',
      speaker: 'Hans',
      text: 'Flip Light and Dark mode, switch Yu-Gi-Oh BGM tracks, or replay this walkthrough anytime up here.',
      fallbackSide: 'bottom',
      scrollTarget: false,
      isHeaderTarget: true,
    },
  ],
  main: [
    {
      id: 'deck-boxes',
      targetSelector: '#tour-deck-boxes',
      speaker: 'Hans',
      text: 'Pick any Deck Box here to filter Projects, Achievements, References, or Side Deck.',
      fallbackSide: 'bottom',
      scrollTarget: true,
    },
    {
      id: 'deck-cards',
      targetSelector: '#tour-deck-cards',
      speaker: 'Hans',
      text: 'Tap any Yu-Gi-Oh card to inspect screenshots, project details, and live links.',
      fallbackSide: 'bottom',
      scrollTarget: true,
    },
  ],
  battle: [
    {
      id: 'exp-list',
      targetSelector: '#tour-exp-list',
      speaker: 'Hans',
      text: 'Here is my internship delivery at Moriroku PH and full-stack engineering work on BuildBid.',
      fallbackSide: 'bottom',
      scrollTarget: true,
    },
    {
      id: 'exp-ojt',
      targetSelector: '#tour-ojt-strip',
      speaker: 'Hans',
      text: 'Click any Moriroku OJT photo to open the matching system or supervisor card.',
      fallbackSide: 'top',
      scrollTarget: true,
    },
  ],
  main2: [
    {
      id: 'about-boxes',
      targetSelector: '#tour-life-decks',
      speaker: 'Hans',
      text: 'Open any Life Deck box to browse church outreach, friends, Yuki, and hobbies.',
      fallbackSide: 'bottom',
      scrollTarget: true,
    },
  ],
  end: [
    {
      id: 'contact-form',
      targetSelector: '#tour-contact-form',
      speaker: 'Hans',
      text: 'Send a message straight to my inbox here, or copy my email and open Gmail Web.',
      fallbackSide: 'top',
      scrollTarget: true,
    },
  ],
}
