import { useEffect, useState } from 'react'
import { HeartPulse, Menu, X, Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { clarityCarePaths } from '@/lib/routes'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', hash: '#hero' },
  { label: 'About', hash: '#about' },
  { label: 'Services', hash: '#services' },
  { label: 'Reviews', hash: '#reviews' },
  { label: 'Contact', hash: '#contact' },
]

export default function Header() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isBookingPage = location.pathname === clarityCarePaths.bookCall

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  const headerCta = isBookingPage
    ? { label: 'See Services', to: `${clarityCarePaths.home}#services` }
    : { label: 'Book a Call', to: clarityCarePaths.bookCall }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0D1F38]/95 backdrop-blur-md shadow-lg shadow-black/10'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to={`${clarityCarePaths.home}#hero`} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-150 group-hover:scale-105">
              <HeartPulse size={17} className="text-primary-foreground" />
            </div>
            <span
              className="text-lg font-semibold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Clarity Care
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={`${clarityCarePaths.home}${link.hash}`}
                className="text-sm font-medium text-white/65 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: phone + CTA */}
          <div className="flex items-center gap-3">
            {/* Phone — desktop only */}
            <a
              href="tel:+18005550199"
              className="hidden lg:flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <Phone size={14} />
              <span>(800) 555-0199</span>
            </a>

            <Link
              to={headerCta.to}
              className="hidden md:inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
            >
              {headerCta.label}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 border-t',
          scrolled ? 'bg-[#0D1F38]/98 border-white/10' : 'bg-[#0D1F38]/95 border-white/10',
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={`${clarityCarePaths.home}${link.hash}`}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={headerCta.to}
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-3 rounded-xl"
          >
            {headerCta.label}
          </Link>
        </nav>
      </div>
    </header>
  )
}
