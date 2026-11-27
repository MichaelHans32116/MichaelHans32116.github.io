import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Download, ExternalLink, Github, Lock, Smartphone, X } from 'lucide-react'
import { DeckCardItem } from '../data/deckData'
import { duelSfx } from '../utils/sfx'
import { DeckCard } from './DeckCard'
import { CarouselSlide, MediaCarousel } from './MediaCarousel'

interface DeckCardModalProps {
  item: DeckCardItem | null
  onClose: () => void
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const DeckCardModal: React.FC<DeckCardModalProps> = ({ item, onClose }) => {
  const [videoFailed, setVideoFailed] = useState(false)
  const [mediaIdx, setMediaIdx] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    setVideoFailed(false)
    setMediaIdx(0)
  }, [item?.id])

  useEffect(() => {
    const isOpen = Boolean(item)
    if (isOpen && !wasOpenRef.current) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      window.requestAnimationFrame(() => {
        modalRef.current?.focus()
      })
    } else if (!isOpen && wasOpenRef.current) {
      const trigger = triggerRef.current
      triggerRef.current = null
      if (trigger && trigger.isConnected) {
        trigger.focus()
      }
    }
    wasOpenRef.current = isOpen
  }, [item])

  const mediaList: CarouselSlide[] = useMemo(() => {
    if (!item) return []
    const entries: CarouselSlide[] = []
    if (item.previewImages && item.previewImages.length > 0) {
      for (const img of item.previewImages) {
        entries.push({ kind: 'image', src: img.src, label: img.label })
      }
    } else if (item.supportingImage) {
      entries.push({
        kind: 'image',
        src: item.supportingImage,
        label: item.supportingCaption || item.title,
      })
    }
    if (item.videoSrc && !videoFailed) {
      entries.push({ kind: 'video', src: item.videoSrc, label: 'Demo Video' })
    }
    return entries
  }, [item, videoFailed])

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft' && mediaList.length > 1) {
        e.preventDefault()
        duelSfx.playHover()
        setMediaIdx((prev) => (prev - 1 + mediaList.length) % mediaList.length)
      } else if (e.key === 'ArrowRight' && mediaList.length > 1) {
        e.preventDefault()
        duelSfx.playHover()
        setMediaIdx((prev) => (prev + 1) % mediaList.length)
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
      if (prevOverflow) {
        document.body.style.overflow = prevOverflow
      } else {
        document.body.style.removeProperty('overflow')
      }
      window.removeEventListener('keydown', onKey)
    }
  }, [item, mediaList.length, onClose])

  if (!item || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="ygo-backdrop-in fixed inset-0 z-[80] flex items-center justify-center bg-black/68 p-3.5 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-modal-title"
      onClick={() => {
        duelSfx.playHover()
        onClose()
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="ygo-modal-summon relative flex max-h-[84dvh] w-[min(1160px,94vw)] flex-col overflow-y-auto overscroll-contain rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl focus:outline-none md:grid md:h-[min(78dvh,680px)] md:grid-cols-[330px_1fr] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden lg:grid-cols-[360px_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-3.5 py-2.5 backdrop-blur-md md:hidden">
          <span className="min-w-0 truncate text-xs font-semibold text-[var(--text-main)]">
            {item.title}
          </span>

          <button
            type="button"
            onClick={() => {
              duelSfx.playHover()
              onClose()
            }}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
            aria-label="Close card details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <aside className="flex shrink-0 flex-col items-center justify-center border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/45 p-4 md:min-h-0 md:overflow-y-auto md:border-b-0 md:border-r md:p-7">
          <div className="w-[min(210px,58vw)] sm:w-[236px] md:w-full">
            <DeckCard item={item} disableTilt />
          </div>
        </aside>

        <div className="min-h-0 flex-1 p-4 sm:p-7 lg:p-10 md:overflow-y-auto md:overscroll-contain">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:pb-5">
            <div className="min-w-0 flex-1 space-y-1.5">
              <h2
                id="deck-modal-title"
                className="font-editorial text-xl leading-snug text-[var(--text-main)] sm:text-3xl"
              >
                {item.title}
              </h2>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-xs font-medium text-[var(--text-secondary)] sm:text-sm">
                  {item.roleOrIssuer}
                </p>
                <span className="font-mono-tech text-[11px] text-[var(--text-muted)] sm:text-xs">
                  {item.period}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                duelSfx.playHover()
                onClose()
              }}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)] md:inline-flex"
              aria-label="Close card details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
            {mediaList.length > 0 && (
              <MediaCarousel
                slides={mediaList}
                activeIdx={mediaIdx}
                onChangeIdx={setMediaIdx}
                altPrefix={item.title}
                showSlideLabel
                stageClassName="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 p-2"
                imgClassName="max-h-[220px] sm:max-h-[300px]"
                onVideoError={() => {
                  setVideoFailed(true)
                  setMediaIdx(0)
                }}
              />
            )}

            <div className="space-y-3 text-[13.5px] leading-relaxed text-[var(--text-secondary)] sm:space-y-4 sm:text-[15px]">
              <p className="font-medium text-[var(--text-main)]">{item.cardEffect}</p>
              <p>{item.details.bodyA}</p>
              <p>{item.details.bodyB}</p>
            </div>

            {item.details.bullets.length > 0 && (
              <ul className="space-y-2 border-t border-[var(--border-subtle)] pt-4 text-[13px] text-[var(--text-secondary)] sm:text-sm">
                {item.details.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--accent-silver)]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-2.5 border-t border-[var(--border-subtle)] pt-4 sm:pt-5">
              {item.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-4 py-2 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90"
                >
                  {link.kind === 'github' && <Github className="h-3.5 w-3.5" />}
                  {link.kind === 'live' && <ExternalLink className="h-3.5 w-3.5" />}
                  {link.kind === 'mobile' && <Smartphone className="h-3.5 w-3.5" />}
                  {link.kind === 'zip' && <Download className="h-3.5 w-3.5" />}
                  <span>{link.label}</span>
                </a>
              ))}

              {item.note && (
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <Lock className="h-3.5 w-3.5" />
                  <span>{item.note}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
