import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { type Product, type StockStatus, type Category, products } from './data'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CompareOverlay = {
  products: Product[]
  phase: 'scanning' | 'done'
} | null

// ─── Brand tokens ─────────────────────────────────────────────────────────────

const BRAND = {
  accent:      '#3B82F6',
  accentHover: '#2563EB',
  pageBg:      '#F4F5F7',
  cardBorder:  '#E8EAED',
  textPrimary: '#0A0A0F',
  textMuted:   '#6B7280',
  star:        '#F59E0B',
  inStock:     '#16A34A',
  lowStock:    '#D97706',
  outOfStock:  '#EF4444',
} as const

// ─── Visual config ────────────────────────────────────────────────────────────

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

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 'w-4 h-4' : 'w-3 h-3'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={cn(dim, n <= Math.round(rating) ? 'text-[#F59E0B]' : 'text-[#E5E7EB]')} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Keyframe styles ─────────────────────────────────────────────────────────

const BLOB_STYLES = `
@keyframes blob-drift-1 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33%       { transform: translate(40px, -30px) scale(1.12); }
  66%       { transform: translate(-20px, 20px) scale(0.95); }
}
@keyframes blob-drift-2 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33%       { transform: translate(-50px, 25px) scale(1.08); }
  66%       { transform: translate(30px, -40px) scale(1.15); }
}
@keyframes blob-drift-3 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  50%       { transform: translate(25px, 35px) scale(1.1); }
}
@keyframes scan-line {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(400%); opacity: 0; }
}
@keyframes pulse-ring {
  0%   { transform: scale(0.9); opacity: 0.7; }
  100% { transform: scale(1.6); opacity: 0; }
}
`

let stylesInjected = false
function ensureBlobStyles() {
  if (stylesInjected) return
  const el = document.createElement('style')
  el.textContent = BLOB_STYLES
  document.head.appendChild(el)
  stylesInjected = true
}

// ─── Compare overlay ──────────────────────────────────────────────────────────

const categoryEmojiMap: Record<string, string> = {
  Headphones: '🎧',
  Keyboards: '⌨️',
  Monitors: '🖥️',
}

function CompareOverlayPanel({ overlay }: { overlay: NonNullable<CompareOverlay> }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [analyzedCount, setAnalyzedCount] = useState(0)
  const isDone = overlay.phase === 'done'
  const total = overlay.products.length

  useEffect(() => { ensureBlobStyles() }, [])

  const displayCards = useMemo(() => {
    if (total <= 5) return overlay.products
    const step = total / 5
    return [0, 1, 2, 3, 4].map((i) => overlay.products[Math.min(Math.round(i * step), total - 1)])
  }, [overlay.products, total])

  useEffect(() => {
    if (isDone) return
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % displayCards.length), 900)
    return () => clearInterval(id)
  }, [isDone, displayCards.length])

  useEffect(() => {
    if (isDone) { setAnalyzedCount(total); return }
    setAnalyzedCount(0)
    const start = Date.now()
    const duration = 4300
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration)
      setAnalyzedCount(Math.round((1 - Math.pow(1 - t, 1.5)) * total))
      if (t >= 1) clearInterval(id)
    }, 60)
    return () => clearInterval(id)
  }, [isDone, total])

  useEffect(() => {
    if (isDone) { setProgress(100); return }
    setProgress(0)
    const start = Date.now()
    const duration = 4300
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration)
      setProgress(Math.round((1 - Math.pow(1 - t, 2.2)) * 97))
      if (t >= 1) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [isDone])

  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-xl bg-white/55" />

      {/* Blobs — brand blue/indigo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-72 h-72 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #1D4ED8 0%, #1E40AF 50%, transparent 70%)', top: '-60px', left: '-40px', filter: 'blur(48px)', animation: 'blob-drift-1 7s ease-in-out infinite' }} />
        <div className="absolute w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #0EA5E9 0%, #0284C7 50%, transparent 70%)', bottom: '-40px', right: '-30px', filter: 'blur(52px)', animation: 'blob-drift-2 9s ease-in-out infinite' }} />
        <div className="absolute w-40 h-40 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #F59E0B 0%, #D97706 60%, transparent 80%)', top: '35%', left: '45%', filter: 'blur(40px)', animation: 'blob-drift-3 6s ease-in-out infinite' }} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          {isDone ? (
            <div className="rounded-2xl px-6 py-5 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', boxShadow: '0 0 0 1px rgba(59,130,246,0.18), 0 20px 40px rgba(10,10,15,0.12)' }}>
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-30" style={{ animation: 'pulse-ring 1.2s ease-out infinite' }} />
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center relative z-10">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: BRAND.textPrimary, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>Analysis complete</p>
                <p className="text-[11px] mt-0.5 tabular-nums" style={{ color: BRAND.textMuted, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>{total} {overlay.products[0]?.category ?? 'products'} compared</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: BRAND.accent, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>Check the chat for my recommendation →</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl px-5 py-5" style={{ background: 'rgba(255,255,255,0.76)', backdropFilter: 'blur(24px)', boxShadow: '0 0 0 1px rgba(59,130,246,0.18), 0 24px 48px rgba(10,10,15,0.12)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full opacity-35" style={{ background: `radial-gradient(circle, ${BRAND.accent}, #1D4ED8)`, animation: 'pulse-ring 1.4s ease-out infinite' }} />
                  <div className="w-9 h-9 rounded-full flex items-center justify-center relative z-10" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M22 2 12 12"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: BRAND.textPrimary, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                    Comparing {overlay.products[0]?.category ?? 'products'}
                  </p>
                  <p className="text-[11px] font-medium" style={{ color: BRAND.accent, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                    AI is reading specs, ratings & pricing
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-black tabular-nums leading-none" style={{ background: `linear-gradient(135deg, ${BRAND.accent}, #0EA5E9)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {analyzedCount}
                  </p>
                  <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: BRAND.textMuted }}>/ {total}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                {displayCards.map((p, i) => {
                  const isActive = i === activeIdx
                  return (
                    <div
                      key={p.id}
                      className="relative overflow-hidden rounded-xl transition-all duration-500"
                      style={isActive ? {
                        background: 'linear-gradient(135deg, #0A0A0F 0%, #1E1B4B 100%)',
                        boxShadow: `0 0 0 1px rgba(59,130,246,0.4), 0 6px 20px rgba(10,10,15,0.2)`,
                      } : {
                        background: 'rgba(248,250,252,0.8)',
                      }}
                    >
                      {isActive && (
                        <div className="absolute inset-x-0 h-0.5 z-20" style={{ background: `linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)`, animation: 'scan-line 1.6s ease-in-out infinite' }} />
                      )}
                      <div className="flex items-center gap-2.5 px-3 py-2 relative z-10">
                        <span className="text-base shrink-0">{categoryEmojiMap[p.category] ?? '🎧'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: isActive ? '#FFFFFF' : BRAND.textPrimary, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>{p.name}</p>
                          <p className="text-[10px]" style={{ color: isActive ? '#93C5FD' : BRAND.textMuted, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>{p.brand} · ★ {p.rating}</p>
                        </div>
                        <p className="text-xs font-bold tabular-nums shrink-0" style={{ color: isActive ? '#93C5FD' : BRAND.textPrimary, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>${p.price}</p>
                        {isActive && (
                          <div className="flex gap-0.5 shrink-0">
                            {[0, 1, 2].map((n) => (
                              <span key={n} className="w-1 h-1 rounded-full animate-bounce" style={{ background: BRAND.accent, animationDelay: `${n * 120}ms` }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mb-3 px-2 py-1.5 rounded-lg overflow-hidden" style={{ background: 'rgba(59,130,246,0.06)' }}>
                <p className="text-[10px] truncate tabular-nums" style={{ color: BRAND.accent, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                  <span className="font-semibold" style={{ color: BRAND.accentHover }}>Reading · </span>
                  {overlay.products[analyzedCount % total]?.name ?? '...'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ background: `linear-gradient(90deg, ${BRAND.accent}, #0EA5E9)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                    Analyzing
                  </span>
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: BRAND.textMuted }}>{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                  <div className="h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${BRAND.accent}, #0EA5E9)` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Cart steps overlay ───────────────────────────────────────────────────────

export type CartOverlayPhase =
  | 'checking'
  | 'out_of_stock'
  | 'adding'
  | 'done'
  | 'failed'
  | 'cancelled'
  | 'coupon_failed'
  | 'coupon_applied'
  | 'applying_coupon'

export type CartOverlay = {
  phase: CartOverlayPhase
  productName: string
  couponCode?: string
  discount?: number
} | null

type StepState = 'idle' | 'active' | 'done' | 'error'

function StepRow({ icon, label, state, sub }: { icon: string; label: string; state: StepState; sub?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm transition-all duration-300', state === 'done' ? 'bg-emerald-500 text-white' : state === 'error' ? 'bg-red-500 text-white' : state === 'idle' ? 'bg-slate-100 text-slate-400' : 'text-white')}
        style={state === 'active' ? { background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' } : undefined}
      >
        {state === 'done' ? '✓' : state === 'error' ? '✗' : state === 'active' ? <span className="animate-pulse">{icon}</span> : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold"
          style={{
            color: state === 'done' ? '#059669' : state === 'error' ? '#EF4444' : state === 'active' ? BRAND.textPrimary : '#9CA3AF',
            fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
          }}
        >
          {label}
        </p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: BRAND.textMuted, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>{sub}</p>}
      </div>
      {state === 'active' && (
        <div className="flex gap-0.5 shrink-0">
          {[0, 1, 2].map((n) => (
            <span key={n} className="w-1 h-1 rounded-full animate-bounce" style={{ background: BRAND.accent, animationDelay: `${n * 120}ms` }} />
          ))}
        </div>
      )}
    </div>
  )
}

function CartStepsOverlay({ overlay }: { overlay: NonNullable<CartOverlay> }) {
  const { phase, productName, couponCode, discount } = overlay

  const stepState = (forPhase: CartOverlayPhase): StepState => {
    const order: CartOverlayPhase[] = ['checking', 'adding', 'done']
    const errorPhases: CartOverlayPhase[] = ['out_of_stock', 'failed', 'cancelled', 'coupon_failed']
    const successPhases: CartOverlayPhase[] = ['done', 'coupon_applied']
    if (errorPhases.includes(phase) && forPhase === 'checking') return 'error'
    if (forPhase === phase) return successPhases.includes(phase) ? 'done' : 'active'
    const currentIdx = order.indexOf(phase)
    const forIdx = order.indexOf(forPhase)
    if (currentIdx > forIdx) return 'done'
    return 'idle'
  }

  const isCouponFlow = ['applying_coupon', 'coupon_applied', 'coupon_failed'].includes(phase)
  const isErrorPhase = ['out_of_stock', 'failed', 'cancelled', 'coupon_failed'].includes(phase)
  const isDone = phase === 'done' || phase === 'coupon_applied'

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-xl bg-white/60" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-56 h-56 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #1D4ED8, #1E40AF, transparent 70%)', top: '-30px', right: '-20px', filter: 'blur(40px)', animation: 'blob-drift-1 7s ease-in-out infinite' }} />
        <div className="absolute w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #0EA5E9, #0284C7, transparent 70%)', bottom: '-20px', left: '-10px', filter: 'blur(44px)', animation: 'blob-drift-2 9s ease-in-out infinite' }} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="w-full max-w-xs rounded-2xl px-5 py-5 space-y-3" style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(24px)', boxShadow: '0 0 0 1px rgba(59,130,246,0.18), 0 20px 40px rgba(10,10,15,0.12)' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 rounded-full opacity-35"
                style={{ animation: 'pulse-ring 1.4s ease-out infinite', background: isDone ? '#10b981' : isErrorPhase ? '#ef4444' : BRAND.accent }}
              />
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center relative z-10 text-white text-sm"
                style={{ background: isDone ? '#10b981' : isErrorPhase ? '#ef4444' : 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}
              >
                {isDone ? '✓' : isErrorPhase ? '✗' : '🛒'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: BRAND.textPrimary, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
                {isDone && !isCouponFlow ? 'Added to cart!'
                  : isDone && isCouponFlow ? 'Coupon applied!'
                  : isErrorPhase
                    ? phase === 'out_of_stock' ? 'Out of stock'
                    : phase === 'cancelled' ? 'Cancelled'
                    : phase === 'coupon_failed' ? 'Invalid coupon'
                    : 'Unavailable'
                  : isCouponFlow ? 'Applying coupon…'
                  : 'Updating cart…'}
              </p>
              <p className="text-[11px] font-medium truncate" style={{ color: BRAND.accent, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>{productName}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {isCouponFlow ? (
              <>
                <StepRow icon="🏷" label="Validating coupon code" state={phase === 'coupon_failed' ? 'error' : phase === 'applying_coupon' ? 'active' : 'done'} />
                <StepRow icon="💰" label={couponCode ? `${discount}% off with ${couponCode}` : 'Applying discount'} state={phase === 'coupon_failed' ? 'idle' : phase === 'applying_coupon' ? 'idle' : 'done'} sub={discount ? `Save ${discount}% on your order` : undefined} />
              </>
            ) : (
              <>
                <StepRow icon="🔍" label="Checking availability" state={stepState('checking')} sub={phase === 'out_of_stock' ? 'This item is out of stock' : undefined} />
                <StepRow icon="➕" label="Adding to cart" state={['out_of_stock', 'failed', 'cancelled'].includes(phase) ? 'idle' : stepState('adding')} />
                <StepRow icon="✅" label="Done" state={phase === 'done' ? 'done' : 'idle'} />
              </>
            )}
          </div>

          {phase === 'out_of_stock' && (
            <p className="text-[11px] pt-1 border-t border-slate-100" style={{ color: BRAND.textMuted, fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
              Finding the best available alternative…
            </p>
          )}
          {couponCode && phase === 'coupon_applied' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 mt-1">
              <span className="text-emerald-600 font-bold text-xs" style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>{couponCode}</span>
              <span className="text-emerald-500 text-[11px]" style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>applied — {discount}% off</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProductDetailProps {
  product: Product
  cartCount: number
  onAddToCart: (productId: string, qty: number) => void
  onSelectProduct: (id: string) => void
  compareOverlay: CompareOverlay
  cartOverlay: CartOverlay
  onBackToListing?: () => void
}

export default function ProductDetail({ product, onAddToCart, onSelectProduct, compareOverlay, cartOverlay, onBackToListing }: ProductDetailProps) {
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

  const stockColor = product.stock === 'in_stock' ? BRAND.inStock
    : product.stock === 'low_stock' ? BRAND.lowStock
    : BRAND.outOfStock
  const stockLabel = product.stock === 'in_stock' ? 'In Stock'
    : product.stock === 'low_stock' ? 'Only a few left in stock'
    : 'Currently unavailable'

  const FONT = "'Plus Jakarta Sans Variable', sans-serif"

  return (
    <div className="flex flex-col relative h-full overflow-y-auto" style={{ background: BRAND.pageBg, fontFamily: FONT }}>

      {/* Overlays */}
      {compareOverlay && <CompareOverlayPanel overlay={compareOverlay} />}
      {cartOverlay && !compareOverlay && <CartStepsOverlay overlay={cartOverlay} />}

      {/* Breadcrumb */}
      <div className="bg-white px-4 py-2 flex items-center gap-1 text-xs" style={{ borderBottom: `1px solid ${BRAND.cardBorder}` }}>
        <button
          onClick={onBackToListing}
          className="flex items-center gap-1 cursor-pointer transition-colors"
          style={{ color: BRAND.accent, fontFamily: FONT }}
          onMouseEnter={e => (e.currentTarget.style.color = BRAND.accentHover)}
          onMouseLeave={e => (e.currentTarget.style.color = BRAND.accent)}
        >
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
          Back to results
        </button>
        <span className="mx-1" style={{ color: BRAND.textMuted }}>/</span>
        <button onClick={onBackToListing} className="cursor-pointer hover:underline transition-colors" style={{ color: BRAND.accent }}>{product.category}</button>
        <span className="mx-1" style={{ color: BRAND.textMuted }}>/</span>
        <span className="truncate max-w-[280px]" style={{ color: BRAND.textPrimary }}>{product.name}</span>
      </div>

      {/* Three-column layout */}
      <div className="flex gap-4 px-4 py-4 items-start">

        {/* LEFT: Product image */}
        <div className="w-[260px] shrink-0">
          <div className="bg-white p-4 rounded-xl" style={{ border: `1px solid ${BRAND.cardBorder}`, boxShadow: '0 1px 3px rgba(10,10,15,0.06)' }}>
            <div className={cn('w-full rounded-lg flex items-center justify-center text-[80px]', categoryBg[product.category])} style={{ aspectRatio: '1' }}>
              {categoryEmoji[product.category]}
            </div>
          </div>
        </div>

        {/* CENTER: Product info */}
        <div className="flex-1 min-w-0 bg-white px-5 py-4 rounded-xl" style={{ border: `1px solid ${BRAND.cardBorder}`, boxShadow: '0 1px 3px rgba(10,10,15,0.06)' }}>

          {/* Badge */}
          {product.badge && (
            <div
              className="inline-block text-[11px] font-bold px-2.5 py-0.5 mb-3 rounded-full text-white"
              style={{
                background: product.badge === 'bestseller' ? BRAND.star
                  : product.badge === 'sale' ? BRAND.outOfStock
                  : BRAND.accent,
                fontFamily: FONT,
              }}
            >
              {product.badge === 'bestseller' ? '🏆 Best Seller' : product.badge === 'sale' ? '🔥 Limited Deal' : '✨ New Release'}
            </div>
          )}

          {/* Title */}
          <h1 className="text-xl font-bold leading-snug mb-1" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>
            {product.name}
          </h1>

          {/* Brand link */}
          <p className="text-sm mb-3 cursor-pointer hover:underline" style={{ color: BRAND.accent, fontFamily: FONT }}>
            Visit the {product.brand} Store
          </p>

          {/* Rating row */}
          <div className="flex items-center gap-2 pb-3 mb-3" style={{ borderBottom: `1px solid ${BRAND.cardBorder}` }}>
            <Stars rating={product.rating} size="md" />
            <span className="text-sm cursor-pointer hover:underline" style={{ color: BRAND.accent, fontFamily: FONT }}>
              {product.reviewCount.toLocaleString()} ratings
            </span>
          </div>

          {/* Price */}
          <div className="mb-4 pb-4" style={{ borderBottom: `1px solid ${BRAND.cardBorder}` }}>
            {product.originalPrice && (
              <div className="text-xs mb-0.5" style={{ color: BRAND.textMuted, fontFamily: FONT }}>
                Was: <span className="line-through">${product.originalPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-baseline gap-2.5 flex-wrap">
              {discount && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: BRAND.outOfStock, fontFamily: FONT }}>-{discount}%</span>
              )}
              <span className="text-3xl font-bold" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>
                <sup className="text-base align-super">$</sup>{Math.floor(product.price)}<sup className="text-base align-super">{(product.price % 1).toFixed(2).slice(1)}</sup>
              </span>
            </div>
            {product.originalPrice && discount && (
              <p className="text-xs mt-0.5" style={{ color: BRAND.textMuted, fontFamily: FONT }}>
                You save: ${(product.originalPrice - product.price).toFixed(2)} ({discount}%)
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: BRAND.accent, fontFamily: FONT }}>Fast Ship+</span>
              <span className="text-xs font-medium" style={{ color: BRAND.inStock, fontFamily: FONT }}>FREE delivery Tomorrow</span>
            </div>
          </div>

          {/* About this item */}
          <div className="mb-5">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-3" style={{ color: BRAND.textMuted, fontFamily: FONT }}>About this item</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              {product.description.split('. ').filter(s => s.trim().length > 0).map((sentence, i) => (
                <li key={i} className="text-sm leading-relaxed" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>
                  {sentence.trim().replace(/\.$/, '')}.
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Details */}
          <div className="mb-5">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-3" style={{ color: BRAND.textMuted, fontFamily: FONT }}>Technical Details</h3>
            <table className="w-full text-sm border-collapse">
              <tbody>
                {product.specs.map((spec, i) => (
                  <tr key={spec.label} style={{ background: i % 2 === 0 ? BRAND.pageBg : '#FFFFFF' }}>
                    <td className="py-2 px-3 font-semibold w-2/5 align-top rounded-l" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>{spec.label}</td>
                    <td className="py-2 px-3 align-top" style={{ color: BRAND.textMuted, fontFamily: FONT }}>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer Reviews */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-3" style={{ color: BRAND.textMuted, fontFamily: FONT }}>Customer Reviews</h3>
            <div className="flex items-center gap-3 mb-4">
              <Stars rating={product.rating} size="md" />
              <span className="font-bold" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>{product.rating} out of 5</span>
            </div>

            {/* Rating breakdown bars */}
            {(() => {
              const total = product.reviews.length
              const counts = [5, 4, 3, 2, 1].map(stars => ({
                stars,
                pct: total > 0 ? Math.round((product.reviews.filter(r => r.rating === stars).length / total) * 100) : 0,
              }))
              return (
                <div className="mb-5 max-w-xs">
                  {counts.map(({ stars, pct }) => (
                    <div key={stars} className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs w-10 shrink-0 cursor-pointer hover:underline" style={{ color: BRAND.accent, fontFamily: FONT }}>{stars} star</span>
                      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: BRAND.cardBorder }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${BRAND.star}, #FBBF24)` }} />
                      </div>
                      <span className="text-xs w-8 shrink-0" style={{ color: BRAND.textMuted, fontFamily: FONT }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              )
            })()}

            {/* Individual reviews */}
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="pb-4" style={{ borderBottom: `1px solid ${BRAND.cardBorder}` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: BRAND.accent }}>
                      {review.author[0]}
                    </div>
                    <span className="font-bold text-sm" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>{review.author}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#F0FDF4', color: BRAND.inStock, fontFamily: FONT }}>Verified</span>
                  </div>
                  <Stars rating={review.rating} size="sm" />
                  <p className="text-sm mt-1.5 leading-relaxed" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>{review.comment}</p>
                  <p className="text-xs mt-1" style={{ color: BRAND.textMuted, fontFamily: FONT }}>{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Buy Box */}
        <div className="w-[220px] shrink-0 space-y-3">
          <div className="bg-white rounded-xl px-4 py-4" style={{ border: `1px solid ${BRAND.cardBorder}`, boxShadow: '0 2px 12px rgba(10,10,15,0.08)' }}>

            {/* Price */}
            <div className="text-2xl font-bold mb-1" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>
              <sup className="text-sm align-super">$</sup>{Math.floor(product.price)}<sup className="text-sm align-super">{(product.price % 1).toFixed(2).slice(1)}</sup>
            </div>

            {/* Fast Ship + delivery */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: BRAND.accent, fontFamily: FONT }}>Fast Ship+</span>
              <span className="text-xs font-medium" style={{ color: BRAND.inStock, fontFamily: FONT }}>FREE Delivery</span>
            </div>
            <p className="text-xs mb-3" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>
              <strong>Tomorrow</strong> by 8 PM. Order within{' '}
              <span style={{ color: BRAND.inStock }}>2 hrs 15 mins</span>
            </p>

            {/* Stock */}
            <p className="text-sm mb-3 font-semibold" style={{ color: stockColor, fontFamily: FONT }}>
              {stockLabel}
            </p>

            {/* Qty */}
            <div className="flex items-center gap-2 mb-3">
              <label className="text-xs font-semibold" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>Qty:</label>
              <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${BRAND.cardBorder}` }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1 || isUnavailable}
                  className="w-8 h-7 flex items-center justify-center font-medium cursor-pointer transition-colors disabled:opacity-30"
                  style={{ background: BRAND.pageBg, color: BRAND.textPrimary, fontFamily: FONT }}
                  onMouseEnter={e => !isUnavailable && (e.currentTarget.style.background = '#E8EAED')}
                  onMouseLeave={e => (e.currentTarget.style.background = BRAND.pageBg)}
                >−</button>
                <span className="w-8 text-center text-sm font-semibold h-7 flex items-center justify-center" style={{ borderLeft: `1px solid ${BRAND.cardBorder}`, borderRight: `1px solid ${BRAND.cardBorder}`, color: BRAND.textPrimary, fontFamily: FONT }}>{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(10, q + 1))}
                  disabled={qty >= 10 || isUnavailable}
                  className="w-8 h-7 flex items-center justify-center font-medium cursor-pointer transition-colors disabled:opacity-30"
                  style={{ background: BRAND.pageBg, color: BRAND.textPrimary, fontFamily: FONT }}
                  onMouseEnter={e => !isUnavailable && (e.currentTarget.style.background = '#E8EAED')}
                  onMouseLeave={e => (e.currentTarget.style.background = BRAND.pageBg)}
                >+</button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isUnavailable}
              className="w-full py-2.5 rounded-full text-sm font-bold mb-2.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              style={{
                background: isUnavailable ? '#E5E7EB' : cartFeedback ? '#10B981' : `linear-gradient(135deg, ${BRAND.accent}, #1D4ED8)`,
                color: isUnavailable ? BRAND.textMuted : '#FFFFFF',
                fontFamily: FONT,
                boxShadow: isUnavailable || cartFeedback ? 'none' : '0 1px 4px rgba(59,130,246,0.30)',
              }}
            >
              {cartFeedback ? '✓ Added to Cart' : isUnavailable ? 'Unavailable' : 'Add to Cart'}
            </button>

            {/* Buy Now */}
            <button
              disabled={isUnavailable}
              className="w-full py-2.5 rounded-full text-sm font-bold mb-4 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              style={{
                background: isUnavailable ? '#E5E7EB' : BRAND.textPrimary,
                color: isUnavailable ? BRAND.textMuted : '#FFFFFF',
                fontFamily: FONT,
              }}
            >
              Buy Now
            </button>

            {/* Coupon */}
            <div style={{ borderTop: `1px solid ${BRAND.cardBorder}`, paddingTop: '12px' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>Apply coupon</p>
              <div
                className="flex rounded-lg overflow-hidden mb-1"
                style={{
                  border: `1px solid ${couponState === 'ok' ? BRAND.inStock : couponState === 'err' ? BRAND.outOfStock : BRAND.cardBorder}`,
                }}
              >
                <input
                  type="text"
                  placeholder="SAVE10, TECH20…"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponState('idle') }}
                  className="flex-1 px-2 py-1.5 text-xs outline-none min-w-0"
                  style={{ color: BRAND.textPrimary, background: '#FFFFFF', fontFamily: FONT }}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!coupon.trim() || couponState === 'ok'}
                  className="px-2 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-40"
                  style={{ background: BRAND.pageBg, color: BRAND.textPrimary, borderLeft: `1px solid ${BRAND.cardBorder}`, fontFamily: FONT }}
                >
                  Apply
                </button>
              </div>
              {couponState === 'ok' && (
                <p className="text-xs font-medium" style={{ color: BRAND.inStock, fontFamily: FONT }}>✓ Discount applied at checkout</p>
              )}
              {couponState === 'err' && (
                <p className="text-xs" style={{ color: BRAND.outOfStock, fontFamily: FONT }}>Invalid code</p>
              )}
            </div>
          </div>

          {/* Customers also viewed */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-xl px-3 py-3" style={{ border: `1px solid ${BRAND.cardBorder}`, boxShadow: '0 1px 3px rgba(10,10,15,0.06)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND.textMuted, fontFamily: FONT }}>Also viewed</p>
              {relatedProducts.slice(0, 2).map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectProduct(rel.id)}
                  className="flex items-center gap-2.5 w-full text-left mb-3 last:mb-0 group cursor-pointer"
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0', categoryBg[rel.category])}>
                    {categoryEmoji[rel.category]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs leading-tight group-hover:underline" style={{ color: BRAND.accent, fontFamily: FONT }}>{rel.name}</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: BRAND.textPrimary, fontFamily: FONT }}>${rel.price}</p>
                    <Stars rating={rel.rating} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
