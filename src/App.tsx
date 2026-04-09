import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Bot, Zap, ShoppingBag, Shield, LayoutDashboard, BookOpen } from 'lucide-react'
import SaasExample from '@/examples/saas'
import EcommerceExample from '@/examples/ecommerce'
import FintechExample from '@/examples/fintech'
import AdminExample from '@/examples/admin'
import EdtechExample from '@/examples/edtech'

const examples = [
  { id: 'saas', path: '/saas', label: 'SaaS / B2B', subtitle: 'Fix & Guide Me Instantly', icon: Zap, component: SaasExample },
  { id: 'ecommerce', path: '/ecommerce', label: 'E-commerce', subtitle: 'Help Me Decide & Finish', icon: ShoppingBag, component: EcommerceExample },
  { id: 'fintech', path: '/fintech', label: 'Fintech / KYC', subtitle: 'Help Me Complete This Safely', icon: Shield, component: FintechExample },
  { id: 'admin', path: '/admin', label: 'Admin Panels', subtitle: 'Do This For Me', icon: LayoutDashboard, component: AdminExample },
  { id: 'edtech', path: '/edtech', label: 'EdTech', subtitle: "Explain What I'm Looking At", icon: BookOpen, component: EdtechExample },
]

export default function App() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const location = useLocation()
  if (location.pathname === '/') {
    navigate('/saas', { replace: true })
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <main className="flex-1 h-full overflow-auto">
        <Routes>
          {examples.map((ex) => (
            <Route key={ex.id} path={ex.path} element={<ex.component />} />
          ))}
        </Routes>
      </main>

      {open && (
        <div className="absolute inset-0 z-10" onClick={() => setOpen(false)} />
      )}

      {/* Edge trigger zone */}
      <div
        className="absolute top-0 right-0 h-full w-4 z-30"
        onMouseEnter={() => setOpen(true)}
      />

      {/* Sidebar */}
      <aside
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1)',
          background: '#ffffff',
          boxShadow: '-24px 0 64px rgba(0,0,0,0.10), -1px 0 0 rgba(0,0,0,0.06)',
        }}
        className="absolute top-0 right-0 h-full z-20 w-72 flex flex-col rounded-l-2xl overflow-hidden"
        onMouseLeave={() => setOpen(false)}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(0,0,0,0.06)' }}
              >
                <Bot size={14} style={{ color: '#0f0f0f' }} />
              </div>
              <div>
                <h1 className="text-[13px] font-semibold leading-tight tracking-[-0.01em]" style={{ color: '#0f0f0f' }}>
                  AI Chatbot Use Cases
                </h1>
                <p className="text-[11px] mt-0.5 tracking-[0.01em]" style={{ color: 'rgba(0,0,0,0.38)' }}>
                  Industry demos
                </p>
              </div>
            </div>
            <kbd
              className="text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 mt-0.5 tracking-wide"
              style={{
                background: 'rgba(0,0,0,0.05)',
                color: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {examples.map((ex) => {
            const Icon = ex.icon
            return (
              <NavLink
                key={ex.id}
                to={ex.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors duration-100 ${
                    isActive ? 'bg-black/6' : 'hover:bg-black/4'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: isActive ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)',
                        transition: 'background 120ms ease',
                      }}
                    >
                      <Icon
                        size={13}
                        style={{
                          color: isActive ? '#0f0f0f' : 'rgba(0,0,0,0.4)',
                          transition: 'color 120ms ease',
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[13px] font-medium leading-tight tracking-[-0.005em] truncate"
                        style={{ color: isActive ? '#0f0f0f' : 'rgba(0,0,0,0.55)' }}
                      >
                        {ex.label}
                      </div>
                      <div
                        className="text-[11px] mt-0.5 leading-tight tracking-[0.01em] truncate"
                        style={{ color: isActive ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.28)' }}
                      >
                        {ex.subtitle}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: 'rgba(0,0,0,0.35)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <p className="text-[11px] tracking-[0.01em]" style={{ color: 'rgba(0,0,0,0.22)' }}>
            Hover right edge or press ⌘K
          </p>
        </div>
      </aside>
    </div>
  )
}
