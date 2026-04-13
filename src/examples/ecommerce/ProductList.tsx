import { cn } from '@/lib/utils'
import { type Product, type Category, categories, products as allProducts } from './data'

const BRAND = {
  accent:     '#3B82F6',
  textPrimary:'#0A0A0F',
  textMuted:  '#6B7280',
  cardBorder: '#E8EAED',
  star:       '#F59E0B',
} as const

const FONT = "'Plus Jakarta Sans Variable', sans-serif"

interface ProductListProps {
  products: Product[]
  selected: string
  onSelect: (id: string) => void
  activeCategory: Category | 'All'
  onCategoryChange: (cat: Category | 'All') => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-bold uppercase tracking-widest mb-2"
      style={{ color: BRAND.textMuted, fontFamily: FONT }}
    >
      {children}
    </p>
  )
}

function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={cn('w-3 h-3', n <= stars ? 'text-[#F59E0B]' : 'text-[#E5E7EB]')} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductList({ activeCategory, onCategoryChange }: ProductListProps) {
  const catCount = (cat: Category | 'All') =>
    cat === 'All' ? allProducts.length : allProducts.filter((p) => p.category === cat).length

  return (
    <div style={{ fontFamily: FONT }}>

      {/* Department */}
      <div className="mb-5">
        <SectionLabel>Department</SectionLabel>
        <div className="space-y-0.5">
          {(['All', ...categories] as (Category | 'All')[]).map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className="flex items-center justify-between w-full py-1 px-2 rounded-lg cursor-pointer transition-colors text-left"
                style={{
                  background: isActive ? '#EFF6FF' : 'transparent',
                  fontFamily: FONT,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F9FAFB' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span
                  className="text-sm"
                  style={{
                    color: isActive ? BRAND.accent : BRAND.textPrimary,
                    fontWeight: isActive ? 700 : 400,
                    fontFamily: FONT,
                  }}
                >
                  {cat === 'All' ? 'All Departments' : cat}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? '#DBEAFE' : '#F3F4F6',
                    color: isActive ? BRAND.accent : BRAND.textMuted,
                    fontWeight: 600,
                    fontFamily: FONT,
                  }}
                >
                  {catCount(cat)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <hr style={{ borderColor: BRAND.cardBorder, marginBottom: '20px' }} />

      {/* Avg. Customer Review */}
      <div className="mb-5">
        <SectionLabel>Customer Review</SectionLabel>
        {[4, 3, 2, 1].map((stars) => (
          <button key={stars} className="flex items-center gap-1.5 py-1 group cursor-pointer w-full text-left">
            <StarRow stars={stars} />
            <span
              className="text-xs group-hover:underline"
              style={{ color: BRAND.accent, fontFamily: FONT }}
            >
              & Up
            </span>
          </button>
        ))}
      </div>

      <hr style={{ borderColor: BRAND.cardBorder, marginBottom: '20px' }} />

      {/* Brand */}
      <div className="mb-5">
        <SectionLabel>Brand</SectionLabel>
        {['Sony', 'Bose', 'Logitech', 'Audio-Technica', 'Samsung', 'LG'].map((brand) => (
          <label key={brand} className="flex items-center gap-2 py-1 cursor-pointer group">
            <input
              type="checkbox"
              className="cursor-pointer rounded"
              style={{ accentColor: BRAND.accent, width: '14px', height: '14px' }}
            />
            <span
              className="text-sm group-hover:underline"
              style={{ color: BRAND.textPrimary, fontFamily: FONT }}
            >
              {brand}
            </span>
          </label>
        ))}
      </div>

      <hr style={{ borderColor: BRAND.cardBorder, marginBottom: '20px' }} />

      {/* Shipping */}
      <div className="mb-4">
        <SectionLabel>Shipping</SectionLabel>
        <label className="flex items-center gap-2 py-1 cursor-pointer group">
          <input
            type="checkbox"
            className="cursor-pointer"
            style={{ accentColor: BRAND.accent, width: '14px', height: '14px' }}
          />
          <span className="text-sm group-hover:underline" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>
            FREE Shipping
          </span>
        </label>
        <label className="flex items-center gap-2 py-1 cursor-pointer group">
          <input
            type="checkbox"
            className="cursor-pointer"
            style={{ accentColor: BRAND.accent, width: '14px', height: '14px' }}
          />
          <span className="text-sm group-hover:underline" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>
            Fast Ship+
          </span>
        </label>
      </div>

    </div>
  )
}
