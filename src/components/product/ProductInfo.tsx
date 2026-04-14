import { useState } from 'react'
import { ShoppingCart, Check, Truck, RotateCcw, Shield } from 'lucide-react'
import { type Product } from '@/data/products'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

const badgeStyles: Record<string, string> = {
  Sale: 'bg-red-700 text-white',
  New: 'bg-primary text-primary-foreground',
  'Best Seller': 'bg-accent text-accent-foreground',
}

// Map color names to approximate CSS values for swatches
const colorSwatches: Record<string, string> = {
  'Forest Green': '#2D5016',
  'Slate Grey': '#6B7280',
  'Rust Orange': '#C2410C',
  'Brown': '#92400E',
  'Black': '#111111',
  'Tan': '#B45309',
  'Dark Brown': '#451A03',
  'Olive': '#4D5C1E',
  'Charcoal': '#374151',
  'Forest': '#1A4B1A',
  'Deep Navy': '#1E3A5F',
  'Burnt Orange': '#C2410C',
  'Cobalt': '#1D4ED8',
  'Crimson': '#B91C1C',
  'Natural': '#D4C5A0',
  'Graphite': '#4B5563',
  'Navy': '#1E3A5F',
  'Red': '#DC2626',
  'Khaki': '#A3944A',
  'Dark Grey': '#374151',
  'Titanium Natural': '#9CA3AF',
}

type Props = { product: Product }

export default function ProductInfo({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes[0] === 'One Size' ? 'One Size' : null
  )
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0])
  const [added, setAdded] = useState(false)
  const { dispatch } = useCart()

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleAddToCart = () => {
    if (!selectedSize) return
    dispatch({ type: 'ADD', payload: { product, size: selectedSize, color: selectedColor } })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const canAdd = !!selectedSize

  return (
    <div className="space-y-7">

      {/* Badge + category */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          {product.category}
        </span>
        {product.badge && (
          <span className={cn(
            'text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1',
            badgeStyles[product.badge]
          )}>
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 bg-red-700 text-white">
            -{discount}% OFF
          </span>
        )}
      </div>

      {/* Name */}
      <h1
        className="text-[2rem] sm:text-[2.6rem] font-bold text-foreground leading-[1.06] tracking-[-0.02em]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-[1.6rem] font-bold text-foreground">${product.price}</span>
        {product.originalPrice && (
          <>
            <span className="text-[1.1rem] text-muted-foreground line-through">${product.originalPrice}</span>
            <span className="text-[13px] font-semibold text-red-700">
              Save ${product.originalPrice - product.price}
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-[15px] text-muted-foreground leading-[1.7] border-t border-border pt-6">
        {product.description}
      </p>

      {/* Color */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground mb-3">
          Color — <span className="font-normal text-muted-foreground normal-case tracking-normal">{selectedColor}</span>
        </p>
        <div className="flex flex-wrap gap-2.5">
          {product.colors.map(color => {
            const swatch = colorSwatches[color]
            const isSelected = selectedColor === color
            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                title={color}
                aria-label={`Color: ${color}${isSelected ? ' (selected)' : ''}`}
                aria-pressed={isSelected}
                className={cn(
                  'cursor-pointer w-8 h-8 rounded-full transition-all duration-150',
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                    : 'hover:scale-105 ring-1 ring-border'
                )}
                style={{ backgroundColor: swatch ?? '#ccc' }}
              />
            )
          })}
        </div>
      </div>

      {/* Size */}
      {product.sizes[0] !== 'One Size' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground">
              Size
            </p>
            <a href="#" className="cursor-pointer text-[12px] text-primary underline underline-offset-2 hover:opacity-70 transition-opacity duration-150">
              Size Guide
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={cn(
                  'cursor-pointer min-w-12 h-11 px-3 text-[13px] font-semibold border transition-all duration-150',
                  selectedSize === size
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                )}
              >
                {size}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <p className="text-[12px] text-muted-foreground mt-2" role="status">
              Select a size to continue
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleAddToCart}
        disabled={!canAdd}
        aria-disabled={!canAdd}
        className={cn(
          'cursor-pointer w-full flex items-center justify-center gap-3 py-4 text-[13px] font-bold tracking-[0.15em] uppercase transition-all duration-200 active:scale-[0.99]',
          added
            ? 'bg-green-800 text-white'
            : canAdd
              ? 'bg-foreground text-background hover:bg-foreground/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {added ? (
          <>
            <Check size={16} aria-hidden="true" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={16} aria-hidden="true" />
            Add to Cart
          </>
        )}
      </button>

      {/* Trust signals */}
      <div className="grid grid-cols-3 gap-4 pt-1 border-t border-border">
        {[
          { icon: Truck, label: 'Free shipping', sub: 'Over $100' },
          { icon: RotateCcw, label: '60-day returns', sub: 'No questions' },
          { icon: Shield, label: 'Lifetime warranty', sub: 'On all gear' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="text-center pt-4">
            <Icon size={16} className="mx-auto mb-1.5 text-muted-foreground" aria-hidden="true" />
            <p className="text-[11px] font-semibold text-foreground leading-tight">{label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
