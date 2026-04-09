import { cn } from '@/lib/utils'
import type { KYCStep, StepStatus } from './data'
import { stepStatusConfig } from './data'

interface KYCStepListProps {
  steps: KYCStep[]
  selectedId: string
  onSelect: (id: string) => void
}

function StepIcon({ status, number }: { status: StepStatus; number: number }) {
  const cfg = stepStatusConfig[status]

  if (status === 'complete') {
    return (
      <div className={cn('w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0', cfg.circleBase)}>
        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={cn('w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0', cfg.circleBase)}>
        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 9v4M12 17h.01" />
        </svg>
      </div>
    )
  }

  if (status === 'locked') {
    return (
      <div className={cn('w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0', cfg.circleBase)}>
        <svg className="w-3 h-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
    )
  }

  if (status === 'active') {
    return (
      <div className={cn('w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 animate-pulse', cfg.circleBase)}>
        <span className="text-[10px] font-bold text-white">{number}</span>
      </div>
    )
  }

  // pending
  return (
    <div className={cn('w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0', cfg.circleBase)}>
      <span className="text-[10px] font-bold text-slate-400">{number}</span>
    </div>
  )
}

export default function KYCStepList({ steps, selectedId, onSelect }: KYCStepListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {steps.map((step, index) => {
        const isSelected = step.id === selectedId
        const isLocked = step.status === 'locked'
        const cfg = stepStatusConfig[step.status]
        const isLast = index === steps.length - 1

        return (
          <div key={step.id} className="relative">
            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[27px] top-[52px] w-px h-[calc(100%-36px)] z-0',
                  step.status === 'complete' ? 'bg-emerald-200' : 'bg-slate-150'
                )}
                style={{ backgroundColor: step.status === 'complete' ? '#a7f3d0' : '#e2e8f0' }}
              />
            )}

            <button
              onClick={() => !isLocked && onSelect(step.id)}
              disabled={isLocked}
              className={cn(
                'relative z-10 w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all',
                isSelected
                  ? cn('border-r-2', step.status === 'error'
                      ? 'border-red-500 bg-red-50/70'
                      : step.status === 'complete'
                        ? 'border-emerald-500 bg-emerald-50/60'
                        : step.status === 'active'
                          ? 'border-sky-500 bg-sky-50/60'
                          : 'border-slate-300 bg-slate-50')
                  : isLocked
                    ? 'cursor-not-allowed opacity-50 hover:bg-transparent'
                    : 'hover:bg-slate-50 cursor-pointer'
              )}
            >
              <StepIcon status={step.status} number={step.number} />

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn(
                    'text-xs font-bold truncate',
                    isLocked ? 'text-slate-300' : 'text-slate-800'
                  )}>
                    {step.title}
                  </p>
                </div>
                <p className={cn(
                  'text-[11px] truncate mt-0.5',
                  isLocked ? 'text-slate-300' : 'text-slate-500'
                )}>
                  {step.subtitle}
                </p>
                <p className={cn('text-[10px] font-semibold mt-1', cfg.labelColor)}>
                  {cfg.label}
                </p>
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}
