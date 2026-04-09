import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Integration } from './data'
import { IntegrationIcon } from './IntegrationList'
import TokenModal from './TokenModal'

const statusConfig = {
  connected: { label: 'Connected', dot: 'bg-emerald-500', row: 'border-slate-100', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  failed: { label: 'Auth Failed', dot: 'bg-red-500', row: 'border-red-100 bg-red-50/40', pill: 'bg-red-50 text-red-700 border-red-200' },
  pending: { label: 'Not Connected', dot: 'bg-amber-400', row: 'border-slate-100', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
}

interface DebugPanelProps {
  integrations: Integration[]
  onFix: (id: string, newToken: string) => void
}

export default function DebugPanel({ integrations, onFix }: DebugPanelProps) {
  const [modalIntegration, setModalIntegration] = useState<Integration | null>(null)

  const failedIntegrations = integrations.filter(i => i.status === 'failed')

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-base font-bold text-slate-900">Developer Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Debug integration connections, manage tokens, and inspect API credentials.</p>
        </div>

        {/* Active issues */}
        {failedIntegrations.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Issues</h3>
              <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 rounded-full leading-4">
                {failedIntegrations.length}
              </span>
            </div>
            <div className="rounded-xl border border-red-200 overflow-hidden bg-white divide-y divide-red-100">
              {failedIntegrations.map(integration => (
                <IssueRow
                  key={integration.id}
                  integration={integration}
                  onFix={() => setModalIntegration(integration)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All integrations table */}
        <section className="space-y-2">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">All Integrations</h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white divide-y divide-slate-100">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-2 bg-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Integration</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Error</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</p>
            </div>
            {integrations.map(integration => {
              const { label, dot, row, pill } = statusConfig[integration.status]
              const isFailed = integration.status === 'failed'
              return (
                <div key={integration.id} className={cn('grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3 border-l-2', isFailed ? 'border-l-red-400' : 'border-l-transparent', row)}>
                  {/* Name */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center shrink-0', isFailed ? 'bg-red-50 border-red-100' : 'bg-slate-100 border-slate-200')}>
                      <IntegrationIcon id={integration.id} className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{integration.name}</p>
                      {integration.botToken && (
                        <p className="text-[10px] font-mono text-slate-400 truncate">{integration.botToken.slice(0, 20)}…</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0', pill)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', dot, isFailed ? 'animate-pulse' : '')} />
                    {label}
                  </span>

                  {/* Last error */}
                  <div className="w-36 shrink-0">
                    {isFailed ? (
                      <code className="text-[10px] font-mono text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded truncate block">
                        {integration.errorCode}
                      </code>
                    ) : (
                      <span className="text-[10px] text-slate-400">—</span>
                    )}
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {isFailed ? (
                      <button
                        onClick={() => setModalIntegration(integration)}
                        className="px-3 py-1.5 rounded-lg bg-[#0F172A] text-white text-[10px] font-bold hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Fix →
                      </button>
                    ) : integration.status === 'pending' ? (
                      <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                        Connect
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">✓ Healthy</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Environment info */}
        <section className="space-y-2">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Environment</h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white divide-y divide-slate-100">
            {[
              { label: 'API Base URL', value: 'https://api.nexus.app/v2' },
              { label: 'Webhook endpoint', value: 'https://nexus.app/webhooks/inbound' },
              { label: 'OAuth redirect URI', value: 'https://nexus.app/oauth/callback' },
              { label: 'SDK Version', value: 'nexus-js@3.12.0' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <p className="text-xs font-semibold text-slate-500 shrink-0">{label}</p>
                <code className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">{value}</code>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Token Modal */}
      {modalIntegration && (
        <TokenModal
          integration={modalIntegration}
          open={!!modalIntegration}
          onClose={() => setModalIntegration(null)}
          onSuccess={(token) => {
            onFix(modalIntegration.id, token)
            setModalIntegration(null)
          }}
        />
      )}
    </div>
  )
}

function IssueRow({ integration, onFix }: { integration: Integration; onFix: () => void }) {
  return (
    <div className="px-4 py-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
        <IntegrationIcon id={integration.id} className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-800">{integration.name} is not connected</p>
            <p className="text-xs text-red-600 mt-0.5">{integration.errorMessage}</p>
            <div className="flex items-center gap-2 mt-2">
              <code className="text-[10px] font-mono text-red-700 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded">
                {integration.errorCode}
              </code>
              {integration.failingSince && (
                <span className="text-[10px] text-slate-400 font-medium">· Failing for {integration.failingSince}</span>
              )}
              {integration.blockedCount != null && (
                <span className="text-[10px] text-red-500 font-bold">· {integration.blockedCount} notifications blocked</span>
              )}
            </div>
          </div>
          <button
            onClick={onFix}
            className="shrink-0 px-3 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.5 10a4.5 4.5 0 0 0 4.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 0 1-.493.11 3.01 3.01 0 0 1-1.618-1.616.455.455 0 0 1 .11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 0 0-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 1 0 3.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.29.01ZM5 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clipRule="evenodd"/>
            </svg>
            Fix Issue
          </button>
        </div>
      </div>
    </div>
  )
}
