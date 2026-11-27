import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { duelSfx } from '../audio'
import { DuelDeckBoxCard } from '../components/DuelDeckBoxCard'
import { CarouselSlide, MediaCarousel } from '../components/MediaCarousel'
import { LIFE_DECKS } from '../data'
import { useModalDialog } from '../hooks/useModalDialog'

export const AboutSection: React.FC = () => {
  const [activeDeckIdx, setActiveDeckIdx] = useState<number | null>(null)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)

  const activeDeck = activeDeckIdx !== null ? LIFE_DECKS[activeDeckIdx] ?? null : null
  const activePhoto = activeDeck ? activeDeck.photos[activePhotoIdx] ?? activeDeck.photos[0] : null

  const photoSlides: CarouselSlide[] = useMemo(() => {
    if (!activeDeck) return []
    return activeDeck.photos.map((photo) => ({
      kind: 'image',
      src: photo.src,
      label: photo.title,
    }))
  }, [activeDeck])

  useEffect(() => {
    setActivePhotoIdx(0)
  }, [activeDeckIdx])

  const closeModal = useCallback(() => {
    setActiveDeckIdx(null)
  }, [])

  const stepPhoto = useCallback(
    (delta: -1 | 1) => {
      if (!activeDeck || activeDeck.photos.length <= 1) return
      setActivePhotoIdx((prev) => (prev + delta + activeDeck.photos.length) % activeDeck.photos.length)
    },
    [activeDeck],
  )

  const { modalRef, setTriggerEl } = useModalDialog({
    open: activeDeck !== null,
    onClose: closeModal,
    onStepSlide: activeDeck && activeDeck.photos.length > 1 ? stepPhoto : undefined,
    restoreFromActive: false,
  })

  const openDeck = (idx: number, el?: HTMLElement | null) => {
    duelSfx.playHover()
    setTriggerEl(el ?? null)
    setActivePhotoIdx(0)
    setActiveDeckIdx(idx)
  }

  const modalNode =
    activeDeck && activePhoto && typeof document !== 'undefined'
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="life-deck-modal-title"
            onClick={() => {
              duelSfx.playHover()
              closeModal()
            }}
            className="ygo-backdrop-in fixed inset-0 z-[80] flex items-center justify-center bg-black/72 p-3.5 backdrop-blur-sm sm:p-6"
          >
            <div
              ref={modalRef}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="ygo-modal-summon relative flex max-h-[84dvh] w-[min(1040px,94vw)] flex-col overflow-y-auto overscroll-contain rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl focus:outline-none md:grid md:h-[min(74dvh,590px)] md:grid-cols-[1.32fr_1fr] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden"
            >
              <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-3.5 py-2.5 backdrop-blur-md md:hidden">
                <span className="min-w-0 truncate text-xs font-semibold text-[var(--text-main)]">
                  {activeDeck.title}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    duelSfx.playHover()
                    closeModal()
                  }}
                  aria-label="Close deck details"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="min-h-0 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/45 md:border-b-0 md:border-r">
                <MediaCarousel
                  slides={photoSlides}
                  activeIdx={activePhotoIdx}
                  onChangeIdx={setActivePhotoIdx}
                  altPrefix={activeDeck.title}
                  stageClassName="h-full min-h-[220px] p-3 sm:p-4"
                  imgClassName="max-h-[38dvh] rounded-[2px] shadow-sm md:max-h-full"
                />
              </div>

              <div className="flex min-h-0 flex-col">
                <div className="hidden shrink-0 items-start justify-between gap-4 border-b border-[var(--border-subtle)] px-6 py-4 md:flex">
                  <h2
                    id="life-deck-modal-title"
                    className="font-editorial text-2xl leading-tight text-[var(--text-main)]"
                  >
                    {activeDeck.title}
                  </h2>

                  <button
                    type="button"
                    onClick={() => {
                      duelSfx.playHover()
                      closeModal()
                    }}
                    aria-label="Close deck details"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="min-h-0 flex-1 space-y-4 p-4 sm:p-6 md:overflow-y-auto md:overscroll-contain">
                  <div className="md:hidden">
                    <h2 className="font-editorial text-xl leading-tight text-[var(--text-main)]">
                      {activeDeck.title}
                    </h2>
                  </div>

                  <p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
                    {activeDeck.story}
                  </p>

                  <div className="space-y-1.5 border-t border-[var(--border-subtle)] pt-4">
                    <h3 className="text-sm font-semibold text-[var(--text-main)] sm:text-[15px]">
                      {activePhoto.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--text-secondary)] sm:text-[13.5px]">
                      {activePhoto.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="space-y-2.5 border-b border-[var(--border-subtle)] pb-5 sm:pb-6">
        <p className="font-mono-tech text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-silver)] uppercase">
          MAIN PHASE 2
        </p>
        <h1 className="font-editorial text-[2rem] leading-tight text-[var(--text-main)] sm:text-[42px]">
          Outside the IDE.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
          Away from work, my weekends go to church piano, barangay outreach, food trips with friends, my dog Yuki, pickleball, chess, and Genshin co-op. Open any deck box to flip through the photos.
        </p>
      </section>

      <section id="tour-life-decks" aria-label="Life Deck Boxes">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {LIFE_DECKS.map((deck, idx) => (
            <DuelDeckBoxCard
              key={deck.id}
              title={deck.title}
              deckTypeLabel={deck.deckTypeLabel}
              boxCode={deck.boxCode}
              countSummary={deck.countSummary}
              tagline={deck.tagline}
              coverSrc={deck.coverSrc}
              coverMode={deck.coverMode}
              accent={deck.accent}
              active={activeDeckIdx === idx}
              ctaLabel="Open Deck"
              onClick={() => openDeck(idx, document.activeElement as HTMLElement | null)}
            />
          ))}
        </div>
      </section>

      {modalNode}
    </div>
  )
}

export default AboutSection
