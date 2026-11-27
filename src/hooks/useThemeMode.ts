import { useCallback, useEffect, useRef, useState } from 'react'
import { duelSfx } from '../audio'

export type ThemeMode = 'light' | 'dark'
export type ThemeFlipDirection = 'to-dark' | 'to-light' | null

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    try {
      return window.localStorage.getItem('mh-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  const [themeFlipDir, setThemeFlipDir] = useState<ThemeFlipDirection>(null)

  const swapTimerRef = useRef<number | null>(null)
  const endTimerRef = useRef<number | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      window.localStorage.setItem('mh-theme', theme)
    } catch {
      // ignore storage failure
    }
  }, [theme])

  useEffect(() => {
    return () => {
      if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current)
      if (endTimerRef.current) window.clearTimeout(endTimerRef.current)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    duelSfx.playFlip()
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
      return
    }

    if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current)
    if (endTimerRef.current) window.clearTimeout(endTimerRef.current)

    const nextDir = theme === 'light' ? 'to-dark' : 'to-light'
    setThemeFlipDir(nextDir)
    swapTimerRef.current = window.setTimeout(() => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }, 310)
    endTimerRef.current = window.setTimeout(() => {
      setThemeFlipDir(null)
    }, 640)
  }, [theme])

  return { theme, themeFlipDir, toggleTheme }
}
