import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/data/products'

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-2">
            Explore
          </p>
          <h2
            className="text-[2rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.08] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Shop by Category
          </h2>
        </div>
        <Link
          to="/shop"
          className="cursor-pointer hidden sm:flex items-center gap-1.5 text-[12px] font-semibold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity duration-150"
        >
          All gear
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="cursor-pointer group relative overflow-hidden"
          >
            <div className="aspect-3/4 relative overflow-hidden">
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-107"
              />
              {/* Base overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
              {/* Hover reveal overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-1.5 group-hover:text-white/70 transition-colors duration-200">
                  Explore
                </p>
                <h3
                  className="text-[1.2rem] font-bold text-white leading-tight tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {cat.label}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <span className="text-[11px] font-semibold text-white/80 tracking-wide">Shop now</span>
                  <ArrowRight size={11} className="text-white/80" aria-hidden="true" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
