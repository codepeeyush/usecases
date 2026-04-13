import { useState, useEffect } from 'react'
import { useAIActions, useYourGPT } from '@yourgpt/widget-web-sdk/react'
import { products, categories, type Category, type Product } from './data'
import { ecommerceHandlers } from '@/yourgpt/handlers'
import { builtinHandlers, startPageObserver, syncPageContext } from '@/yourgpt/builtin'
import { cn } from '@/lib/utils'
import ProductList from './ProductList'
import ProductDetail, { type CompareOverlay, type CartOverlay, type CartOverlayPhase } from './ProductDetail'

interface CartItem {
  productId: string
  qty: number
}

// ─── Brand Design Tokens ─────────────────────────────────────────────────────
const BRAND = {
  headerBg:   '#0A0A0F',
  subnavBg:   '#111118',
  accent:     '#3B82F6',
  accentHover:'#2563EB',
  pageBg:     '#F4F5F7',
  cardBorder: '#E8EAED',
  textPrimary:'#0A0A0F',
  textMuted:  '#6B7280',
  star:       '#F59E0B',
  inStock:    '#16A34A',
  lowStock:   '#D97706',
  outOfStock: '#EF4444',
  sale:       '#EF4444',
} as const

const categoryBg: Record<Category, string> = {
  Headphones: 'bg-amber-50',
  Keyboards:  'bg-sky-50',
  Monitors:   'bg-emerald-50',
}

const categoryEmoji: Record<Category, string> = {
  Headphones: '🎧',
  Keyboards:  '⌨️',
  Monitors:   '🖥️',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={cn('w-3 h-3', n <= Math.round(rating) ? 'text-[#F59E0B]' : 'text-[#E5E7EB]')} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function EcommerceExample() {
  const [selectedId, setSelectedId] = useState(products[0].id)
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [compareOverlay, setCompareOverlay] = useState<CompareOverlay>(null)
  const [cartOverlay, setCartOverlay] = useState<CartOverlay>(null)
  const [viewMode, setViewMode] = useState<'listing' | 'detail'>('listing')

  const { registerActions } = useAIActions()
  const { sdk } = useYourGPT()

  useEffect(() => {
    registerActions({ ...ecommerceHandlers, ...builtinHandlers })
  }, [registerActions])

  useEffect(() => {
    if (!sdk) return
    return startPageObserver(sdk)
  }, [sdk])

  useEffect(() => {
    if (!sdk) return
    const selectedProduct = products.find((p) => p.id === selectedId) ?? products[0]
    return sdk.onWidgetPopup((isOpen: boolean) => {
      if (!isOpen) return
      syncPageContext(sdk)
      sdk.setSessionData({
        suggestions: [
          activeCategory !== 'All'
            ? `Compare all ${activeCategory} in my price range`
            : 'Compare headphones',
          `Add ${selectedProduct.name} to my cart`,
          'Find the best deal right now',
          'Apply a coupon code',
          "What's on sale today?",
        ],
      })
    })
  }, [sdk, selectedId, activeCategory])

  useEffect(() => {
    const handler = (e: Event) => {
      const { products: items, phase } = (e as CustomEvent).detail as {
        products: Product[]
        phase: 'start' | 'done'
      }
      if (phase === 'start') {
        setViewMode('detail')
        setCompareOverlay({ products: items, phase: 'scanning' })
      }
      if (phase === 'done') {
        setCompareOverlay((prev) => prev ? { ...prev, phase: 'done' } : null)
        setTimeout(() => setCompareOverlay(null), 2500)
      }
    }
    window.addEventListener('ygpt:compare', handler)
    return () => window.removeEventListener('ygpt:compare', handler)
  }, [])

  useEffect(() => {
    const AUTO_DISMISS: CartOverlayPhase[] = ['done', 'cancelled', 'coupon_applied']
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        phase: CartOverlayPhase
        productName?: string
        couponCode?: string
        discount?: number
      }
      setViewMode('detail')
      setCartOverlay({
        phase: detail.phase,
        productName: detail.productName ?? '',
        couponCode: detail.couponCode,
        discount: detail.discount,
      })
      if (AUTO_DISMISS.includes(detail.phase)) {
        setTimeout(() => setCartOverlay(null), 2500)
      }
    }
    window.addEventListener('ygpt:cart', handler)
    return () => window.removeEventListener('ygpt:cart', handler)
  }, [])

  const selected = products.find((p) => p.id === selectedId) ?? products[0]
  const filteredProducts = activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)
  const totalCartQty = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const handleCategoryChange = (cat: Category | 'All') => {
    setActiveCategory(cat)
    const first = cat === 'All' ? products[0] : products.find((p) => p.category === cat)
    if (first) setSelectedId(first.id)
    setViewMode('listing')
  }

  const handleAddToCart = (productId: string, qty: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      if (existing) return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { productId, qty }]
    })
  }

  const handleSelectProduct = (id: string) => {
    setSelectedId(id)
    const p = products.find((pr) => pr.id === id)
    if (p && activeCategory !== 'All' && p.category !== activeCategory) {
      setActiveCategory('All')
    }
    setViewMode('detail')
  }

  const handleBackToListing = () => setViewMode('listing')

  return (
    <div className="h-full flex flex-col" style={{ background: BRAND.pageBg, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="shrink-0" style={{ background: BRAND.headerBg, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-2.5 flex items-center gap-3">

          {/* Logo: Tech + Shop in split color */}
          <button
            onClick={handleBackToListing}
            className="shrink-0 flex items-center gap-0 cursor-pointer mr-1"
            style={{ textDecoration: 'none' }}
          >
            <span style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif", fontWeight: 800, fontSize: '18px', letterSpacing: '-0.04em', color: '#FFFFFF' }}>Tech</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif", fontWeight: 800, fontSize: '18px', letterSpacing: '-0.04em', color: BRAND.accent }}>Shop</span>
          </button>

          {/* Search bar */}
          <div className="flex flex-1 min-w-0 rounded-lg overflow-hidden" style={{ boxShadow: '0 0 0 2px rgba(59,130,246,0.0)' }}>
            <select
              className="shrink-0 text-xs px-2 h-9 outline-none cursor-pointer border-r"
              style={{ background: '#1A1A25', color: '#D1D5DB', borderColor: 'rgba(255,255,255,0.10)', minWidth: '64px', fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
              onChange={(e) => {
                const val = e.target.value
                if (val === 'All') handleCategoryChange('All')
                else handleCategoryChange(val as Category)
              }}
              value={activeCategory}
            >
              <option value="All">All</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="text"
              placeholder="Search TechShop..."
              className="flex-1 px-3 h-9 text-sm outline-none min-w-0"
              style={{ background: '#FFFFFF', color: BRAND.textPrimary, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
            />
            <button
              className="px-3 h-9 flex items-center justify-center shrink-0 transition-colors"
              style={{ background: BRAND.accent }}
              onMouseEnter={e => (e.currentTarget.style.background = BRAND.accentHover)}
              onMouseLeave={e => (e.currentTarget.style.background = BRAND.accent)}
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Returns & Orders */}
          <div
            className="shrink-0 text-white cursor-pointer rounded px-2 py-1 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <p className="text-[10px] leading-tight" style={{ color: '#9CA3AF' }}>Returns</p>
            <p className="text-xs font-bold leading-tight">& Orders</p>
          </div>

          {/* Cart */}
          <button
            className="shrink-0 flex items-center gap-1 relative cursor-pointer rounded px-2 py-1 transition-colors"
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="relative">
              <svg className="w-7 h-7 text-white" viewBox="0 0 28 28" fill="currentColor">
                <path d="M5 3H3a1 1 0 000 2h1.4l3.15 12.6A1.75 1.75 0 009.5 19.25h9a1.75 1.75 0 001.662-1.195l2.275-8.4A.875.875 0 0021.5 8.75H7.35L5 3zM9 22.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM19.5 22.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"/>
              </svg>
              {totalCartQty > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none text-white"
                  style={{ background: BRAND.accent }}
                >
                  {totalCartQty > 9 ? '9+' : totalCartQty}
                </span>
              )}
            </div>
            <span className="text-white text-xs font-semibold">Cart</span>
          </button>
        </div>
      </header>

      {/* ── Sub-navigation ────────────────────────────────────────────── */}
      <nav className="shrink-0 px-4 flex items-center gap-0 overflow-x-auto" style={{ background: BRAND.subnavBg, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2.5 cursor-pointer shrink-0 transition-colors border-b-2 border-transparent"
          onClick={handleBackToListing}
          style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
          onMouseEnter={e => (e.currentTarget.style.color = '#93C5FD')}
          onMouseLeave={e => (e.currentTarget.style.color = '#FFFFFF')}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
          </svg>
          All
        </button>

        {(['All', ...categories] as (Category | 'All')[]).map((cat) => {
          const isActive = activeCategory === cat && viewMode === 'listing'
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="text-white text-xs px-3 py-2.5 cursor-pointer shrink-0 transition-colors border-b-2"
              style={{
                fontWeight: isActive ? 700 : 500,
                borderColor: isActive ? BRAND.accent : 'transparent',
                fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget.style.color = '#93C5FD') }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget.style.color = '#FFFFFF') }}
            >
              {cat === 'All' ? 'All Products' : cat}
            </button>
          )
        })}

        {['Today\'s Deals', 'Best Sellers', 'New Arrivals'].map((label) => (
          <button
            key={label}
            className="text-xs px-3 py-2.5 cursor-pointer shrink-0 border-b-2 border-transparent transition-colors"
            style={{ color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.color = '#93C5FD')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      {viewMode === 'listing' ? (
        <div className="flex flex-1 min-h-0">
          {/* Filter sidebar */}
          <div className="w-[200px] shrink-0 bg-white overflow-y-auto px-3 py-4" style={{ borderRight: `1px solid ${BRAND.cardBorder}` }}>
            <ProductList
              products={filteredProducts}
              selected={selectedId}
              onSelect={handleSelectProduct}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: `1px solid ${BRAND.cardBorder}` }}>
              <p className="text-sm" style={{ color: BRAND.textMuted, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                <span style={{ color: BRAND.textPrimary, fontWeight: 500 }}>{filteredProducts.length} results</span>
                {activeCategory !== 'All' && <span> for <em style={{ fontStyle: 'normal', color: BRAND.textPrimary, fontWeight: 600 }}>{activeCategory}</em></span>}
              </p>
              <div className="flex items-center gap-2 text-sm" style={{ color: BRAND.textMuted }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif", fontSize: '13px' }}>Sort by:</span>
                <select
                  className="border rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
                  style={{
                    borderColor: BRAND.cardBorder,
                    background: '#FFFFFF',
                    color: BRAND.textPrimary,
                    fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
                  }}
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Avg. Customer Review</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {filteredProducts.map((product) => {
                const discount = product.originalPrice
                  ? Math.round((1 - product.price / product.originalPrice) * 100)
                  : null

                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="bg-white text-left cursor-pointer rounded-xl relative flex flex-col"
                    style={{
                      border: `1px solid ${BRAND.cardBorder}`,
                      boxShadow: '0 1px 3px rgba(10,10,15,0.06), 0 1px 2px rgba(10,10,15,0.04)',
                      transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                      fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,10,15,0.10), 0 2px 6px rgba(10,10,15,0.06)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.borderColor = '#D1D5DB'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(10,10,15,0.06), 0 1px 2px rgba(10,10,15,0.04)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.borderColor = BRAND.cardBorder
                    }}
                  >
                    {/* Badge */}
                    {product.badge && (
                      <div
                        className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded"
                        style={{
                          background: product.badge === 'bestseller' ? BRAND.star
                            : product.badge === 'sale' ? BRAND.sale
                            : BRAND.accent,
                          fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
                        }}
                      >
                        {product.badge === 'bestseller' ? 'Best Seller'
                          : product.badge === 'sale' ? 'Deal'
                          : 'New'}
                      </div>
                    )}

                    {/* Product image */}
                    <div
                      className={cn('w-full rounded-t-xl flex items-center justify-center text-5xl', categoryBg[product.category])}
                      style={{ aspectRatio: '1', paddingTop: product.badge ? '28px' : '0' }}
                    >
                      {categoryEmoji[product.category]}
                    </div>

                    {/* Info */}
                    <div className="p-3 flex flex-col flex-1">
                      {/* Name */}
                      <p
                        className="text-sm leading-tight mb-1 line-clamp-2"
                        style={{ color: BRAND.accent, fontWeight: 500, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
                      >
                        {product.name}
                      </p>

                      {/* Brand */}
                      <p className="text-xs mb-2" style={{ color: BRAND.textMuted, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                        by {product.brand}
                      </p>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        <Stars rating={product.rating} />
                        <span className="text-xs" style={{ color: BRAND.textMuted, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-base font-semibold" style={{ color: BRAND.textPrimary, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs line-through" style={{ color: BRAND.textMuted }}>
                              ${product.originalPrice}
                            </span>
                          )}
                          {discount && (
                            <span className="text-xs font-semibold" style={{ color: BRAND.sale }}>
                              -{discount}%
                            </span>
                          )}
                        </div>

                        {/* Fast Ship badge */}
                        <div className="flex items-center gap-1 mt-1.5">
                          <span
                            className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm"
                            style={{ background: BRAND.accent, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
                          >
                            Fast Ship
                          </span>
                          <span className="text-[10px]" style={{ color: BRAND.inStock, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>FREE</span>
                        </div>

                        {/* Stock status */}
                        {product.stock === 'low_stock' && (
                          <p className="text-[11px] mt-1 font-medium" style={{ color: BRAND.lowStock, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                            Only a few left
                          </p>
                        )}
                        {product.stock === 'out_of_stock' && (
                          <p className="text-[11px] mt-1 font-medium" style={{ color: BRAND.outOfStock, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                            Unavailable
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          <ProductDetail
            product={selected}
            cartCount={totalCartQty}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            compareOverlay={compareOverlay}
            cartOverlay={cartOverlay}
            onBackToListing={handleBackToListing}
          />
        </div>
      )}
    </div>
  )
}
