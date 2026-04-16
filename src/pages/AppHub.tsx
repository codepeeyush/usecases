import { ArrowRight, HeartPulse, Mountain } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clarityCarePath, summitTrailPaths } from '@/lib/routes'

const apps = [
  {
    name: 'Clarity Care',
    description:
      'Healthcare landing experience focused on wellness programs, care pathways, and conversion sections.',
    path: clarityCarePath,
    icon: HeartPulse,
    eyebrow: 'Healthcare',
    accentClass: 'from-cyan-900/95 via-teal-700/90 to-emerald-500/80',
  },
  {
    name: 'Summit Trail',
    description:
      'Outdoor commerce experience with catalog browsing, product detail, cart, and checkout flows.',
    path: summitTrailPaths.home,
    icon: Mountain,
    eyebrow: 'Outdoor retail',
    accentClass: 'from-stone-950/95 via-emerald-900/90 to-amber-700/75',
  },
]

export default function AppHub() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.48),_transparent_42%),linear-gradient(180deg,_rgba(245,240,232,1)_0%,_rgba(237,231,219,1)_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl py-8 sm:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/70">
            Usecase Router
          </p>
          <h1
            className="mt-4 text-[clamp(2.5rem,6vw,4.75rem)] font-bold tracking-[-0.04em] text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Choose the app you want to open.
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-7 text-muted-foreground">
            The current branch now routes directly into the two imported experiences and drops the previous demo catalog.
          </p>
        </div>

        <div className="grid gap-5 pb-8 md:grid-cols-2 md:gap-6">
          {apps.map(({ name, description, path, icon: Icon, eyebrow, accentClass }) => (
            <Link
              key={name}
              to={path}
              className="group relative overflow-hidden rounded-[2rem] border border-black/8 bg-card p-7 shadow-[0_24px_80px_rgba(28,18,9,0.08)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${accentClass}`} />
              <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(255,255,255,0.88)_100%)]" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-black/6 p-3 text-foreground">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {eyebrow}
                  </span>
                </div>
                <div className="mt-14">
                  <h2
                    className="text-[2rem] font-bold tracking-[-0.03em] text-foreground"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {name}
                  </h2>
                  <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
                <div className="mt-10 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                  Open app
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
