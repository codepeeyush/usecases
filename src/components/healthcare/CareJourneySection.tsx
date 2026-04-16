import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { clarityCarePaths } from '@/lib/routes'

const steps = [
  {
    step: '01',
    title: 'Tell us what support you need',
    description:
      'Pick the care path that matches your situation so the page already knows what you are looking for.',
  },
  {
    step: '02',
    title: 'Choose format and preferred timing',
    description:
      'Select virtual, in-person, or flexible care and lock a day and time window that fits your week.',
  },
  {
    step: '03',
    title: 'Get a clear confirmation',
    description:
      'We summarize the request, set expectations, and keep phone or email fallback actions one tap away.',
  },
]

export default function CareJourneySection() {
  return (
    <section className="bg-background py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-[linear-gradient(135deg,rgba(13,31,56,0.98)_0%,rgba(15,84,104,0.96)_52%,rgba(67,164,132,0.92)_100%)] p-8 text-white shadow-[0_28px_90px_rgba(15,31,56,0.2)] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                New Booking Flow
              </p>
              <h2
                className="mt-4 max-w-2xl text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                From “I need help” to “I have a time booked” in one calmer flow.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
                We tightened the path between the first click and the actual booking
                action so visitors do not have to decode the site before they ask for care.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Available within 24 hours</p>
              <p className="text-sm leading-6 text-white/72">
                Dedicated booking page, interactive time selection, and a clear confirmation state.
              </p>
              <Link
                to={clarityCarePaths.bookCall}
                className={buttonVariants({
                  size: 'lg',
                  className:
                    'mt-1 h-11 rounded-xl border-0 bg-white px-5 text-sm font-semibold text-[#0D1F38] hover:bg-white/92',
                })}
              >
                Book a Call
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(({ step, title, description }) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-white/12 bg-black/10 p-5"
              >
                <div className="text-[11px] font-semibold tracking-[0.26em] text-white/45">
                  {step}
                </div>
                <h3 className="mt-3 text-xl font-semibold leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
