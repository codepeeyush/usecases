import { type FormEvent, useState } from 'react'
import { Phone, Mail, MapPin, ArrowRight, CalendarCheck, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { careServices, type CareServiceId } from '@/data/clarityCareBooking'
import { buildClarityCareBookCallPath } from '@/lib/routes'

const contactInfo = [
  { icon: Phone, label: '+1 (800) 555-0199', sub: 'Mon–Fri, 8am–8pm' },
  { icon: Mail, label: 'hello@claritycare.com', sub: 'Response within 2 hours' },
  { icon: MapPin, label: '123 Wellness Ave, NY 10001', sub: 'Virtual sessions available' },
]

export default function ContactSection() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [supportType, setSupportType] = useState(careServices[0].id)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!firstName.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Enter your first name and a valid email so we can follow up.')
      return
    }

    setError('')
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: copy + contact details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              Get In Touch
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Let's talk about what you need
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">
              No pressure, no commitment. Just a friendly conversation with one of our
              care coordinators to find the right fit for you.
            </p>

            {/* Contact details */}
            <div className="space-y-5 mb-10">
              {contactInfo.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={17} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next-appointment CTA */}
            <div
              className="flex items-center gap-3 rounded-xl px-5 py-4 border border-border"
              style={{ background: 'var(--secondary)' }}
            >
              <CalendarCheck size={20} className="text-primary shrink-0" />
              <p className="text-sm text-muted-foreground flex-1">
                First appointment available <span className="text-foreground font-semibold">tomorrow</span>
              </p>
            </div>
          </div>

          {/* Right: inline lead capture */}
          <div
            className="rounded-2xl border border-border p-8 lg:p-10 shadow-sm"
            style={{ background: 'var(--card)' }}
          >
            {!submitted ? (
              <>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Need a coordinator to reach out first?</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground max-w-md">
                      Leave the basics here and we will follow up with next-step options.
                      If you already know you want a call, jump straight into the booking flow.
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Fast response
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="firstName">
                        First name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="Sarah"
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="email">
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="serviceType">
                      Best-fit support type
                    </label>
                    <select
                      id="serviceType"
                      value={supportType}
                      onChange={(event) => setSupportType(event.target.value as CareServiceId)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-foreground"
                    >
                      {careServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">
                      Prefer a scheduled time?
                    </div>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Skip the callback queue and choose a preferred slot directly.
                      </p>
                      <Link
                        to={buildClarityCareBookCallPath({ service: supportType })}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        Open booking page
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {error ? <p className="text-sm text-destructive">{error}</p> : null}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                  >
                    Send My Details
                    <ArrowRight size={15} />
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    We will reach out within one business day. No spam, ever.
                  </p>
                </form>
              </>
            ) : (
              <div className="rounded-[1.5rem] border border-primary/12 bg-[linear-gradient(180deg,rgba(244,250,251,1)_0%,rgba(236,247,248,1)_100%)] p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
                  <CheckCircle size={14} />
                  Details received
                </div>
                <h3
                  className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Thanks, {firstName.trim()}.
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  A coordinator will reach out to <span className="font-semibold text-foreground">{email}</span>{' '}
                  with next-step options for {careServices.find((service) => service.id === supportType)?.name.toLowerCase()}.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link
                    to={buildClarityCareBookCallPath({ service: supportType })}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Choose a Time Instead
                    <ArrowRight size={14} />
                  </Link>
                  <a
                    href="mailto:hello@claritycare.com"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
                  >
                    Email the Team
                    <Mail size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
