import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, Mountain } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const navLinks = [
  { to: '/shop', label: 'Shop All' },
  { to: '/shop?category=footwear', label: 'Footwear' },
  { to: '/shop?category=backpacks', label: 'Backpacks' },
  { to: '/shop?category=clothing', label: 'Clothing' },
  { to: '/shop?category=accessories', label: 'Accessories' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 bg-background transition-shadow duration-300"
      style={{ boxShadow: scrolled ? '0 1px 0 var(--border), 0 4px 16px rgba(28,18,9,0.06)' : '0 1px 0 var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
            aria-label="Summit Trail home"
          >
            <Mountain
              size={20}
              className="text-primary transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
            <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-foreground select-none">
              Summit Trail
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-[12px] font-semibold tracking-widest uppercase transition-colors duration-150 cursor-pointer relative py-1
                  ${isActive
                    ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              className="cursor-pointer p-2.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
              aria-label="Search products"
            >
              <Search size={18} aria-hidden="true" />
            </button>
            <Link
              to="/cart"
              className="cursor-pointer relative p-2.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
              aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            >
              <ShoppingCart size={18} aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            <button
              className="cursor-pointer md:hidden p-2.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 ml-1"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span
                className="block transition-all duration-200"
                style={{ opacity: menuOpen ? 0 : 1, position: menuOpen ? 'absolute' : 'relative' }}
              >
                <Menu size={20} aria-hidden="true" />
              </span>
              {menuOpen && <X size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? '400px' : '0', opacity: menuOpen ? 1 : 0 }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col px-4 py-3 gap-0.5 border-t border-border" aria-label="Mobile navigation">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer text-[14px] font-medium py-3 text-foreground border-b border-border/50 last:border-0 hover:text-primary transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
