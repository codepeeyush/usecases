import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { summitTrailPaths } from '@/lib/routes'

const SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 12.95

export default function Cart() {
  const { items, subtotal, dispatch } = useCart()
  const navigate = useNavigate()

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-6" />
        <h1
          className="text-3xl font-bold text-foreground mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-8">Add some gear to get started.</p>
        <Link
          to={summitTrailPaths.shop}
          className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3 text-[13px] font-bold tracking-[0.12em] uppercase hover:bg-foreground/90 transition-colors"
        >
          Continue Shopping
          <ArrowRight size={15} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1
        className="text-3xl font-bold text-foreground mb-10"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0 divide-y divide-border border-t border-border">
          {items.map(item => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-5 py-6"
            >
              {/* Image */}
              <Link to={summitTrailPaths.product(item.product.id)} className="shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover bg-muted"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      to={summitTrailPaths.product(item.product.id)}
                      className="text-[15px] font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {item.color} · {item.size}
                    </p>
                  </div>
                  <span className="text-[15px] font-bold text-foreground shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QTY',
                          payload: {
                            id: item.product.id,
                            size: item.size,
                            color: item.color,
                            quantity: item.quantity - 1,
                          },
                        })
                      }
                      className="cursor-pointer p-2 hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-4 text-[13px] font-semibold min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_QTY',
                          payload: {
                            id: item.product.id,
                            size: item.size,
                            color: item.color,
                            quantity: item.quantity + 1,
                          },
                        })
                      }
                      className="cursor-pointer p-2 hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'REMOVE',
                        payload: { id: item.product.id, size: item.size, color: item.color },
                      })
                    }
                    className="cursor-pointer p-2 text-muted-foreground hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border p-6 sticky top-24">
            <h2 className="text-[13px] font-bold tracking-[0.18em] uppercase text-foreground mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-700">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-border mt-5 pt-5 flex justify-between text-[15px]">
              <span className="font-bold">Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate(summitTrailPaths.checkout)}
              className="cursor-pointer mt-6 w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 text-[13px] font-bold tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors active:scale-[0.99]"
            >
              Proceed to Checkout
              <ArrowRight size={15} />
            </button>

            <Link
              to={summitTrailPaths.shop}
              className="block mt-4 text-center text-[12px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
