import { HeartPulse } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const links = [
  {
    heading: 'Services',
    items: ['Individual Therapy', 'Family Therapy', 'Couples Therapy', 'Physical Therapy'],
  },
  {
    heading: 'Company',
    items: ['About Us', 'Our Team', 'Careers', 'Press'],
  },
  {
    heading: 'Support',
    items: ['Contact Us', 'Privacy Policy', 'Terms of Service', 'Accessibility'],
  },
]

export default function Footer() {
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
            {/* Newsletter */}
            <p className="text-sm font-medium mb-3 opacity-80">Stay in the know</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-primary"
              />
              <Button size="sm" className="shrink-0">
                Subscribe
              </Button>
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
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {item}
                    </a>
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
            <a href="#" className="hover:opacity-70 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Terms</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
