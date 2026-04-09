import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface AIStep {
  id: string
  label: string
  detail?: string
  status: 'pending' | 'active' | 'done'
}

interface AIActionOverlayProps {
  steps: AIStep[]
  token?: string
  phase: 'running' | 'done'
}

// Typewriter hook — reveals text char-by-char
function useTypewriter(text: string, active: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active || !text) { setDisplayed(''); return }
    let i = 0
    setDisplayed('')
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, active, speed])
  return displayed
}

// Blinking cursor
function Cursor() {
  return <span className="inline-block w-[2px] h-[13px] bg-sky-400 ml-0.5 align-middle animate-pulse" />
}

// Step row
function StepRow({ step, token }: { step: AIStep; token?: string }) {
  const isActive = step.status === 'active'
  const isDone = step.status === 'done'
  const isPending = step.status === 'pending'
  const isGenerating = step.id === 'generate' && isActive
  const typedToken = useTypewriter(token ?? '', isGenerating, 12)

  return (
    <div className={cn(
      'flex items-start gap-3.5 py-2.5 px-4 rounded-xl transition-all duration-300',
      isActive ? 'bg-white/5' : ''
    )}>
      {/* Icon */}
      <div className="w-5 h-5 shrink-0 mt-0.5 flex items-center justify-center">
        {isDone && (
          <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
          </svg>
        )}
        {isActive && (
          <div className="relative w-5 h-5">
            <svg className="w-5 h-5 text-slate-600 absolute" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            </svg>
            <svg className="w-5 h-5 text-sky-400 absolute animate-spin" viewBox="0 0 24 24" fill="none">
              <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}
        {isPending && (
          <div className="w-4 h-4 rounded-full border border-slate-700" />
        )}
      </div>

      {/* Label + detail + token */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium leading-5 transition-colors duration-200',
          isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-slate-600'
        )}>
          {step.label}
          {isActive && !isGenerating && <Cursor />}
        </p>

        {/* Detail line — shown when active or done */}
        {step.detail && (isActive || isDone) && !isGenerating && (
          <p className={cn(
            'mt-1 text-[11px] leading-relaxed',
            isDone ? 'text-slate-600' : 'text-slate-400'
          )}>
            {step.detail}
          </p>
        )}

        {/* Token typewriter — only on generate step when active */}
        {isActive && isGenerating && token && (
          <p className="mt-1.5 font-mono text-[11px] text-sky-300 leading-relaxed break-all">
            {typedToken}<Cursor />
          </p>
        )}

        {/* Show full token once generate step is done */}
        {isDone && step.id === 'generate' && token && (
          <p className="mt-1 font-mono text-[11px] text-emerald-400/60 leading-relaxed break-all">
            {token}
          </p>
        )}
      </div>
    </div>
  )
}

export default function AIActionOverlay({ steps, token, phase }: AIActionOverlayProps) {
  const doneCount = steps.filter(s => s.status === 'done').length
  const progress = doneCount / steps.length

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        className="relative w-full max-w-md mx-6 rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 48px rgba(0,0,0,0.6)' }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative bg-[#0F172A]">
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 shrink-0">
                <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
                <div className="relative w-7 h-7 rounded-full bg-sky-500/30 border border-sky-500/50 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-sky-400 uppercase tracking-widest">AI Agent</p>
                <p className="text-xs text-slate-400 font-medium">
                  {phase === 'done' ? 'Fix complete' : 'Diagnosing Slack integration…'}
                </p>
              </div>

              {phase === 'running' && (
                <div className="ml-auto flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full bg-sky-400"
                      style={{ animation: `ygpt-bounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Steps */}
          {phase === 'running' && (
            <div className="px-1 py-2">
              {steps.map(step => (
                <StepRow key={step.id} step={step} token={token} />
              ))}
            </div>
          )}

          {/* Done state */}
          {phase === 'done' && (
            <div className="flex flex-col items-center py-10 px-6 gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="relative w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-emerald-400">Slack reconnected</p>
                <p className="text-xs text-slate-500 mt-1">All systems healthy · New token applied</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="h-0.5 bg-white/4">
            <div
              className="h-full bg-sky-500 transition-all duration-700"
              style={{ width: phase === 'done' ? '100%' : `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ygpt-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
