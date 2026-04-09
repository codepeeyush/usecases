import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { KYCStep, KYCField, StepStatus } from './data'
import { stepStatusConfig } from './data'

// ─── Primitives ──────────────────────────────────────────────────────────────

function StepHeader({ step }: { step: KYCStep }) {
  const statusPill: Record<StepStatus, string> = {
    complete: 'bg-emerald-50 text-emerald-700',
    error: 'bg-red-50 text-red-600',
    active: 'bg-amber-50 text-amber-700',
    pending: 'bg-slate-100 text-slate-400',
    locked: 'bg-slate-50 text-slate-300',
  }
  const dotColor: Record<StepStatus, string> = {
    complete: 'bg-emerald-500',
    error: 'bg-red-500 animate-pulse',
    active: 'bg-amber-500 animate-pulse',
    pending: 'bg-slate-300',
    locked: 'bg-slate-200',
  }
  const accentBar: Record<StepStatus, string> = {
    complete: 'bg-emerald-400',
    error: 'bg-red-400',
    active: 'bg-amber-400',
    pending: 'bg-slate-200',
    locked: 'bg-slate-100',
  }

  return (
    <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid #F1F0ED' }}>
      <div className={`w-1 h-9 rounded-full shrink-0 ${accentBar[step.status]}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">{step.title}</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{step.subtitle}</p>
          </div>
          <div className={`shrink-0 flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusPill[step.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor[step.status]}`} />
            {stepStatusConfig[step.status].label}
          </div>
        </div>
      </div>
    </div>
  )
}

// Borderless field — status shown via bg tint + left accent
function FieldRow({ field, readOnly = false }: { field: KYCField; readOnly?: boolean }) {
  const isMasked = field.type === 'masked'
  const displayValue = isMasked ? field.value.replace(/\d(?=\d{4})/g, '•') : field.value

  const wrapperBg = field.status === 'verified' ? 'bg-emerald-50'
    : field.status === 'error' ? 'bg-red-50'
    : field.status === 'warning' ? 'bg-amber-50'
    : 'bg-slate-50'

  const leftAccent = field.status === 'verified' ? 'bg-emerald-400'
    : field.status === 'error' ? 'bg-red-400'
    : field.status === 'warning' ? 'bg-amber-400'
    : 'bg-transparent'

  const textColor = field.status === 'verified' ? 'text-slate-700'
    : field.status === 'error' ? 'text-red-700'
    : field.status === 'warning' ? 'text-amber-800'
    : 'text-slate-700'

  return (
    <div>
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-2 block">
        {field.label}
        {field.format && <span className="ml-1.5 text-slate-300 normal-case tracking-normal font-mono">· {field.format}</span>}
      </label>

      <div className={`flex items-center gap-3 rounded-xl overflow-hidden ${wrapperBg}`}>
        {/* Left accent strip */}
        <div className={`w-0.5 self-stretch shrink-0 ${leftAccent}`} />

        <div className="flex items-center gap-2.5 flex-1 py-2.5 pr-3.5">
          {readOnly || field.status === 'verified' ? (
            <span className={cn('font-mono text-sm font-medium flex-1', textColor)}>
              {displayValue || field.placeholder}
            </span>
          ) : (
            <input
              type="text"
              defaultValue={field.value}
              placeholder={field.placeholder}
              className={cn('font-mono text-sm font-medium flex-1 bg-transparent outline-none placeholder:text-slate-300', textColor)}
            />
          )}

          {field.status === 'verified' && (
            <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
          {field.status === 'error' && (
            <svg className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
          )}
          {field.status === 'warning' && (
            <svg className="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      {(field.status === 'error' || field.status === 'warning') && field.errorMessage && (
        <p className={cn('text-[11px] mt-1.5 font-medium', field.status === 'error' ? 'text-red-500' : 'text-amber-600')}>
          {field.errorMessage}
        </p>
      )}

      {field.status === 'idle' && field.hint && (
        <p className="text-[11px] mt-1.5 text-slate-400">{field.hint}</p>
      )}
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

function PrimaryBtn({ onClick, loading, loadingText, children }: {
  onClick?: () => void; loading?: boolean; loadingText?: string; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 active:scale-[0.98] transition-all cursor-pointer"
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
    <button
      onClick={onClick}
      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
    >
      {children}
    </button>
  )
}

// ─── Step 1: Personal Info ───────────────────────────────────────────────────
function PersonalInfoDetail({ step }: { step: KYCStep }) {
  return (
    <div>
      <StepHeader step={step} />

      <div className="mx-6 mt-5 bg-emerald-50 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-700">Identity confirmed</p>
          <p className="text-[10px] text-emerald-600/70 mt-0.5">All fields match government records · Verified 2h ago</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {step.fields.map(f => <FieldRow key={f.id} field={f} readOnly />)}
      </div>

      <div className="px-6 pb-4">
        <p className="text-[10px] text-slate-300 font-medium flex items-center gap-1.5">
          <svg className="w-3 h-3 text-slate-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
          </svg>
          AES-256 encrypted · Not shared with third parties
        </p>
      </div>
    </div>
  )
}

// ─── Step 2: PAN Verification ────────────────────────────────────────────────
function PANDetail({ step }: { step: KYCStep }) {
  const [retrying, setRetrying] = useState(false)
  const issueCount = step.fields.filter(f => f.status === 'error' || f.status === 'warning').length

  return (
    <div>
      <StepHeader step={step} />

      {/* Error notice — left accent only, no border box */}
      <div className="mx-6 mt-5 rounded-xl overflow-hidden flex">
        <div className="w-1 bg-red-400 shrink-0" />
        <div className="bg-red-50 flex-1 px-4 py-3">
          <p className="text-xs font-bold text-red-700">{issueCount} issue{issueCount !== 1 ? 's' : ''} found</p>
          <p className="text-[11px] text-red-500 mt-0.5 leading-relaxed">
            Correct the fields below and retry. Details must match your physical PAN card exactly.
          </p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {step.fields.map(f => <FieldRow key={f.id} field={f} />)}

        {/* Help section */}
        <div className="bg-slate-50 rounded-xl px-4 py-4 space-y-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5">Common questions</p>
          {[
            'What does a valid PAN look like? (e.g. ABCDE1234F)',
            'Why does the date of birth need to match records?',
          ].map(q => (
            <button key={q} className="flex items-start gap-2 text-[11px] text-amber-600 hover:text-amber-700 font-semibold text-left cursor-pointer transition-colors">
              <svg className="w-3 h-3 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              {q}
            </button>
          ))}
        </div>
      </div>

      <ActionBar>
        <PrimaryBtn
          onClick={() => { setRetrying(true); setTimeout(() => setRetrying(false), 2000) }}
          loading={retrying}
          loadingText="Verifying PAN…"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          Retry Verification
        </PrimaryBtn>
        <GhostBtn>Save draft</GhostBtn>
      </ActionBar>
    </div>
  )
}

// ─── Step 3: Aadhaar ─────────────────────────────────────────────────────────
function AadhaarDetail({ step }: { step: KYCStep }) {
  const [seconds] = useState(42)
  const [verifying, setVerifying] = useState(false)

  return (
    <div>
      <StepHeader step={step} />

      {/* OTP notice */}
      <div className="mx-6 mt-5 rounded-xl overflow-hidden flex">
        <div className="w-1 bg-amber-400 shrink-0" />
        <div className="bg-amber-50 flex-1 px-4 py-3">
          <p className="text-xs font-bold text-amber-800">OTP sent to +91 98765 XXXXX</p>
          <p className="text-[11px] text-amber-600/80 mt-0.5">Linked to your Aadhaar · Expires in 10 minutes</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        <FieldRow field={step.fields[0]} readOnly />

        {/* OTP boxes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em]">Enter OTP</label>
            <button
              className={cn('text-[11px] font-semibold transition-colors', seconds > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-amber-600 hover:text-amber-700 cursor-pointer')}
              disabled={seconds > 0}
            >
              {seconds > 0 ? `Resend in ${seconds}s` : 'Resend OTP'}
            </button>
          </div>
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="flex-1 aspect-square text-center text-base font-bold text-slate-800 bg-slate-50 rounded-xl outline-none focus:bg-amber-50 focus:ring-2 focus:ring-amber-300 transition-all"
                style={{ maxWidth: '52px' }}
              />
            ))}
          </div>
          <p className="text-[11px] mt-2 text-slate-400">Never share your OTP · UIDAI will never ask for it</p>
        </div>

        <div className="bg-slate-50 rounded-xl px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Why Aadhaar?</p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            SEBI mandates Aadhaar-based e-KYC for all investment accounts. Your data is used only for verification and never stored by ClearFund.
          </p>
        </div>
      </div>

      <ActionBar>
        <PrimaryBtn
          onClick={() => { setVerifying(true); setTimeout(() => setVerifying(false), 2000) }}
          loading={verifying}
          loadingText="Verifying OTP…"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          Verify OTP
        </PrimaryBtn>
        <GhostBtn>Change number</GhostBtn>
      </ActionBar>
    </div>
  )
}

// ─── Step 4: Bank Account ────────────────────────────────────────────────────
function BankDetail({ step }: { step: KYCStep }) {
  return (
    <div>
      <StepHeader step={step} />

      {step.docRequired && (
        <div className="mx-6 mt-5 bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-700">Keep ready</p>
            <p className="text-[10px] text-blue-600/70 mt-0.5">{step.docRequired}</p>
          </div>
        </div>
      )}

      <div className="px-6 py-5 space-y-5">
        {step.fields.map(f => <FieldRow key={f.id} field={f} />)}

        <div className="bg-slate-50 rounded-xl px-4 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Where to find these</p>
          <div className="space-y-1.5">
            <p className="text-[11px] text-slate-500"><span className="font-semibold text-slate-600">Account number:</span> First page of your passbook or cheque book</p>
            <p className="text-[11px] text-slate-500"><span className="font-semibold text-slate-600">IFSC code:</span> Printed on every cheque leaf · 11 characters (e.g. HDFC0001234)</p>
          </div>
        </div>
      </div>

      <ActionBar>
        <PrimaryBtn>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
          Save & Continue
        </PrimaryBtn>
      </ActionBar>
    </div>
  )
}

// ─── Step 5: Review & Submit (locked) ────────────────────────────────────────
function ReviewDetail() {
  const blockers = [
    { label: 'PAN Verification', desc: 'Fix 2 errors to proceed', bg: 'bg-red-50', text: 'text-red-700', sub: 'text-red-400', dot: 'bg-red-400' },
    { label: 'Aadhaar Linking', desc: 'Enter and verify OTP', bg: 'bg-amber-50', text: 'text-amber-800', sub: 'text-amber-500', dot: 'bg-amber-400 animate-pulse' },
    { label: 'Bank Account', desc: 'Not started yet', bg: 'bg-slate-50', text: 'text-slate-500', sub: 'text-slate-400', dot: 'bg-slate-300' },
  ]

  return (
    <div>
      <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid #F1F0ED' }}>
        <div className="w-1 h-9 rounded-full bg-slate-200 shrink-0" />
        <div>
          <h2 className="text-sm font-bold text-slate-400">Review & Submit</h2>
          <p className="text-[11px] text-slate-300 mt-0.5">Complete all steps to unlock</p>
        </div>
      </div>

      <div className="px-6 py-8 flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-slate-500">3 steps remaining</p>
          <p className="text-[11px] text-slate-400 mt-1">Complete all steps below to submit your KYC</p>
        </div>

        <div className="w-full space-y-2">
          {blockers.map(b => (
            <div key={b.label} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${b.bg}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${b.dot}`} />
              <div className="flex-1">
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

// ─── Router ───────────────────────────────────────────────────────────────────
export default function KYCStepDetail({ step }: { step: KYCStep }) {
  if (step.status === 'locked') return <ReviewDetail />
  switch (step.id) {
    case 'personal': return <PersonalInfoDetail step={step} />
    case 'pan': return <PANDetail step={step} />
    case 'aadhaar': return <AadhaarDetail step={step} />
    case 'bank': return <BankDetail step={step} />
    default: return null
  }
}
