import { useEffect, useRef } from 'react'
import { duelSfx } from '../audio'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface UseModalDialogOptions {
  open: boolean
  onClose: () => void
  onStepSlide?: (delta: -1 | 1) => void
  restoreFromActive?: boolean
}

export function useModalDialog({
  open,
  onClose,
  onStepSlide,
  restoreFromActive = true,
}: UseModalDialogOptions) {
  const modalRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      if (restoreFromActive) {
        triggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null
      }
      window.requestAnimationFrame(() => {
        modalRef.current?.focus()
      })
    } else if (!open && wasOpenRef.current) {
      const trigger = triggerRef.current
      triggerRef.current = null
      if (trigger && trigger.isConnected) {
        trigger.focus()
      }
    }
    wasOpenRef.current = open
  }, [open, restoreFromActive])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft' && onStepSlide) {
        e.preventDefault()
        duelSfx.playHover()
        onStepSlide(-1)
      } else if (e.key === 'ArrowRight' && onStepSlide) {
        e.preventDefault()
        duelSfx.playHover()
        onStepSlide(1)
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
  }, [onClose, onStepSlide, open])

  const setTriggerEl = (el: HTMLElement | null) => {
    triggerRef.current = el
  }

  return { modalRef, setTriggerEl }
}
