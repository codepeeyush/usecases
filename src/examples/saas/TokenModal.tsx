import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Integration } from './data'
import { IntegrationIcon } from './IntegrationList'

type Step = 'confirm' | 'generating' | 'ready' | 'saving' | 'done'

function generateFakeToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const seg = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `xoxb-${seg(10)}-${seg(10)}-${seg(24)}`
}

interface TokenModalProps {
  integration: Integration
  open: boolean
  onClose: () => void
  onSuccess: (newToken: string) => void
}

export default function TokenModal({ integration, open, onClose, onSuccess }: TokenModalProps) {
  const [step, setStep] = useState<Step>('confirm')
  const [newToken, setNewToken] = useState('')
  const [copied, setCopied] = useState(false)

  const handleClose = () => {
    onClose()
    setTimeout(() => { setStep('confirm'); setNewToken(''); setCopied(false) }, 300)
  }

  const handleGenerate = () => {
    setStep('generating')
    setTimeout(() => {
      const token = generateFakeToken()
      setNewToken(token)
      setStep('ready')
    }, 1600)
  }

  const handleSave = () => {
    setStep('saving')
    setTimeout(() => {
      setStep('done')
      setTimeout(() => {
        onSuccess(newToken)
        handleClose()
      }, 1200)
    }, 1800)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(newToken).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden border border-slate-200"
        style={{ fontFamily: "'Plus Jakarta Sans Variable', sans-serif" }}
      >
        <DialogTitle className="sr-only">Regenerate Access Token — {integration.name}</DialogTitle>

        {/* Modal header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <IntegrationIcon id={integration.id} className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Regenerate Access Token</h2>
            <p className="text-xs text-slate-500">{integration.name} · OAuth Bot Token</p>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Step: confirm */}
          {(step === 'confirm') && (
            <>
              {/* Current bad token */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Token</p>
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <svg className="w-3.5 h-3.5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
                  </svg>
                  <code className="text-xs font-mono text-red-700 flex-1 truncate">{integration.botToken}</code>
                  <span className="text-[10px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded shrink-0">Invalid</span>
                </div>
                <p className="text-[11px] text-red-600">{integration.errorMessage}</p>
              </div>

              {/* What happens */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">What happens next</p>
                {[
                  'Current token is revoked from Slack',
                  'A new Bot Token is generated',
                  'Nexus reconnects and tests the connection',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[9px] font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-[11px] text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-amber-600 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
                </svg>
                Any active Slack workflows using the old token will need to be updated.
              </p>
            </>
          )}

          {/* Step: generating */}
          {step === 'generating' && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="relative w-12 h-12">
                <svg className="animate-spin w-12 h-12 text-slate-200" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                </svg>
                <svg className="animate-spin w-12 h-12 text-[#0369A1] absolute inset-0" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Generating new token…</p>
                <p className="text-xs text-slate-400 mt-1">Revoking old credentials and requesting new OAuth token</p>
              </div>
            </div>
          )}

          {/* Step: ready — show new token */}
          {step === 'ready' && (
            <>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd"/>
                </svg>
                <p className="text-xs font-bold text-emerald-700 flex-1">New token generated</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Bot Token</p>
                <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-3 py-3">
                  <code className="text-xs font-mono text-emerald-300 flex-1 break-all leading-relaxed">{newToken}</code>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'shrink-0 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer',
                      copied
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    )}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-amber-600 flex items-center gap-1.5">
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
                  </svg>
                  Save this token — it won't be shown again
                </p>
              </div>
            </>
          )}

          {/* Step: saving */}
          {step === 'saving' && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="relative w-12 h-12">
                <svg className="animate-spin w-12 h-12 text-slate-200" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                </svg>
                <svg className="animate-spin w-12 h-12 text-emerald-500 absolute inset-0" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Reconnecting to Slack…</p>
                <p className="text-xs text-slate-400 mt-1">Saving token and verifying connection</p>
              </div>
            </div>
          )}

          {/* Step: done */}
          {step === 'done' && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-emerald-700">Slack reconnected!</p>
                <p className="text-xs text-slate-400 mt-1">Integration is now active</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(step === 'confirm' || step === 'ready') && (
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center gap-2.5 bg-slate-50/60">
            {step === 'confirm' && (
              <>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Generate New Token
                </button>
              </>
            )}
            {step === 'ready' && (
              <>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd"/>
                  </svg>
                  Save & Reconnect
                </button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
