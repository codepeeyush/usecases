import { useState, useEffect } from 'react'
import { useAIActions, useYourGPT } from '@yourgpt/widget-web-sdk/react'
import { products, categories, type Category, type Product } from './data'
import { ecommerceHandlers } from '@/yourgpt/handlers'
import { builtinHandlers, startPageObserver } from '@/yourgpt/builtin'
import ProductList from './ProductList'
import ProductDetail, { type CompareOverlay, type CartOverlay, type CartOverlayPhase } from './ProductDetail'

interface CartItem {
  productId: string
  qty: number
}

export default function EcommerceExample() {
  const [selectedId, setSelectedId] = useState(products[0].id)
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [compareOverlay, setCompareOverlay] = useState<CompareOverlay>(null)
  const [cartOverlay, setCartOverlay] = useState<CartOverlay>(null)

  const { registerActions } = useAIActions()
  const { sdk } = useYourGPT()

  // Register AI action handlers once
  useEffect(() => {
    registerActions({ ...ecommerceHandlers, ...builtinHandlers })
  }, [registerActions])

  // Auto-sync DOM state to widget on every mutation/navigation
  useEffect(() => {
    if (!sdk) return
    return startPageObserver(sdk)
  }, [sdk])

  // Listen for compare events dispatched by the handler
  useEffect(() => {
    const handler = (e: Event) => {
      const { products: items, phase } = (e as CustomEvent).detail as {
        products: Product[]
        phase: 'start' | 'done'
      }
      if (phase === 'start') {
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

  // Listen for cart step events dispatched by the handler
  useEffect(() => {
    const AUTO_DISMISS: CartOverlayPhase[] = ['done', 'cancelled', 'coupon_applied']
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        phase: CartOverlayPhase
        productName?: string
        couponCode?: string
        discount?: number
      }
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

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  const totalCartQty = cartItems.reduce((sum, item) => sum + item.qty, 0)

  const handleCategoryChange = (cat: Category | 'All') => {
    setActiveCategory(cat)
    const first = cat === 'All' ? products[0] : products.find((p) => p.category === cat)
    if (first) setSelectedId(first.id)
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
  }

  return (
    <div className="h-full flex flex-col bg-zinc-100" style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>

      {/* Header */}
      <div className="px-6 py-3.5 bg-white flex items-center justify-between gap-4 shrink-0 shadow-[0_1px_0_--theme(--color-slate-100)]">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5 font-medium">
            <span>TechShop</span>
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-600">Peripherals</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-sm font-bold text-slate-900">Peripherals</h1>
            <span className="text-[11px] text-slate-400">
              {categories.map((c) => `${products.filter((p) => p.category === c).length} ${c}`).join(' · ')}
            </span>
          </div>
        </div>

        <button className="relative flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-xl cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          Cart
          {totalCartQty > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-slate-900 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 leading-none">
              {totalCartQty > 9 ? '9+' : totalCartQty}
            </span>
          )}
        </button>
      </div>

      {/* Two-panel body */}
      <div className="flex flex-1 min-h-0">
        <div className="w-64 shrink-0 overflow-hidden flex flex-col shadow-[1px_0_0_--theme(--color-slate-100)]">
          <ProductList
            products={filteredProducts}
            selected={selectedId}
            onSelect={setSelectedId}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden relative">
          <ProductDetail
            product={selected}
            cartCount={totalCartQty}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            compareOverlay={compareOverlay}
            cartOverlay={cartOverlay}
          />
        </div>
      </div>
    </div>
  )
}
