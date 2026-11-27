import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { DuelDeckBoxCard } from '../components/DuelDeckBoxCard'
import { CarouselSlide, MediaCarousel } from '../components/MediaCarousel'
import { duelSfx } from '../utils/sfx'
import boseQcUltraImg from '../images/web/bose-qc-ultra.jpg'
import chessMatchImg from '../images/web/chess-match.jpg'
import evangelismDrawingImg from '../images/web/evangelism-drawing.jpg'
import evangelismKidsImg from '../images/web/evangelism-kids.jpg'
import evangelismVisitImg from '../images/web/evangelism-visit.jpg'
import favoriteArtImg from '../images/web/favorite-art.jpg'
import friendsCafeImg from '../images/web/friends-cafe.jpg'
import friendsGroupImg from '../images/web/friends-group.jpg'
import friendsPizzaImg from '../images/web/friends-pizza.jpg'
import genshinCoopImg from '../images/web/genshin-coop.jpg'
import howconnectGroupImg from '../images/web/howconnect-group.jpg'
import pickleballMjolnirImg from '../images/web/pickleball-mjolnir.jpg'
import yukiDressImg from '../images/web/yuki-dress.jpg'
import yukiWithArtImg from '../images/web/yuki-with-art.jpg'

interface PhotoCard {
  src: string
  title: string
  caption: string
  objectMode?: 'cover-top' | 'cover-center' | 'contain-art'
}

interface LifeDeckItem {
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
  photos: PhotoCard[]
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const LIFE_DECKS: LifeDeckItem[] = [
  {
    id: 'church',
    title: 'Church & Outreach',
    deckTypeLabel: 'FAITH DECK',
    boxCode: 'FAITH',
    countSummary: '4 Photos',
    tagline: 'House of Worship LB, Sat Masili & Sun Sucol',
    story:
      'I play piano at House of Worship Los Baños and help lead barangay outreach. Funny enough, they are also the real client behind my HoW Connect app. Every Saturday I am in Barangay Masili and every Sunday in Barangay Sucol for kids ministry and house-to-house visits.',
    coverSrc: evangelismKidsImg,
    coverMode: 'cover-top',
    accent: '#2563eb',
    photos: [
      {
        src: evangelismKidsImg,
        title: 'Barangay Kids Ministry',
        caption: 'Saturdays in Barangay Masili and Sundays in Barangay Sucol. Loud kids, nonstop energy.',
        objectMode: 'cover-top',
      },
      {
        src: evangelismDrawingImg,
        title: 'Coloring & Bible Stories',
        caption: 'Crayons on the floor while teaching the kids every weekend.',
        objectMode: 'cover-center',
      },
      {
        src: evangelismVisitImg,
        title: 'House-to-House Outreach',
        caption: 'Visiting nanays and families across the barangay for soul-winning outreach.',
        objectMode: 'cover-top',
      },
      {
        src: howconnectGroupImg,
        title: 'HoW Los Baños & HoW Connect',
        caption: 'Home church, barangay crew, and the actual client behind HoW Connect.',
        objectMode: 'cover-top',
      },
    ],
  },
  {
    id: 'friends',
    title: 'Friends & Food Trips',
    deckTypeLabel: 'SQUAD DECK',
    boxCode: 'SQUAD',
    countSummary: '3 Photos',
    tagline: 'Dinner runs, pizza nights & late cafes',
    story:
      'Most of my favorite memories happen around crowded dinner tables after surviving exams or defenses, sharing pizza boxes, and hanging out at cafes until late.',
    coverSrc: friendsGroupImg,
    coverMode: 'cover-top',
    accent: '#0f766e',
    photos: [
      {
        src: friendsGroupImg,
        title: 'Full Table Dinner Run',
        caption: 'Post-exam rule: nobody leaves the Pizza Hut table hungry.',
        objectMode: 'cover-top',
      },
      {
        src: friendsPizzaImg,
        title: 'After-Class Pizza',
        caption: 'Same squad, looser ties, no code talk for at least 20 minutes.',
        objectMode: 'cover-top',
      },
      {
        src: friendsCafeImg,
        title: 'Late-Night Cafe',
        caption: 'Started as a normal hangout, ended up sketching app ideas again.',
        objectMode: 'cover-top',
      },
    ],
  },
  {
    id: 'yuki',
    title: 'Yuki & Birthday Art',
    deckTypeLabel: 'COMPANION DECK',
    boxCode: 'YUKI',
    countSummary: '3 Photos',
    tagline: 'Favorite dog Yuki & 21st birthday drawing',
    story:
      'Yuki is my favorite dog and basically runs our house in her blue gingham dress. Right beside her is my favorite art piece: a 21st birthday drawing I commissioned from one of my favorite people, starring Yuki on top of the cake.',
    coverSrc: favoriteArtImg,
    coverMode: 'contain-art',
    accent: '#b45309',
    photos: [
      {
        src: favoriteArtImg,
        title: '21st Birthday Commission',
        caption: 'Commissioned from one of my favorite people, starring Yuki on the cake.',
        objectMode: 'contain-art',
      },
      {
        src: yukiWithArtImg,
        title: 'Yuki Meets Her Drawing',
        caption: 'Holding the printed birthday art right beside the actual model.',
        objectMode: 'cover-top',
      },
      {
        src: yukiDressImg,
        title: 'Yuki in Full Outfit',
        caption: '10/10 polite dog, zero coding skills, huge morale boost.',
        objectMode: 'cover-top',
      },
    ],
  },
  {
    id: 'hobbies',
    title: 'Gear & Hobbies',
    deckTypeLabel: 'HOBBY DECK',
    boxCode: 'GEAR',
    countSummary: '4 Photos',
    tagline: 'Bose QC Ultra, Mjolnir 16cm, Chess & Genshin',
    story:
      'Outside dev work I rotate between my Bose QuietComfort Ultra and Sony WH-1000XM5 headphones, my Mjolnir 16cm wide-frame pickleball paddle, weekend chess, and Genshin co-op with friends.',
    coverSrc: boseQcUltraImg,
    coverMode: 'cover-center',
    accent: '#6d28d9',
    photos: [
      {
        src: boseQcUltraImg,
        title: 'Bose QC Ultra & WH-1000XM5',
        caption: 'My two go-to headphones for deep coding sessions and blocking commute noise.',
        objectMode: 'cover-center',
      },
      {
        src: pickleballMjolnirImg,
        title: 'Mjolnir 16cm Wide-Frame',
        caption: 'Enflexy Mjolnir widebody pickleball paddle. Big sweet spot and a fun name.',
        objectMode: 'cover-center',
      },
      {
        src: chessMatchImg,
        title: 'Over-the-Board Chess',
        caption: 'Good practice for staying patient and spotting traps early.',
        objectMode: 'cover-top',
      },
      {
        src: genshinCoopImg,
        title: 'Genshin Co-Op',
        caption: 'Running domains and boss fights with friends after pushing updates.',
        objectMode: 'cover-center',
      },
    ],
  },
]

export const AboutSection: React.FC = () => {
  const [activeDeckIdx, setActiveDeckIdx] = useState<number | null>(null)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)

  const modalRef = useRef<HTMLDivElement>(null)
  const triggerElRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)

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

  useEffect(() => {
    const isOpen = activeDeck !== null
    if (isOpen && !wasOpenRef.current) {
      window.requestAnimationFrame(() => {
        modalRef.current?.focus()
      })
    } else if (!isOpen && wasOpenRef.current) {
      const trigger = triggerElRef.current
      triggerElRef.current = null
      if (trigger && trigger.isConnected) {
        trigger.focus()
      }
    }
    wasOpenRef.current = isOpen
  }, [activeDeck])

  useEffect(() => {
    if (!activeDeck) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setActiveDeckIdx(null)
      } else if (e.key === 'ArrowLeft' && activeDeck.photos.length > 1) {
        e.preventDefault()
        duelSfx.playHover()
        setActivePhotoIdx((prev) => (prev - 1 + activeDeck.photos.length) % activeDeck.photos.length)
      } else if (e.key === 'ArrowRight' && activeDeck.photos.length > 1) {
        e.preventDefault()
        duelSfx.playHover()
        setActivePhotoIdx((prev) => (prev + 1) % activeDeck.photos.length)
      } else if (e.key === 'Tab' && modalRef.current) {
        const focusables = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter((el) => el.offsetParent !== null || el === document.activeElement)

        if (focusables.length === 0) {
          e.preventDefault()
          modalRef.current.focus()
          return
        }

        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null

        if (!active || !modalRef.current.contains(active)) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
        } else if (e.shiftKey && (active === first || active === modalRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (prevOverflow) document.body.style.overflow = prevOverflow
      else document.body.style.removeProperty('overflow')
    }
  }, [activeDeck])

  const openDeck = (idx: number, el?: HTMLElement | null) => {
    duelSfx.playHover()
    triggerElRef.current = el ?? null
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
              setActiveDeckIdx(null)
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
                    setActiveDeckIdx(null)
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
                      setActiveDeckIdx(null)
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
