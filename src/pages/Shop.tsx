import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { products, type Product } from '@/data/products'
import FilterSidebar from '@/components/shop/FilterSidebar'
import ProductCard from '@/components/shop/ProductCard'

type Category = 'all' | 'footwear' | 'backpacks' | 'clothing' | 'accessories'

function sortProducts(list: Product[], sort: string): Product[] {
  switch (sort) {
    case 'price-asc': return [...list].sort((a, b) => a.price - b.price)
    case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
    case 'newest': return [...list].filter(p => p.badge === 'New').concat(list.filter(p => p.badge !== 'New'))
    default: return list
  }
}

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [selectedSort, setSelectedSort] = useState('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const cat = searchParams.get('category') as Category | null
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const sorted = sortProducts(filtered, selectedSort)

  const categoryLabel = selectedCategory === 'all'
    ? 'All Gear'
    : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <p className="text-[12px] text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors duration-150 cursor-pointer">Home</a>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-foreground font-medium">{categoryLabel}</span>
        </p>
      </nav>

      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1
            className="text-[2rem] sm:text-[2.5rem] font-bold text-foreground leading-[1.06] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {categoryLabel}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {sorted.length} {sorted.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen(v => !v)}
          className="cursor-pointer lg:hidden flex items-center gap-2 px-4 py-2.5 border border-border text-[12px] font-semibold tracking-wide hover:bg-muted transition-colors duration-150"
          aria-expanded={mobileFiltersOpen}
          aria-controls="filter-sidebar"
        >
          {mobileFiltersOpen ? <X size={14} aria-hidden="true" /> : <SlidersHorizontal size={14} aria-hidden="true" />}
          Filters
        </button>
      </div>

      <div className="flex gap-10 lg:gap-14">
        {/* Sidebar */}
        <div
          id="filter-sidebar"
          className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}
          aria-label="Product filters"
        >
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => { setSelectedCategory(cat); setMobileFiltersOpen(false) }}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {sorted.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-[15px]">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {sorted.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
