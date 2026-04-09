import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { ComplianceStep, ComplianceField, FieldStatus } from './data'
import { stepStatusConfig } from './data'

// ─── Field components ────────────────────────────────────────────────────────

function FieldLabel({ field }: { field: ComplianceField }) {
  return (
    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-2 block">
      {field.label}
      {field.format && (
        <span className="ml-1.5 text-slate-300 normal-case tracking-normal font-mono">· {field.format}</span>
      )}
    </label>
  )
}

function FieldStatusIcon({ status }: { status: FieldStatus }) {
  if (status === 'verified') return (
    <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
  if (status === 'error') return (
    <svg className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
  )
  if (status === 'warning') return (
    <svg className="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
  )
  return null
}

function FieldRow({
  field,
  readOnly = false,
  onChange,
  aiFixed = false,
}: {
  field: ComplianceField
  readOnly?: boolean
  onChange?: (id: string, value: string) => void
  aiFixed?: boolean
}) {
  const wrapperBg = {
    verified: 'bg-emerald-50',
    error: 'bg-red-50',
    warning: 'bg-amber-50',
    idle: 'bg-slate-50',
  }[field.status]

  const leftAccent = {
    verified: 'bg-emerald-400',
    error: 'bg-red-400',
    warning: 'bg-amber-400',
    idle: 'bg-transparent',
  }[field.status]

  const textColor = {
    verified: 'text-slate-700',
    error: 'text-red-700',
    warning: 'text-amber-900',
    idle: 'text-slate-700',
  }[field.status]

  const maskedValue = field.type === 'masked' && field.value
    ? field.value.replace(/\d(?=\d{4})/g, '•')
    : field.value

  return (
    <div>
      <FieldLabel field={field} />

      <div className={`flex items-center rounded-xl overflow-hidden ${wrapperBg}`}>
        <div className={`w-1 self-stretch shrink-0 ${leftAccent}`} />

        {field.prefix && (
          <span className="pl-3 text-sm text-slate-400 font-medium shrink-0 select-none">{field.prefix}</span>
        )}

        <div className="flex items-center gap-2 flex-1 py-2.5 pr-3.5 pl-3">
          {readOnly ? (
            <span className={cn('text-sm font-medium flex-1', textColor)}>
              {maskedValue || <span className="text-slate-300">{field.placeholder}</span>}
            </span>
          ) : field.type === 'select' ? (
            <select
              value={field.value || ''}
              disabled={!onChange}
              onChange={e => onChange?.(field.id, e.target.value)}
              className={cn('text-sm font-medium flex-1 bg-transparent outline-none appearance-none cursor-pointer disabled:cursor-default', textColor, !field.value && 'text-slate-400')}
            >
              <option value="" disabled>{field.placeholder}</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={field.value}
              placeholder={field.placeholder}
              readOnly={!onChange}
              onChange={e => onChange?.(field.id, e.target.value)}
              className={cn('text-sm font-medium flex-1 bg-transparent outline-none placeholder:text-slate-300', textColor)}
            />
          )}
          {/* AI-fixed badge */}
          {aiFixed ? (
            <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
              Fixed by AI
            </span>
          ) : (
            <FieldStatusIcon status={field.status} />
          )}
        </div>
      </div>

      {(field.status === 'error' || field.status === 'warning') && field.errorMessage && (
        <p
          data-yourgpt-context={`compliance-error-${field.id}`}
          className={cn('text-[11px] mt-1.5 font-medium leading-relaxed', field.status === 'error' ? 'text-red-500' : 'text-amber-600')}
        >
          {field.errorMessage}
        </p>
      )}

      {field.status === 'idle' && field.hint && (
        <p className="text-[11px] mt-1.5 text-slate-400 leading-relaxed">{field.hint}</p>
      )}
    </div>
  )
}

function StepHeader({ step }: { step: ComplianceStep }) {
  const cfg = stepStatusConfig[step.status]
  return (
    <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid #F1F0ED' }}>
      <div className={`w-1 h-9 rounded-full shrink-0 ${cfg.accentBar}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">{step.title}</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">{step.subtitle}</p>
          </div>
          <div className={`shrink-0 flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #F1F0ED' }}>
      {children}
    </div>
  )
}

function PrimaryBtn({ onClick, loading, loadingText, disabled, children }: {
  onClick?: () => void; loading?: boolean; loadingText?: string; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
          </svg>
          {loadingText}
        </>
      ) : children}
    </button>
  )
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
      {children}
    </button>
  )
}

// ─── Step 1: Business Details ─────────────────────────────────────────────────
export function BusinessDetailsStep({ step, onComplete }: { step: ComplianceStep; onComplete: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const handleChange = (id: string, val: string) => setValues(prev => ({ ...prev, [id]: val }))

  // Demo-fill hook — triggered by the floating dev button
  useEffect(() => {
    const handler = (e: Event) => {
      const { business } = (e as CustomEvent).detail as { business?: Record<string, string> }
      if (business) setValues(business)
    }
    window.addEventListener('ygpt:fintech:demo_fill', handler)
    return () => window.removeEventListener('ygpt:fintech:demo_fill', handler)
  }, [])

  // All required fields filled?
  const requiredIds = ['company_name', 'business_type']
  const allFilled = requiredIds.every(id => {
    const field = step.fields.find(f => f.id === id)
    return (values[id] ?? field?.value ?? '').trim().length > 0
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onComplete()
    }, 1400)
  }

  return (
    <div>
      <StepHeader step={step} />

      <div className="px-6 pt-5 pb-2 space-y-5">
        {step.fields.map(f => (
          <FieldRow
            key={f.id}
            field={{ ...f, value: values[f.id] ?? f.value }}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Optional field note */}
      <p className="px-6 pb-4 text-[10px] text-slate-300 font-medium">
        Tax ID can be added later — some regions don't require it for low-volume merchants.
      </p>

      <ActionBar>
        <PrimaryBtn
          onClick={handleSave}
          loading={saving}
          loadingText="Saving details…"
          disabled={!allFilled}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          Confirm & Continue
        </PrimaryBtn>
        <GhostBtn>Save draft</GhostBtn>
      </ActionBar>
    </div>
  )
}

// ─── Step 1 complete (read-only recap) ───────────────────────────────────────
export function BusinessDetailsComplete({ step }: { step: ComplianceStep }) {
  return (
    <div>
      <StepHeader step={{ ...step, status: 'complete' }} />

      <div className="mx-6 mt-5 bg-emerald-50 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-700">Business details saved</p>
          <p className="text-[10px] text-emerald-600/70 mt-0.5">Continue to verify your identity as authorized signatory</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {step.fields.slice(0, 3).map(f => (
          <FieldRow key={f.id} field={{ ...f, status: 'verified', value: f.value || f.placeholder }} readOnly />
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Authorized Signatory ────────────────────────────────────────────
export function SignatoryStep({
  step,
  onComplete,
  onSubmitError,
  fieldOverrides = {},
}: {
  step: ComplianceStep
  onComplete: () => void
  onSubmitError?: () => void
  fieldOverrides?: Record<string, string>
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, { status: FieldStatus; errorMessage: string }>>({})
  const [submitted, setSubmitted] = useState(false)
  const [retrying, setRetrying] = useState(false)

  const handleChange = (id: string, val: string) => setValues(prev => ({ ...prev, [id]: val }))

  // Demo-fill hook — triggered by the floating dev button
  useEffect(() => {
    const handler = (e: Event) => {
      const { signatory } = (e as CustomEvent).detail as { signatory?: Record<string, string> }
      if (signatory) setValues(signatory)
    }
    window.addEventListener('ygpt:fintech:demo_fill', handler)
    return () => window.removeEventListener('ygpt:fintech:demo_fill', handler)
  }, [])

  // Merge values + fieldOverrides + fieldErrors into a single field object for rendering
  const getEffectiveField = (field: ComplianceField): ComplianceField => {
    const overrideValue = fieldOverrides[field.id]
    const val = overrideValue ?? values[field.id] ?? field.value
    const err = overrideValue ? undefined : fieldErrors[field.id]
    return {
      ...field,
      value: val,
      status: err?.status ?? (overrideValue ? 'idle' : field.status),
      errorMessage: err?.errorMessage,
    }
  }

  const issueCount = Object.keys(fieldErrors).length

  const handleRetry = () => {
    setRetrying(true)
    setTimeout(() => {
      setRetrying(false)
      setSubmitted(true)

      const effectiveId = fieldOverrides['id_number'] ?? values['id_number'] ?? ''
      const effectiveDob = fieldOverrides['dob'] ?? values['dob'] ?? ''

      const newErrors: Record<string, { status: FieldStatus; errorMessage: string }> = {}

      if (effectiveId.includes('-')) {
        newErrors['id_number'] = {
          status: 'error',
          errorMessage: 'Format not recognized — ID numbers cannot contain hyphens. Enter digits only (e.g. DL48291234).',
        }
      }
      if (effectiveDob === '09/14/1991') {
        newErrors['dob'] = {
          status: 'warning',
          errorMessage: 'Mismatch — this date does not match the ID on file. Double-check your document.',
        }
      }

      if (Object.keys(newErrors).length === 0) {
        onComplete()
      } else {
        setFieldErrors(newErrors)
        onSubmitError?.()
      }
    }, 1800)
  }

  return (
    <div>
      <StepHeader step={step} />

      {/* Error notice — only shown after first failed submission */}
      {submitted && issueCount > 0 && (
        <div className="mx-6 mt-5 rounded-xl overflow-hidden flex">
          <div className="w-1 bg-red-400 shrink-0" />
          <div className="bg-red-50 flex-1 px-4 py-3">
            <p className="text-xs font-bold text-red-700">{issueCount} issue{issueCount > 1 ? 's' : ''} found — identity could not be verified</p>
            <p className="text-[11px] text-red-500 mt-0.5 leading-relaxed">
              Details below must match your official ID exactly. Not sure what's wrong? Ask the assistant.
            </p>
          </div>
        </div>
      )}

      <div className="px-6 py-5 space-y-5">
        {step.fields.map(f => (
          <FieldRow
            key={f.id}
            field={getEffectiveField(f)}
            onChange={handleChange}
            aiFixed={!!fieldOverrides[f.id]}
          />
        ))}

        {/* Help callout */}
        <div className="bg-slate-50 rounded-xl px-4 py-4 space-y-2.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Common questions</p>
          {[
            'Which ID types are accepted — passport, driver\'s license, or national ID?',
            'Why does my date of birth not match what\'s on file?',
            'Is it safe to submit my government ID number here?',
          ].map(q => (
            <button key={q} className="flex items-start gap-2 text-[11px] text-amber-600 hover:text-amber-700 font-semibold text-left cursor-pointer transition-colors w-full">
              <svg className="w-3 h-3 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              {q}
            </button>
          ))}
        </div>

        {step.docRequired && (
          <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <div>
              <p className="text-xs font-bold text-blue-700">Documents you'll need</p>
              <p className="text-[10px] text-blue-600/70 mt-0.5">{step.docRequired}</p>
            </div>
          </div>
        )}
      </div>

      <ActionBar>
        <PrimaryBtn onClick={handleRetry} loading={retrying} loadingText="Verifying identity…">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          {submitted && issueCount > 0 ? 'Retry Verification' : 'Submit for Verification'}
        </PrimaryBtn>
        <GhostBtn>Save draft</GhostBtn>
      </ActionBar>
    </div>
  )
}

// ─── Step 3: Settlement Account (locked) ────────────────────────────────────
export function BankStep({ step }: { step: ComplianceStep }) {
  return (
    <div>
      <StepHeader step={step} />
      <LockedStepBody message="Complete identity verification to unlock your settlement account setup." />
    </div>
  )
}

// ─── Step 4: Review & Activate (locked) ─────────────────────────────────────
export function ReviewStep({ step }: { step: ComplianceStep }) {
  const blockers: Array<{ label: string; desc: string; bg: string; text: string; sub: string; dot: string }> = [
    {
      label: 'Authorized Signatory',
      desc: 'Fix ID number format and date of birth mismatch',
      bg: 'bg-red-50', text: 'text-red-700', sub: 'text-red-400', dot: 'bg-red-400',
    },
    {
      label: 'Settlement Account',
      desc: 'Add your business bank account',
      bg: 'bg-slate-50', text: 'text-slate-500', sub: 'text-slate-400', dot: 'bg-slate-300',
    },
  ]

  return (
    <div>
      <StepHeader step={step} />

      <div className="px-6 py-8 flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-slate-500">Complete these steps first</p>
          <p className="text-[11px] text-slate-400 mt-1">Once resolved, you can review and go live</p>
        </div>

        <div className="w-full space-y-2">
          {blockers.map(b => (
            <div key={b.label} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${b.bg}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${b.dot}`} />
              <div>
                <p className={`text-[11px] font-bold ${b.text}`}>{b.label}</p>
                <p className={`text-[10px] mt-0.5 ${b.sub}`}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Locked state helper ────────────────────────────────────────────────────
function LockedStepBody({ message }: { message: string }) {
  return (
    <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <p className="text-sm font-bold text-slate-400">This step is locked</p>
      <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">{message}</p>
    </div>
  )
}
