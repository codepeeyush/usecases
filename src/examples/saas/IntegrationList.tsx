import { cn } from '@/lib/utils'
import { Integration, IntegrationStatus } from './data'

const statusDot: Record<IntegrationStatus, string> = {
  connected: 'bg-emerald-500',
  failed: 'bg-red-500',
  pending: 'bg-amber-400',
}

export const IntegrationIcon = ({ id, className }: { id: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    slack: (
      <svg viewBox="0 0 24 24" className={className ?? 'w-4 h-4'} fill="none">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
      </svg>
    ),
    stripe: (
      <svg viewBox="0 0 24 24" className={className ?? 'w-4 h-4'} fill="none">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" fill="#635BFF"/>
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" className={className ?? 'w-4 h-4'} fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    zapier: (
      <svg viewBox="0 0 24 24" className={className ?? 'w-4 h-4'} fill="none">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8l2.4 4.8H9.6L12 4.8zm-7.2 7.2h4.8l-2.4 4.8-2.4-4.8zm14.4 0h-4.8l2.4 4.8 2.4-4.8zm-7.2 0h4.8l-2.4 4.8-2.4-4.8z" fill="#FF4A00"/>
      </svg>
    ),
  }
  return icons[id] ?? <span className="text-[10px] font-bold text-slate-400">{id[0].toUpperCase()}</span>
}

interface IntegrationListProps {
  integrations: Integration[]
  selected: string
  onSelect: (id: string) => void
}

export default function IntegrationList({ integrations, selected, onSelect }: IntegrationListProps) {
  return (
    <div className="flex flex-col gap-0.5 p-2">
      {integrations.map((integration) => {
        const isSelected = selected === integration.id
        const isFailed = integration.status === 'failed'
        const isPending = integration.status === 'pending'
        const errorCount = integration.logs.filter(l => l.status >= 400).length

        return (
          <button
            key={integration.id}
            onClick={() => onSelect(integration.id)}
            className={cn(
              'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-3 cursor-pointer',
              isSelected
                ? 'bg-sky-50 border border-sky-200 shadow-sm'
                : isFailed
                ? 'border border-red-100 bg-red-50/40'
                : 'border border-transparent'
            )}
          >
            {/* Icon */}
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border',
              isSelected
                ? 'bg-sky-100 border-sky-200'
                : isFailed
                ? 'bg-red-50 border-red-100'
                : 'bg-slate-100 border-slate-200'
            )}>
              <IntegrationIcon id={integration.id} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={cn('text-xs font-bold truncate', isSelected ? 'text-sky-900' : 'text-slate-800')}>
                  {integration.name}
                </span>
                {/* Error count badge */}
                {isFailed && errorCount > 0 && (
                  <span className={cn(
                    'text-[9px] font-bold px-1.5 rounded-full shrink-0 leading-4',
                    'bg-red-100 text-red-600'
                  )}>
                    {errorCount} err
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full shrink-0',
                  isFailed && !isSelected ? 'animate-pulse' : '',
                  isSelected ? 'opacity-60 ' + statusDot[integration.status] : statusDot[integration.status]
                )} />
                <span className={cn('text-[11px] truncate', isSelected ? 'text-sky-700' : 'text-slate-400')}>
                  {integration.status === 'connected' && integration.lastEvent
                    ? `Last event ${integration.lastEvent}`
                    : integration.status === 'failed'
                    ? `Failing · ${integration.failingSince ?? '—'}`
                    : isPending
                    ? 'Not connected'
                    : integration.status}
                </span>
              </div>
            </div>

            {/* Right side: event count or chevron */}
            {integration.status === 'connected' && integration.eventCount && (
              <span className={cn(
                'text-[10px] font-bold shrink-0 tabular-nums',
                isSelected ? 'text-sky-400' : 'text-slate-300'
              )}>
                {integration.eventCount.toLocaleString()}
              </span>
            )}
            {isFailed && (
              <svg
                className="w-3.5 h-3.5 shrink-0 text-red-400"
                viewBox="0 0 20 20" fill="currentColor"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
