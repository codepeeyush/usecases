import { useState } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect root to first example
  if (location.pathname === '/') {
    navigate('/saas', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 border-r border-border flex flex-col shrink-0 overflow-hidden`}
      >
        <div className="w-64 flex flex-col h-full">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-sm text-foreground">AI Chatbot Use Cases</h1>
              <p className="text-xs text-muted-foreground mt-1">Industry demos</p>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {examples.map((ex) => (
              <NavLink
                key={ex.id}
                to={ex.path}
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

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Toggle button */}
        <div className="h-10 flex items-center px-3 border-b border-border shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {sidebarOpen ? (
                <>
                  <rect x="1" y="2" width="14" height="1.5" rx="0.75" fill="currentColor" />
                  <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
                  <rect x="1" y="12.5" width="14" height="1.5" rx="0.75" fill="currentColor" />
                  <path d="M5 5L2.5 8L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </>
              ) : (
                <>
                  <rect x="1" y="2" width="14" height="1.5" rx="0.75" fill="currentColor" />
                  <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
                  <rect x="1" y="12.5" width="14" height="1.5" rx="0.75" fill="currentColor" />
                  <path d="M3 5L5.5 8L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="flex-1">
          <Routes>
            {examples.map((ex) => (
              <Route key={ex.id} path={ex.path} element={<ex.component />} />
            ))}
          </Routes>
        </div>
      </main>
    </div>
  )
}
