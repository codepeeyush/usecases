import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  return (
    <section className="bg-foreground text-primary-foreground py-20 relative overflow-hidden">
      {/* Subtle texture pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
          backgroundSize: '12px 12px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase opacity-40 mb-4">
          Join the community
        </p>
        <h2
          className="text-[2rem] sm:text-[2.6rem] font-bold leading-[1.08] tracking-[-0.02em] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Get 10% off your first order
        </h2>
        <p className="text-[15px] opacity-55 leading-relaxed mb-10 max-w-sm mx-auto">
          Gear drops, trail stories, and exclusive offers — straight to your inbox.
        </p>

        <div
          className="transition-all duration-500"
          style={{ opacity: submitted ? 0 : 1, height: submitted ? 0 : 'auto', overflow: 'hidden' }}
          aria-hidden={submitted}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            noValidate
          >
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="your@email.com"
                aria-describedby={error ? 'newsletter-error' : undefined}
                className="w-full px-5 py-4 bg-white/8 border border-white/15 text-primary-foreground placeholder:text-primary-foreground/30 text-[14px] focus:outline-none focus:border-white/50 transition-colors duration-150"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer flex items-center justify-center gap-2 px-7 py-4 bg-primary text-primary-foreground text-[12px] font-bold tracking-[0.15em] uppercase hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 whitespace-nowrap"
            >
              Subscribe
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </form>
          {error && (
            <p id="newsletter-error" role="alert" className="mt-3 text-[13px] text-red-300">
              {error}
            </p>
          )}
          <p className="mt-4 text-[11px] opacity-30 tracking-wide">
            No spam, ever. Unsubscribe any time.
          </p>
        </div>

        {submitted && (
          <div
            className="flex flex-col items-center gap-3 py-4"
            role="status"
            aria-live="polite"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Check size={22} className="text-primary" aria-hidden="true" />
            </div>
            <p className="text-[17px] font-semibold">You're in!</p>
            <p className="text-[14px] opacity-50">Check your inbox for your 10% discount code.</p>
          </div>
        )}
      </div>
    </section>
  )
}
