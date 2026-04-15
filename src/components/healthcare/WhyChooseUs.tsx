import { Sparkles, Award, Shield, Leaf } from 'lucide-react'

const reasons = [
  {
    icon: Sparkles,
    title: 'Personalized Care',
    description:
      'Every treatment plan is built around you — your goals, history, and pace. No protocols, no shortcuts.',
    accent: 'oklch(0.78 0.12 165)',
    bg: 'oklch(0.78 0.12 165 / 0.08)',
  },
  {
    icon: Award,
    title: 'Experienced Professionals',
    description:
      'Licensed therapists with advanced degrees and 10+ years of clinical practice across anxiety, trauma, relationships, and more.',
    accent: 'oklch(0.65 0.15 250)',
    bg: 'oklch(0.65 0.15 250 / 0.08)',
  },
  {
    icon: Shield,
    title: 'Confidential Space',
    description:
      'HIPAA-compliant sessions, strict confidentiality laws, and a judgment-free environment — always.',
    accent: 'oklch(0.55 0.13 30)',
    bg: 'oklch(0.55 0.13 30 / 0.08)',
  },
  {
    icon: Leaf,
    title: 'Holistic Approach',
    description:
      'Mind, body, and spirit. We integrate CBT, mindfulness, somatic therapy, and physical rehabilitation as needed.',
    accent: 'oklch(0.62 0.14 145)',
    bg: 'oklch(0.62 0.14 145 / 0.08)',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-14">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Why Clarity Care
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Care built around{' '}
              <span className="italic">you,</span>{' '}
              not a system
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base">
            We combine clinical expertise with genuine human connection — because
            good therapy is as much about trust as it is about technique.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map(({ icon: Icon, title, description, accent, bg }, i) => (
            <div
              key={title}
              className="group relative rounded-2xl p-6 border border-border hover:border-transparent transition-all duration-300 hover:shadow-xl cursor-default"
              style={{ background: 'var(--card)' }}
            >
              {/* Subtle hover bg tint */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: bg }}
              />
              <div className="relative z-10">
                {/* Number + icon row */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-4xl font-bold leading-none select-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: accent,
                      opacity: 0.18,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: bg }}
                  >
                    <Icon size={19} style={{ color: accent }} />
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-2 leading-snug">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
