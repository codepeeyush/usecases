import { useState, useEffect, useCallback, useRef } from 'react'
import { useAIActions, useYourGPT } from '@yourgpt/widget-web-sdk/react'
import { YourGPTSDK } from '@yourgpt/widget-web-sdk'
import { builtinHandlers, startPageObserver } from '@/yourgpt/builtin'
import { integrations as baseIntegrations, Integration } from './data'
import type { AIActionData } from '@yourgpt/widget-web-sdk/react'
import IntegrationList from './IntegrationList'
import IntegrationDetail from './IntegrationDetail'
import DebugPanel from './DebugPanel'
import AIActionOverlay, { AIStep } from './AIActionOverlay'

function generateFakeToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const seg = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `xoxb-${seg(10)}-${seg(10)}-${seg(24)}`
}

function parseArgs<T = Record<string, unknown>>(data: AIActionData): T {
  try {
    return JSON.parse(data.action?.tool?.function?.arguments ?? '{}') as T
  } catch {
    return {} as T
  }
}


interface AIOverlayState {
  steps: AIStep[]
  token?: string
  phase: 'running' | 'done'
  runningSubtitle?: string
  doneTitle?: string
  doneSubtitle?: string
}

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
  const [aiOverlay, setAiOverlay] = useState<AIOverlayState | null>(null)

  const integrations = baseIntegrations.map((i) => ({ ...i, ...overrides[i.id] }))
  const selected = integrations.find((i) => i.id === selectedId) ?? integrations[0]

  const failedCount = integrations.filter((i) => i.status === 'failed').length
  const connectedCount = integrations.filter((i) => i.status === 'connected').length

  const handleFix = useCallback((id: string, newToken: string) => {
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
  }, [])

  // Keep a stable ref to handleFix for the AI action closure
  const handleFixRef = useRef(handleFix)
  useEffect(() => { handleFixRef.current = handleFix }, [handleFix])

  // Ref so action closures always read the latest integrations state
  const integrationsRef = useRef(integrations)
  useEffect(() => { integrationsRef.current = integrations }, [integrations])

  const { sdk } = useYourGPT()

  // Register builtin get_page_context + auto-sync DOM
  const { registerActions, registerAction, unregisterAction } = useAIActions()
  useEffect(() => {
    registerActions(builtinHandlers)
  }, [registerActions])
  useEffect(() => {
    if (!sdk) return
    return startPageObserver(sdk)
  }, [sdk])

  // Register 4 chained AI tools
  useEffect(() => {
    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    // ── Tool 1: get_integration_status ──────────────────────────────────────
    registerAction('get_integration_status', (data, helpers) => {
      const { integration_id } = parseArgs<{ integration_id?: string }>(data)
      const live = integrationsRef.current
      const targets = integration_id ? live.filter(i => i.id === integration_id) : live

      setActiveNav('integrations')

      if (targets.length === 0) {
        helpers.respond(`No integration found: "${integration_id}". Available: ${live.map(i => i.id).join(', ')}.`)
        return
      }

      const failed = targets.filter(i => i.status === 'failed')
      const lines: string[] = []

      for (const i of targets) {
        if (i.status === 'failed') {
          lines.push(`${i.name} [${i.id}]: FAILED — ${i.errorCode}: ${i.errorMessage} Failing for ${i.failingSince ?? 'unknown'}. ${i.blockedCount ?? 0} events blocked.`)
        } else {
          lines.push(`${i.name} [${i.id}]: ${i.status}. Last synced: ${i.lastSynced ?? 'never'}.`)
        }
      }

      if (failed.length > 0) {
        lines.push(`\nTo investigate: call diagnose_integration with integration_id="${failed[0].id}".`)
      } else {
        lines.push('\nAll integrations are healthy. No action needed.')
      }

      helpers.respond(lines.join('\n'))
    })

    // ── Tool 2: diagnose_integration ────────────────────────────────────────
    registerAction('diagnose_integration', async (data, helpers) => {
      const { integration_id } = parseArgs<{ integration_id: string }>(data)
      const integration = integrationsRef.current.find(i => i.id === integration_id)

      if (!integration) {
        helpers.respond(`Integration "${integration_id}" not found. Call get_integration_status to see available integrations.`)
        return
      }
      if (integration.status !== 'failed') {
        helpers.respond(`${integration.name} is currently "${integration.status}" — no diagnosis needed.`)
        return
      }

      const STEPS: AIStep[] = [
        { id: 'read-logs',       label: 'Reading error logs & request history', status: 'active' },
        { id: 'analyze-pattern', label: 'Analyzing failure pattern',            status: 'pending' },
        { id: 'root-cause',      label: 'Root cause identified',                status: 'pending' },
      ]

      YourGPTSDK.getInstance().close()
      setAiOverlay({ steps: STEPS, phase: 'running', runningSubtitle: `Diagnosing ${integration.name}…` } as AIOverlayState)
      await delay(1200)

      setAiOverlay({ steps: STEPS.map((s, i) => ({ ...s, status: (i < 1 ? 'done' : i === 1 ? 'active' : 'pending') as AIStep['status'] })), phase: 'running', runningSubtitle: `Diagnosing ${integration.name}…` })
      await delay(1600)

      setAiOverlay({ steps: STEPS.map((s, i) => ({ ...s, status: (i < 2 ? 'done' : 'active') as AIStep['status'] })), phase: 'running', runningSubtitle: `Diagnosing ${integration.name}…` })
      await delay(1200)

      setAiOverlay(null)

      // Build diagnosis based on error type
      const code = integration.errorCode ?? ''
      let rootCause: string
      let recommendation: string

      if (code.startsWith('401')) {
        rootCause = `Bot token \`${integration.botToken}\` has been revoked or expired in workspace settings.`
        recommendation = `call fix_integration with integration_id="${integration_id}" to regenerate the OAuth token.`
      } else if (code.startsWith('403')) {
        rootCause = `The app was authorized with read-only scopes (${(integration.scopes ?? []).join(', ')}) but write access is required for syncing.`
        recommendation = `call fix_integration with integration_id="${integration_id}" to re-authorize with expanded OAuth scopes.`
      } else if (code.startsWith('429')) {
        rootCause = `The bulk sync job polls every 5 minutes, consuming all ${integration.errorMessage?.match(/\d+,\d+|\d+/)?.[0] ?? '15,000'} daily API calls before midnight. Needs batch size reduction or an Enterprise API tier.`
        recommendation = `call fix_integration with integration_id="${integration_id}" to apply rate-limit mitigation.`
      } else if (code.startsWith('400')) {
        rootCause = `The stored webhook secret is stale — Intercom rotated the secret in the dashboard but the local copy was never updated. Every incoming webhook now fails HMAC validation.`
        recommendation = `call fix_integration with integration_id="${integration_id}" to update the webhook secret.`
      } else {
        rootCause = `Unknown error — ${integration.errorCode}: ${integration.errorMessage}`
        recommendation = `call fix_integration with integration_id="${integration_id}" to attempt a reconnect.`
      }

      helpers.respond(
        `Diagnosis for ${integration.name}:\n` +
        `Error: ${integration.errorCode} — ${integration.errorMessage}\n` +
        `Failing for ${integration.failingSince}. ${integration.blockedCount} events blocked.\n\n` +
        `Root cause: ${rootCause}\n\n` +
        `Next step: ${recommendation}`
      )
      YourGPTSDK.getInstance().open()
    })

    // ── Tool 3: fix_integration ──────────────────────────────────────────────
    registerAction('fix_integration', async (data, helpers) => {
      const { integration_id } = parseArgs<{ integration_id: string }>(data)
      const integration = integrationsRef.current.find(i => i.id === integration_id)

      if (!integration) {
        helpers.respond(`Integration "${integration_id}" not found. Call get_integration_status to see available integrations.`)
        return
      }
      if (integration.status !== 'failed') {
        helpers.respond(`${integration.name} is currently "${integration.status}" — nothing to fix.`)
        return
      }

      const code = integration.errorCode ?? ''
      const is403 = code.startsWith('403')
      const is429 = code.startsWith('429')
      const is400 = code.startsWith('400')

      // Step labels vary by failure type
      const actionLabel = is403
        ? 'Re-authorizing OAuth with expanded scopes'
        : is429
        ? 'Adjusting sync frequency & batch size'
        : is400
        ? 'Fetching new webhook secret'
        : 'Generating new OAuth token'

      const ALL_STEPS: AIStep[] = [
        { id: 'capture',  label: 'Integration status captured',      status: 'done' },
        { id: 'analyze',  label: 'Error logs analyzed',              status: 'done' },
        { id: 'diagnose', label: 'Root cause identified',            status: 'done' },
        { id: 'navigate', label: 'Navigating to Developer Settings', status: 'active' },
        { id: 'generate', label: actionLabel,                        status: 'pending' },
        { id: 'apply',    label: 'Applying fix',                     status: 'pending' },
        { id: 'save',     label: 'Saving changes',                   status: 'pending' },
      ]

      const makeSteps = (activeIdx: number): AIStep[] =>
        ALL_STEPS.map((s, i) => ({
          ...s,
          status: (i < 3 ? 'done' : i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending') as AIStep['status'],
        }))

      const overlaySubtitle = `Fixing ${integration.name}…`
      const token = is403 || is429 || is400 ? undefined : generateFakeToken()

      YourGPTSDK.getInstance().close()
      setAiOverlay({ steps: makeSteps(3), phase: 'running', runningSubtitle: overlaySubtitle })
      setActiveNav('developer')
      await delay(900)

      setAiOverlay({ steps: makeSteps(4), token, phase: 'running', runningSubtitle: overlaySubtitle })
      await delay(1800)

      setAiOverlay({ steps: makeSteps(5), token, phase: 'running', runningSubtitle: overlaySubtitle })
      handleFixRef.current(integration_id, token ?? `fixed-${Date.now()}`)
      await delay(900)

      setAiOverlay({ steps: makeSteps(6), token, phase: 'running', runningSubtitle: overlaySubtitle })
      await delay(800)

      const doneName = `${integration.name} reconnected`
      const doneSub = is403
        ? 'Write scopes granted · CRM sync resumed'
        : is429
        ? 'Batch mode enabled · API quota conserved'
        : is400
        ? 'Webhook secret updated · Events resuming'
        : 'New token applied · All systems healthy'

      setAiOverlay({ steps: ALL_STEPS.map(s => ({ ...s, status: 'done' as const })), token, phase: 'done', doneTitle: doneName, doneSubtitle: doneSub })
      await delay(1400)
      setAiOverlay(null)

      helpers.respond(
        `Fix applied to ${integration.name}.\n` +
        `${doneSub}.\n\n` +
        `Next step: call verify_integration with integration_id="${integration_id}" to confirm the API connection is healthy.`
      )
      YourGPTSDK.getInstance().open()
    })

    // ── Tool 4: verify_integration ───────────────────────────────────────────
    registerAction('verify_integration', async (data, helpers) => {
      const { integration_id } = parseArgs<{ integration_id: string }>(data)
      const integration = integrationsRef.current.find(i => i.id === integration_id)

      if (!integration) {
        helpers.respond(`Integration "${integration_id}" not found.`)
        return
      }

      YourGPTSDK.getInstance().close()
      setAiOverlay({
        steps: [{ id: 'verify', label: `Verifying API connection with ${integration.name}`, status: 'active' }],
        phase: 'running',
        runningSubtitle: `Verifying ${integration.name}…`,
      })
      await delay(1300)

      setAiOverlay({
        steps: [{ id: 'verify', label: `Verifying API connection with ${integration.name}`, status: 'done' }],
        phase: 'done',
        doneTitle: `${integration.name} verified`,
        doneSubtitle: 'Connection healthy · All API calls succeeding',
      })
      await delay(1400)
      setAiOverlay(null)

      const currentStatus = integrationsRef.current.find(i => i.id === integration_id)?.status ?? 'unknown'
      helpers.respond(
        currentStatus === 'connected'
          ? `${integration.name} is connected and healthy. All API calls are succeeding. No further action needed.`
          : `${integration.name} status is "${currentStatus}". If still failing, call diagnose_integration again to recheck.`
      )
      YourGPTSDK.getInstance().open()
    })

    return () => {
      unregisterAction('get_integration_status')
      unregisterAction('diagnose_integration')
      unregisterAction('fix_integration')
      unregisterAction('verify_integration')
    }
  }, [registerAction, unregisterAction])


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
      <div className="flex flex-1 min-h-0 relative">

        {/* AI Action Overlay */}
        {aiOverlay && (
          <AIActionOverlay
            steps={aiOverlay.steps}
            token={aiOverlay.token}
            phase={aiOverlay.phase}
            runningSubtitle={aiOverlay.runningSubtitle}
            doneTitle={aiOverlay.doneTitle}
            doneSubtitle={aiOverlay.doneSubtitle}
          />
        )}

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
