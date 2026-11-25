import React, { useEffect } from 'react'
import { Download, ExternalLink, Github, Lock, Smartphone, X } from 'lucide-react'
import { ProjectCardData } from '../data/portfolioData'
import { duelSfx } from '../utils/sfx'
import { YuGiOhCard } from './YuGiOhCard'

interface CardInspectorModalProps {
  project: ProjectCardData | null
  onClose: () => void
}

export const CardInspectorModal: React.FC<CardInspectorModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040508]/85 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-title"
      onClick={() => {
        duelSfx.playClick()
        onClose()
      }}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-[#D4AF37]/35 bg-[#0c0f16] shadow-[0_28px_80px_rgba(0,0,0,0.92)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#D4AF37]/20 bg-[#0c0f16]/95 px-5 py-3.5 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <span className="font-mono-tech rounded border border-[#D4AF37]/40 bg-[#151923] px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-[#F3DA8B]">
              {project.serial}
            </span>
            <span className="font-mono-tech text-[11px] tracking-wider text-[#98A2B3] uppercase">
              CARD INSPECTOR // {project.roleBadge}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              duelSfx.playClick()
              onClose()
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#2a3142] bg-[#121621] text-[#b4bccb] transition hover:border-[#D4AF37]/60 hover:text-white"
            aria-label="Close card inspector"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Grid */}
        <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[260px_1fr] md:items-start">
          {/* Interactive 3D Card */}
          <div className="mx-auto w-[235px] sm:w-[260px]">
            <YuGiOhCard
              serial={project.serial}
              cardName={project.cardName}
              cardKind={project.cardKind}
              attribute={project.attribute}
              typeLine={project.typeLine}
              levelOrRating={project.levelOrRating}
              stars={project.stars}
              atk={project.atk}
              def={project.def}
              artSrc={project.artSrc}
              artMode={project.artMode}
              pedestalTone={project.pedestalTone}
              effectText={project.effectText}
              size="md"
            />
            <p className="font-mono-tech mt-3 text-center text-[10px] tracking-wider text-[#7f8a9e] uppercase">
              Hover card for 3D holo inspection
            </p>
          </div>

          {/* Engineering Case Study */}
          <div className="space-y-5">
            <div>
              <p className="font-mono-tech text-[11px] tracking-[0.14em] text-[#4EA8DE] uppercase">
                {project.period}
              </p>
              <h2 id="inspector-title" className="font-display mt-1 text-2xl font-bold text-[#f3f5f9]">
                {project.projectTitle}
              </h2>
            </div>

            <div className="grid gap-3.5 text-sm leading-relaxed text-[#cfd5e2]">
              <div className="rounded-lg border border-[#232938] bg-[#10141e] p-3.5">
                <p className="font-mono-tech text-[10px] font-semibold tracking-[0.16em] text-[#D4AF37] uppercase">
                  01 · Problem
                </p>
                <p className="mt-1.5">{project.caseStudy.problem}</p>
              </div>

              <div className="rounded-lg border border-[#232938] bg-[#10141e] p-3.5">
                <p className="font-mono-tech text-[10px] font-semibold tracking-[0.16em] text-[#4EA8DE] uppercase">
                  02 · System Architecture
                </p>
                <p className="mt-1.5">{project.caseStudy.architecture}</p>
              </div>

              <div className="rounded-lg border border-[#232938] bg-[#10141e] p-3.5">
                <p className="font-mono-tech text-[10px] font-semibold tracking-[0.16em] text-[#34d399] uppercase">
                  03 · Verified Outcome
                </p>
                <p className="mt-1.5">{project.caseStudy.outcome}</p>
              </div>
            </div>

            {/* Key Engineering Highlights */}
            <div>
              <p className="font-mono-tech mb-2 text-[10px] font-semibold tracking-[0.16em] text-[#98A2B3] uppercase">
                Verified Engineering Notes
              </p>
              <ul className="space-y-1.5 text-sm text-[#d6dce8]">
                {project.caseStudy.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <p className="font-mono-tech mb-2 text-[10px] font-semibold tracking-[0.16em] text-[#98A2B3] uppercase">
                Stack & Infrastructure
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono-tech rounded border border-[#D4AF37]/25 bg-[#131824] px-2.5 py-1 text-[11px] text-[#e2e6ef]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Links / Private Note */}
            <div className="flex flex-wrap items-center gap-2.5 border-t border-[#D4AF37]/15 pt-4">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono-tech inline-flex items-center gap-1.5 rounded-md border border-[#D4AF37]/65 bg-gradient-to-b from-[#d4af37]/20 to-[#8a6e28]/15 px-4 py-2 text-xs font-semibold text-[#F3DA8B] transition hover:bg-[#D4AF37]/30"
                >
                  {link.kind === 'github' && <Github className="h-3.5 w-3.5" />}
                  {link.kind === 'live' && <ExternalLink className="h-3.5 w-3.5" />}
                  {link.kind === 'mobile' && <Smartphone className="h-3.5 w-3.5" />}
                  {link.kind === 'zip' && <Download className="h-3.5 w-3.5" />}
                  <span>{link.label}</span>
                </a>
              ))}

              {project.privateNote && (
                <span className="font-mono-tech inline-flex items-center gap-1.5 rounded-md border border-[#2a3142] bg-[#10141d] px-3 py-2 text-[11px] text-[#98A2B3]">
                  <Lock className="h-3.5 w-3.5 text-[#D4AF37]/75" />
                  <span>{project.privateNote}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
