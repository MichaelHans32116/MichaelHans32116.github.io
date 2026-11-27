import React from 'react'
import { Download, ExternalLink, Github } from 'lucide-react'
import { DeckCard } from '../components/DeckCard'
import { DuelDeckBoxCard } from '../components/DuelDeckBoxCard'
import { duelSfx } from '../audio'
import {
  DECK_BOX_COVERS,
  DECK_CARDS,
  DeckCardItem,
  DeckCategory,
  SIDE_WORK_ARCHIVE,
} from '../data'

interface DeckSectionProps {
  deckFilter: DeckCategory
  onChangeFilter: (next: DeckCategory) => void
  onSelectCard: (card: DeckCardItem) => void
  trapCards: DeckCardItem[]
  spellCards: DeckCardItem[]
  monsterCards: DeckCardItem[]
}

export const DeckSection: React.FC<DeckSectionProps> = ({
  deckFilter,
  onChangeFilter,
  onSelectCard,
  trapCards,
  spellCards,
  monsterCards,
}) => {
  const renderDeckShelf = (title: string, cards: DeckCardItem[]) => (
    <section className="space-y-5 sm:space-y-6">
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border-subtle)] pb-2.5">
        <h2 className="font-editorial text-xl leading-snug text-[var(--text-main)] sm:text-2xl">
          {title}
        </h2>
        <span className="shrink-0 font-mono-tech text-xs text-[var(--text-muted)]">
          {cards.length}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-9">
        {cards.map((card) => (
          <div
            key={card.id}
            className="ygo-deck-slot flex w-[min(276px,82vw)] flex-col sm:w-[272px] lg:w-[296px]"
          >
            <DeckCard item={card} onClick={() => onSelectCard(card)} />
            <p className="mt-2.5 text-center text-sm leading-snug font-medium text-[var(--text-main)]">
              {card.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div className="space-y-1">
          <h1 className="font-editorial text-3xl text-[var(--text-main)] sm:text-4xl">The Deck</h1>
          <p className="font-mono-tech text-[11px] text-[var(--text-muted)]">
            {DECK_CARDS.length} Main Deck Cards, {SIDE_WORK_ARCHIVE.length} Side Deck
          </p>
        </div>

        <button
          type="button"
          aria-pressed={deckFilter === 'all'}
          onClick={() => {
            duelSfx.playHover()
            onChangeFilter('all')
          }}
          className={`rounded-[2px] border px-3.5 py-2 text-xs font-medium transition ${
            deckFilter === 'all'
              ? 'border-[var(--text-main)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)]'
          }`}
        >
          Show All ({DECK_CARDS.length + SIDE_WORK_ARCHIVE.length})
        </button>
      </div>

      <div
        id="tour-deck-boxes"
        className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4"
        role="tablist"
        aria-label="Deck Boxes"
      >
        {(
          [
            {
              id: 'projects',
              title: 'Projects Deck',
              deckTypeLabel: 'TRAP DECK',
              boxCode: 'TRAP',
              countSummary: `${trapCards.length} Trap Cards`,
              tagline: 'Production apps & systems',
              coverSrc: DECK_BOX_COVERS.projects,
              accent: '#a22c6a',
            },
            {
              id: 'achievements',
              title: 'Achievements Deck',
              deckTypeLabel: 'SPELL DECK',
              boxCode: 'SPELL',
              countSummary: `${spellCards.length} Spell Cards`,
              tagline: 'Certifications, CTF & scholarships',
              coverSrc: DECK_BOX_COVERS.achievements,
              accent: '#157766',
            },
            {
              id: 'references',
              title: 'References Deck',
              deckTypeLabel: 'MONSTER DECK',
              boxCode: 'MNSTR',
              countSummary: `${monsterCards.length} Monster Cards`,
              tagline: 'Supervisors, coaches & panelists',
              coverSrc: DECK_BOX_COVERS.references,
              accent: '#b56831',
            },
            {
              id: 'side',
              title: 'Side Deck',
              deckTypeLabel: 'SIDE DECK',
              boxCode: 'SIDE',
              countSummary: `${SIDE_WORK_ARCHIVE.length} Side Cards`,
              tagline: 'Coursework tools & web games',
              coverSrc: DECK_BOX_COVERS.side,
              accent: '#475569',
            },
          ] as const
        ).map((box) => {
          const isActive = deckFilter === box.id
          return (
            <DuelDeckBoxCard
              key={box.id}
              title={box.title}
              deckTypeLabel={box.deckTypeLabel}
              boxCode={box.boxCode}
              countSummary={box.countSummary}
              tagline={box.tagline}
              coverSrc={box.coverSrc}
              accent={box.accent}
              active={isActive}
              compact
              onClick={() => {
                duelSfx.playHover()
                onChangeFilter(isActive ? 'all' : box.id)
              }}
            />
          )
        })}
      </div>

      <div id="tour-deck-cards" className="space-y-10 sm:space-y-14">
        {(deckFilter === 'all' || deckFilter === 'projects') &&
          renderDeckShelf('Trap Cards (Projects)', trapCards)}

        {(deckFilter === 'all' || deckFilter === 'achievements') &&
          renderDeckShelf('Spell Cards (Achievements & Scholarships)', spellCards)}

        {(deckFilter === 'all' || deckFilter === 'references') &&
          renderDeckShelf('Monster Cards (Character References)', monsterCards)}

        {(deckFilter === 'all' || deckFilter === 'side') && (
          <section className="space-y-5 border-t border-dashed border-[var(--border-hover)] pt-8 sm:space-y-6 sm:pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border-subtle)] pb-2.5">
              <div>
                <p className="font-mono-tech text-[10px] font-semibold tracking-[0.16em] text-[var(--accent-silver)] uppercase">
                  SIDE DECK ZONE
                </p>
                <h2 className="mt-1 font-editorial text-xl leading-snug text-[var(--text-main)] sm:text-2xl">
                  Side Deck: Tools, Coursework &amp; Collaborations
                </h2>
              </div>
              <span className="shrink-0 font-mono-tech text-xs text-[var(--text-muted)]">
                {SIDE_WORK_ARCHIVE.length}
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
              {SIDE_WORK_ARCHIVE.map((item, idx) => (
                <article
                  key={item.id}
                  className="group relative flex w-[min(320px,88vw)] flex-col overflow-hidden rounded-[2px] border border-[var(--border-hover)] bg-[var(--bg-surface)] p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent-silver)] hover:shadow-lg sm:w-[290px] lg:w-[300px]"
                >
                  <div className="mb-2 flex items-center justify-between gap-2 rounded-[1px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-2.5 py-1">
                    <span className="truncate font-mono-tech text-[10px] font-semibold tracking-wider text-[var(--accent-silver)] uppercase">
                      SIDE-{String(idx + 1).padStart(3, '0')}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono-tech text-[10px] text-[var(--text-muted)]">
                      <span className="h-2 w-2 rotate-45 rounded-[1px] bg-[var(--accent-silver)]" />
                      SIDE DECK
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] overflow-hidden rounded-[1px] border border-[var(--border-hover)] bg-[var(--bg-muted)]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-all duration-500 group-hover:left-[150%]"
                    />
                  </div>

                  <div className="mt-2.5 flex flex-1 flex-col justify-between rounded-[1px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/45 p-3">
                    <div>
                      <p className="font-mono-tech text-[10px] text-[var(--text-muted)]">
                        {item.role}
                      </p>
                      <h3 className="mt-0.5 text-sm font-semibold text-[var(--text-main)]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {item.summary}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-2.5">
                      {item.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-silver)] hover:underline"
                        >
                          {link.kind === 'github' && <Github className="h-3.5 w-3.5" />}
                          {link.kind === 'live' && <ExternalLink className="h-3.5 w-3.5" />}
                          {link.kind === 'zip' && <Download className="h-3.5 w-3.5" />}
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default DeckSection
