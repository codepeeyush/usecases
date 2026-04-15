import { Star, Quote } from 'lucide-react'

const featured = {
  name: 'Priya Sharma',
  profession: 'Management Consultant',
  quote:
    'Couples therapy with Clarity Care gave my partner and me a completely new language for communicating. After just six sessions, we stopped fighting about symptoms and started actually solving things. Truly transformative.',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
}

const testimonials = [
  {
    name: 'Sarah Thompson',
    profession: 'High School Teacher',
    quote:
      'I felt seen and understood from the very first session. Clarity Care changed the way I manage stress in the classroom and at home.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
  },
  {
    name: 'Dr. Marcus Reid',
    profession: 'University Lecturer',
    quote:
      'The evidence-based methods here are outstanding. My therapist gave me practical tools I actually use every single day.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
  {
    name: 'James Okafor',
    profession: 'Investment Banker',
    quote:
      "I was skeptical, but the flexible scheduling and virtual option made it easy to commit. Best decision I've made in years.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
  },
  {
    name: 'Linda Castellano',
    profession: 'Small Business Owner',
    quote:
      'Family therapy helped us navigate a really difficult period. Our therapist was patient, warm, and incredibly skilled.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
  },
  {
    name: 'David Chen',
    profession: 'Corporate Lawyer',
    quote:
      'The confidentiality and professionalism here are exceptional. I trust Clarity Care completely with my mental health journey.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
  },
]

function StarRow({ size = 14 }: { size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="text-amber-400 fill-amber-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="reviews" className="py-24 lg:py-32 bg-[#0D1F38] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
               style={{ color: 'oklch(0.78 0.12 165)' }}>
              Client Stories
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Real people,<br className="hidden sm:block" /> real results
            </h2>
          </div>
          {/* Aggregate rating */}
          <div className="flex items-center gap-3 text-white">
            <div className="text-right">
              <div className="text-3xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>4.9</div>
              <div className="text-xs text-white/50 mt-0.5">out of 5</div>
            </div>
            <div>
              <StarRow size={16} />
              <div className="text-xs text-white/50 mt-1">2,400+ verified reviews</div>
            </div>
          </div>
        </div>

        {/* Featured testimonial */}
        <div className="relative rounded-2xl overflow-hidden mb-6 p-8 sm:p-10"
             style={{ background: 'oklch(0.445 0.082 192 / 0.15)', border: '1px solid oklch(0.445 0.082 192 / 0.3)' }}>
          <Quote size={48} className="absolute top-6 right-8 opacity-10 text-white" />
          <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
            <img
              src={featured.image}
              alt={featured.name}
              className="w-14 h-14 rounded-full object-cover ring-2 shrink-0"
              style={{ ringColor: 'oklch(0.445 0.082 192 / 0.5)' }}
            />
            <div>
              <StarRow size={15} />
              <blockquote
                className="text-white text-lg sm:text-xl leading-relaxed mt-3 mb-4 font-light"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
              >
                "{featured.quote}"
              </blockquote>
              <div>
                <div className="text-white font-semibold text-sm">{featured.name}</div>
                <div className="text-white/50 text-xs">{featured.profession}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid of secondary testimonials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {testimonials.map(({ name, profession, quote, image }) => (
            <div
              key={name}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <StarRow size={11} />
              <blockquote className="text-white/80 text-sm leading-relaxed my-3 line-clamp-3">
                "{quote}"
              </blockquote>
              <div className="flex items-center gap-2.5">
                <img
                  src={image}
                  alt={name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-white text-xs font-semibold">{name}</div>
                  <div className="text-white/40 text-xs">{profession}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
