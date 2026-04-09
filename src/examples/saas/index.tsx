import { useState } from 'react'
import { integrations as baseIntegrations, Integration } from './data'
import IntegrationList from './IntegrationList'
import IntegrationDetail from './IntegrationDetail'
import DebugPanel from './DebugPanel'

const settingsNav = [
  { id: 'general', label: 'General', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' },
  { id: 'team', label: 'Team', icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' },
  { id: 'security', label: 'Security', icon: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z' },
  { id: 'integrations', label: 'Integrations', icon: 'M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z' },
  { id: 'billing', label: 'Billing', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z' },
  { id: 'developer', label: 'Developer', icon: 'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5' },
]

export default function SaasExample() {
  const [selectedId, setSelectedId] = useState('stripe')
  const [activeNav, setActiveNav] = useState('integrations')
  const [overrides, setOverrides] = useState<Record<string, Partial<Integration>>>({})

  const integrations = baseIntegrations.map((i) => ({ ...i, ...overrides[i.id] }))
  const selected = integrations.find((i) => i.id === selectedId) ?? integrations[0]

  const failedCount = integrations.filter((i) => i.status === 'failed').length
  const connectedCount = integrations.filter((i) => i.status === 'connected').length

  const handleFix = (id: string, newToken: string) => {
    setOverrides((prev) => ({
      ...prev,
      [id]: {
        status: 'connected',
        botToken: newToken,
        errorMessage: undefined,
        errorCode: undefined,
        failingSince: undefined,
        blockedCount: undefined,
        lastSynced: 'just now',
        lastEvent: 'just now',
        eventCount: (prev[id]?.eventCount ?? 0) + 1,
        logs: [
          {
            id: `fix-${Date.now()}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
            method: 'POST' as const,
            endpoint: '/auth/token/verify',
            status: 200,
            duration: 142,
            requestBody: JSON.stringify({ token: newToken.slice(0, 20) + '…' }, null, 2),
            responseBody: JSON.stringify({ ok: true, scope: 'chat:write,channels:read', team: 'Nexus HQ' }, null, 2),
          },
        ],
      },
    }))
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]" style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>

      {/* Top CRM navbar */}
      <header className="h-12 bg-[#0F172A] flex items-center px-4 gap-3 shrink-0 border-b border-slate-700/60">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0369A1] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">Nexus</span>
        </div>

        <div className="w-px h-4 bg-slate-600 mx-1" />

        {/* Nav links */}
        {['Dashboard', 'Contacts', 'Deals', 'Reports'].map((item) => (
          <button key={item} className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer px-1 font-medium">
            {item}
          </button>
        ))}

        <div className="flex-1" />

        {/* Right side */}
        {failedCount > 0 && (
          <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            {failedCount} integration{failedCount > 1 ? 's' : ''} failing
          </div>
        )}

        {/* Notification bell */}
        <button className="relative w-7 h-7 rounded-md hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          {failedCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer">
          JD
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">

        {/* Settings sidebar */}
        <aside className="w-44 shrink-0 bg-white border-r border-slate-200 flex flex-col py-4">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Settings</p>
          </div>
          <nav className="flex-1 px-2 space-y-0.5">
            {settingsNav.map((item) => {
              const isActive = item.id === activeNav
              const isBadged = (item.id === 'integrations' || item.id === 'developer') && failedCount > 0
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isBadged && (
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
                  )}
                </button>
              )
            })}
          </nav>
          <div className="px-4 pt-4 border-t border-slate-100 mt-4">
            <p className="text-[10px] text-slate-400 font-medium">v3.12.0</p>
          </div>
        </aside>

        {/* Main content area */}
        {activeNav === 'developer' ? (
          <DebugPanel integrations={integrations} onFix={handleFix} />
        ) : (
          <div className="flex flex-1 min-w-0 min-h-0">

            {/* Integration list panel */}
            <div className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col">
              {/* Panel header */}
              <div className="px-4 py-3.5 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Integrations</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {connectedCount} active · {failedCount > 0 ? `${failedCount} failing` : 'all healthy'}
                </p>
              </div>

              {/* Status health bar */}
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-1">System Health</p>
                  <span className={`text-[10px] font-bold ${failedCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {failedCount > 0 ? 'DEGRADED' : 'HEALTHY'}
                  </span>
                </div>
                <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden">
                  {integrations.map((i) => (
                    <div
                      key={i.id}
                      className={`flex-1 rounded-full ${
                        i.status === 'connected' ? 'bg-emerald-400' :
                        i.status === 'failed' ? 'bg-red-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <IntegrationList
                  integrations={integrations}
                  selected={selectedId}
                  onSelect={setSelectedId}
                />
              </div>

              {/* Browse more */}
              <div className="p-3 border-t border-slate-100">
                <button className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#0369A1] hover:bg-sky-50 py-2 rounded-lg transition-colors cursor-pointer">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                  Browse integrations
                </button>
              </div>
            </div>

            {/* Detail panel */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <IntegrationDetail integration={selected} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
