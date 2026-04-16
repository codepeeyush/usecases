import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import { type Product } from '@/data/products'
import { cn } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { summitTrailPaths } from '@/lib/routes'

type Props = {
  product: Product
  className?: string
}

const badgeStyles: Record<string, string> = {
  Sale: 'bg-red-700 text-white',
  New: 'bg-primary text-primary-foreground',
  'Best Seller': 'bg-accent text-accent-foreground',
}

export default function ProductCard({ product, className }: Props) {
  const { dispatch } = useCart()
  const [added, setAdded] = useState(false)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch({
      type: 'ADD',
      payload: {
        product,
        size: product.sizes[0],
        color: product.colors[0],
      },
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link
      to={summitTrailPaths.product(product.id)}
      className={cn('group block cursor-pointer', className)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-muted mb-3.5" style={{ aspectRatio: '4/5' }}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={cn(
              'text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1',
              badgeStyles[product.badge]
            )}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 bg-foreground text-background">
              -{discount}%
            </span>
          )}
        </div>

      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-[14px] font-semibold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors duration-150">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[14px] font-bold text-foreground">${product.price}</span>
          {product.originalPrice && (
            <span className="text-[13px] text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        aria-label={`Add ${product.name} to cart`}
        className={cn(
          'cursor-pointer mt-3 w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold tracking-widest uppercase border transition-colors duration-150',
          added
            ? 'bg-green-800 border-green-800 text-white'
            : 'bg-background border-border text-foreground hover:bg-foreground hover:border-foreground hover:text-background'
        )}
      >
        {added ? (
          <>
            <Check size={13} aria-hidden="true" />
            Added
          </>
        ) : (
          <>
            <ShoppingCart size={13} aria-hidden="true" />
            Add to Cart
          </>
        )}
      </button>
    </Link>
  )
}
