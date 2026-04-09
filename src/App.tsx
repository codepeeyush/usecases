import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import SaasExample from '@/examples/saas'
import EcommerceExample from '@/examples/ecommerce'
import FintechExample from '@/examples/fintech'
import AdminExample from '@/examples/admin'
import EdtechExample from '@/examples/edtech'

const examples = [
  { id: 'saas', path: '/saas', label: 'SaaS / B2B', subtitle: 'Fix & Guide Me Instantly', component: SaasExample },
  { id: 'ecommerce', path: '/ecommerce', label: 'E-commerce', subtitle: 'Help Me Decide & Finish', component: EcommerceExample },
  { id: 'fintech', path: '/fintech', label: 'Fintech / KYC', subtitle: 'Help Me Complete This Safely', component: FintechExample },
  { id: 'admin', path: '/admin', label: 'Admin Panels', subtitle: 'Do This For Me', component: AdminExample },
  { id: 'edtech', path: '/edtech', label: 'EdTech', subtitle: "Explain What I'm Looking At", component: EdtechExample },
]

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        setSidebarVisible(v => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  const location = useLocation()

  // Redirect root to first example
  if (location.pathname === '/') {
    navigate('/saas', { replace: true })
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Left hover trigger zone */}
      <div
        className="absolute top-0 left-0 h-full w-2 z-20"
        onMouseEnter={() => setSidebarVisible(true)}
      />

      {/* Sidebar - revealed on left hover */}
      <aside
        className={`absolute top-0 left-0 h-full z-10 flex flex-col shrink-0 overflow-hidden border-r border-border bg-background transition-all duration-200 ${
          sidebarVisible ? 'w-64' : 'w-0'
        }`}
        onMouseLeave={() => setSidebarVisible(false)}
      >
        <div className="w-64 flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h1 className="font-semibold text-sm text-foreground">AI Chatbot Use Cases</h1>
            <p className="text-xs text-muted-foreground mt-1">Industry demos</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {examples.map((ex) => (
              <NavLink
                key={ex.id}
                to={ex.path}
                onClick={() => setSidebarVisible(false)}
                className={({ isActive }) =>
                  `flex flex-col w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="text-sm font-medium">{ex.label}</span>
                    <span className={`text-xs mt-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {ex.subtitle}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main - full screen */}
      <main className="flex-1 h-full overflow-auto">
        <Routes>
          {examples.map((ex) => (
            <Route key={ex.id} path={ex.path} element={<ex.component />} />
          ))}
        </Routes>
      </main>
    </div>
  )
}
