import { useEffect } from 'react'

export type HeaderScroll = {
  y: number
  anchor: number
  direction: number
  hidden: boolean
}

/** Accumulate deliberate scroll movement so small finger jitter does not flicker the header. */
export function advanceHeaderScroll(state: HeaderScroll, nextY: number): HeaderScroll {
  const y = Math.max(0, nextY)
  const delta = y - state.y
  if (y < 28) return { y, anchor: y, direction: 0, hidden: false }
  if (Math.abs(delta) < 2) return { ...state, y }
  const direction = Math.sign(delta)
  const anchor = direction === state.direction ? state.anchor : state.y
  const distance = Math.abs(y - anchor)
  const hidden =
    direction > 0 && y > 96 && distance >= 18
      ? true
      : direction < 0 && distance >= 10
        ? false
        : state.hidden
  return { y, anchor, direction, hidden }
}

interface MobileHeaderMotionProps {
  resetKey: string
}

/** Phone top bar glides out of the way on downward scroll and returns immediately on upward scroll. */
export function MobileHeaderMotion({ resetKey }: MobileHeaderMotionProps) {
  useEffect(() => {
    const header = document.getElementById('portfolio-topbar')
    if (!header) return

    let state: HeaderScroll = { y: window.scrollY, anchor: window.scrollY, direction: 0, hidden: false }
    let currentTranslate = 0
    let lastY = window.scrollY
    let settleTimer: number | null = null
    let frame = 0

    const getMaxHide = () => (header.offsetHeight || 56) + 18

    const applyTranslate = (ty: number, animated: boolean) => {
      currentTranslate = ty
      header.style.transition = animated
        ? 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease'
        : 'none'
      header.style.transform = ty === 0 ? '' : `translateY(${ty}px)`
      if (ty <= -getMaxHide()) {
        header.style.opacity = '0'
        header.style.pointerEvents = 'none'
      } else {
        header.style.opacity = ''
        header.style.pointerEvents = ''
      }
    }

    const resetVisible = () => {
      if (settleTimer !== null) window.clearTimeout(settleTimer)
      header.style.transform = ''
      header.style.transition = ''
      header.style.opacity = ''
      header.style.pointerEvents = ''
      header.classList.remove('is-scroll-hidden')
      state = { y: window.scrollY, anchor: window.scrollY, direction: 0, hidden: false }
      currentTranslate = 0
      lastY = window.scrollY
    }

    const update = () => {
      frame = 0
      const nextY = Math.max(0, window.scrollY)
      const deltaY = nextY - lastY
      lastY = nextY
      const isMobile = window.innerWidth <= 767

      if (!isMobile) {
        resetVisible()
        return
      }

      state = advanceHeaderScroll(state, nextY)
      const maxHide = getMaxHide()

      if (nextY <= 15) {
        applyTranslate(0, false)
      } else if (Math.abs(deltaY) >= 1) {
        const targetTranslate = Math.max(-maxHide, Math.min(0, currentTranslate - deltaY))
        applyTranslate(targetTranslate, false)
      }

      header.classList.toggle('is-scroll-hidden', state.hidden)

      if (settleTimer !== null) window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        if (window.innerWidth > 767) return
        const currentY = window.scrollY
        if (currentY <= 15) {
          applyTranslate(0, true)
          header.classList.remove('is-scroll-hidden')
        } else if (state.hidden || currentTranslate < -maxHide * 0.45) {
          applyTranslate(-maxHide, true)
          header.classList.add('is-scroll-hidden')
        } else {
          applyTranslate(0, true)
          header.classList.remove('is-scroll-hidden')
        }
      }, 120)
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const reveal = () => {
      if (settleTimer !== null) window.clearTimeout(settleTimer)
      state = { y: window.scrollY, anchor: window.scrollY, direction: 0, hidden: false }
      header.classList.remove('is-scroll-hidden')
      applyTranslate(0, true)
    }

    resetVisible()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    header.addEventListener('focusin', reveal)

    return () => {
      window.cancelAnimationFrame(frame)
      if (settleTimer !== null) window.clearTimeout(settleTimer)
      resetVisible()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      header.removeEventListener('focusin', reveal)
    }
  }, [resetKey])

  return null
}

export default MobileHeaderMotion
