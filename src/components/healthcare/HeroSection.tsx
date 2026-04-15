import { useState } from 'react'
import { ArrowRight, ChevronDown, ShieldCheck, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const therapyTypes = [
  { id: 'individual', label: 'For Myself', sublabel: 'Individual therapy' },
  { id: 'couples', label: 'For My Relationship', sublabel: 'Couples therapy' },
  { id: 'family', label: 'For My Family', sublabel: 'Family therapy' },
]

export default function HeroSection() {
  const [selected, setSelected] = useState('individual')

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2070&q=80)',
        }}
      />
      {/* Layered gradient: dark left for text, lighter right to show image */}
      <div className="absolute inset-0 bg-linear-to-r from-[#0D1F38]/95 via-[#0D1F38]/80 to-[#0D1F38]/40" />
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-[#0D1F38]/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32">
        <div className="max-w-2xl">

          {/* Social proof anchor — top of content */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3.5 py-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-white/90 text-xs font-medium">4.9 · 2,400+ reviews</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3.5 py-1.5">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span className="text-white/90 text-xs font-medium">HIPAA Compliant</span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(2.6rem,6vw,4.5rem)] font-bold leading-[1.06] text-white mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            You deserve to feel{' '}
            <span className="italic" style={{ color: 'oklch(0.78 0.12 165)' }}>
              well.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-lg">
            Clarity Care connects you with licensed therapists who combine genuine
            empathy with evidence-based methods — so you can gain clarity,
            manage stress, and live more fully.
          </p>

          {/* Therapy type selector */}
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/50 mb-3">
            What are you looking for?
          </p>
          <div className="flex flex-wrap gap-2.5 mb-8">
            {therapyTypes.map(({ id, label, sublabel }) => (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={cn(
                  'group flex flex-col items-start px-5 py-3 rounded-xl border text-left transition-all duration-200',
                  selected === id
                    ? 'bg-white text-[#0D1F38] border-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-sm border-white/25 text-white hover:bg-white/20 hover:border-white/40'
                )}
              >
                <span className="text-sm font-semibold leading-tight">{label}</span>
                <span
                  className={cn(
                    'text-xs mt-0.5 leading-tight',
                    selected === id ? 'text-[#0D1F38]/60' : 'text-white/55'
                  )}
                >
                  {sublabel}
                </span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0D1F38] hover:bg-white/92 font-semibold px-8 py-3.5 rounded-xl text-base transition-all duration-150 shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Get Matched Today
              <ArrowRight size={16} />
            </a>
            <a
              href="#services"
              className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors text-sm font-medium"
            >
              See all services
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Outcome micro-proof */}
          <p className="mt-6 text-xs text-white/45">
            75% of our clients report meaningful improvement within 8 sessions.
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown size={26} strokeWidth={1.5} />
      </a>
    </section>
  )
}
