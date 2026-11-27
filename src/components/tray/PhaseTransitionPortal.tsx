import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { PhaseCardItem, PortfolioPhase } from './phaseCards'
import { PhaseCardVisual } from './PhaseCardVisual'

export interface PhaseTransitionState {
  item: PhaseCardItem
  customUrl?: string
  startRect: { left: number; top: number; width: number; height: number }
  vw: number
  vh: number
}

interface PhaseTransitionPortalProps {
  transition: PhaseTransitionState | null
  isLight: boolean
  onSelectPhase: (phase: PortfolioPhase) => void
  onReplayDraw: () => void
  onDone: () => void
}

export function PhaseTransitionPortal({
  transition,
  isLight,
  onSelectPhase,
  onReplayDraw,
  onDone,
}: PhaseTransitionPortalProps) {
  const portalRef = useRef<HTMLDivElement>(null)
  const dimRef = useRef<HTMLDivElement>(null)
  const raysRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const irisOverlayRef = useRef<SVGSVGElement>(null)
  const irisMaskCircleRef = useRef<SVGCircleElement>(null)
  const irisRingRef = useRef<SVGCircleElement>(null)
  const onSelectPhaseRef = useRef(onSelectPhase)
  const onReplayDrawRef = useRef(onReplayDraw)
  const onDoneRef = useRef(onDone)

  onSelectPhaseRef.current = onSelectPhase
  onReplayDrawRef.current = onReplayDraw
  onDoneRef.current = onDone

  useEffect(() => {
    if (
      !transition ||
      !dimRef.current ||
      !raysRef.current ||
      !cardRef.current ||
      !irisOverlayRef.current ||
      !irisMaskCircleRef.current ||
      !irisRingRef.current
    ) {
      return
    }

    const dimEl = dimRef.current
    const raysEl = raysRef.current
    const cardEl = cardRef.current
    const irisEl = irisOverlayRef.current
    const maskCircleEl = irisMaskCircleRef.current
    const ringEl = irisRingRef.current
    const { item, startRect, vw, vh } = transition

    const centerX = vw / 2
    const centerY = vh / 2
    const maxR = Math.ceil(Math.hypot(centerX, centerY)) + 20
    const dx = centerX - (startRect.left + startRect.width / 2)
    const dy = centerY - (startRect.top + startRect.height / 2)
    const targetScale = Math.min(1.9, (vh * 0.48) / Math.max(180, startRect.height))

    gsap.set(dimEl, { opacity: 0 })
    gsap.set(raysEl, { opacity: 0, scale: 0.65 })
    gsap.set(cardEl, { x: 0, y: 0, scale: 1, opacity: 1 })
    gsap.set(irisEl, { opacity: 0 })
    gsap.set([maskCircleEl, ringEl], { attr: { r: 0 } })
    gsap.set(ringEl, { opacity: 0 })

    let switched = false
    const tl = gsap.timeline({
      onComplete: () => {
        onDoneRef.current()
      },
    })

    tl.to(dimEl, { opacity: 1, duration: 0.28, ease: 'power2.out' }, 0)
      .to(raysEl, { opacity: 1, scale: 1, duration: 0.38, ease: 'power2.out' }, 0.08)
      .to(
        cardEl,
        {
          x: dx,
          y: dy,
          scale: targetScale,
          duration: 0.42,
          ease: 'back.out(1.26)',
        },
        0,
      )
      .to(cardEl, { duration: 0.14 })
      .to(cardEl, { scale: 2.65, opacity: 0, duration: 0.25, ease: 'power2.in' }, 'seal')
      .to(raysEl, { opacity: 0, scale: 1.35, duration: 0.24, ease: 'power2.in' }, 'seal')
      .to(irisEl, { opacity: 1, duration: 0.22, ease: 'power2.inOut' }, 'seal')
      .call(() => {
        if (switched) return
        switched = true
        if (item.id === 'draw') onReplayDrawRef.current()
        else onSelectPhaseRef.current(item.id)
      })
      .set(dimEl, { opacity: 0 })
      .set(ringEl, { opacity: 0.95 })
      .to([maskCircleEl, ringEl], { attr: { r: maxR }, duration: 0.56, ease: 'power3.inOut' }, 'iris')
      .to(ringEl, { opacity: 0, duration: 0.42, ease: 'power2.out' }, 'iris+=0.14')

    return () => {
      tl.kill()
      if (!switched) {
        if (item.id === 'draw') onReplayDrawRef.current()
        else onSelectPhaseRef.current(item.id)
      }
    }
  }, [transition])

  if (!transition) return null

  return (
    <div ref={portalRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <div ref={dimRef} className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

      <svg
        ref={irisOverlayRef}
        viewBox={`0 0 ${transition.vw} ${transition.vh}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <mask id="pvz-iris-mask">
            <rect x="0" y="0" width={transition.vw} height={transition.vh} fill="white" />
            <circle
              ref={irisMaskCircleRef}
              cx={transition.vw / 2}
              cy={transition.vh / 2}
              r={0}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width={transition.vw}
          height={transition.vh}
          fill={isLight ? '#f6f4ee' : '#0b0e14'}
          mask="url(#pvz-iris-mask)"
        />
        <circle
          ref={irisRingRef}
          cx={transition.vw / 2}
          cy={transition.vh / 2}
          r={0}
          fill="none"
          stroke={isLight ? '#647081' : '#e2e8f0'}
          strokeWidth="4"
        />
      </svg>

      <div
        ref={raysRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-[min(540px,125vw)] w-[min(540px,125vw)] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <div className="summon-rays absolute inset-0 rounded-full" />
        <div className="summon-ring absolute h-[48%] w-[48%] rounded-full" />
      </div>

      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          left: transition.startRect.left,
          top: transition.startRect.top,
          width: transition.startRect.width,
          height: transition.startRect.height,
          transformOrigin: 'center center',
        }}
        className="z-20 flex flex-col overflow-hidden rounded-[2px] border-2 border-[#e2e8f0] shadow-[0_0_38px_rgba(226,232,240,0.52)]"
      >
        <PhaseCardVisual
          item={transition.item}
          customUrl={transition.customUrl}
          isLight={isLight}
          isCurrentPhase={false}
          isHighlighted
        />
      </div>
    </div>
  )
}
