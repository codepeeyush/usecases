import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { type Product, type StockStatus, type ProductBadge, type Category, products } from './data'
// ─── Types ────────────────────────────────────────────────────────────────────

export type CompareOverlay = {
  products: Product[]
  phase: 'scanning' | 'done'
} | null

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

// ─── Compare overlay ─────────────────────────────────────────────────────────

const categoryEmojiMap: Record<string, string> = {
  Headphones: '🎧',
  Keyboards: '⌨️',
  Monitors: '🖥️',
}

// ─── Keyframe styles injected once ───────────────────────────────────────────
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
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
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

// ─── Overlay component ────────────────────────────────────────────────────────
function CompareOverlayPanel({ overlay }: { overlay: NonNullable<CompareOverlay> }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [analyzedCount, setAnalyzedCount] = useState(0)
  const isDone = overlay.phase === 'done'
  const total = overlay.products.length

  useEffect(() => { ensureBlobStyles() }, [])

  // Pick 5 evenly-spread spotlight cards — never render all N
  const displayCards = useMemo(() => {
    if (total <= 5) return overlay.products
    const step = total / 5
    return [0, 1, 2, 3, 4].map((i) => overlay.products[Math.min(Math.round(i * step), total - 1)])
  }, [overlay.products, total])

  // Cycle active card through display cards only
  useEffect(() => {
    if (isDone) return
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % displayCards.length), 900)
    return () => clearInterval(id)
  }, [isDone, displayCards.length])

  // Analyzed-count counter: 0 → total over 4.3s
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

  // Progress bar over 4.3s
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
      {/* ── Heavy backdrop blur ─────────────────────────────────────── */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/55" />

      {/* ── Floating purple blobs ───────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-72 h-72 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #a855f7 0%, #7c3aed 50%, transparent 70%)', top: '-60px', left: '-40px', filter: 'blur(48px)', animation: 'blob-drift-1 7s ease-in-out infinite' }} />
        <div className="absolute w-64 h-64 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #6366f1 0%, #4f46e5 50%, transparent 70%)', bottom: '-40px', right: '-30px', filter: 'blur(52px)', animation: 'blob-drift-2 9s ease-in-out infinite' }} />
        <div className="absolute w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #e879f9 0%, #c026d3 60%, transparent 80%)', top: '35%', left: '45%', filter: 'blur(40px)', animation: 'blob-drift-3 6s ease-in-out infinite' }} />
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">

          {isDone ? (
            /* ── Done state ─────────────────────────────── */
            <div className="rounded-2xl px-6 py-5 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', boxShadow: '0 0 0 1px rgba(167,139,250,0.3), 0 20px 40px rgba(109,40,217,0.12)' }}>
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-30" style={{ animation: 'pulse-ring 1.2s ease-out infinite' }} />
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center relative z-10">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Analysis complete</p>
                <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">{total} {overlay.products[0]?.category ?? 'products'} compared</p>
                <p className="text-xs text-violet-500 font-medium mt-0.5">Check the chat for my recommendation →</p>
              </div>
            </div>

          ) : (
            /* ── Scanning state ──────────────────────────── */
            <div className="rounded-2xl px-5 py-5" style={{ background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(24px)', boxShadow: '0 0 0 1px rgba(167,139,250,0.35), 0 24px 48px rgba(109,40,217,0.15)' }}>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, #a855f7, #7c3aed)', animation: 'pulse-ring 1.4s ease-out infinite' }} />
                  <div className="w-9 h-9 rounded-full flex items-center justify-center relative z-10" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)' }}>
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M22 2 12 12"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">
                    Comparing {overlay.products[0]?.category ?? 'products'}
                  </p>
                  <p className="text-[11px] text-violet-500 font-medium">AI is reading specs, ratings & pricing</p>
                </div>
                {/* Live counter badge */}
                <div className="shrink-0 text-right">
                  <p className="text-lg font-black tabular-nums leading-none" style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {analyzedCount}
                  </p>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">/ {total}</p>
                </div>
              </div>

              {/* 5 spotlight cards — fixed height, never overflows */}
              <div className="space-y-1.5 mb-4">
                {displayCards.map((p, i) => {
                  const isActive = i === activeIdx
                  return (
                    <div
                      key={p.id}
                      className="relative overflow-hidden rounded-xl transition-all duration-500"
                      style={isActive ? {
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 100%)',
                        boxShadow: '0 0 0 1px rgba(167,139,250,0.4), 0 6px 20px rgba(109,40,217,0.25)',
                      } : {
                        background: 'rgba(248,250,252,0.8)',
                      }}
                    >
                      {isActive && (
                        <div className="absolute inset-x-0 h-0.5 z-20" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)', animation: 'scan-line 1.6s ease-in-out infinite' }} />
                      )}
                      <div className="flex items-center gap-2.5 px-3 py-2 relative z-10">
                        <span className="text-base shrink-0">{categoryEmojiMap[p.category] ?? '🎧'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-semibold truncate', isActive ? 'text-white' : 'text-slate-800')}>{p.name}</p>
                          <p className={cn('text-[10px]', isActive ? 'text-violet-300' : 'text-slate-400')}>{p.brand} · ★ {p.rating}</p>
                        </div>
                        <p className={cn('text-xs font-bold tabular-nums shrink-0', isActive ? 'text-violet-300' : 'text-slate-700')}>${p.price}</p>
                        {isActive && (
                          <div className="flex gap-0.5 shrink-0">
                            {[0, 1, 2].map((n) => (
                              <span key={n} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${n * 120}ms` }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Ticker: scrolling product name being "read" */}
              <div className="mb-3 px-2 py-1.5 rounded-lg overflow-hidden" style={{ background: 'rgba(109,40,217,0.06)' }}>
                <p className="text-[10px] text-violet-500 truncate tabular-nums">
                  <span className="font-semibold text-violet-400">Reading · </span>
                  {overlay.products[analyzedCount % total]?.name ?? '...'}
                </p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Analyzing
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 tabular-nums">{progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #a855f7, #6366f1, #818cf8)' }} />
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

function StepRow({
  icon,
  label,
  state,
  sub,
}: {
  icon: string
  label: string
  state: StepState
  sub?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm transition-all duration-300',
          state === 'done'   ? 'bg-emerald-500 text-white' :
          state === 'error'  ? 'bg-red-500 text-white' :
          state === 'active' ? 'text-white' : 'bg-slate-100 text-slate-400',
        )}
        style={state === 'active' ? { background: 'linear-gradient(135deg,#a855f7,#6d28d9)' } : undefined}
      >
        {state === 'done'   ? '✓' :
         state === 'error'  ? '✗' :
         state === 'active' ? <span className="animate-pulse">{icon}</span> : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-xs font-semibold',
          state === 'done'  ? 'text-emerald-700' :
          state === 'error' ? 'text-red-600' :
          state === 'active'? 'text-slate-800' : 'text-slate-400',
        )}>
          {label}
        </p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {state === 'active' && (
        <div className="flex gap-0.5 shrink-0">
          {[0,1,2].map((n) => (
            <span key={n} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${n*120}ms` }} />
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

  const isCouponFlow = ['applying_coupon','coupon_applied','coupon_failed'].includes(phase)
  const isErrorPhase = ['out_of_stock','failed','cancelled','coupon_failed'].includes(phase)
  const isDone = phase === 'done' || phase === 'coupon_applied'

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-xl bg-white/60" />

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-56 h-56 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#a855f7,#7c3aed,transparent 70%)', top: '-30px', right: '-20px', filter: 'blur(40px)', animation: 'blob-drift-1 7s ease-in-out infinite' }} />
        <div className="absolute w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#6366f1,#4f46e5,transparent 70%)', bottom: '-20px', left: '-10px', filter: 'blur(44px)', animation: 'blob-drift-2 9s ease-in-out infinite' }} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div
          className="w-full max-w-xs rounded-2xl px-5 py-5 space-y-3"
          style={{ background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(24px)', boxShadow: '0 0 0 1px rgba(167,139,250,0.3), 0 20px 40px rgba(109,40,217,0.14)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-1">
            <div className="relative shrink-0">
              <div
                className="absolute inset-0 rounded-full opacity-35"
                style={{ animation: 'pulse-ring 1.4s ease-out infinite', background: isDone ? '#10b981' : isErrorPhase ? '#ef4444' : '#a855f7' }}
              />
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center relative z-10 text-white text-sm"
                style={{ background: isDone ? '#10b981' : isErrorPhase ? '#ef4444' : 'linear-gradient(135deg,#a855f7,#6d28d9)' }}
              >
                {isDone ? '✓' : isErrorPhase ? '✗' : '🛒'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">
                {isDone && !isCouponFlow ? 'Added to cart!'
                 : isDone && isCouponFlow ? 'Coupon applied!'
                 : isErrorPhase ? phase === 'out_of_stock' ? 'Out of stock'
                                : phase === 'cancelled'   ? 'Cancelled'
                                : phase === 'coupon_failed' ? 'Invalid coupon'
                                : 'Unavailable'
                 : isCouponFlow ? 'Applying coupon…'
                 : 'Updating cart…'}
              </p>
              <p className="text-[11px] text-violet-500 font-medium truncate">{productName}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {isCouponFlow ? (
              <>
                <StepRow
                  icon="🏷"
                  label="Validating coupon code"
                  state={phase === 'coupon_failed' ? 'error' : phase === 'applying_coupon' ? 'active' : 'done'}
                />
                <StepRow
                  icon="💰"
                  label={couponCode ? `${discount}% off with ${couponCode}` : 'Applying discount'}
                  state={phase === 'coupon_failed' ? 'idle' : phase === 'applying_coupon' ? 'idle' : 'done'}
                  sub={discount ? `Save ${discount}% on your order` : undefined}
                />
              </>
            ) : (
              <>
                <StepRow
                  icon="🔍"
                  label="Checking availability"
                  state={stepState('checking')}
                  sub={phase === 'out_of_stock' ? 'This item is out of stock' : undefined}
                />
                <StepRow
                  icon="➕"
                  label="Adding to cart"
                  state={
                    ['out_of_stock','failed','cancelled'].includes(phase) ? 'idle'
                    : stepState('adding')
                  }
                />
                <StepRow
                  icon="✅"
                  label="Done"
                  state={phase === 'done' ? 'done' : 'idle'}
                />
              </>
            )}
          </div>

          {phase === 'out_of_stock' && (
            <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Finding the best available alternative…
            </p>
          )}
          {couponCode && phase === 'coupon_applied' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 mt-1">
              <span className="text-emerald-600 font-bold text-xs">{couponCode}</span>
              <span className="text-emerald-500 text-[11px]">applied — {discount}% off</span>
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
}

export default function ProductDetail({ product, onAddToCart, onSelectProduct, compareOverlay, cartOverlay }: ProductDetailProps) {
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
    <div className="flex flex-col h-full bg-white relative" style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>

      {/* ── Compare overlay ───────────────────────────────────────────── */}
      {compareOverlay && <CompareOverlayPanel overlay={compareOverlay} />}

      {/* ── Cart steps overlay ────────────────────────────────────────── */}
      {cartOverlay && !compareOverlay && <CartStepsOverlay overlay={cartOverlay} />}

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
