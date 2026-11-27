import React from 'react'
import { FileDown, Github, Mail, Phone } from 'lucide-react'
import { HoloYugiohCard } from '../components/HoloYugiohCard'
import { TechToolkit } from '../components/TechToolkit'
import { EDUCATION_INFO, PROFILE, STANDOUT_HIGHLIGHTS } from '../data/deckData'

interface HomeSectionProps {
  onOpenCard: (cardId: string) => void
  onGoContact: () => void
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onOpenCard, onGoContact }) => {
  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      <section className="grid items-center gap-6 sm:gap-10 lg:grid-cols-[308px_1fr] lg:gap-12">
        <div
          id="tour-hero-card"
          className="mx-auto w-[min(238px,66vw)] sm:w-[276px] lg:w-[308px]"
        >
          <HoloYugiohCard flippable />
        </div>

        <div className="min-w-0 space-y-4 text-left sm:space-y-5">
          <div className="space-y-3">
            <h1 className="font-editorial text-[1.75rem] leading-[1.15] text-[var(--text-main)] sm:text-[2.6rem]">
              {PROFILE.heroHeadline}
            </h1>
            <p className="max-w-2xl text-[14.5px] leading-[1.75] text-[var(--text-secondary)] sm:text-[15.5px]">
              I&apos;m a full-stack developer and 4th-year DOST-SEI scholar at FAITH Colleges. I build database-heavy web and mobile apps with strict SQL security, shipped internal plant systems at Moriroku PH, and focus on keeping software practical for the people actually using it.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:gap-2.5 lg:justify-start">
            <button
              type="button"
              onClick={onGoContact}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90 sm:w-auto sm:py-2"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{PROFILE.emailPersonal}</span>
            </button>

            <a
              href={`tel:${PROFILE.phoneTel}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 font-mono-tech text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)] sm:flex-none sm:px-3.5"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-[var(--accent-silver)]" />
              <span>{PROFILE.phone}</span>
            </a>

            <a
              href={PROFILE.githubMain}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)] sm:flex-none sm:px-3.5"
            >
              <Github className="h-3.5 w-3.5 shrink-0" />
              <span>GitHub</span>
            </a>

            <a
              href={PROFILE.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs font-medium text-[var(--text-main)] transition hover:border-[var(--border-hover)] sm:flex-none sm:px-3.5"
            >
              <FileDown className="h-3.5 w-3.5 shrink-0" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-4 border-t border-[var(--border-subtle)] pt-8 sm:space-y-5 sm:pt-12">
        <h2 className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--accent-silver)] uppercase">
          Standout Achievements
        </h2>

        <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {STANDOUT_HIGHLIGHTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenCard(item.cardId)}
              className="group flex w-full flex-col gap-1 py-3.5 text-left transition sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-silver)] sm:text-[15px]">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{item.issuer}</p>
              </div>
              <span className="shrink-0 font-mono-tech text-[11px] font-medium text-[var(--accent-silver)] sm:text-xs sm:text-[var(--text-secondary)]">
                {item.metric}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 border-t border-[var(--border-subtle)] pt-8 sm:pt-12">
        <h2 className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--accent-silver)] uppercase">
          Education
        </h2>

        <div className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:gap-6">
          <div className="space-y-1.5">
            <h3 className="font-editorial text-xl leading-snug text-[var(--text-main)] sm:text-2xl">
              {EDUCATION_INFO.institution}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">{EDUCATION_INFO.degree}</p>
            <p className="text-xs text-[var(--text-muted)]">{EDUCATION_INFO.location}</p>
            <p className="text-xs text-[var(--text-muted)]">{PROFILE.ojtWindow}</p>
          </div>

          <ul className="space-y-2 text-[13px] text-[var(--text-secondary)] sm:text-sm">
            {EDUCATION_INFO.honors.map((h) => (
              <li key={h} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--accent-silver)]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="border-t border-[var(--border-subtle)] pt-8 sm:pt-12">
        <TechToolkit onOpenCard={onOpenCard} />
      </div>
    </div>
  )
}
