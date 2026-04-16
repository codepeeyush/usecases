import { Link } from 'react-router-dom'
import { Mountain, ArrowRight } from 'lucide-react'
import { summitTrailPaths } from '@/lib/routes'

const shopLinks = [
  { label: 'Shop All', to: summitTrailPaths.shop },
  { label: 'Footwear', to: summitTrailPaths.category('footwear') },
  { label: 'Backpacks', to: summitTrailPaths.category('backpacks') },
  { label: 'Clothing', to: summitTrailPaths.category('clothing') },
  { label: 'Accessories', to: summitTrailPaths.category('accessories') },
  { label: 'Sale', to: summitTrailPaths.shop },
]
const companyLinks = ['About Us', 'Our Story', 'Sustainability', 'Careers', 'Press']
const supportLinks = ['Shipping & Returns', 'Size Guide', 'FAQ', 'Warranty', 'Contact Us']

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        {/* Top strip */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-14 border-b border-white/10">

          {/* Brand col */}
          <div className="md:col-span-2">
            <Link
              to={summitTrailPaths.home}
              className="cursor-pointer inline-flex items-center gap-2.5 mb-5 group"
              aria-label="Summit Trail home"
            >
              <Mountain size={18} className="opacity-70 group-hover:opacity-100 transition-opacity duration-150" aria-hidden="true" />
              <span className="text-[12px] font-bold tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity duration-150 select-none">
                Summit Trail
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed opacity-45 max-w-xs mb-8">
              Gear built for the mountains. Field-tested at altitude. Designed by trekkers, for trekkers.
            </p>

            {/* Newsletter micro-form */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-40 mb-3">Stay in the loop</p>
              <form
                onSubmit={e => e.preventDefault()}
                className="flex gap-2"
                aria-label="Footer newsletter signup"
              >
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-3 py-2.5 bg-white/8 border border-white/12 text-primary-foreground placeholder:text-primary-foreground/25 text-[12px] focus:outline-none focus:border-white/35 transition-colors duration-150"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="cursor-pointer px-3 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
                >
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-35 mb-5">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="cursor-pointer text-[13px] opacity-50 hover:opacity-90 transition-opacity duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-35 mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(item => (
                <li key={item}>
                  <a href="#" className="cursor-pointer text-[13px] opacity-50 hover:opacity-90 transition-opacity duration-150">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-35 mb-5">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map(item => (
                <li key={item}>
                  <a href="#" className="cursor-pointer text-[13px] opacity-50 hover:opacity-90 transition-opacity duration-150">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-[11px] opacity-25">© 2025 Summit Trail Co. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Preferences'].map(item => (
              <a
                key={item}
                href="#"
                className="cursor-pointer text-[11px] opacity-25 hover:opacity-60 transition-opacity duration-150"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
