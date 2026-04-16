import { cn } from '@/lib/utils'

type Category = 'all' | 'footwear' | 'backpacks' | 'clothing' | 'accessories'

type Props = {
  selectedCategory: Category
  onCategoryChange: (cat: Category) => void
  selectedSort: string
  onSortChange: (sort: string) => void
}

const categories: { id: Category; label: string; count: number }[] = [
  { id: 'all', label: 'All Gear', count: 32 },
  { id: 'footwear', label: 'Footwear', count: 8 },
  { id: 'backpacks', label: 'Backpacks', count: 8 },
  { id: 'clothing', label: 'Clothing', count: 8 },
  { id: 'accessories', label: 'Accessories', count: 8 },
]

const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'newest', label: 'Newest' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground mb-3 mt-7 first:mt-0">
      {children}
    </h3>
  )
}

export default function FilterSidebar({ selectedCategory, onCategoryChange, selectedSort, onSortChange }: Props) {
  return (
    <aside className="w-full lg:w-52 shrink-0">

      {/* Categories */}
      <SectionLabel>Category</SectionLabel>
      <ul className="space-y-0.5" role="list">
        {categories.map(cat => (
          <li key={cat.id}>
            <button
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'cursor-pointer w-full flex items-center justify-between text-left px-3 py-2.5 text-[13px] font-medium transition-colors duration-150',
                selectedCategory === cat.id
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-muted'
              )}
              aria-pressed={selectedCategory === cat.id}
            >
              <span>{cat.label}</span>
              <span className={cn(
                'text-[11px] tabular-nums',
                selectedCategory === cat.id ? 'opacity-50' : 'text-muted-foreground'
              )}>
                {cat.count}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Sort */}
      <SectionLabel>Sort By</SectionLabel>
      <ul className="space-y-0.5" role="list">
        {sortOptions.map(opt => (
          <li key={opt.id}>
            <button
              onClick={() => onSortChange(opt.id)}
              className={cn(
                'cursor-pointer w-full text-left px-3 py-2.5 text-[13px] transition-colors duration-150',
                selectedSort === opt.id
                  ? 'font-semibold text-foreground'
                  : 'font-medium text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={selectedSort === opt.id}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Price range */}
      <SectionLabel>Price Range</SectionLabel>
      <div className="px-1">
        <label htmlFor="price-range" className="sr-only">Maximum price: $350</label>
        <input
          id="price-range"
          type="range"
          min={0}
          max={350}
          defaultValue={350}
          className="w-full cursor-pointer accent-primary"
          aria-valuemin={0}
          aria-valuemax={350}
          aria-valuenow={350}
          aria-label="Price range filter"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5 tabular-nums">
          <span>$0</span>
          <span>$350+</span>
        </div>
      </div>
    </aside>
  )
}
