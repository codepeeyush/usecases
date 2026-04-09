import { useState } from 'react'
import { cn } from '@/lib/utils'
import { type Product, type StockStatus, type ProductBadge, type Category, products } from './data'

// ─── Visual config ────────────────────────────────────────────────────────────

const categoryBg: Record<Category, string> = {
  Headphones: 'bg-amber-50',
  Keyboards:  'bg-blue-50',
  Monitors:   'bg-emerald-50',
}

const categoryEmoji: Record<Category, string> = {
  Headphones: '🎧',
  Keyboards:  '⌨️',
  Monitors:   '🖥️',
}

const stockConfig: Record<StockStatus, { label: string; dot: string; textCls: string; bg: string }> = {
  in_stock:     { label: 'In stock',       dot: 'bg-emerald-500',            textCls: 'text-emerald-600', bg: 'bg-emerald-50 text-emerald-700' },
  low_stock:    { label: 'Only a few left', dot: 'bg-amber-400 animate-pulse', textCls: 'text-amber-600',  bg: 'bg-amber-50 text-amber-700' },
  out_of_stock: { label: 'Out of stock',    dot: 'bg-slate-300',               textCls: 'text-slate-400',  bg: 'bg-slate-100 text-slate-500' },
}

const badgeConfig: Record<NonNullable<ProductBadge>, { label: string; cls: string }> = {
  bestseller: { label: 'Bestseller', cls: 'bg-violet-100 text-violet-700' },
  new:        { label: 'New',        cls: 'bg-sky-100 text-sky-700' },
  sale:       { label: 'Sale',       cls: 'bg-red-100 text-red-600' },
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 'w-4 h-4' : 'w-3 h-3'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={cn(dim, n <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200')} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ProductDetailProps {
  product: Product
  cartCount: number
  onAddToCart: (productId: string, qty: number) => void
  onSelectProduct: (id: string) => void
}

export default function ProductDetail({ product, onAddToCart, onSelectProduct }: ProductDetailProps) {
  const [qty, setQty] = useState(1)
  const [coupon, setCoupon] = useState('')
  const [couponState, setCouponState] = useState<'idle' | 'ok' | 'err'>('idle')
  const [cartFeedback, setCartFeedback] = useState(false)

  const [lastId, setLastId] = useState(product.id)
  if (product.id !== lastId) {
    setLastId(product.id)
    setQty(1)
    setCoupon('')
    setCouponState('idle')
    setCartFeedback(false)
  }

  const isUnavailable = product.stock === 'out_of_stock'
  const stock = stockConfig[product.stock]
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const relatedProducts = product.relatedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[]

  const handleAddToCart = () => {
    onAddToCart(product.id, qty)
    setCartFeedback(true)
    setTimeout(() => setCartFeedback(false), 2000)
  }

  const handleApplyCoupon = () => {
    setCouponState(['SAVE10', 'TECH20', 'FIRST15'].includes(coupon.trim().toUpperCase()) ? 'ok' : 'err')
  }

  return (
    <div className="flex flex-col h-full bg-white" style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="px-8 py-7 bg-white shrink-0">
        <div className="flex items-start gap-6">

          {/* Product visual */}
          <div className={cn('w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shrink-0', categoryBg[product.category])}>
            {categoryEmoji[product.category]}
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {product.badge && (
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide', badgeConfig[product.badge].cls)}>
                  {badgeConfig[product.badge].label}
                </span>
              )}
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1', stock.bg)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', stock.dot)} />
                {stock.label}
              </span>
            </div>

            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
              {product.brand}
            </p>
            <h2 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <Stars rating={product.rating} size="md" />
              <span className="text-sm font-semibold text-slate-700 tabular-nums">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-3xl font-bold text-slate-900 tabular-nums tracking-tight">${product.price}</p>
            {product.originalPrice && (
              <div className="flex items-center gap-2 justify-end mt-1">
                <span className="text-sm text-slate-400 line-through tabular-nums">${product.originalPrice}</span>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                  -{discount}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Description */}
        <div className="px-8 pb-6">
          <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>
        </div>

        {/* Specs — on a tinted background, no borders */}
        <div className="bg-slate-50/70 px-8 py-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Specifications
          </p>
          <div className="grid gap-0">
            {product.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={cn(
                  'flex items-center gap-6 py-2.5',
                  i < product.specs.length - 1 ? 'shadow-[0_1px_0_--theme(--color-slate-200/50)]' : ''
                )}
              >
                <span className="w-36 shrink-0 text-xs text-slate-400 font-medium">{spec.label}</span>
                <span className="text-xs text-slate-700 font-semibold">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase */}
        <div className="px-8 py-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">
            Add to Cart
          </p>

          <div className="flex items-center gap-3 mb-3">
            {/* Qty */}
            <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || isUnavailable}
                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="w-9 text-center text-sm font-bold text-slate-800 tabular-nums h-9 flex items-center justify-center">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                disabled={qty >= 10 || isUnavailable}
                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 4a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 0110 4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={isUnavailable}
              className={cn(
                'flex-1 h-9 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2',
                isUnavailable
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : cartFeedback
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
              )}
            >
              {cartFeedback ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Added to Cart
                </>
              ) : isUnavailable ? (
                'Out of Stock'
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Add to Cart — ${(product.price * qty).toLocaleString()}
                </>
              )}
            </button>
          </div>

          {/* Coupon */}
          <div className="flex gap-2">
            <div className={cn(
              'flex-1 flex items-center gap-2 rounded-xl px-3 h-9 bg-slate-50 transition-all',
              couponState === 'ok'  ? 'bg-emerald-50 shadow-[0_0_0_1.5px_#10B981]' :
              couponState === 'err' ? 'bg-red-50 shadow-[0_0_0_1.5px_#EF4444]' :
              'focus-within:bg-white focus-within:shadow-[0_0_0_1.5px_#94A3B8]'
            )}>
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
              <input
                type="text"
                placeholder="Promo code (try SAVE10)"
                value={coupon}
                onChange={(e) => { setCoupon(e.target.value); setCouponState('idle') }}
                className={cn(
                  'flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400',
                  couponState === 'ok' ? 'text-emerald-700' : couponState === 'err' ? 'text-red-600' : 'text-slate-700'
                )}
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={!coupon.trim() || couponState === 'ok'}
              className="px-3 h-9 rounded-xl bg-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-200 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
            >
              Apply
            </button>
          </div>

          {couponState === 'ok' && (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Discount applied — reflected at checkout
            </p>
          )}
          {couponState === 'err' && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              Invalid code — try SAVE10, TECH20, or FIRST15
            </p>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-slate-50/70 px-8 py-6">
          <div className="flex items-center gap-3 mb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reviews</p>
            <div className="flex items-center gap-1.5">
              <Stars rating={product.rating} size="sm" />
              <span className="text-xs font-bold text-slate-600">{product.rating}</span>
              <span className="text-xs text-slate-400">/ 5</span>
            </div>
          </div>

          <div className="space-y-3">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl px-4 py-3.5 shadow-sm shadow-slate-200/60">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-slate-500">{review.author[0]}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{review.author}</span>
                    <Stars rating={review.rating} />
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{review.date}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-8">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="px-8 py-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              You may also like
            </p>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.slice(0, 2).map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectProduct(rel.id)}
                  className="text-left bg-slate-50 hover:bg-white rounded-xl px-4 py-3.5 transition-all duration-150 cursor-pointer group hover:shadow-md hover:shadow-slate-200/60"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-2xl mb-2.5', categoryBg[rel.category])}>
                    {categoryEmoji[rel.category]}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{rel.brand}</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-tight group-hover:text-slate-900 transition-colors">
                    {rel.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">${rel.price}</span>
                    {rel.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through tabular-nums">${rel.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Stars rating={rel.rating} />
                    <span className="text-[10px] text-slate-400">{rel.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
