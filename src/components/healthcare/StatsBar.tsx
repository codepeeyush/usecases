import { ShieldCheck, CalendarCheck, Star, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '75%',
    label: 'report improvement',
    sub: 'within 8 sessions',
  },
  {
    icon: Star,
    value: '4.9 / 5',
    label: 'average rating',
    sub: 'across 2,400+ reviews',
  },
  {
    icon: CalendarCheck,
    value: '< 24 hrs',
    label: 'to first appointment',
    sub: 'evening & weekend slots',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'HIPAA compliant',
    sub: 'confidential & secure',
  },
]

export default function StatsBar() {
  return (
    <section id="stats" className="bg-[#0D1F38] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map(({ icon: Icon, value, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-[#0D1F38] px-6 py-7"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary" style={{ color: 'oklch(0.78 0.12 165)' }} />
              </div>
              <div>
                <div
                  className="text-2xl font-bold leading-tight"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                >
                  {value}
                </div>
                <div className="text-xs text-white/80 font-medium mt-0.5">{label}</div>
                <div className="text-xs text-white/40 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
