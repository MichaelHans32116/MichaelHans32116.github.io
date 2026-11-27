import React from 'react'
import { EXPERIENCE_HIGHLIGHTS, OJT_EXPERIENCE_PHOTOS } from '../data/deckData'

interface ExperienceSectionProps {
  onOpenCard: (cardId: string) => void
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onOpenCard }) => {
  return (
    <div className="space-y-10 sm:space-y-14">
      <div className="space-y-2 border-b border-[var(--border-subtle)] pb-5 sm:pb-6">
        <p className="font-mono-tech text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-silver)] uppercase">
          BATTLE PHASE
        </p>
        <h1 className="font-editorial text-3xl text-[var(--text-main)] sm:text-4xl">
          Experience &amp; Field Record
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Enterprise internship delivery at Moriroku Philippines, startup engineering at BuildBid, and field deployments.
        </p>
      </div>

      <div id="tour-exp-list" className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {EXPERIENCE_HIGHLIGHTS.map((exp) => (
          <article
            key={exp.id}
            className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-tech text-xs text-[var(--text-muted)]">
                {exp.period}
              </span>
              <span className="font-mono-tech text-[11px] font-semibold text-[var(--accent-silver)]">
                {exp.badge}
              </span>
            </div>
            <h2 className="mt-2.5 text-base font-semibold text-[var(--text-main)] sm:mt-3 sm:text-lg">
              {exp.role}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{exp.company}</p>
            <p className="text-xs text-[var(--text-muted)]">{exp.location}</p>
            <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:text-sm">
              {exp.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--accent-silver)]" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section
        id="tour-ojt-strip"
        className="space-y-4 border-t border-[var(--border-subtle)] pt-8 sm:space-y-5"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-mono-tech text-xs font-semibold tracking-[0.14em] text-[var(--accent-silver)] uppercase">
            Moriroku Philippines OJT Moments
          </h2>
          <span className="text-xs text-[var(--text-muted)]">Click any photo to open its card</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {OJT_EXPERIENCE_PHOTOS.map((shot) => (
            <button
              key={shot.id}
              type="button"
              onClick={() => onOpenCard(shot.cardId)}
              className="group flex flex-col overflow-hidden rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-left transition hover:-translate-y-0.5 hover:border-[var(--accent-silver)] hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-muted)]">
                <img
                  src={shot.src}
                  alt={shot.label}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-3.5">
                <p className="text-sm font-semibold text-[var(--text-main)]">{shot.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {shot.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
