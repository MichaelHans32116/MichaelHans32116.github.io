import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Github,
  Lock,
  Smartphone,
  X,
} from 'lucide-react'
import { DeckCardItem } from '../data/deckData'
import { duelSfx } from '../utils/sfx'
import { DeckCard } from './DeckCard'

interface DeckCardModalProps {
  item: DeckCardItem | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  positionLabel?: string
}

interface ModalMediaItem {
  kind: 'image' | 'video'
  src: string
  label: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const DeckCardModal: React.FC<DeckCardModalProps> = ({
  item,
  onClose,
  onPrev,
  onNext,
  positionLabel,
}) => {
  const [videoFailed, setVideoFailed] = useState(false)
  const [mediaIdx, setMediaIdx] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)
  const mediaTouchStartRef = useRef<{ x: number; y: number } | null>(null)

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

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft' && onPrev) {
        e.preventDefault()
        duelSfx.playHover()
        onPrev()
      } else if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault()
        duelSfx.playHover()
        onNext()
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
  }, [item, onClose, onNext, onPrev])

  const mediaList: ModalMediaItem[] = useMemo(() => {
    if (!item) return []
    const entries: ModalMediaItem[] = []
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

  if (!item || typeof document === 'undefined') return null

  const activeMedia = mediaList[mediaIdx] ?? mediaList[0]

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
        className="ygo-modal-summon relative flex max-h-[84dvh] w-[min(1140px,94vw)] flex-col overflow-y-auto overscroll-contain rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl focus:outline-none md:grid md:h-[min(78dvh,680px)] md:grid-cols-[310px_1fr] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden lg:grid-cols-[340px_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Mobile Action Bar: keeps Close and Prev/Next accessible while scrolling */}
        <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 px-3.5 py-2.5 backdrop-blur-md md:hidden">
          {onPrev || onNext ? (
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  duelSfx.playHover()
                  onPrev?.()
                }}
                className="inline-flex h-8 items-center gap-0.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-2 font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)]"
                aria-label="Previous card"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>
              {positionLabel && (
                <span className="font-mono-tech text-[11px] text-[var(--text-muted)]">
                  {positionLabel}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  duelSfx.playHover()
                  onNext?.()
                }}
                className="inline-flex h-8 items-center gap-0.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-2 font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)]"
                aria-label="Next card"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span className="min-w-0 truncate text-xs font-semibold text-[var(--text-main)]">
              {item.title}
            </span>
          )}

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

        {/* LEFT COLUMN: Spacious Card Showcase */}
        <aside className="flex shrink-0 flex-col items-center justify-between gap-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/45 p-4 md:min-h-0 md:gap-5 md:overflow-y-auto md:border-b-0 md:border-r md:p-7">
          <div className="my-auto w-[min(172px,46vw)] sm:w-[210px] md:w-full">
            <DeckCard item={item} disableTilt />
          </div>

          {(onPrev || onNext) && (
            <div className="hidden w-full items-center justify-between border-t border-[var(--border-subtle)] pt-3.5 text-xs md:flex">
              <button
                type="button"
                onClick={() => {
                  duelSfx.playHover()
                  onPrev?.()
                }}
                className="inline-flex items-center gap-1 font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-main)]"
                aria-label="Previous card"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              {positionLabel && (
                <span className="font-mono-tech text-[11px] text-[var(--text-muted)]">
                  {positionLabel}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  duelSfx.playHover()
                  onNext?.()
                }}
                className="inline-flex items-center gap-1 font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-main)]"
                aria-label="Next card"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </aside>

        {/* RIGHT COLUMN: Calm, Un-Cluttered Editorial View */}
        <div className="min-h-0 flex-1 p-4 sm:p-7 lg:p-10 md:overflow-y-auto md:overscroll-contain">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:pb-5">
            <div className="min-w-0 space-y-1">
              <h2
                id="deck-modal-title"
                className="font-editorial text-xl leading-snug text-[var(--text-main)] sm:text-3xl"
              >
                {item.title}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] sm:text-sm">
                {item.roleOrIssuer} · <span className="text-[var(--text-muted)]">{item.period}</span>
              </p>
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
            {activeMedia && (
              <div
                className="space-y-3"
                onTouchStart={(e) => {
                  const t = e.touches[0]
                  mediaTouchStartRef.current = { x: t.clientX, y: t.clientY }
                }}
                onTouchEnd={(e) => {
                  const start = mediaTouchStartRef.current
                  mediaTouchStartRef.current = null
                  if (!start || mediaList.length <= 1) return
                  const t = e.changedTouches[0]
                  const dx = t.clientX - start.x
                  const dy = t.clientY - start.y
                  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
                    duelSfx.playHover()
                    setMediaIdx((prev) =>
                      dx < 0 ? (prev + 1) % mediaList.length : (prev - 1 + mediaList.length) % mediaList.length,
                    )
                  }
                }}
              >
                {activeMedia.kind === 'video' ? (
                  <div className="overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-black">
                    <video
                      key={activeMedia.src}
                      src={activeMedia.src}
                      controls
                      playsInline
                      preload="metadata"
                      onError={() => {
                        setVideoFailed(true)
                        setMediaIdx(0)
                      }}
                      className="aspect-video w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 p-2">
                    <img
                      key={activeMedia.src}
                      src={activeMedia.src}
                      alt={`${item.title} (${activeMedia.label})`}
                      className="ygo-media-fade max-h-[200px] w-full object-contain sm:max-h-[290px]"
                    />
                  </div>
                )}

                {mediaList.length > 1 && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {mediaList.map((m, idx) => (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => {
                          duelSfx.playHover()
                          setMediaIdx(idx)
                        }}
                        className={`border-b-2 pb-1 text-xs font-medium transition ${
                          idx === mediaIdx
                            ? 'border-[var(--accent-silver)] text-[var(--text-main)]'
                            : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Full readable card overview + Editorial Prose */}
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

            {item.stack && item.stack.length > 0 && (
              <p className="font-mono-tech text-xs leading-relaxed text-[var(--text-muted)]">
                {item.stack.join(' · ')}
              </p>
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
