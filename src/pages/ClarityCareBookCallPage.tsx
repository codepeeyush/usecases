import { type FormEvent, startTransition, useEffect, useRef, useState } from 'react'
import { ArrowRight, CalendarCheck, CheckCircle, Clock3, Mail, Phone, ShieldCheck } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import HealthcareShell from '@/components/healthcare/HealthcareShell'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  bookingSlots,
  buildBookingDays,
  careServices,
  getCareService,
  getSessionFormat,
  type CareServiceId,
  type SessionFormatId,
  sessionFormats,
} from '@/data/clarityCareBooking'
import { useHashScroll } from '@/hooks/useHashScroll'
import { clarityCarePaths } from '@/lib/routes'
import { cn } from '@/lib/utils'

type BookingErrors = Partial<Record<'firstName' | 'email' | 'phone', string>>

type BookingDetails = {
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

type BookingConfirmation = {
  confirmationCode: string
  bookedDay: string
  bookedTime: string
  serviceName: string
  formatName: string
  firstName: string
}

const initialDetails: BookingDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  notes: '',
}

const trustPoints = [
  'HIPAA-compliant virtual sessions',
  'Care coordinator follow-up within one business day',
  'Flexible therapist rematch if the fit is off',
]

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

function isValidPhone(phone: string) {
  return phone.replace(/\D/g, '').length >= 10
}

function buildConfirmationCode() {
  return `CC-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

export default function ClarityCareBookCallPage() {
  useHashScroll()

  const [searchParams, setSearchParams] = useSearchParams()
  const [bookingDays] = useState(() => buildBookingDays())
  const [details, setDetails] = useState(initialDetails)
  const [errors, setErrors] = useState<BookingErrors>({})
  const [selectedDay, setSelectedDay] = useState(() => buildBookingDays(1)[0]?.id ?? '')
  const [selectedSlot, setSelectedSlot] = useState(bookingSlots[0]?.id ?? '')
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submissionTimeoutRef = useRef<number | null>(null)

  const selectedService = getCareService(searchParams.get('service'))
  const selectedFormat = getSessionFormat(searchParams.get('format'))

  useEffect(() => {
    if (!searchParams.get('service')) {
      const next = new URLSearchParams(searchParams)
      next.set('service', selectedService.id)
      next.set('format', selectedFormat.id)
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, selectedFormat.id, selectedService.id, setSearchParams])

  useEffect(() => {
    return () => {
      if (submissionTimeoutRef.current !== null) {
        window.clearTimeout(submissionTimeoutRef.current)
      }
    }
  }, [])

  function updateBookingPreference(
    key: 'service' | 'format',
    value: CareServiceId | SessionFormatId
  ) {
    startTransition(() => {
      const next = new URLSearchParams(searchParams)
      next.set(key, value)
      setSearchParams(next, { replace: true })
    })
  }

  function updateDetails<K extends keyof BookingDetails>(key: K, value: BookingDetails[K]) {
    setDetails((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key as keyof BookingErrors]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[key as keyof BookingErrors]
      return nextErrors
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: BookingErrors = {}

    if (!details.firstName.trim()) {
      nextErrors.firstName = 'First name is required.'
    }

    if (!isValidEmail(details.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!isValidPhone(details.phone)) {
      nextErrors.phone = 'Enter a valid phone number.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    submissionTimeoutRef.current = window.setTimeout(() => {
      setIsSubmitting(false)

      const bookedDay =
        bookingDays.find(({ id }) => id === selectedDay)?.fullLabel ?? bookingDays[0]?.fullLabel ?? 'Soon'
      const bookedTime =
        bookingSlots.find(({ id }) => id === selectedSlot)?.label ?? bookingSlots[0]?.label ?? '9:00 AM'

      startTransition(() => {
        setConfirmation({
          confirmationCode: buildConfirmationCode(),
          bookedDay,
          bookedTime,
          serviceName: selectedService.name,
          formatName: selectedFormat.label,
          firstName: details.firstName.trim(),
        })
      })
    }, 900)
  }

  if (confirmation) {
    return (
      <HealthcareShell>
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(244,250,251,1)_0%,rgba(235,244,247,1)_100%)] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(77,154,173,0.18),transparent_62%)]" />
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-card shadow-[0_34px_90px_rgba(15,31,56,0.12)]">
              <div className="border-b border-border/80 bg-[linear-gradient(135deg,rgba(13,31,56,0.96)_0%,rgba(17,108,123,0.94)_100%)] px-8 py-10 text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
                  <CheckCircle size={14} className="text-emerald-300" />
                  Booking Request Confirmed
                </div>
                <h1
                  className="mt-5 text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.04] tracking-[-0.03em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {confirmation.firstName}, your care request is in motion.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
                  A coordinator will reach out to confirm fit, answer any final questions,
                  and lock your first session.
                </p>
              </div>

              <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-border bg-background p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Your Request
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          Service
                        </div>
                        <div className="mt-1 text-lg font-semibold">{confirmation.serviceName}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          Session Format
                        </div>
                        <div className="mt-1 text-lg font-semibold">{confirmation.formatName}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          Preferred Day
                        </div>
                        <div className="mt-1 text-lg font-semibold">{confirmation.bookedDay}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          Preferred Time
                        </div>
                        <div className="mt-1 text-lg font-semibold">{confirmation.bookedTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-secondary p-5">
                    <p className="text-sm font-semibold">What happens next</p>
                    <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                      <p>1. We review your preferences and therapist fit.</p>
                      <p>2. You receive a confirmation call or email within one business day.</p>
                      <p>3. If this slot is unavailable, we send the next closest option immediately.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-primary/12 bg-[linear-gradient(180deg,rgba(244,250,251,1)_0%,rgba(236,247,248,1)_100%)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Confirmation Code
                  </p>
                  <div
                    className="mt-3 text-3xl font-bold tracking-[0.12em] text-foreground"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {confirmation.confirmationCode}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Save this if you need to call or email us before the coordinator reaches out.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      to={clarityCarePaths.home}
                      className={buttonVariants({
                        size: 'lg',
                        className: 'h-11 rounded-xl px-5 text-sm font-semibold',
                      })}
                    >
                      Back to Home
                    </Link>
                    <a
                      href="tel:+18005550199"
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'lg',
                        className: 'h-11 rounded-xl px-5 text-sm font-semibold',
                      })}
                    >
                      Call the Care Team
                    </a>
                    <a
                      href="mailto:hello@claritycare.com"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                    >
                      hello@claritycare.com
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </HealthcareShell>
    )
  }

  return (
    <HealthcareShell>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(244,250,251,1)_0%,rgba(235,244,247,1)_100%)] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(77,154,173,0.2),transparent_60%)]" />
        <div className="absolute right-[-8rem] top-28 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="pt-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <CalendarCheck size={14} />
                Book a Call
              </div>
              <h1
                className="mt-5 max-w-2xl text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Choose your care path and we will shape the first conversation around it.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                This flow keeps the decisions small: pick the kind of support you want,
                choose how you want to meet, and select the time window that works this week.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/75 px-4 py-2 text-sm text-foreground shadow-sm"
                  >
                    <ShieldCheck size={14} className="text-primary" />
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {careServices.map((service) => {
                  const isActive = service.id === selectedService.id

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => updateBookingPreference('service', service.id)}
                      className={cn(
                        'rounded-[1.6rem] border p-5 text-left transition-all duration-200',
                        isActive
                          ? 'border-primary bg-card shadow-[0_24px_60px_rgba(15,31,56,0.12)]'
                          : 'border-border/80 bg-white/78 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_50px_rgba(15,31,56,0.08)]'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
                            {service.selectorLabel}
                          </p>
                          <h2
                            className="mt-2 text-2xl font-semibold leading-tight"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {service.name}
                          </h2>
                        </div>
                        {service.tag ? (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            {service.tag}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">{service.heroSummary}</p>
                      <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-foreground/55">
                        {service.focusAreas}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/80 bg-card p-6 shadow-[0_34px_90px_rgba(15,31,56,0.12)] lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Booking Details
                  </p>
                  <h2
                    className="mt-2 text-3xl font-semibold tracking-[-0.03em]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Reserve your intake call
                  </h2>
                </div>
                <div className="rounded-full border border-primary/12 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  2 min
                </div>
              </div>

              <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <p className="text-sm font-semibold">How would you like to meet?</p>
                  <div className="mt-3 grid gap-3">
                    {sessionFormats.map((format) => {
                      const isActive = format.id === selectedFormat.id

                      return (
                        <button
                          key={format.id}
                          type="button"
                          onClick={() => updateBookingPreference('format', format.id)}
                          className={cn(
                            'rounded-[1.25rem] border px-4 py-4 text-left transition-colors',
                            isActive
                              ? 'border-primary bg-primary/6'
                              : 'border-border hover:border-primary/25 hover:bg-secondary/60'
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold">{format.label}</span>
                            {isActive ? <CheckCircle size={16} className="text-primary" /> : null}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {format.description}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarCheck size={16} className="text-primary" />
                    Preferred day
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {bookingDays.map((day) => {
                      const isActive = day.id === selectedDay

                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => setSelectedDay(day.id)}
                          className={cn(
                            'rounded-[1.25rem] border px-4 py-4 text-left transition-colors',
                            isActive
                              ? 'border-primary bg-primary/6'
                              : 'border-border hover:border-primary/25 hover:bg-secondary/60'
                          )}
                        >
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
                            {day.weekday}
                          </div>
                          <div className="mt-2 text-lg font-semibold">{day.dateLabel}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Clock3 size={16} className="text-primary" />
                    Time window
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {bookingSlots.map((slot) => {
                      const isActive = slot.id === selectedSlot

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot.id)}
                          className={cn(
                            'rounded-[1.25rem] border px-4 py-4 text-left transition-colors',
                            isActive
                              ? 'border-primary bg-primary/6'
                              : 'border-border hover:border-primary/25 hover:bg-secondary/60'
                          )}
                        >
                          <div className="text-sm font-semibold">{slot.label}</div>
                          <div className="mt-1 text-sm text-muted-foreground">{slot.windowLabel}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="booking-first-name"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      First name
                    </label>
                    <Input
                      id="booking-first-name"
                      value={details.firstName}
                      onChange={(event) => updateDetails('firstName', event.target.value)}
                      placeholder="Sarah"
                      className={cn('h-11 rounded-xl bg-background px-3.5', errors.firstName && 'aria-invalid')}
                      aria-invalid={Boolean(errors.firstName)}
                    />
                    {errors.firstName ? (
                      <p className="mt-1.5 text-xs text-destructive">{errors.firstName}</p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="booking-last-name"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Last name
                    </label>
                    <Input
                      id="booking-last-name"
                      value={details.lastName}
                      onChange={(event) => updateDetails('lastName', event.target.value)}
                      placeholder="Thompson"
                      className="h-11 rounded-xl bg-background px-3.5"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="booking-email"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Email
                    </label>
                    <Input
                      id="booking-email"
                      type="email"
                      value={details.email}
                      onChange={(event) => updateDetails('email', event.target.value)}
                      placeholder="sarah@example.com"
                      className={cn('h-11 rounded-xl bg-background px-3.5', errors.email && 'aria-invalid')}
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email ? (
                      <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Phone
                    </label>
                    <Input
                      id="booking-phone"
                      type="tel"
                      value={details.phone}
                      onChange={(event) => updateDetails('phone', event.target.value)}
                      placeholder="(800) 555-0199"
                      className={cn('h-11 rounded-xl bg-background px-3.5', errors.phone && 'aria-invalid')}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    {errors.phone ? (
                      <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="booking-notes"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Anything we should know? <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="booking-notes"
                    value={details.notes}
                    onChange={(event) => updateDetails('notes', event.target.value)}
                    rows={4}
                    placeholder="Share a quick note about what is going on, what you have tried already, or any scheduling constraints."
                    className="w-full rounded-[1.25rem] border border-input bg-background px-3.5 py-3 text-sm leading-6 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full rounded-xl text-sm font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirming your request...' : 'Confirm My Call'}
                  <ArrowRight size={16} />
                </Button>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                  Prefer to talk now? Call <a href="tel:+18005550199" className="font-semibold text-primary hover:text-primary/80">(800) 555-0199</a> or email{' '}
                  <a href="mailto:hello@claritycare.com" className="font-semibold text-primary hover:text-primary/80">
                    hello@claritycare.com
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[1.8rem] border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Current Selection
              </p>
              <div className="mt-4 grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <h2
                    className="text-3xl font-semibold leading-tight tracking-[-0.03em]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {selectedService.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {selectedService.description}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] bg-secondary p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                        Focus Areas
                      </div>
                      <div className="mt-2 text-sm leading-6">{selectedService.focusAreas}</div>
                    </div>
                    <div className="rounded-[1.25rem] bg-secondary p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                        Typical Session
                      </div>
                      <div className="mt-2 text-sm leading-6">{selectedService.sessionLength}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-primary/10 bg-[linear-gradient(180deg,rgba(244,250,251,1)_0%,rgba(236,247,248,1)_100%)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Your Coordinator Notes
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {selectedService.coordinator}
                  </p>
                  <div className="mt-4 space-y-3 rounded-[1.25rem] bg-white/80 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-primary" />
                      <span className="text-sm">Phone confirmation within one business day</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-primary" />
                      <span className="text-sm">Follow-up email with therapist fit details</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock3 size={16} className="text-primary" />
                      <span className="text-sm">Fastest option stays visible if you choose flexible care</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-border bg-[#0D1F38] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Need help choosing?
              </p>
              <h2
                className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Start with the closest fit. We can refine after the first call.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/68">
                If you are not fully sure which care track is right, pick the nearest match.
                The coordinator can adjust the therapist type, format, or timing before the first appointment.
              </p>

              <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Quick fallback actions</p>
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="tel:+18005550199"
                    className={buttonVariants({
                      size: 'lg',
                      className:
                        'h-11 justify-center rounded-xl border-0 bg-white px-5 text-sm font-semibold text-[#0D1F38] hover:bg-white/92',
                    })}
                  >
                    Call the Care Team
                  </a>
                  <Link
                    to={clarityCarePaths.home}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'lg',
                      className:
                        'h-11 justify-center rounded-xl border-white/14 bg-transparent px-5 text-sm font-semibold text-white hover:bg-white/10 hover:text-white',
                    })}
                  >
                    Back to the Home Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HealthcareShell>
  )
}
