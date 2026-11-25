import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Terminal as TerminalIcon } from 'lucide-react'
import {
  CREDENTIAL_TRAPS,
  DUELIST_PROFILE,
  PROJECT_CARDS,
  ProjectCardData,
  SKILL_SPELLS,
  TERMINAL_EASTER_EGGS,
} from '../data/portfolioData'
import { duelSfx } from '../utils/sfx'

interface TerminalLine {
  id: number
  kind: 'cmd' | 'out' | 'gold' | 'accent' | 'error'
  text: string
}

interface DuelTerminalProps {
  open: boolean
  onToggleOpen: () => void
  onReplayDraw: () => void
  onSummonProject: (project: ProjectCardData) => void
  onSetMode: (mode: 'duelist' | 'recruiter') => void
  onSetSfx: (enabled: boolean) => void
  sfxEnabled: boolean
  viewMode: 'duelist' | 'recruiter'
}

const KNOWN_COMMANDS = [
  'help',
  'whoami',
  'stats',
  'draw',
  'deck',
  'summon buildbid',
  'summon gatepass',
  'summon insectra',
  'summon howconnect',
  'skills',
  'awards',
  'lp',
  'open resume',
  'open github',
  'open linkedin',
  'open buildbid',
  'mode recruiter',
  'mode duelist',
  'sfx on',
  'sfx off',
  'pot of greed',
  'exodia',
  'heart of the cards',
  'trap',
  'mirror force',
  'sudo hire-me',
  'clear',
  'hide',
]

const QUICK_CHIPS = ['help', 'deck', 'summon buildbid', 'pot of greed', 'exodia', 'open resume']

export const DuelTerminal: React.FC<DuelTerminalProps> = ({
  open,
  onToggleOpen,
  onReplayDraw,
  onSummonProject,
  onSetMode,
  onSetSfx,
  sfxEnabled,
  viewMode,
}) => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 1,
      kind: 'gold',
      text: 'DUEL DISK CLI v2.6 initialized — type `help` to list commands, or `summon buildbid` to inspect a card.',
    },
  ])

  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(2)

  const pushLines = (entries: Omit<TerminalLine, 'id'>[]) => {
    setLines((prev) => [
      ...prev,
      ...entries.map((entry) => ({
        ...entry,
        id: nextId.current++,
      })),
    ])
  }

  useEffect(() => {
    if (open && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [lines, open])

  // Global backtick (`) or Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const inInput =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target !== inputRef.current
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onToggleOpen()
      } else if (!inInput && e.key === '`' && target !== inputRef.current) {
        e.preventDefault()
        onToggleOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onToggleOpen])

  const execute = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    const cmd = trimmed.toLowerCase()

    duelSfx.playTerminal()
    setHistory((prev) => [trimmed, ...prev.slice(0, 29)])
    setHistIdx(-1)
    pushLines([{ kind: 'cmd', text: `${DUELIST_PROFILE.handle} ~ $ ${trimmed}` }])

    if (cmd === 'clear') {
      setLines([])
      return
    }

    if (cmd === 'hide' || cmd === 'exit') {
      onToggleOpen()
      return
    }

    if (cmd === 'help') {
      pushLines([
        { kind: 'gold', text: 'CORE COMMANDS:' },
        { kind: 'out', text: '  draw                 Replay the Yu-Gi-Oh opening deck-draw sequence' },
        { kind: 'out', text: '  deck                 List all summonable Project Monster Cards' },
        { kind: 'out', text: '  summon <name>        Inspect a project card (e.g. summon buildbid | gatepass | insectra | howconnect)' },
        { kind: 'out', text: '  cd <zone>            Jump to section (ace | projects | deck-specs | archive | contact)' },
        { kind: 'out', text: '  whoami | stats       Show duelist profile, LP, and OJT window' },
        { kind: 'out', text: '  skills | awards      Print stack loadout or verified competitions & certs' },
        { kind: 'out', text: '  open <target>        Open resume | github | linkedin | buildbid' },
        { kind: 'out', text: '  mode <view>          Switch between `mode duelist` and `mode recruiter`' },
        { kind: 'out', text: '  sfx <on|off>         Toggle synthesized duel audio feedback' },
        { kind: 'accent', text: 'EASTER EGGS: pot of greed · exodia · heart of the cards · trap · mirror force · sudo hire-me' },
      ])
      return
    }

    if (cmd === 'draw' || cmd === 'redraw') {
      pushLines([{ kind: 'gold', text: '[DRAW PHASE] Returning to Duel Mat and shuffling Main Deck...' }])
      window.setTimeout(() => onReplayDraw(), 260)
      return
    }

    if (cmd === 'deck' || cmd === 'ls' || cmd === 'ls projects') {
      pushLines([
        { kind: 'gold', text: `MAIN & EXTRA DECK (${PROJECT_CARDS.length} MONSTER CARDS):` },
        ...PROJECT_CARDS.map((p) => ({
          kind: 'out' as const,
          text: `  [${p.serial}] ${p.slug.padEnd(14, ' ')} ${p.cardKind.padEnd(8, ' ')} ATK/${p.atk.padEnd(5, ' ')} — ${p.projectTitle}`,
        })),
        { kind: 'accent', text: 'Tip: run `summon buildbid` or `summon insectra` to open the 3D Card Inspector.' },
      ])
      return
    }

    if (cmd.startsWith('summon ')) {
      const q = cmd.replace(/^summon\s+/, '').trim()
      const match = PROJECT_CARDS.find(
        (p) =>
          p.slug === q ||
          p.id === q ||
          p.projectTitle.toLowerCase().includes(q) ||
          p.cardName.toLowerCase().includes(q),
      )
      if (match) {
        pushLines([
          { kind: 'gold', text: `[SUMMON SUCCESS] ${match.cardName} (${match.cardKind} · ATK/${match.atk}) summoned to Inspector!` },
        ])
        onSummonProject(match)
      } else {
        pushLines([
          { kind: 'error', text: `Card "${q}" not found in Deck. Try: summon buildbid | gatepass | insectra | howconnect` },
        ])
      }
      return
    }

    if (cmd.startsWith('cd ')) {
      const target = cmd.replace(/^cd\s+/, '').trim()
      const idMap: Record<string, string> = {
        ace: 'ace',
        home: 'ace',
        projects: 'projects',
        work: 'projects',
        monsters: 'projects',
        skills: 'deck-specs',
        'deck-specs': 'deck-specs',
        experience: 'deck-specs',
        archive: 'archive',
        side: 'archive',
        contact: 'contact',
      }
      const domId = idMap[target]
      const el = domId ? document.getElementById(domId) : null
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        pushLines([{ kind: 'accent', text: `Navigated to zone #${domId}.` }])
      } else {
        pushLines([{ kind: 'error', text: `Unknown zone "${target}". Try: cd projects | skills | archive | contact` }])
      }
      return
    }

    if (cmd === 'stats' || cmd === 'lp') {
      pushLines([
        { kind: 'gold', text: `DUELIST LP: ${DUELIST_PROFILE.lp} / 8000 · VIEW: ${viewMode.toUpperCase()} · SFX: ${sfxEnabled ? 'ON' : 'OFF'}` },
        { kind: 'out', text: '  ATK / 2600  DEF / 2100  —  Full-Stack & Database Security Architecture' },
        { kind: 'out', text: `  OJT SLOT  : ${DUELIST_PROFILE.ojtWindow}` },
        { kind: 'out', text: '  GITHUB    : @MichaelHans32116 (Main) + @hans32116 (Debug/Alt)' },
      ])
      return
    }

    if (cmd === 'skills') {
      pushLines([
        { kind: 'gold', text: 'SPELL DECK — ENGINEERING STACK:' },
        ...SKILL_SPELLS.map((g) => ({
          kind: 'out' as const,
          text: `  [${g.title}] ${g.items.join(', ')}`,
        })),
      ])
      return
    }

    if (cmd === 'awards' || cmd === 'certs') {
      pushLines([
        { kind: 'gold', text: 'TRAP DECK — VERIFIED CREDENTIALS:' },
        ...CREDENTIAL_TRAPS.map((c) => ({
          kind: 'out' as const,
          text: `  [${c.metric}] ${c.title} — ${c.issuer} (${c.date})`,
        })),
      ])
      return
    }

    if (cmd === 'contact') {
      pushLines([
        { kind: 'gold', text: 'DIRECT CHANNELS:' },
        { kind: 'out', text: `  Personal Email : ${DUELIST_PROFILE.emailPersonal}` },
        { kind: 'out', text: `  School Email   : ${DUELIST_PROFILE.emailSchool}` },
        { kind: 'out', text: `  LinkedIn       : ${DUELIST_PROFILE.linkedin}` },
        { kind: 'out', text: `  GitHub         : ${DUELIST_PROFILE.githubMain}` },
      ])
      return
    }

    if (cmd.startsWith('open ')) {
      const target = cmd.replace(/^open\s+/, '').trim()
      const urls: Record<string, { label: string; url: string }> = {
        resume: { label: 'Resume PDF', url: DUELIST_PROFILE.resumeUrl },
        cv: { label: 'Resume PDF', url: DUELIST_PROFILE.resumeUrl },
        github: { label: 'GitHub (@MichaelHans32116)', url: DUELIST_PROFILE.githubMain },
        linkedin: { label: 'LinkedIn Profile', url: DUELIST_PROFILE.linkedin },
        buildbid: { label: 'BuildBid (thebuildbid.com)', url: 'https://thebuildbid.com' },
      }
      const chosen = urls[target]
      if (chosen) {
        window.open(chosen.url, '_blank', 'noopener,noreferrer')
        pushLines([{ kind: 'accent', text: `Opening ${chosen.label} in a new tab...` }])
      } else {
        pushLines([{ kind: 'error', text: `Unknown target "${target}". Try: open resume | github | linkedin | buildbid` }])
      }
      return
    }

    if (cmd === 'mode recruiter' || cmd === 'recruiter') {
      onSetMode('recruiter')
      pushLines([{ kind: 'accent', text: 'Switched to Recruiter / Editorial Mode.' }])
      return
    }

    if (cmd === 'mode duelist' || cmd === 'duelist') {
      onSetMode('duelist')
      pushLines([{ kind: 'gold', text: 'Switched to Yu-Gi-Oh Duelist Field Mode.' }])
      return
    }

    if (cmd === 'sfx on') {
      onSetSfx(true)
      pushLines([{ kind: 'accent', text: 'Duel audio synthesizer enabled.' }])
      return
    }

    if (cmd === 'sfx off') {
      onSetSfx(false)
      pushLines([{ kind: 'out', text: 'Duel audio synthesizer muted.' }])
      return
    }

    if (TERMINAL_EASTER_EGGS[cmd]) {
      pushLines(
        TERMINAL_EASTER_EGGS[cmd].map((line, i) => ({
          kind: i === 0 ? ('gold' as const) : ('out' as const),
          text: line,
        })),
      )
      return
    }

    pushLines([
      {
        kind: 'error',
        text: `Command not recognized: "${trimmed}". Type \`help\` for available commands.`,
      },
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx <= 0) {
        setHistIdx(-1)
        setInput('')
      } else {
        const next = histIdx - 1
        setHistIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const q = input.trim().toLowerCase()
      if (!q) return
      const match = KNOWN_COMMANDS.find((c) => c.startsWith(q))
      if (match) setInput(match)
    }
  }

  return (
    <aside
      aria-label="Duel Disk Command Terminal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D4AF37]/30 bg-[#07090d]/96 shadow-[0_-12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md"
    >
      {/* Sleek 42px Top Bar (always visible, never overlaps page content thanks to dynamic body padding) */}
      <div className="mx-auto flex h-[42px] max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
        <button
          type="button"
          onClick={() => {
            duelSfx.playClick()
            onToggleOpen()
          }}
          className="font-mono-tech flex items-center gap-2 text-xs text-[#d6dce8] transition hover:text-[#F3DA8B]"
        >
          <TerminalIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span className="font-semibold text-[#F3DA8B]">{DUELIST_PROFILE.handle}</span>
          <span className="hidden text-[#6f7b91] sm:inline">~ $</span>
          <span className="hidden rounded border border-[#232a3a] bg-[#0e121b] px-1.5 py-0.5 text-[10px] text-[#8d97ab] md:inline">
            {open ? 'ACTIVE' : 'Press ` or Ctrl+K'}
          </span>
        </button>

        {/* Quick Clickable Command Pills */}
        <div className="hidden items-center gap-1.5 lg:flex">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                if (!open) onToggleOpen()
                execute(chip)
              }}
              className="font-mono-tech rounded border border-[#222938] bg-[#0e121a] px-2 py-0.5 text-[10px] text-[#9aa5b9] transition hover:border-[#D4AF37]/50 hover:text-[#F3DA8B]"
            >
              {chip}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            duelSfx.playClick()
            onToggleOpen()
          }}
          className="font-mono-tech inline-flex items-center gap-1 rounded border border-[#D4AF37]/25 bg-[#10141e] px-2.5 py-1 text-[10.5px] text-[#cfd5e2] transition hover:border-[#D4AF37]/60 hover:text-[#F3DA8B]"
          aria-expanded={open}
        >
          <span>{open ? 'Minimize' : 'Open CLI'}</span>
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Expandable Terminal Drawer */}
      {open && (
        <div className="mx-auto flex h-[230px] max-w-6xl flex-col border-t border-[#1c2231] px-3 pb-3 pt-2 sm:px-6">
          {/* Output Log */}
          <div
            ref={outputRef}
            className="font-mono-tech flex-1 space-y-1 overflow-y-auto pr-2 text-[11.5px] leading-relaxed"
          >
            {lines.map((line) => (
              <div
                key={line.id}
                className={
                  line.kind === 'cmd'
                    ? 'font-semibold text-[#F3DA8B]'
                    : line.kind === 'gold'
                    ? 'text-[#e9cb6d]'
                    : line.kind === 'accent'
                    ? 'text-[#6fc0f0]'
                    : line.kind === 'error'
                    ? 'text-[#eb7b8e]'
                    : 'whitespace-pre-wrap text-[#c5ccd9]'
                }
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Mobile Quick Chips */}
          <div className="my-1.5 flex gap-1.5 overflow-x-auto pb-0.5 lg:hidden">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => execute(chip)}
                className="font-mono-tech shrink-0 rounded border border-[#222938] bg-[#0e121a] px-2 py-0.5 text-[10px] text-[#9aa5b9]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Prompt Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              execute(input)
              setInput('')
            }}
            className="font-mono-tech mt-1 flex items-center gap-2 rounded-md border border-[#D4AF37]/30 bg-[#0b0e15] px-3 py-1.5 text-xs focus-within:border-[#D4AF37]/75"
          >
            <span className="shrink-0 font-semibold text-[#D4AF37]">{DUELIST_PROFILE.handle} ~ $</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type `help`, `summon buildbid`, `pot of greed`, `draw`... (Tab to complete)"
              spellCheck={false}
              autoComplete="off"
              className="w-full bg-transparent text-[#f0f2f7] placeholder-[#5e6980] focus:outline-none"
            />
          </form>
        </div>
      )}
    </aside>
  )
}
