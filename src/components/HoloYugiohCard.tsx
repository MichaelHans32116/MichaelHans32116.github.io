import React, { useRef, useState } from 'react'
import { duelSfx } from '../audio'
import frontCardUrl from '../cards/Michael Hans Magbojos-yugioh-card.jpeg'
import backCardUrl from '../cards/back-image-yugioh.jpg'
import '../styles/cards.css'

export { frontCardUrl, backCardUrl }

interface HoloYugiohCardProps {
  flippable?: boolean
  disableTilt?: boolean
  className?: string
  showBackFirst?: boolean
}

export const HoloYugiohCard: React.FC<HoloYugiohCardProps> = ({
  flippable = true,
  disableTilt = false,
  className = '',
  showBackFirst = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [interacting, setInteracting] = useState(false)
  const [flipped, setFlipped] = useState(showBackFirst)

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disableTilt || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

    const rotY = (px - 0.5) * 24
    const rotX = (0.5 - py) * 22
    const bgX = 25 + px * 50
    const bgY = 25 + py * 50

    const el = cardRef.current
    el.style.setProperty('--pointer-x', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--pointer-y', `${(py * 100).toFixed(1)}%`)
    el.style.setProperty('--bg-x', `${bgX.toFixed(1)}%`)
    el.style.setProperty('--bg-y', `${bgY.toFixed(1)}%`)
    el.style.setProperty('--rotate-x', `${rotX.toFixed(2)}deg`)
    el.style.setProperty('--rotate-y', `${rotY.toFixed(2)}deg`)
    el.style.setProperty('--holo-opacity', '1')
    if (!interacting) setInteracting(true)
  }

  const handlePointerLeave = () => {
    if (!cardRef.current) return
    const el = cardRef.current
    el.style.setProperty('--rotate-x', '0deg')
    el.style.setProperty('--rotate-y', '0deg')
    el.style.setProperty('--holo-opacity', '0')
    setInteracting(false)
  }

  const handleClick = () => {
    if (!flippable) return
    duelSfx.playFlip()
    setFlipped((prev) => !prev)
  }

  return (
    <div className={`holo-stage ${className}`}>
      <div
        ref={cardRef}
        data-interacting={interacting ? 'true' : 'false'}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        role={flippable ? 'button' : undefined}
        tabIndex={flippable ? 0 : undefined}
        onKeyDown={(e) => {
          if (flippable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleClick()
          }
        }}
        aria-label={flippable ? 'Michael Hans Magbojos card, click to flip' : 'Michael Hans Magbojos card'}
        className={`holo-card relative aspect-[59/86] w-full select-none ${
          flippable ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-silver)]' : ''
        }`}
      >
        <div className="holo-flipper relative h-full w-full" data-flipped={flipped ? 'true' : 'false'}>
          {/* FRONT: Pure card image with crisp authentic corners & zero outer border */}
          <div className="holo-face absolute inset-0 overflow-hidden rounded-[2px] shadow-[0_22px_50px_-14px_rgba(0,0,0,0.48)]">
            <img
              src={frontCardUrl}
              alt="Michael Hans Magbojos Yu-Gi-Oh Developer Card"
              className="h-[103%] w-full object-cover object-top"
              draggable={false}
            />
            <div className="holo-shine absolute inset-0 rounded-[2px]" />
            <div className="holo-glare absolute inset-0 rounded-[2px]" />
          </div>

          {/* BACK: Pure Yu-Gi-Oh card back */}
          <div className="holo-face holo-face-back absolute inset-0 overflow-hidden rounded-[2px] shadow-[0_22px_50px_-14px_rgba(0,0,0,0.48)]">
            <img
              src={backCardUrl}
              alt="Yu-Gi-Oh Card Back"
              className="h-full w-full object-cover"
              draggable={false}
            />
            <div className="holo-glare absolute inset-0 rounded-[2px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
