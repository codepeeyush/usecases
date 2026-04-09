import { cn } from '@/lib/utils'
import { type Product, type StockStatus, type Category, categories, products as allProducts } from './data'

const stockDot: Record<StockStatus, string> = {
  in_stock:     'bg-emerald-500',
  low_stock:    'bg-amber-400',
  out_of_stock: 'bg-slate-300',
}

const stockLabel: Record<StockStatus, string> = {
  in_stock:     'In stock',
  low_stock:    'Low stock',
  out_of_stock: 'Out of stock',
}

const categoryEmoji: Record<Category, string> = {
  Headphones: '🎧',
  Keyboards:  '⌨️',
  Monitors:   '🖥️',
}

// Category-specific emoji bg tint on selection
const categoryEmojiSelectedBg: Record<Category, string> = {
  Headphones: 'bg-amber-50',
  Keyboards:  'bg-blue-50',
  Monitors:   'bg-emerald-50',
}

const badgeCls: Record<string, string> = {
  bestseller: 'bg-violet-100 text-violet-600',
  new:        'bg-sky-100 text-sky-600',
  sale:       'bg-red-100 text-red-500',
}
const badgeLabel: Record<string, string> = {
  bestseller: 'Best',
  new:        'New',
  sale:       'Sale',
}

// Category SVG icons (consistent, not emojis)
function CategoryIcon({ cat, active }: { cat: Category | 'All'; active: boolean }) {
  const cls = cn('w-3.5 h-3.5 shrink-0', active ? 'text-slate-700' : 'text-slate-400')
  if (cat === 'All') return (
    <svg className={cls} viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  )
  if (cat === 'Headphones') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
    </svg>
  )
  if (cat === 'Keyboards') return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
    </svg>
  )
  // Monitors
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  )
}

interface ProductListProps {
  products: Product[]
  selected: string
  onSelect: (id: string) => void
  activeCategory: Category | 'All'
  onCategoryChange: (cat: Category | 'All') => void
}

export default function ProductList({ products, selected, onSelect, activeCategory, onCategoryChange }: ProductListProps) {
  const catCount = (cat: Category | 'All') =>
    cat === 'All' ? allProducts.length : allProducts.filter((p) => p.category === cat).length

  return (
    <div className="flex flex-col h-full bg-zinc-100">

      {/* Category nav */}
      <div className="px-3 pt-4 pb-3">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
          Browse
        </p>
        <div className="space-y-0.5">
          {(['All', ...categories] as (Category | 'All')[]).map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  'w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-2.5',
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/80'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/70'
                )}
              >
                <CategoryIcon cat={cat} active={isActive} />
                <span className="flex-1">{cat}</span>
                <span className={cn(
                  'text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md min-w-[20px] text-center transition-colors',
                  isActive ? 'bg-slate-100 text-slate-600' : 'text-slate-400'
                )}>
                  {catCount(cat)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Section label for products */}
      <div className="px-5 pt-2 pb-1.5">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {activeCategory === 'All' ? `All Products` : activeCategory} · {products.length}
        </p>
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {products.map((product) => {
          const isSelected = selected === product.id
          const isUnavailable = product.stock === 'out_of_stock'

          return (
            <button
              key={product.id}
              onClick={() => onSelect(product.id)}
              className={cn(
                'w-full text-left rounded-xl transition-all duration-150 cursor-pointer',
                isSelected
                  ? 'bg-white'
                  : isUnavailable
                  ? 'opacity-40 hover:opacity-60 hover:bg-white/70'
                  : 'hover:bg-white hover:shadow-sm hover:shadow-slate-200/60'
              )}
              style={isSelected ? { boxShadow: 'inset 3px 0 0 #F59E0B, 0 2px 10px rgba(0,0,0,0.06)' } : undefined}
            >
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                {/* Emoji icon */}
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0',
                  isSelected ? categoryEmojiSelectedBg[product.category] : 'bg-slate-100'
                )}>
                  {categoryEmoji[product.category]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {/* Brand + price row */}
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide leading-none">
                      {product.brand}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through tabular-nums">${product.originalPrice}</span>
                      )}
                      <p className={cn(
                        'text-xs font-bold tabular-nums',
                        isSelected ? 'text-amber-500' : 'text-slate-800'
                      )}>
                        ${product.price}
                      </p>
                    </div>
                  </div>

                  {/* Name */}
                  <p className={cn(
                    'text-xs font-semibold leading-tight truncate mt-0.5',
                    isSelected ? 'text-slate-900' : 'text-slate-700'
                  )}>
                    {product.name}
                  </p>

                  {/* Stock + badge row */}
                  <div className="flex items-center justify-between gap-1 mt-1">
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        stockDot[product.stock],
                        product.stock === 'low_stock' ? 'animate-pulse' : ''
                      )} />
                      <span className="text-[10px] text-slate-400">{stockLabel[product.stock]}</span>
                    </div>
                    {product.badge && (
                      <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full', badgeCls[product.badge])}>
                        {badgeLabel[product.badge]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
