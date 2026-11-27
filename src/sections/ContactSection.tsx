import React, { useState } from 'react'
import { Check, Copy, ExternalLink, FileDown, Github, Linkedin, Mail, Phone, Send } from 'lucide-react'
import { PROFILE } from '../data/deckData'
import { duelSfx } from '../utils/sfx'

export const ContactSection: React.FC = () => {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSending, setContactSending] = useState(false)
  const [contactStatus, setContactStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [contactNotice, setContactNotice] = useState<string | null>(null)

  const copyValue = async (kind: 'email' | 'phone', val: string) => {
    try {
      await navigator.clipboard.writeText(val)
      duelSfx.playHover()
      setCopiedField(kind)
      window.setTimeout(() => setCopiedField(null), 1800)
    } catch {
      // ignore clipboard failure
    }
  }

  const handleSendContactMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const cleanName = contactName.trim()
    const cleanEmail = contactEmail.trim()
    const cleanMsg = contactMessage.trim()
    if (!cleanName || !cleanEmail || !cleanMsg) {
      setContactStatus('error')
      setContactNotice('Please fill out your name, email, and message first.')
      return
    }

    setContactSending(true)
    setContactStatus('idle')
    setContactNotice(null)
    duelSfx.playFlip()

    try {
      const resp = await fetch(`https://formsubmit.co/ajax/${PROFILE.emailPersonal}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          message: cleanMsg,
          _subject: `Portfolio Inquiry from ${cleanName}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })

      const payload = (await resp.json().catch(() => null)) as
        | { success?: boolean | string; message?: string }
        | null
      const isAccepted =
        resp.ok && (payload?.success === true || payload?.success === 'true')

      if (!isAccepted) {
        throw new Error(payload?.message || `HTTP ${resp.status}`)
      }

      setContactStatus('sent')
      setContactNotice(`Message sent to ${PROFILE.emailPersonal}. I'll reply soon.`)
      setContactName('')
      setContactEmail('')
      setContactMessage('')
    } catch {
      setContactStatus('error')
      setContactNotice(
        'Could not confirm direct delivery, so your draft was kept intact. Use "Open in Gmail Web" below or "Copy Email" on the left.',
      )
    } finally {
      setContactSending(false)
    }
  }

  return (
    <div className="space-y-9 sm:space-y-12">
      <div className="grid gap-7 sm:gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="space-y-5 sm:space-y-6">
          <div className="space-y-2.5 sm:space-y-3">
            <p className="font-mono-tech text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-silver)] uppercase">
              END PHASE
            </p>
            <h1 className="font-editorial text-[2rem] leading-tight text-[var(--text-main)] sm:text-[42px]">
              Your turn. Let&rsquo;s build.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              Looking for a 600-hour OJT intern or help on a web or backend system? Send a message here and I&rsquo;ll get back to you.
            </p>
            <div className="space-y-0.5 font-mono-tech text-xs text-[var(--text-muted)]">
              <p>{PROFILE.ojtWindow}</p>
              <p>{PROFILE.location}</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-[var(--border-subtle)] pt-5 text-sm">
            <div className="flex items-center gap-3 text-[var(--text-main)]">
              <Github className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>GitHub:</span>
                <a
                  href={PROFILE.githubMain}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
                >
                  @MichaelHans32116
                </a>
                <span className="text-[var(--text-muted)]">/</span>
                <a
                  href={PROFILE.githubAlt}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
                >
                  @hans32116
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[var(--text-main)]">
              <Linkedin className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
              >
                <span>LinkedIn: {PROFILE.shortName}</span>
                <ExternalLink className="h-3 w-3 text-[var(--text-muted)]" />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-[var(--text-main)] sm:gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
              <a
                href={`mailto:${PROFILE.emailPersonal}`}
                className="break-all font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
              >
                {PROFILE.emailPersonal}
              </a>
              <button
                type="button"
                onClick={() => copyValue('email', PROFILE.emailPersonal)}
                className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)]"
              >
                {copiedField === 'email' ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copiedField === 'email' ? 'Email Copied' : 'Copy Email'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[var(--text-main)]">
              <Phone className="h-4 w-4 shrink-0 text-[var(--accent-silver)]" />
              <a
                href={`tel:${PROFILE.phoneTel}`}
                className="font-mono-tech text-xs font-medium underline decoration-[var(--border-hover)] underline-offset-4 hover:decoration-[var(--accent-silver)]"
              >
                {PROFILE.phone}
              </a>
            </div>

            <div className="pt-2">
              <a
                href={PROFILE.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-main)] transition hover:border-[var(--border-hover)]"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Resume PDF</span>
              </a>
            </div>
          </div>
        </div>

        <form
          id="tour-contact-form"
          onSubmit={handleSendContactMessage}
          className="space-y-4 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-7"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="contact-name"
              className="block font-mono-tech text-xs font-medium text-[var(--text-secondary)]"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your name..."
              className="w-full rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-email"
              className="block font-mono-tech text-xs font-medium text-[var(--text-secondary)]"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Your email..."
              className="w-full rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-message"
              className="block font-mono-tech text-xs font-medium text-[var(--text-secondary)]"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Your message..."
              className="w-full resize-y rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)]/55 px-3.5 py-2.5 text-base text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-silver)] focus:outline-none sm:text-sm"
            />
          </div>

          {contactNotice && (
            <p
              className={`rounded-[2px] border px-3 py-2 text-xs ${
                contactStatus === 'sent'
                  ? 'border-emerald-500/45 bg-emerald-500/10 text-[var(--text-main)]'
                  : 'border-[var(--accent-silver)]/45 bg-[var(--bg-muted)] text-[var(--text-secondary)]'
              }`}
            >
              {contactNotice}
            </p>
          )}

          <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <button
              type="submit"
              disabled={contactSending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--btn-primary-bg)] px-5 py-2.5 text-xs font-semibold text-[var(--btn-primary-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{contactSending ? 'Sending...' : 'Send Message'}</span>
            </button>

            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                PROFILE.emailPersonal,
              )}&su=${encodeURIComponent(
                `Portfolio Inquiry${contactName.trim() ? ` from ${contactName.trim()}` : ''}`,
              )}&body=${encodeURIComponent(contactMessage.trim())}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-muted)] px-3.5 py-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-main)] sm:w-auto"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open in Gmail Web</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
