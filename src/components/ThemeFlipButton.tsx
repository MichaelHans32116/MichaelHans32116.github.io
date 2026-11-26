import { Moon, Sun } from 'lucide-react'

interface ThemeFlipButtonProps {
  theme: 'light' | 'dark'
  onToggle: () => void
  compact?: boolean
}

export function ThemeFlipButton({ theme, onToggle, compact = false }: ThemeFlipButtonProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={onToggle}
      title={isDark ? 'Flip card to Light Mode' : 'Flip card to Dark Mode'}
      aria-label="Toggle theme"
      className={`group relative inline-flex items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition hover:border-[var(--accent-silver)] hover:text-[var(--text-main)] ${
        compact ? 'h-8 w-8' : 'h-8 w-8 shadow-sm sm:h-9 sm:w-9'
      }`}
      style={{ perspective: 400 }}
    >
      <span
        className="relative flex h-4 w-4 items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transformStyle: 'preserve-3d',
          transform: isDark ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <Moon className="h-3.5 w-3.5" />
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Sun className="h-3.5 w-3.5 text-[var(--accent-silver)]" />
        </span>
      </span>
    </button>
  )
}
