import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full h-[92vh] min-h-[600px] overflow-hidden">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1800&q=85"
        alt=""
        role="presentation"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Multi-layer overlay for cinematic depth */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-8 bg-white/40" />
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/60">
              Spring / Summer 2025
            </p>
          </div>

          {/* Headline — Playfair Display for heritage feel */}
          <h1
            className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold text-white leading-[1.04] tracking-[-0.02em] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Gear Built
            <br />
            <em className="not-italic text-white/80">for the Summit</em>
          </h1>

          <p className="text-[17px] text-white/65 leading-relaxed mb-10 max-w-md font-light">
            From basecamp to the peak — premium trekking equipment engineered for every elevation.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="cursor-pointer inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-8 py-4 text-[12px] font-bold tracking-[0.12em] uppercase hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
            >
              Shop Now
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              to="/shop?category=footwear"
              className="cursor-pointer inline-flex items-center gap-2 text-white text-[12px] font-semibold tracking-[0.12em] uppercase border-b border-white/40 pb-0.5 hover:border-white transition-colors duration-150"
            >
              Explore Footwear
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex items-center gap-6 mt-14 pt-8 border-t border-white/10">
            {[
              { val: '50K+', label: 'Happy trekkers' },
              { val: '60-day', label: 'Free returns' },
              { val: 'Lifetime', label: 'Warranty' },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-[15px] font-bold text-white">{val}</p>
                <p className="text-[11px] text-white/45 tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2" aria-hidden="true">
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 rotate-90 origin-center translate-x-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-linear-to-b from-white/30 to-transparent" />
      </div>
    </section>
  )
}
