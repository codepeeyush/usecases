import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Integration, LogEntry, liveLogTemplates } from './data'
import { IntegrationIcon } from './IntegrationList'

const statusConfig = {
  connected: { label: 'Connected', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  failed: { label: 'Connection Failed', dot: 'bg-red-500', pill: 'bg-red-50 text-red-700 border border-red-200' },
  pending: { label: 'Pending Setup', dot: 'bg-amber-400', pill: 'bg-amber-50 text-amber-700 border border-amber-200' },
}

const methodColor: Record<string, string> = {
  GET: 'text-sky-600 bg-sky-50',
  POST: 'text-violet-600 bg-violet-50',
  PUT: 'text-amber-600 bg-amber-50',
  DELETE: 'text-red-600 bg-red-50',
}

const httpStatusColor = (code: number) => {
  if (code < 300) return 'text-emerald-700 bg-emerald-50 border-emerald-200'
  if (code < 400) return 'text-amber-700 bg-amber-50 border-amber-200'
  return 'text-red-700 bg-red-50 border-red-200'
}

function fireConsoleErrors(integration: Integration) {
  const ts = new Date().toISOString()
  console.groupCollapsed(
    `%c✕ [Nexus] Integration failure — ${integration.name} (${integration.errorCode})`,
    'color:#dc2626;font-weight:700;font-size:12px'
  )
  console.error(`%cEndpoint:%c POST /api/${integration.id}/test-connection`, 'color:#6b7280;font-weight:600', 'color:#dc2626')
  console.error('%cResponse body:', 'color:#6b7280;font-weight:600',
    JSON.parse('{"ok":false,"error":"invalid_auth","needed":"chat:write","provided":"none"}'))
  console.error('%cFull context:', 'color:#6b7280;font-weight:600', {
    timestamp: ts,
    service: integration.id,
    error_code: integration.errorCode,
    message: integration.errorMessage,
    token_preview: (integration.botToken ?? '').slice(0, 14) + '••••',
    hint: 'Regenerate at api.slack.com → Your Apps → OAuth & Permissions',
  })
  console.warn('%c⚠ Expected format: xoxb-{team_id}-{token_id}-{token_secret}', 'color:#d97706')
  console.groupEnd()
}

function LogRow({ entry, isNew, onToggle, expanded }: {
  entry: LogEntry
  isNew?: boolean
  expanded: boolean
  onToggle: () => void
}) {
  const isError = entry.status >= 400
  return (
    <div className={cn('border-b border-slate-100 transition-colors duration-500', isNew ? 'bg-red-50' : '')}>
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-2.5 text-xs font-mono text-left cursor-pointer transition-colors',
          expanded ? 'bg-slate-50' : 'hover:bg-slate-50/60'
        )}
      >
        <span className="text-slate-400 tabular-nums shrink-0 w-14">{entry.time}</span>
        <span className={cn('font-bold text-[10px] px-1.5 py-0.5 rounded shrink-0 w-12 text-center', methodColor[entry.method])}>
          {entry.method}
        </span>
        <span className="flex-1 text-slate-600 truncate">{entry.endpoint}</span>
        <span className={cn('shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border tabular-nums', httpStatusColor(entry.status))}>
          {entry.status}
        </span>
        <span className={cn('shrink-0 tabular-nums text-right w-14', isError ? 'text-red-400' : 'text-slate-400')}>
          {entry.duration}ms
        </span>
        <svg
          className={cn('w-3 h-3 shrink-0 text-slate-400 transition-transform', expanded ? 'rotate-180' : '')}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {expanded && (entry.requestBody || entry.responseBody) && (
        <div className="px-4 pb-3 grid grid-cols-2 gap-3">
          {entry.requestBody && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Request</p>
              <pre className="text-[10px] font-mono bg-slate-900 text-slate-300 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {entry.requestBody}
              </pre>
            </div>
          )}
          {entry.responseBody && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Response</p>
              <pre className={cn(
                'text-[10px] font-mono rounded-lg p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed',
                entry.status >= 400 ? 'bg-red-950 text-red-300' : 'bg-slate-900 text-emerald-300'
              )}>
                {entry.responseBody}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type Tab = 'overview' | 'logs'

interface IntegrationDetailProps {
  integration: Integration
}

export default function IntegrationDetail({ integration }: IntegrationDetailProps) {
  const [tab, setTab] = useState<Tab>('overview')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'error' | 'success' | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>(integration.logs)
  const [newLogId, setNewLogId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showToken, setShowToken] = useState(false)
  const prevIdRef = useRef(integration.id)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset when integration changes
  useEffect(() => {
    if (prevIdRef.current !== integration.id) {
      prevIdRef.current = integration.id
      setTab('overview')
      setTestResult(null)
      setLogs(integration.logs)
      setNewLogId(null)
      setExpandedId(null)
      setShowToken(false)
    }
  }, [integration])

  // Live simulation for connected integrations
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (integration.status !== 'connected') return
    const templates = liveLogTemplates[integration.id]
    if (!templates || templates.length === 0) return

    intervalRef.current = setInterval(() => {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
      const template = templates[Math.floor(Math.random() * templates.length)]
      const newEntry: LogEntry = {
        ...template,
        id: `live-${Date.now()}`,
        time,
        duration: Math.floor(Math.random() * 180 + 80),
      }
      setLogs(prev => [newEntry, ...prev.slice(0, 49)])
      setNewLogId(newEntry.id)
      setTimeout(() => setNewLogId(null), 2000)
    }, 7000)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [integration.id, integration.status])

  const handleTest = () => {
    setTesting(true)
    setTestResult(null)
    setTimeout(() => {
      const isSuccess = integration.status === 'connected'
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
      const newEntry: LogEntry = {
        id: `test-${Date.now()}`,
        time,
        method: 'POST',
        endpoint: `/api/${integration.id}/test-connection`,
        status: isSuccess ? 200 : 401,
        duration: Math.floor(Math.random() * 200 + 100),
        requestBody: isSuccess
          ? `POST /api/${integration.id}/test-connection\nAuthorization: Bearer ••••••••••••`
          : `POST /api/${integration.id}/test-connection\nAuthorization: Bearer ${integration.botToken}\nContent-Type: application/json`,
        responseBody: isSuccess
          ? '{\n  "ok": true,\n  "bot_id": "B0123456"\n}'
          : '{\n  "ok": false,\n  "error": "invalid_auth",\n  "needed": "chat:write",\n  "provided": "none"\n}',
      }
      setLogs(prev => [newEntry, ...prev])
      setNewLogId(newEntry.id)
      setTesting(false)
      setTestResult(isSuccess ? 'success' : 'error')
      if (!isSuccess) {
        fireConsoleErrors(integration)
        setTimeout(() => setNewLogId(null), 4000)
      }
    }, 1800)
  }

  const { label, dot, pill } = statusConfig[integration.status]
  const errorCount = logs.filter(l => l.status >= 400).length
  const totalEvents = logs.length

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Header */}
      <div className="px-5 pt-4 pb-0 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <IntegrationIcon id={integration.id} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-slate-900">{integration.name}</h2>
                <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold', pill)}>
                  <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot, integration.status === 'failed' ? 'animate-pulse' : '')} />
                  {label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{integration.description}</p>
            </div>
          </div>

          {/* Stats */}
          {integration.status !== 'pending' && (
            <div className="flex items-center gap-3 shrink-0">
              {integration.status === 'failed' && (
                <>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Failing for</p>
                    <p className="text-sm font-bold text-red-600 tabular-nums">{integration.failingSince}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Blocked</p>
                    <p className="text-sm font-bold text-red-600 tabular-nums">{integration.blockedCount} notifs</p>
                  </div>
                </>
              )}
              {integration.status === 'connected' && (
                <>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Total Events</p>
                    <p className="text-sm font-bold text-slate-800 tabular-nums">{(integration.eventCount ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Event</p>
                    <p className="text-sm font-bold text-emerald-600">{integration.lastEvent}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex">
          {(['overview', 'logs'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 -mb-px capitalize flex items-center gap-1.5',
                tab === t
                  ? 'border-[#0F172A] text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              )}
            >
              {t === 'logs' ? `Request Logs` : 'Overview'}
              {t === 'logs' && (
                <span className={cn(
                  'text-[9px] font-bold px-1.5 rounded-full leading-4',
                  errorCount > 0 ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'
                )}>
                  {totalEvents}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'overview' ? (
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">

            {/* Incident banner — failed */}
            {integration.status === 'failed' && (
              <div className="rounded-xl border border-red-200 overflow-hidden">
                <div className="bg-red-600 px-4 py-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-red-100 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-xs font-bold text-white">Active Incident · Failing for {integration.failingSince}</p>
                  <div className="flex-1" />
                  <span className="text-[10px] font-bold text-red-200">{integration.blockedCount} notifications blocked</span>
                </div>
                <div className="bg-red-50 px-4 py-3 flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800">{integration.errorMessage}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <code className="text-[10px] font-mono bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">
                        {integration.errorCode}
                      </code>
                      <button
                        onClick={() => setTab('logs')}
                        className="text-[11px] font-semibold text-red-600 hover:text-red-800 underline underline-offset-2 cursor-pointer transition-colors"
                      >
                        View request logs →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pending banner */}
            {integration.status === 'pending' && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">Setup incomplete</p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">Connect your Zapier account to start automating workflows across 5,000+ apps.</p>
                </div>
              </div>
            )}

            {/* Credentials */}
            {(integration.botToken || integration.webhookUrl) && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credentials</h3>

                {integration.botToken && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-600">Bot Token</label>
                      <button
                        onClick={() => setShowToken(v => !v)}
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showToken ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type={showToken ? 'text' : 'password'}
                        defaultValue={integration.botToken}
                        className={cn(
                          'font-mono text-xs h-9',
                          integration.status === 'failed'
                            ? 'border-red-300 bg-red-50/50 text-red-700 focus-visible:ring-red-200'
                            : 'border-slate-200'
                        )}
                      />
                      <button className="px-3 h-9 rounded-md border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer shrink-0">
                        Copy
                      </button>
                    </div>
                    {integration.status === 'failed' && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1.5">
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="currentColor">
                          <path fillRule="evenodd" d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V6A.75.75 0 016 5.25zm0 4.5a.625.625 0 100-1.25.625.625 0 000 1.25z" clipRule="evenodd"/>
                        </svg>
                        Invalid format — expected <code className="bg-red-100 px-1 py-0.5 rounded text-[10px] mx-0.5">xoxb-&#123;team&#125;-&#123;token&#125;</code>
                      </p>
                    )}
                  </div>
                )}

                {integration.webhookUrl && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Webhook URL</label>
                    <div className="flex gap-2">
                      <Input
                        defaultValue={integration.webhookUrl}
                        readOnly
                        className="font-mono text-xs h-9 bg-slate-50 text-slate-400 border-slate-200"
                      />
                      <button className="px-3 h-9 rounded-md border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer shrink-0">
                        Copy
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">Paste into Slack app → Event Subscriptions → Request URL</p>
                  </div>
                )}
              </div>
            )}

            <Separator className="bg-slate-100" />

            {/* Connection details grid */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connection Details</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</p>
                  <p className="text-sm font-bold text-slate-800 mt-1 capitalize">{integration.status}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Last Sync</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">{integration.lastSynced ?? '—'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Errors (24h)</p>
                  <p className={cn('text-sm font-bold mt-1', errorCount > 0 ? 'text-red-600' : 'text-slate-800')}>
                    {errorCount}
                  </p>
                </div>
              </div>

              {integration.scopes && integration.scopes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Required OAuth Scopes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {integration.scopes.map((scope) => (
                      <span key={scope} className="inline-flex items-center gap-1 text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                        <svg className="w-2.5 h-2.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Test result */}
            {testResult === 'error' && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-sm font-bold text-red-700">Test failed — {integration.errorCode}</p>
                  <p className="text-[11px] text-red-500 mt-0.5">Full error logged to browser console. Check DevTools → Console.</p>
                </div>
              </div>
            )}
            {testResult === 'success' && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-3">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd"/>
                </svg>
                <p className="text-sm font-bold text-emerald-700">Connection successful — all checks passed</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Logs tab */
        <div className="flex-1 overflow-y-auto">
          {/* Column header */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-14">Time</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12 text-center">Method</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-1">Endpoint</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-14 text-right">Duration</span>
            <span className="w-3" />
          </div>

          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <svg className="w-8 h-8 mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
              </svg>
              <p className="text-xs font-semibold">No request logs yet</p>
              <p className="text-[11px] mt-0.5">Logs will appear here as requests are made</p>
            </div>
          ) : (
            logs.map((entry) => (
              <LogRow
                key={entry.id}
                entry={entry}
                isNew={entry.id === newLogId}
                expanded={expandedId === entry.id}
                onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200 flex items-center gap-2.5 bg-white shrink-0">
        {integration.status === 'failed' ? (
          <>
            <button className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer">
              Reconnect
            </button>
            <button
              onClick={handleTest}
              disabled={testing}
              className={cn(
                'px-4 py-2 rounded-lg border text-xs font-bold transition-colors',
                testing
                  ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
              )}
            >
              {testing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Testing…
                </span>
              ) : 'Test Connection'}
            </button>
            <button className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
              View docs
            </button>
          </>
        ) : integration.status === 'pending' ? (
          <button className="px-4 py-2 rounded-lg bg-[#0369A1] text-white text-xs font-bold hover:bg-sky-700 transition-colors cursor-pointer">
            Connect {integration.name}
          </button>
        ) : (
          <>
            <button
              onClick={handleTest}
              disabled={testing}
              className={cn(
                'px-4 py-2 rounded-lg border text-xs font-bold transition-colors',
                testing
                  ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
              )}
            >
              {testing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Testing…
                </span>
              ) : 'Test Connection'}
            </button>
            <button className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer">
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  )
}
