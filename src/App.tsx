import { useState } from 'react'

const examples = [
  { id: 'saas', label: 'SaaS / B2B', subtitle: 'Fix & Guide Me Instantly' },
  { id: 'ecommerce', label: 'E-commerce', subtitle: 'Help Me Decide & Finish' },
  { id: 'fintech', label: 'Fintech / KYC', subtitle: 'Help Me Complete This Safely' },
  { id: 'admin', label: 'Admin Panels', subtitle: 'Do This For Me' },
  { id: 'edtech', label: 'EdTech', subtitle: 'Explain What I\'m Looking At' },
]

export default function App() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-semibold text-sm text-foreground">AI Chatbot Use Cases</h1>
          <p className="text-xs text-muted-foreground mt-1">Industry demos</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setActive(ex.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                active === ex.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <div className="text-sm font-medium">{ex.label}</div>
              <div className={`text-xs mt-0.5 ${active === ex.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {ex.subtitle}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-8">
        {active ? (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Example: <span className="text-foreground font-medium">{examples.find(e => e.id === active)?.label}</span>
            </p>
            <p className="text-xs mt-1">Coming soon…</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Select a use case from the sidebar</p>
          </div>
        )}
      </main>
    </div>
  )
}
