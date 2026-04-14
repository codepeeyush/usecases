import { ArrowRight } from 'lucide-react'

const stats = [
  { value: '2018', label: 'Founded in Karakoram' },
  { value: '40+', label: 'Countries reached' },
  { value: '50K+', label: 'Happy trekkers' },
]

export default function BrandStory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Image side */}
        <div className="relative order-1 lg:order-2">
          <img
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=85"
            alt="Trekker in the mountains using Summit Trail gear"
            loading="lazy"
            className="w-full aspect-4/5 object-cover"
          />
          {/* Green accent block — offset decoration */}
          <div
            className="absolute -bottom-5 -left-5 w-24 h-24 bg-primary hidden lg:block"
            aria-hidden="true"
          />
          {/* Stat card overlay */}
          <div className="absolute -bottom-4 right-4 lg:-right-6 bg-background border border-border p-5 shadow-lg min-w-[160px]">
            <p className="text-[32px] font-bold text-foreground leading-none tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              6+
            </p>
            <p className="text-[12px] text-muted-foreground mt-1 leading-tight">
              Years field-testing at altitude
            </p>
          </div>
        </div>

        {/* Text side */}
        <div className="order-2 lg:order-1">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-5">
            Our Story
          </p>
          <h2
            className="text-[2rem] sm:text-[2.6rem] font-bold text-foreground leading-[1.06] tracking-[-0.02em] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Made for those who
            <br />
            <em className="not-italic text-primary">choose harder routes</em>
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
            Summit Trail started on a three-week traverse of the Karakoram. Our founders couldn't find gear that lasted — so they built their own.
          </p>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
            Every product is field-tested at altitude before it reaches your hands. No shortcuts. No compromise. Just gear you can trust when it matters most.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-10 pb-10 border-b border-border">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-[1.6rem] font-bold text-foreground leading-none tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {value}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          <a
            href="#"
            className="cursor-pointer inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.15em] uppercase text-primary group"
          >
            Read our full story
            <ArrowRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
