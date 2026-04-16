import { type FormEvent, useState } from 'react'
import { ArrowRight, HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { careServices } from '@/data/clarityCareBooking'
import { buildClarityCareBookCallPath, clarityCarePaths } from '@/lib/routes'

const links = [
  {
    heading: 'Services',
    items: careServices.map((service) => ({
      label: service.name,
      to: buildClarityCareBookCallPath({ service: service.id }),
    })),
  },
  {
    heading: 'Company',
    items: [
      { label: 'About Us', to: `${clarityCarePaths.home}#about` },
      { label: 'Our Team', to: `${clarityCarePaths.home}#team` },
      { label: 'Client Reviews', to: `${clarityCarePaths.home}#reviews` },
      { label: 'Book a Call', to: clarityCarePaths.bookCall },
    ],
  },
  {
    heading: 'Support',
    items: [
      { label: 'Contact Us', to: `${clarityCarePaths.home}#contact` },
      { label: 'Call (800) 555-0199', to: 'tel:+18005550199', external: true },
      { label: 'hello@claritycare.com', to: 'mailto:hello@claritycare.com', external: true },
      { label: 'Virtual Sessions', to: buildClarityCareBookCallPath({ format: 'virtual' }) },
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/\S+@\S+\.\S+/.test(email)) {
      return
    }

    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <HeartPulse size={20} className="text-primary-foreground" />
              </div>
              <span
                className="text-xl font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Clarity Care
              </span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed mb-6 max-w-xs">
              Your path to wellness starts today. Compassionate, evidence-based
              therapy for individuals, couples, and families.
            </p>
            <Link
              to={clarityCarePaths.bookCall}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Book a Call
              <ArrowRight size={14} />
            </Link>

            <div className="mt-6">
              <p className="text-sm font-medium mb-3 opacity-80">Care notes by email</p>
              {!subscribed ? (
                <form className="flex gap-2" onSubmit={handleSubscribe}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-primary"
                  />
                  <Button size="sm" className="shrink-0" type="submit">
                    Subscribe
                  </Button>
                </form>
              ) : (
                <p className="text-sm leading-6 text-white/72">
                  You are in. We will send thoughtful updates and appointment availability.
                </p>
              )}
            </div>
          </div>

          {/* Link columns */}
          {links.map(({ heading, items }) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold mb-4 opacity-50 uppercase tracking-widest">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.to}
                        className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.to}
                        className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-40"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p>© {new Date().getFullYear()} Clarity Care. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to={clarityCarePaths.bookCall} className="hover:opacity-70 transition-opacity">Book a call</Link>
            <a href="tel:+18005550199" className="hover:opacity-70 transition-opacity">Call</a>
            <a href="mailto:hello@claritycare.com" className="hover:opacity-70 transition-opacity">Email</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
