import { useState } from 'react'
import { kycSteps } from './data'
import KYCStepDetail from './KYCStepDetail'

export default function FintechExample() {
  const [selectedId, setSelectedId] = useState('pan')

  const selected = kycSteps.find(s => s.id === selectedId) ?? kycSteps[0]
  const completedCount = kycSteps.filter(s => s.status === 'complete').length
  const errorCount = kycSteps.filter(s => s.status === 'error').length
  const currentIndex = kycSteps.findIndex(s => s.id === selectedId)

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: '#F5F4F1',
        fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="shrink-0 h-14 bg-white flex items-center px-6 gap-4" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">ClearFund</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 ml-2">
          {['Dashboard', 'Portfolio', 'Explore'].map(item => (
            <button key={item} className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded-md hover:bg-slate-50 cursor-pointer font-medium">
              {item}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="text-[10px] text-slate-400 font-medium hidden md:block tracking-wide">
          SEBI · INP000001271 · RBI Regulated
        </div>

        {errorCount > 0 && (
          <div className="flex items-center gap-1.5 bg-red-50 text-red-600 text-[10px] font-semibold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Action needed
          </div>
        )}

        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-[10px] font-bold cursor-pointer">
          AM
        </div>
      </header>

      {/* ── Scrollable body ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[560px] mx-auto px-4 py-8 sm:py-10">

          {/* Page heading */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">KYC Verification</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">Required by SEBI to activate your account</p>
              </div>
              <div className="text-right shrink-0 bg-white rounded-xl px-4 py-2.5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Progress</p>
                <span className="text-2xl font-bold text-slate-800 select-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {completedCount}<span className="text-base font-semibold text-slate-400">/{kycSteps.length}</span>
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${(completedCount / kycSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* ── Horizontal stepper ────────────────────────────── */}
          <div className="mb-6">
            <div className="relative flex justify-between items-start">
              {/* track line */}
              <div className="absolute left-[15px] right-[15px] top-[14px] h-0.5 bg-slate-200 rounded-full" />
              {/* filled portion */}
              <div
                className="absolute left-[15px] top-[14px] h-0.5 bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: completedCount > 0 ? `calc(${(completedCount / (kycSteps.length - 1)) * 100}% - 0px)` : '0%' }}
              />

              {kycSteps.map(step => {
                const isSelected = step.id === selectedId
                const isLocked = step.status === 'locked'

                const circleBg = step.status === 'complete' ? 'bg-emerald-500'
                  : step.status === 'error' ? 'bg-red-500'
                  : step.status === 'active' ? (isSelected ? 'bg-amber-500' : 'bg-amber-300')
                  : step.status === 'pending' ? (isSelected ? 'bg-slate-400' : 'bg-slate-300')
                  : 'bg-slate-200'

                const labelColor = isSelected ? 'text-slate-800 font-bold'
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
                      className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-150 ${circleBg}`}
                      style={isSelected ? { boxShadow: '0 0 0 3px white, 0 0 0 5px rgba(245,158,11,0.35)' } : undefined}
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

          {/* ── Active step banner ─────────────────────────────── */}
          {selected.status === 'error' && (
            <div className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <p className="text-xs font-semibold text-red-700">Action required — fix the errors below to continue</p>
            </div>
          )}
          {selected.status === 'active' && (
            <div className="mb-4 flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <p className="text-xs font-semibold text-amber-700">In progress — complete this step to continue</p>
            </div>
          )}

          {/* ── Step card ─────────────────────────────────────── */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <KYCStepDetail step={selected} />
          </div>

          {/* ── Footer nav ────────────────────────────────────── */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => { const p = kycSteps[currentIndex - 1]; if (p) setSelectedId(p.id) }}
              disabled={currentIndex === 0}
              className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-default"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Previous
            </button>

            <p className="text-[10px] text-slate-300 font-medium">AES-256 encrypted · DPDP Act compliant</p>

            <button
              onClick={() => { const n = kycSteps[currentIndex + 1]; if (n && n.status !== 'locked') setSelectedId(n.id) }}
              disabled={currentIndex >= kycSteps.length - 1 || kycSteps[currentIndex + 1]?.status === 'locked'}
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
    </div>
  )
}
