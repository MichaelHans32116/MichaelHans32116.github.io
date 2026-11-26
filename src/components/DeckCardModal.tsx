import React, { useEffect, useMemo, useState } from 'react'
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
import { DeckCardItem, DeckPreviewImage } from '../data/deckData'
import { duelSfx } from '../utils/sfx'
import { DeckCard } from './DeckCard'

interface DeckCardModalProps {
  item: DeckCardItem | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  positionLabel?: string
}

export const DeckCardModal: React.FC<DeckCardModalProps> = ({
  item,
  onClose,
  onPrev,
  onNext,
  positionLabel,
}) => {
  const [videoReady, setVideoReady] = useState(false)
  const [mediaIdx, setMediaIdx] = useState(0)

  useEffect(() => {
    setVideoReady(false)
    setMediaIdx(0)
  }, [item?.id])

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

  const mediaList: DeckPreviewImage[] = useMemo(() => {
    if (!item) return []
    if (item.previewImages && item.previewImages.length > 0) return item.previewImages
    if (item.supportingImage) {
      return [{ src: item.supportingImage, label: item.supportingCaption || item.title }]
    }
    return []
  }, [item])

  if (!item) return null

  const hasVideo = Boolean(item.videoSrc) && videoReady
  const activeMedia = mediaList[mediaIdx] ?? mediaList[0]

  return (
    <div
      className="ygo-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-black/68 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-modal-title"
      onClick={() => {
        duelSfx.playHover()
        onClose()
      }}
    >
      <div
        className="ygo-modal-summon relative flex max-h-[90dvh] w-[min(1160px,94vw)] flex-col overflow-y-auto overscroll-contain rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl md:grid md:h-[min(86dvh,800px)] md:grid-cols-[330px_1fr] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden lg:grid-cols-[360px_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT COLUMN: Spacious Card Showcase */}
        <aside className="flex shrink-0 flex-col items-center justify-between gap-5 border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]/45 p-5 md:min-h-0 md:overflow-y-auto md:border-b-0 md:border-r md:p-7">
          <div className="flex w-full items-center justify-end md:hidden">
            <button
              type="button"
              onClick={() => {
                duelSfx.playHover()
                onClose()
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
              aria-label="Close card details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="my-auto w-[min(230px,60vw)] md:w-full">
            <DeckCard item={item} disableTilt />
          </div>

          {(onPrev || onNext) && (
            <div className="flex w-full items-center justify-between border-t border-[var(--border-subtle)] pt-3.5 text-xs">
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
        <div className="min-h-0 flex-1 p-6 sm:p-8 lg:p-10 md:overflow-y-auto md:overscroll-contain">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
            <div className="min-w-0 space-y-1">
              <h2
                id="deck-modal-title"
                className="font-editorial text-2xl text-[var(--text-main)] sm:text-3xl"
              >
                {item.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
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

          <div className="mt-6 space-y-6">
            {/* Single Clean Media Area (shows real screenshots immediately; only switches to video if valid video loads) */}
            {item.videoSrc && !videoReady && (
              <video
                src={item.videoSrc}
                preload="metadata"
                muted
                onLoadedData={() => setVideoReady(true)}
                className="hidden"
              />
            )}
            {hasVideo ? (
              <div className="overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-black">
                <video
                  src={item.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setVideoReady(false)}
                  className="aspect-video w-full object-cover"
                />
              </div>
            ) : activeMedia ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 p-2">
                  <img
                    key={activeMedia.src}
                    src={activeMedia.src}
                    alt={`${item.title} — ${activeMedia.label}`}
                    className="ygo-media-fade max-h-[340px] w-full object-contain"
                  />
                </div>
                {mediaList.length > 1 && (
                  <div className="flex flex-wrap items-center gap-4">
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
            ) : null}

            {/* Clean Editorial Prose — Zero Nested Grey Boxes */}
            <div className="space-y-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
              <p>{item.details.bodyA}</p>
              <p>{item.details.bodyB}</p>
            </div>

            {item.details.bullets.length > 0 && (
              <ul className="space-y-2 border-t border-[var(--border-subtle)] pt-4 text-sm text-[var(--text-secondary)]">
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

            <div className="flex flex-wrap items-center gap-2.5 border-t border-[var(--border-subtle)] pt-5">
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
    </div>
  )
}
