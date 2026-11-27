import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { duelSfx } from '../utils/sfx'

export interface CarouselSlide {
  kind: 'image' | 'video'
  src: string
  label: string
}

interface MediaCarouselProps {
  slides: CarouselSlide[]
  activeIdx: number
  onChangeIdx: (idx: number) => void
  altPrefix: string
  stageClassName?: string
  imgClassName?: string
  showSlideLabel?: boolean
  onVideoError?: () => void
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  slides,
  activeIdx,
  onChangeIdx,
  altPrefix,
  stageClassName = '',
  imgClassName = '',
  showSlideLabel = false,
  onVideoError,
}) => {
  const [pressedArrow, setPressedArrow] = useState<'prev' | 'next' | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const pressTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current)
    }
  }, [])

  if (slides.length === 0) return null

  const safeIdx = activeIdx >= 0 && activeIdx < slides.length ? activeIdx : 0
  const activeSlide = slides[safeIdx]
  const hasMultiple = slides.length > 1

  const triggerArrow = (dir: 'prev' | 'next') => {
    if (!hasMultiple) return
    duelSfx.playHover()
    setPressedArrow(dir)
    if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current)
    pressTimerRef.current = window.setTimeout(() => setPressedArrow(null), 200)

    const delta = dir === 'next' ? 1 : -1
    onChangeIdx((safeIdx + delta + slides.length) % slides.length)
  }

  const arrowBtnClass = (dir: 'prev' | 'next') => {
    const isPressed = pressedArrow === dir
    return `absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-xs transition duration-150 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/80 ${
      dir === 'prev' ? 'left-2.5' : 'right-2.5'
    } ${
      isPressed
        ? 'scale-95 border-white/75 bg-black/90 text-white opacity-100'
        : 'border-white/25 bg-black/40 text-white/90 opacity-60 active:scale-95 active:border-white/75 active:bg-black/90 active:text-white active:opacity-100 sm:opacity-0 sm:bg-black/55 sm:group-hover/carousel:opacity-100 sm:hover:border-white/60 sm:hover:bg-black/85'
    }`
  }

  return (
    <div
      className={`group/carousel relative flex items-center justify-center overflow-hidden ${stageClassName}`}
      onTouchStart={(e) => {
        if (!hasMultiple || e.touches.length !== 1) return
        const t = e.touches[0]
        touchStartRef.current = { x: t.clientX, y: t.clientY }
      }}
      onTouchEnd={(e) => {
        const start = touchStartRef.current
        touchStartRef.current = null
        if (!start || !hasMultiple) return
        const t = e.changedTouches[0]
        const dx = t.clientX - start.x
        const dy = t.clientY - start.y
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          triggerArrow(dx < 0 ? 'next' : 'prev')
        }
      }}
    >
      {activeSlide.kind === 'video' ? (
        <video
          key={activeSlide.src}
          src={activeSlide.src}
          controls
          playsInline
          preload="metadata"
          onError={onVideoError}
          className="aspect-video w-full bg-black object-contain"
        />
      ) : (
        <img
          key={activeSlide.src}
          src={activeSlide.src}
          alt={activeSlide.label ? `${altPrefix} (${activeSlide.label})` : altPrefix}
          className={`ygo-media-fade h-auto w-auto max-w-full object-contain ${imgClassName}`}
        />
      )}

      {showSlideLabel && activeSlide.label && (
        <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 rounded-[2px] bg-black/60 px-2 py-0.5 font-mono-tech text-[10.5px] font-medium text-white/95 backdrop-blur-xs sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover/carousel:opacity-100">
          {activeSlide.label}
        </span>
      )}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => triggerArrow('prev')}
            aria-label="Previous image"
            className={arrowBtnClass('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => triggerArrow('next')}
            aria-label="Next image"
            className={arrowBtnClass('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            className={`absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1.5 backdrop-blur-xs ${
              activeSlide.kind === 'video' ? 'top-2.5' : 'bottom-2.5'
            }`}
          >
            {slides.map((slide, idx) => (
              <button
                key={`${slide.label}-${idx}`}
                type="button"
                aria-label={`Go to image ${idx + 1}: ${slide.label}`}
                aria-current={idx === safeIdx ? 'true' : undefined}
                onClick={() => {
                  duelSfx.playHover()
                  onChangeIdx(idx)
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === safeIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
