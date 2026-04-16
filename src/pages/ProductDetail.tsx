import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { products } from '@/data/products'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductCard from '@/components/shop/ProductCard'
import { summitTrailPaths } from '@/lib/routes'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground mb-4 text-[15px]">Product not found.</p>
        <Link
          to={summitTrailPaths.shop}
          className="cursor-pointer text-primary underline underline-offset-2 hover:opacity-70 transition-opacity duration-150"
        >
          Back to shop
        </Link>
      </div>
    )
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
          aria-label="Go back"
        >
          <ChevronLeft size={14} aria-hidden="true" />
          Back
        </button>
        <span className="text-border">·</span>
        <nav aria-label="Breadcrumb">
          <p className="text-[12px] text-muted-foreground">
            <Link
              to={summitTrailPaths.home}
              className="cursor-pointer hover:text-foreground transition-colors duration-150"
            >
              Home
            </Link>
            <span className="mx-1.5 opacity-40">/</span>
            <Link
              to={summitTrailPaths.shop}
              className="cursor-pointer hover:text-foreground transition-colors duration-150"
            >
              Shop
            </Link>
            <span className="mx-1.5 opacity-40">/</span>
            <Link
              to={summitTrailPaths.category(product.category)}
              className="cursor-pointer hover:text-foreground transition-colors duration-150 capitalize"
            >
              {product.category}
            </Link>
            <span className="mx-1.5 opacity-40">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </p>
        </nav>
      </div>

      {/* Product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-28 items-start">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section aria-label="Related products">
          <div className="border-t border-border pt-16 mb-10 flex items-end justify-between">
            <h2
              className="text-[1.8rem] font-bold text-foreground tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              You May Also Like
            </h2>
            <Link
              to={summitTrailPaths.category(product.category)}
              className="cursor-pointer hidden sm:block text-[12px] font-semibold tracking-widest uppercase text-primary hover:opacity-70 transition-opacity duration-150"
            >
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
