import React, { useState } from 'react'
import {
  Award,
  Check,
  Copy,
  ExternalLink,
  FileDown,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Terminal,
} from 'lucide-react'
import {
  CREDENTIAL_TRAPS,
  DUELIST_PROFILE,
  EXPERIENCE_SPELLS,
  PROJECT_CARDS,
  ProjectCardData,
  SIDE_DECK_ARCHIVE,
  SKILL_SPELLS,
} from '../data/portfolioData'
import { duelSfx } from '../utils/sfx'

interface RecruiterViewProps {
  onSwitchToDuelist: () => void
  onReplayDraw: () => void
  onInspectProject: (project: ProjectCardData) => void
  onOpenTerminal: () => void
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  onSwitchToDuelist,
  onReplayDraw,
  onInspectProject,
  onOpenTerminal,
}) => {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DUELIST_PROFILE.emailPersonal)
      setCopied(true)
      duelSfx.playClick()
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback ignored if clipboard blocked
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e6e8ee]">
      {/* Clean Minimal Editorial Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#1f2533] bg-[#0a0c10]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <a href="#recruiter-top" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded border border-[#D4AF37]/45 bg-[#121620] font-display text-xs font-bold text-[#F3DA8B]">
              MH
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">
              {DUELIST_PROFILE.shortName}
            </span>
          </a>

          <nav className="hidden items-center gap-5 text-xs font-medium text-[#98a2b3] md:flex">
            <a href="#rec-experience" className="transition hover:text-white">
              Experience
            </a>
            <a href="#rec-projects" className="transition hover:text-white">
              Projects
            </a>
            <a href="#rec-skills" className="transition hover:text-white">
              Skills
            </a>
            <a href="#rec-credentials" className="transition hover:text-white">
              Credentials
            </a>
            <a href="#rec-contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenTerminal}
              className="font-mono-tech inline-flex items-center gap-1.5 rounded border border-[#283042] bg-[#121620] px-2.5 py-1.5 text-[11px] text-[#b4bccb] transition hover:border-[#4EA8DE]/60 hover:text-white"
              title="Open Duel Terminal"
            >
              <Terminal className="h-3.5 w-3.5 text-[#4EA8DE]" />
              <span className="hidden sm:inline">CLI</span>
            </button>

            <button
              type="button"
              onClick={() => {
                duelSfx.playClick()
                onSwitchToDuelist()
              }}
              className="font-mono-tech inline-flex items-center gap-1.5 rounded border border-[#D4AF37]/50 bg-[#17140d] px-3 py-1.5 text-[11px] font-medium text-[#F3DA8B] transition hover:bg-[#241e12]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Duelist View</span>
            </button>
          </div>
        </div>
      </header>

      <main id="recruiter-top" className="mx-auto max-w-5xl space-y-16 px-4 py-12 sm:px-6">
        {/* Hero Summary */}
        <section className="grid items-center gap-8 border-b border-[#1c2230] pb-12 md:grid-cols-[1fr_200px]">
          <div className="space-y-4">
            <p className="font-mono-tech text-xs tracking-[0.14em] text-[#4EA8DE] uppercase">
              {DUELIST_PROFILE.ojtWindow}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {DUELIST_PROFILE.fullName}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#b2bac9]">
              {DUELIST_PROFILE.heroBio}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {DUELIST_PROFILE.proofPills.map((pill) => (
                <span
                  key={pill}
                  className="font-mono-tech rounded border border-[#242c3c] bg-[#11151f] px-2.5 py-1 text-[11px] text-[#d6dce8]"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={DUELIST_PROFILE.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2.5 text-xs font-bold tracking-wide text-[#090a0d] transition hover:bg-[#e5c14f]"
              >
                <FileDown className="h-4 w-4" />
                <span>Download Resume (PDF)</span>
              </a>
              <a
                href={`mailto:${DUELIST_PROFILE.emailPersonal}`}
                className="inline-flex items-center gap-2 rounded-md border border-[#2b3447] bg-[#121620] px-4 py-2.5 text-xs font-semibold text-[#e6e8ee] transition hover:border-[#D4AF37]/50"
              >
                <Mail className="h-4 w-4" />
                <span>{DUELIST_PROFILE.emailPersonal}</span>
              </a>
              <button
                type="button"
                onClick={onReplayDraw}
                className="font-mono-tech inline-flex items-center gap-1.5 rounded-md border border-[#242b3b] px-3 py-2.5 text-[11px] text-[#98a2b3] transition hover:text-[#F3DA8B]"
              >
                Replay Card Draw
              </button>
            </div>
          </div>

          <div className="mx-auto w-44 overflow-hidden rounded-xl border border-[#283042] bg-gradient-to-b from-[#152236] to-[#0d1119] pt-3 shadow-xl md:w-48">
            <img
              src="/assets/cards/ace-michael-hans.png"
              alt={DUELIST_PROFILE.fullName}
              className="mx-auto h-48 w-auto object-contain object-bottom"
            />
          </div>
        </section>

        {/* Experience */}
        <section id="rec-experience" className="space-y-5">
          <div>
            <p className="font-mono-tech text-[11px] tracking-[0.16em] text-[#D4AF37] uppercase">
              Experience
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">Internship & Production Builds</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {EXPERIENCE_SPELLS.map((exp) => (
              <article
                key={exp.id}
                className="rounded-lg border border-[#1f2636] bg-[#0f131b] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono-tech text-[11px] text-[#4EA8DE]">{exp.period}</span>
                  <span className="font-mono-tech rounded border border-[#D4AF37]/35 bg-[#19150d] px-2 py-0.5 text-[10px] text-[#F3DA8B]">
                    {exp.tag}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-white">{exp.title}</h3>
                <p className="text-xs text-[#98a2b3]">
                  {exp.org} · {exp.location}
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#c6cddb]">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="rec-projects" className="space-y-5">
          <div>
            <p className="font-mono-tech text-[11px] tracking-[0.16em] text-[#D4AF37] uppercase">
              Featured Systems
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">Projects With Clear Roles</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {PROJECT_CARDS.map((proj) => (
              <article
                key={proj.id}
                className="flex flex-col justify-between rounded-lg border border-[#1f2636] bg-[#0f131b] p-5 transition hover:border-[#D4AF37]/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-tech text-[10.5px] tracking-wider text-[#4EA8DE] uppercase">
                      {proj.roleBadge}
                    </span>
                    <span className="font-mono-tech text-[10px] text-[#7f8a9e]">{proj.serial}</span>
                  </div>
                  <h3 className="mt-1.5 text-lg font-bold text-white">{proj.projectTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#b7bfd0]">{proj.caseStudy.architecture}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.stack.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono-tech rounded border border-[#242c3d] bg-[#141925] px-2 py-0.5 text-[10.5px] text-[#cfd5e2]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#1b2230] pt-3">
                  <button
                    type="button"
                    onClick={() => onInspectProject(proj)}
                    className="font-mono-tech text-xs font-semibold text-[#F3DA8B] hover:underline"
                  >
                    Read Case Study →
                  </button>
                  {proj.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tech inline-flex items-center gap-1 text-xs text-[#98a2b3] hover:text-white"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id="rec-skills" className="space-y-5">
          <div>
            <p className="font-mono-tech text-[11px] tracking-[0.16em] text-[#D4AF37] uppercase">
              Technical Stack
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">Core Tools & Infrastructure</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SKILL_SPELLS.map((group) => (
              <div key={group.id} className="rounded-lg border border-[#1f2636] bg-[#0f131b] p-5">
                <h3 className="text-sm font-bold text-white">{group.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono-tech rounded border border-[#242c3c] bg-[#131823] px-2.5 py-1 text-[11px] text-[#d3d9e6]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Credentials */}
        <section id="rec-credentials" className="space-y-5">
          <div>
            <p className="font-mono-tech text-[11px] tracking-[0.16em] text-[#D4AF37] uppercase">
              Verified Credentials
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">Certifications & National Competitions</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CREDENTIAL_TRAPS.map((cred) => (
              <div key={cred.id} className="rounded-lg border border-[#1f2636] bg-[#0f131b] p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#D4AF37]" />
                    <h3 className="text-sm font-bold text-white">{cred.title}</h3>
                  </div>
                  <span className="font-mono-tech shrink-0 text-[11px] font-semibold text-[#F3DA8B]">
                    {cred.metric}
                  </span>
                </div>
                <p className="font-mono-tech mt-1 text-[11px] text-[#7f8a9e]">
                  {cred.issuer} · {cred.date}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#b7bfd0]">{cred.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Archive / Other Work */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">Additional Builds & Experiments</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SIDE_DECK_ARCHIVE.map((item) => (
              <div key={item.id} className="rounded-lg border border-[#1e2433] bg-[#0e121a] p-4">
                <p className="font-mono-tech text-[10px] text-[#7f8a9e] uppercase">{item.role}</p>
                <h3 className="mt-1 text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-[#98a2b3]">{item.summary}</p>
                <div className="mt-3 flex gap-3">
                  {item.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono-tech text-[11px] text-[#4EA8DE] hover:underline"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          id="rec-contact"
          className="rounded-xl border border-[#242c3d] bg-[#0f131b] p-6 sm:p-8"
        >
          <p className="font-mono-tech text-[11px] tracking-[0.16em] text-[#D4AF37] uppercase">
            Contact & OJT Availability
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">Ready for Dec 2026 – Mar 2027 (600 Hours)</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#98a2b3]">
            Based in Calamba, Laguna and ready to report on-site or hybrid in Laguna, Makati, BGC, or Ortigas.
            Main GitHub:{' '}
            <a href={DUELIST_PROFILE.githubMain} target="_blank" rel="noreferrer" className="text-[#4EA8DE] hover:underline">
              @MichaelHans32116
            </a>{' '}
            · Debug/Alt:{' '}
            <a href={DUELIST_PROFILE.githubAlt} target="_blank" rel="noreferrer" className="text-[#4EA8DE] hover:underline">
              @hans32116
            </a>
            .
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href={`mailto:${DUELIST_PROFILE.emailPersonal}`}
              className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#090a0d] hover:bg-[#e5c14f]"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{DUELIST_PROFILE.emailPersonal}</span>
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#2a3347] bg-[#131823] px-3.5 py-2 text-xs font-medium text-[#d6dce8] hover:border-[#D4AF37]/50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#34d399]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Email'}</span>
            </button>
            <a
              href={DUELIST_PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#2a3347] bg-[#131823] px-3.5 py-2 text-xs font-medium text-[#d6dce8] hover:border-[#4EA8DE]/50"
            >
              <Linkedin className="h-3.5 w-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={DUELIST_PROFILE.githubMain}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#2a3347] bg-[#131823] px-3.5 py-2 text-xs font-medium text-[#d6dce8] hover:border-[#4EA8DE]/50"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
