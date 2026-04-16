import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { summitTrailPaths } from '@/lib/routes'

const SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 12.95

type FormData = {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zip: string
}

const emptyForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

export default function Checkout() {
  const { items, subtotal, dispatch } = useCart()
  const [form, setForm] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [placed, setPlaced] = useState(false)

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  const validate = (): boolean => {
    const errs: Partial<FormData> = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.lastName.trim()) errs.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.address.trim()) errs.address = 'Required'
    if (!form.city.trim()) errs.city = 'Required'
    if (!form.state.trim()) errs.state = 'Required'
    if (!form.zip.trim() || !/^\d{5}(-\d{4})?$/.test(form.zip)) errs.zip = 'Valid ZIP required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    dispatch({ type: 'CLEAR' })
    setPlaced(true)
  }

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  if (placed) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <CheckCircle2 size={56} className="mx-auto text-green-700 mb-6" />
        <h1
          className="text-3xl font-bold text-foreground mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Order Placed!
        </h1>
        <p className="text-muted-foreground mb-2">
          Thanks, {form.firstName}! Your order is confirmed.
        </p>
        <p className="text-[13px] text-muted-foreground mb-10">
          A confirmation will be sent to {form.email}.
        </p>
        <Link
          to={summitTrailPaths.shop}
          className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3 text-[13px] font-bold tracking-[0.12em] uppercase hover:bg-foreground/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <Link
          to={summitTrailPaths.shop}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground underline underline-offset-2"
        >
          <ArrowLeft size={14} /> Go to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to={summitTrailPaths.cart}
        className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={13} /> Back to Cart
      </Link>

      <h1
        className="text-3xl font-bold text-foreground mb-10"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Shipping Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First Name"
              value={form.firstName}
              onChange={handleChange('firstName')}
              error={errors.firstName}
            />
            <Field
              label="Last Name"
              value={form.lastName}
              onChange={handleChange('lastName')}
              error={errors.lastName}
            />
          </div>

          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
          />
          <Field
            label="Street Address"
            value={form.address}
            onChange={handleChange('address')}
            error={errors.address}
          />

          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
              <Field
                label="City"
                value={form.city}
                onChange={handleChange('city')}
                error={errors.city}
              />
            </div>
            <div className="col-span-1">
              <Field
                label="State"
                value={form.state}
                onChange={handleChange('state')}
                error={errors.state}
                maxLength={2}
                placeholder="CA"
              />
            </div>
            <div className="col-span-2">
              <Field
                label="ZIP Code"
                value={form.zip}
                onChange={handleChange('zip')}
                error={errors.zip}
                placeholder="12345"
              />
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer mt-4 w-full py-4 bg-foreground text-background text-[13px] font-bold tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors active:scale-[0.99]"
          >
            Place Order — ${total.toFixed(2)}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-5">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover bg-muted shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground truncate">{item.product.name}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {item.color} · {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-[14px] font-semibold shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-5 space-y-3 text-[14px]">
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
            <div className="flex justify-between text-[15px] pt-3 border-t border-border">
              <span className="font-bold">Total</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  maxLength?: number
  placeholder?: string
}

function Field({ label, value, onChange, error, type = 'text', maxLength, placeholder }: FieldProps) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full border px-3 py-2.5 text-[14px] bg-background text-foreground outline-none transition-colors ${
          error ? 'border-red-500' : 'border-border focus:border-foreground'
        }`}
      />
      {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
    </div>
  )
}
