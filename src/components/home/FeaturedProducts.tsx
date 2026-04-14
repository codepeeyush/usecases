import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { products } from '@/data/products'
import ProductCard from '@/components/shop/ProductCard'

const featured = products.filter(p => p.badge === 'Best Seller').slice(0, 8)

export default function FeaturedProducts() {
  return (
    <section className="bg-secondary/60 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-2">
              Top Picks
            </p>
            <h2
              className="text-[2rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.08] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Featured Gear
            </h2>
          </div>
          <Link
            to="/shop"
            className="cursor-pointer hidden sm:flex items-center gap-1.5 text-[12px] font-semibold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity duration-150"
          >
            Shop all
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Link
          to="/shop"
          className="cursor-pointer sm:hidden mt-8 flex items-center justify-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity duration-150"
        >
          Shop all gear
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
