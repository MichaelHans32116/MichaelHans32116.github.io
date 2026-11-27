import { ACHIEVEMENT_CARDS } from './achievements'
import { PROJECT_CARDS } from './projects'
import { REFERENCE_CARDS } from './references'
import { DeckCardItem } from './types'

export * from './types'
export { DECK_BOX_COVERS, EDUCATION_INFO, PROFILE, STANDOUT_HIGHLIGHTS } from './profile'
export { PROJECT_CARDS, SIDE_WORK_ARCHIVE } from './projects'
export { ACHIEVEMENT_CARDS } from './achievements'
export { REFERENCE_CARDS } from './references'
export { EXPERIENCE_HIGHLIGHTS, OJT_EXPERIENCE_PHOTOS } from './experience'
export { LIFE_DECKS } from './lifeDecks'
export { PORTFOLIO_TOUR_KEY, TOUR_STEPS_BY_PHASE } from './tourSteps'

export const DECK_CARDS: DeckCardItem[] = [
  ...PROJECT_CARDS,
  ...ACHIEVEMENT_CARDS,
  ...REFERENCE_CARDS,
]
