import { useState, useEffect, useRef } from 'react'
import { useAIActions, useYourGPT } from '@yourgpt/widget-web-sdk/react'
import { complianceSteps } from './data'
import { fintechHandlers } from '@/yourgpt/handlers'
import { builtinHandlers, startPageObserver } from '@/yourgpt/builtin'
import {
  BusinessDetailsStep,
  BusinessDetailsComplete,
  SignatoryStep,
  BankStep,
  ReviewStep,
} from './KYCStepDetail'

type StepState = 'business-active' | 'business-done' | 'signatory-error' | 'signatory-done'

// Compliance errors for Step 2 — only active when stepState === 'signatory-error'
const SIGNATORY_ERRORS = [
  {
    field: 'Government ID Number',
    field_id: 'id_number',
    error: 'Format not recognized — ID numbers cannot contain hyphens. Enter digits only (e.g. DL48291234).',
    fixable: true,
    suggested_value: 'DL48291234',
  },
  {
    field: 'Date of Birth',
    field_id: 'dob',
    error: 'Mismatch — this date does not match the ID on file. Double-check your document.',
    fixable: true,
    suggested_value: '09/14/1990',
  },
]

export default function FintechExample() {
  const [selectedId, setSelectedId] = useState('business')
  const [stepState, setStepState] = useState<StepState>('business-active')
  const [fieldOverrides, setFieldOverrides] = useState<Record<string, string>>({})

  const { registerActions } = useAIActions()
  const { sdk } = useYourGPT()

  // Stable refs so inline handlers never have stale closures (SaaS pattern)
  const stepStateRef = useRef(stepState)
  const setFieldOverridesRef = useRef(setFieldOverrides)
  useEffect(() => { stepStateRef.current = stepState }, [stepState])
  useEffect(() => { setFieldOverridesRef.current = setFieldOverrides }, [setFieldOverrides])

  // Register handlers inline with live state access — not dependent on session_data timing
  useEffect(() => {
    registerActions({
      // Explain current compliance errors — reads live stepState ref
      explain_compliance_errors: (_data, helpers) => {
        const errors = stepStateRef.current === 'signatory-error' ? SIGNATORY_ERRORS : []

        if (!errors.length) {
          helpers.respond(
            "No errors detected yet. Fill in the fields and click **Submit for Verification** — if anything fails, I'll explain what needs to be fixed and can auto-correct the issues for you.",
          )
          return
        }

        const lines: string[] = ["Here's what's blocking your **identity verification** step:\n"]
        errors.forEach((e, i) => {
          lines.push(`**${i + 1}. ${e.field}**`)
          lines.push(e.error)
          lines.push(
            e.fixable && e.suggested_value
              ? `→ I can fix this automatically — the correct value is \`${e.suggested_value}\`. Say **"fix all errors"** to apply it.`
              : `→ Needs manual correction — check the exact value on your document.`,
          )
          lines.push('')
        })

        const fixableCount = errors.filter(e => e.fixable).length
        if (fixableCount > 0) {
          lines.push(
            `I can auto-correct ${fixableCount === errors.length ? 'all' : fixableCount} of these. Say **"fix all my errors"** and I'll apply the corrections in one go.`,
          )
        }

        helpers.respond(lines.join('\n'))
      },

      // Fix one or all compliance fields — directly updates component state, no custom event needed
      fix_compliance_field: async (_data, helpers) => {
        const { field_id } = (() => {
          try { return JSON.parse(_data.action.tool?.function?.arguments ?? '{}') as { field_id?: string } }
          catch { return {} as { field_id?: string } }
        })()

        const errors = stepStateRef.current === 'signatory-error' ? SIGNATORY_ERRORS : []

        if (!errors.length) {
          helpers.respond(
            "There are no active errors to fix. Submit the form first and if validation fails, I'll be able to correct the fields for you.",
          )
          return
        }

        const fixAll = !field_id || field_id === 'all'
        const targets = fixAll
          ? errors.filter(e => e.fixable && e.suggested_value)
          : errors.filter(e => e.field_id === field_id && e.fixable && e.suggested_value)

        if (targets.length === 0) {
          const unfixable = errors.find(e => e.field_id === field_id)
          helpers.respond(
            unfixable
              ? `I can't automatically fix **${unfixable.field}** — check your physical document for the correct value.`
              : "I couldn't find that field in the current errors. Try asking me to **fix all errors** instead.",
          )
          return
        }

        const fieldsList = targets.map(t => `**${t.field}** → \`${t.suggested_value}\``).join('\n')
        const confirmed = await helpers.confirm({
          title: targets.length === 1 ? `Fix ${targets[0].field}?` : `Fix ${targets.length} fields?`,
          description: `I'll apply these corrections:\n${fieldsList}`,
          acceptLabel: 'Apply fixes',
          rejectLabel: 'Cancel',
        })

        if (!confirmed) {
          helpers.respond("No problem — nothing has been changed.")
          return
        }

        // Apply directly to component state — no window.dispatchEvent needed
        setFieldOverridesRef.current(prev => {
          const next = { ...prev }
          for (const t of targets) {
            if (t.field_id && t.suggested_value) next[t.field_id] = t.suggested_value
          }
          return next
        })

        const remaining = errors.filter(e => !targets.find(t => t.field_id === e.field_id))
        const fixedList = targets.map(t => `**${t.field}** → \`${t.suggested_value}\``).join(', ')

        helpers.respond(
          remaining.length === 0
            ? `All done! Fixed: ${fixedList}. Click **"Retry Verification"** — everything should pass now.`
            : `Fixed: ${fixedList}. The remaining field${remaining.length > 1 ? 's' : ''} (${remaining.map(e => e.field).join(', ')}) need manual correction. Then click **"Retry Verification"**.`,
        )
      },

      // Field explanation — stateless, kept from handlers.ts
      explain_field: fintechHandlers.explain_field,

      // Builtin: AI can read live page DOM (form values, errors, annotated elements)
      ...builtinHandlers,
    })
  }, [registerActions])

  // Auto-sync DOM state to widget on every render/mutation (SaaS pattern)
  useEffect(() => {
    if (!sdk) return
    return startPageObserver(sdk)
  }, [sdk])

  // Derive displayed steps with overridden statuses
  const steps = complianceSteps.map(s => {
    if (s.id === 'business') {
      return { ...s, status: stepState === 'business-done' || stepState === 'signatory-error' || stepState === 'signatory-done' ? 'complete' : 'active' } as typeof s
    }
    if (s.id === 'signatory') {
      if (stepState === 'signatory-done') return { ...s, status: 'complete' } as typeof s
      if (stepState === 'signatory-error') return { ...s, status: 'error' } as typeof s
      if (stepState === 'business-done') return { ...s, status: 'active' } as typeof s
      return { ...s, status: 'locked' } as typeof s
    }
    if (s.id === 'bank') {
      return { ...s, status: stepState === 'signatory-done' ? 'active' : 'locked' } as typeof s
    }
    return s
  })

  const selected = steps.find(s => s.id === selectedId) ?? steps[0]
  const completedCount = steps.filter(s => s.status === 'complete').length
  const errorCount = steps.filter(s => s.status === 'error').length
  const currentIndex = steps.findIndex(s => s.id === selectedId)
  const progressPct = Math.round((completedCount / steps.length) * 100)

  const handleBusinessComplete = () => {
    setStepState('business-done')
    setTimeout(() => setSelectedId('signatory'), 400)
  }

  const handleSignatoryError = () => setStepState('signatory-error')

  const handleSignatoryComplete = () => {
    setStepState('signatory-done')
    setTimeout(() => setSelectedId('bank'), 400)
  }

  // Push structured compliance context into session data for the AI
  useEffect(() => {
    if (!sdk) return
    sdk.setSessionData({
      page_context: 'fintech-compliance',
      current_step: selectedId,
      current_step_status: steps.find(s => s.id === selectedId)?.status ?? 'active',
      compliance_errors: stepState === 'signatory-error' ? SIGNATORY_ERRORS : [],
      step_summary: steps.map(s => ({ step: s.title, status: s.status })),
    })
  }, [sdk, selectedId, stepState])

  return (
    <div
      className="min-h-full"
      style={{ backgroundColor: '#F5F4F1', fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 h-14 bg-white flex items-center px-6 gap-4"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">FounderStack</span>
        </div>

        <div className="w-px h-4 bg-slate-200 mx-1" />

        <div className="hidden sm:flex items-center gap-1">
          {['Dashboard', 'Apps', 'Payments', 'Docs'].map(item => (
            <button key={item} className={`text-xs px-2 py-1 rounded-md transition-colors cursor-pointer font-medium ${item === 'Payments' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {errorCount > 0 && (
          <div className="flex items-center gap-1.5 bg-red-50 text-red-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Action needed
          </div>
        )}

        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <svg className="w-3 h-3 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
          </svg>
          256-bit encrypted
        </div>

        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-[10px] font-bold cursor-pointer">
          RK
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div>
        <div className="max-w-[560px] mx-auto px-4 py-8 sm:py-10">

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Payments Onboarding</p>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Enable payment processing</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Complete compliance to start accepting payments in your app
                </p>
              </div>

              {/* Progress chip */}
              <div
                className="shrink-0 bg-white rounded-2xl px-4 py-2.5 text-right"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Done</p>
                <p className="text-2xl font-bold text-slate-800 leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {completedCount}<span className="text-sm font-semibold text-slate-300">/{steps.length}</span>
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: errorCount > 0 ? '#f97316' : '#a78bfa',
                }}
              />
            </div>
          </div>

          {/* ── Stepper ──────────────────────────────────────────── */}
          <div className="mb-6">
            <div className="relative flex justify-between items-start">
              {/* track */}
              <div className="absolute left-[15px] right-[15px] top-[14px] h-0.5 bg-slate-200 rounded-full" />
              {/* fill */}
              <div
                className="absolute left-[15px] top-[14px] h-0.5 rounded-full transition-all duration-700"
                style={{
                  width: completedCount > 0 ? `calc(${(completedCount / (steps.length - 1)) * 100}% - 0px)` : '0%',
                  backgroundColor: '#a78bfa',
                }}
              />

              {steps.map(step => {
                const isSelected = step.id === selectedId
                const isLocked = step.status === 'locked'
                const cfg = (() => {
                  if (step.status === 'complete') return { bg: 'bg-emerald-500', ring: '0 0 0 3px white, 0 0 0 5px rgba(52,211,153,0.35)' }
                  if (step.status === 'error') return { bg: isSelected ? 'bg-red-500' : 'bg-red-400', ring: '0 0 0 3px white, 0 0 0 5px rgba(239,68,68,0.3)' }
                  if (step.status === 'active') return { bg: isSelected ? 'bg-violet-600' : 'bg-violet-400', ring: '0 0 0 3px white, 0 0 0 5px rgba(139,92,246,0.35)' }
                  if (step.status === 'pending') return { bg: 'bg-slate-300', ring: '0 0 0 3px white, 0 0 0 5px rgba(148,163,184,0.3)' }
                  return { bg: 'bg-slate-200', ring: '' }
                })()

                const labelColor = isSelected ? 'text-slate-700 font-bold'
                  : step.status === 'complete' ? 'text-emerald-600 font-semibold'
                  : step.status === 'error' ? 'text-red-500 font-semibold'
                  : step.status === 'locked' ? 'text-slate-300 font-medium'
                  : 'text-slate-400 font-medium'

                return (
                  <button
                    key={step.id}
                    onClick={() => !isLocked && setSelectedId(step.id)}
                    disabled={isLocked}
                    className="relative z-10 flex flex-col items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <div
                      className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-200 ${cfg.bg}`}
                      style={isSelected && cfg.ring ? { boxShadow: cfg.ring } : undefined}
                    >
                      {step.status === 'complete' && (
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {step.status === 'error' && (
                        <span className="text-xs font-black text-white leading-none">!</span>
                      )}
                      {step.status === 'locked' && (
                        <svg className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      )}
                      {(step.status === 'active' || step.status === 'pending') && (
                        <span className="text-[11px] font-bold text-white">{step.number}</span>
                      )}
                    </div>
                    <span className={`text-[10px] transition-colors ${labelColor}`}>
                      {step.title.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Context banner above card ─────────────────────── */}
          {selected.status === 'error' && (
            <div className="mb-4 flex items-center gap-2.5 bg-red-50 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <p className="text-xs font-semibold text-red-700">Identity verification failed — fix the errors below or ask the assistant for help</p>
            </div>
          )}

          {/* ── Step card ─────────────────────────────────────── */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}
          >
            {selected.id === 'business' && stepState === 'business-active' && (
              <BusinessDetailsStep step={selected} onComplete={handleBusinessComplete} />
            )}
            {selected.id === 'business' && stepState === 'business-done' && (
              <BusinessDetailsComplete step={selected} />
            )}
            {selected.id === 'signatory' && (
              <SignatoryStep
                step={selected}
                onComplete={handleSignatoryComplete}
                onSubmitError={handleSignatoryError}
                fieldOverrides={fieldOverrides}
              />
            )}
            {selected.id === 'bank' && (
              <BankStep step={selected} />
            )}
            {selected.id === 'review' && (
              <ReviewStep step={selected} />
            )}
          </div>

          {/* ── Footer nav ────────────────────────────────────── */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => { const p = steps[currentIndex - 1]; if (p) setSelectedId(p.id) }}
              disabled={currentIndex === 0}
              className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-default"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Previous
            </button>

            <p className="text-[10px] text-slate-300 font-medium">PCI-DSS compliant · RBI regulated</p>

            <button
              onClick={() => { const n = steps[currentIndex + 1]; if (n && n.status !== 'locked') setSelectedId(n.id) }}
              disabled={currentIndex >= steps.length - 1 || steps[currentIndex + 1]?.status === 'locked'}
              className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-default"
            >
              Next
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Demo fill button (dev helper) ─────────────────────── */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('ygpt:fintech:demo_fill', {
          detail: {
            business: {
              company_name: 'Waverly Software Inc.',
              business_type: 'llc',
              website: 'waverl.io',
              tax_id: '82-4719302',
            },
            signatory: {
              signatory_name: 'Jordan Riley',
              id_number: 'DL-4829X1',
              dob: '09/14/1991',
              nationality: 'us',
            },
          },
        }))}
        className="fixed bottom-5 left-5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 hover:border-slate-300 hover:text-slate-600 px-3 py-1.5 rounded-full shadow-sm transition-all cursor-pointer"
        title="Auto-fill demo values"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        Fill demo
      </button>
    </div>
  )
}
