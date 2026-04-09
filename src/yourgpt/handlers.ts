/**
 * YourGPT Handlers
 *
 * AI Action handlers and widget event handlers for each use-case example.
 * Register actions via the useAIActions hook:
 *
 *   const { registerActions } = useAIActions()
 *   useEffect(() => { registerActions(saasHandlers) }, [])
 *
 * Register widget events via the useYourGPT hook:
 *
 *   const { sdk } = useYourGPT()
 *   useEffect(() => sdk?.onMessageReceived(onMessageReceived), [sdk])
 */

import type {
  AIActionHandler,
  AIActionData,
  AIActionHelpers,
  MessageData,
  EscalationData,
} from '@yourgpt/widget-web-sdk/react'
import { YourGPT } from '@yourgpt/widget-web-sdk'
import { products as allProducts } from '@/examples/ecommerce/data'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse JSON arguments from an AI action safely. */
function parseArgs<T = Record<string, unknown>>(data: AIActionData): T {
  try {
    return JSON.parse(data.action.tool?.function?.arguments ?? '{}') as T
  } catch {
    return {} as T
  }
}

// ---------------------------------------------------------------------------
// SaaS / B2B — Fix & Guide Me Instantly
// ---------------------------------------------------------------------------

/**
 * Reconnect a failing integration (e.g. Slack token expired).
 * Expected args: { integration_id: string }
 */
const reconnectIntegration: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { integration_id } = parseArgs<{ integration_id: string }>(data)

  const confirmed = await helpers.confirm({
    title: `Reconnect ${integration_id}?`,
    description: 'This will re-authenticate and refresh the token for this integration.',
    acceptLabel: 'Reconnect',
    rejectLabel: 'Cancel',
  })

  if (!confirmed) {
    helpers.respond('Reconnection cancelled.')
    return
  }

  // TODO: call your integration reconnect API here
  helpers.respond(
    `Reconnecting ${integration_id}… The token has been refreshed. It may take a few seconds to sync.`,
  )
}

/**
 * Return the current status of an integration.
 * Expected args: { integration_id: string }
 */
const getIntegrationStatus: AIActionHandler = (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { integration_id } = parseArgs<{ integration_id: string }>(data)

  // TODO: look up real integration state from your store
  helpers.respond(
    `The current status of ${integration_id} has been fetched and shared above.`,
  )
}

export const saasHandlers: Record<string, AIActionHandler> = {
  reconnect_integration: reconnectIntegration,
  get_integration_status: getIntegrationStatus,
}

// ---------------------------------------------------------------------------
// E-commerce — Help Me Decide & Finish
// ---------------------------------------------------------------------------

/**
 * Add a product to the cart.
 * Expected args: { product_id: string; quantity?: number }
 */
const addToCart: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { product_id, quantity = 1 } = parseArgs<{
    product_id: string
    quantity?: number
  }>(data)

  const confirmed = await helpers.confirm({
    title: 'Add to cart?',
    description: `Add ${quantity}× ${product_id} to your cart?`,
    acceptLabel: 'Add',
    rejectLabel: 'Cancel',
  })

  if (!confirmed) {
    helpers.respond('No problem — nothing was added to your cart.')
    return
  }

  // TODO: call your cart API here
  helpers.respond(`Added ${quantity}× ${product_id} to your cart!`)
}

/**
 * Apply a coupon / discount code to the current order.
 * Expected args: { code: string }
 */
const applyCoupon: AIActionHandler = (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { code } = parseArgs<{ code: string }>(data)

  // TODO: validate and apply coupon via your API
  helpers.respond(`Coupon "${code}" applied! Your discount has been reflected in the cart.`)
}

/**
 * Compare products in a category and recommend the best one.
 * Uses page-aware data (products array) to build a live comparison.
 * Expected args: { category?: string }  — defaults to 'Headphones'
 */
const compareProducts: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { category = 'Headphones' } = parseArgs<{ category?: string }>(data)

  const items = allProducts.filter((p) => p.category === category)

  if (items.length === 0) {
    helpers.respond(`No products found for category "${category}".`)
    return
  }

  // Close widget so the full-page overlay animation is unobstructed
  YourGPT.getInstance()?.close()

  // Notify the page UI to show the scanning overlay
  window.dispatchEvent(new CustomEvent('ygpt:compare', {
    detail: { products: items, phase: 'start' },
  }))

  // Simulate AI analysis time
  await new Promise<void>((r) => setTimeout(r, 4500))

  // Build comparison response
  const available = [...items]
    .filter((p) => p.stock !== 'out_of_stock')
    .sort((a, b) => b.rating - a.rating)
  const top = available[0]

  const lines: string[] = [
    `Here's my comparison of the **${items.length} ${category}** currently in the store:\n`,
  ]

  for (const p of items) {
    const discountNote = p.originalPrice
      ? ` — ~~$${p.originalPrice}~~ **${Math.round((1 - p.price / p.originalPrice) * 100)}% off**`
      : ''
    const stockNote =
      p.stock === 'out_of_stock' ? ' *(out of stock)*'
      : p.stock === 'low_stock' ? ' *(low stock — hurry!)*'
      : ''
    lines.push(
      `**${p.name}** by ${p.brand} — **$${p.price}**${discountNote}${stockNote}\n` +
      `⭐ ${p.rating}/5 · ${p.description.split('.')[0]}.`
    )
  }

  if (top) {
    const savingsNote = top.originalPrice
      ? `, currently **${Math.round((1 - top.price / top.originalPrice) * 100)}% off** (was $${top.originalPrice})`
      : ''
    lines.push(
      `\n✅ **My recommendation: ${top.name}**\n` +
      `Best overall rating (${top.rating}/5) at **$${top.price}**${savingsNote}. ` +
      `${available.length < items.length ? 'Some options are currently out of stock.' : 'All options are available to order now.'}`
    )
  }

  helpers.respond(lines.join('\n\n'))

  // Signal overlay to transition to done state
  window.dispatchEvent(new CustomEvent('ygpt:compare', {
    detail: { products: items, phase: 'done' },
  }))

  // Reopen widget so user sees the recommendation
  YourGPT.getInstance()?.open()
}

export const ecommerceHandlers: Record<string, AIActionHandler> = {
  add_to_cart: addToCart,
  apply_coupon: applyCoupon,
  compare_products: compareProducts,
}

// ---------------------------------------------------------------------------
// Fintech / Compliance — Help Me Complete This Safely
// ---------------------------------------------------------------------------

interface ComplianceError {
  field: string
  error: string
  field_id?: string
  fixable?: boolean
  suggested_value?: string
}

/**
 * Explain why the user is failing compliance checks.
 * Reads compliance_errors from session data and returns a clear breakdown.
 */
const explainComplianceErrors: AIActionHandler = (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const errors: ComplianceError[] = data.session_data?.compliance_errors ?? []
  const step: string = data.session_data?.current_step ?? 'unknown'

  if (!errors.length) {
    helpers.respond(
      "No errors detected yet. Fill in all the fields and click **Submit for Verification** — if anything doesn't pass, I'll explain exactly what needs to be fixed and can auto-correct the issues for you.",
    )
    return
  }

  const lines: string[] = [
    `Here's what's blocking your **${step === 'signatory' ? 'identity verification' : step}** step:\n`,
  ]

  errors.forEach((e, i) => {
    lines.push(`**${i + 1}. ${e.field}**`)
    lines.push(e.error)
    if (e.fixable && e.suggested_value) {
      lines.push(`→ I can fix this automatically — the correct value is \`${e.suggested_value}\`. Say "fix my ${e.field.toLowerCase()}" or "fix all errors" to apply it.`)
    } else {
      lines.push(`→ This needs to be corrected manually — check the exact value on your physical document.`)
    }
    lines.push('')
  })

  const fixableCount = errors.filter(e => e.fixable).length
  if (fixableCount > 0) {
    lines.push(
      fixableCount === errors.length
        ? `I can fix all ${fixableCount} issue${fixableCount > 1 ? 's' : ''} automatically. Say **"fix all my errors"** and I'll apply the corrections in one go.`
        : `I can automatically correct ${fixableCount} of these — say **"fix all errors"** to apply the auto-fixes.`,
    )
  }

  helpers.respond(lines.join('\n'))
}

/**
 * Auto-fix one or all compliance fields.
 * Expected args: { field_id?: string } — omit or pass "all" to fix everything fixable.
 * Dispatches ygpt:fintech:fix_field for each corrected field.
 */
const fixComplianceField: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { field_id } = parseArgs<{ field_id?: string }>(data)
  const errors: ComplianceError[] = data.session_data?.compliance_errors ?? []

  if (!errors.length) {
    helpers.respond(
      "There are no active errors to fix. Submit the form first — if any fields fail validation I'll be able to correct them for you.",
    )
    return
  }

  // "all" or no field_id → fix everything fixable; otherwise fix the named field
  const fixAll = !field_id || field_id === 'all'
  const targets = fixAll
    ? errors.filter(e => e.fixable && e.suggested_value)
    : errors.filter(e => e.field_id === field_id && e.fixable && e.suggested_value)

  if (targets.length === 0) {
    const unfixable = errors.find(e => e.field_id === field_id)
    helpers.respond(
      unfixable
        ? `I can't automatically fix **${unfixable.field}** — this needs to be corrected manually by checking your document.`
        : "I couldn't find that field in the current errors. Try asking me to fix all errors instead.",
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

  for (const t of targets) {
    window.dispatchEvent(
      new CustomEvent('ygpt:fintech:fix_field', {
        detail: { field_id: t.field_id, value: t.suggested_value },
      }),
    )
  }

  const fixedList = targets.map(t => `**${t.field}** → \`${t.suggested_value}\``).join(', ')
  const remaining = errors.filter(e => !targets.find(t => t.field_id === e.field_id))

  helpers.respond(
    remaining.length === 0
      ? `All done! Fixed: ${fixedList}. Click **"Retry Verification"** — everything should pass now.`
      : `Fixed: ${fixedList}. The remaining field${remaining.length > 1 ? 's' : ''} (${remaining.map(e => e.field).join(', ')}) need${remaining.length === 1 ? 's' : ''} manual correction. Then click **"Retry Verification"**.`,
  )
}

/**
 * Explain a specific compliance field in plain language.
 * Expected args: { field_name: string }
 */
const explainField: AIActionHandler = (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { field_name } = parseArgs<{ field_name: string }>(data)

  const explanations: Record<string, string> = {
    'tax id': '**Tax Identification Number (Tax ID)** is a government-issued number used to identify your business for tax purposes.\n\n- 🇺🇸 **EIN** (US): Format `XX-XXXXXXX`, issued by the IRS\n- 🇪🇺 **VAT** (EU): Format `XXXXXXXXXXXX`, issued by your national tax authority\n- 🇦🇺 **ABN** (Australia): 11-digit number, issued by the ATO\n- 🇬🇧 **CRN** (UK): 8-character company registration number\n\nIf your business is below the tax registration threshold in your country, you can skip this field for now.',
    'government id': '**Government ID Number** is the unique identifier on your passport, driver\'s license, or national ID card.\n\n- Must be current and not expired\n- Enter digits only — no spaces, hyphens, or special characters\n- Accepted: Passport, Driver\'s License, National ID card\n\nExample: `DL48291234` (not `DL-4829X1`)',
    'date of birth': '**Date of Birth** must exactly match the date printed on your government-issued ID document.\n\n- Use the format `MM/DD/YYYY`\n- If your passport shows `14 SEP 1991`, enter `09/14/1991`\n- The date on your driver\'s license and passport may differ — use whichever document you submitted as your Government ID',
    'iban': '**IBAN (International Bank Account Number)** is a standardised format used by banks globally.\n\n- Starts with a 2-letter country code (e.g. `DE`, `FR`, `GB`)\n- Followed by 2 check digits\n- Then your bank account details\n\nExample: `GB29NWBK60161331926819`. Found on your bank statement or online banking portal.',
    'swift': '**SWIFT / BIC code** identifies your specific bank branch internationally.\n\n- 8 or 11 characters long\n- Format: Bank code (4) + Country code (2) + Location code (2) + optional branch (3)\n\nExample: `CHASUS33` (JPMorgan Chase, US). Found on international wire transfer forms from your bank.',
    'routing': '**Routing Number** (US) or **Sort Code** (UK) identifies your bank branch for domestic transfers.\n\n- 🇺🇸 US Routing: 9-digit number printed at the bottom-left of your cheque\n- 🇬🇧 UK Sort Code: 6-digit number in format `XX-XX-XX`\n\nFor international transfers, use the SWIFT/BIC code instead.',
  }

  const key = Object.keys(explanations).find(k =>
    field_name.toLowerCase().includes(k),
  )

  if (key) {
    helpers.respond(explanations[key])
  } else {
    helpers.respond(
      `I don't have a specific explanation for **${field_name}** yet, but here's the general rule: enter the value exactly as it appears on your official documents, without special characters or extra spaces. If you're still unsure, check the hint text beneath the field or share the exact error message with me.`,
    )
  }
}

export const fintechHandlers: Record<string, AIActionHandler> = {
  explain_compliance_errors: explainComplianceErrors,
  fix_compliance_field: fixComplianceField,
  explain_field: explainField,
}

// ---------------------------------------------------------------------------
// Admin Panels — Do This For Me
// ---------------------------------------------------------------------------

/**
 * Generate and download a report.
 * Expected args: { report_type: string; date_range?: string }
 */
const runReport: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { report_type, date_range = 'last 30 days' } = parseArgs<{
    report_type: string
    date_range?: string
  }>(data)

  const confirmed = await helpers.confirm({
    title: `Generate ${report_type} report?`,
    description: `This will export data for ${date_range}.`,
    acceptLabel: 'Generate',
    rejectLabel: 'Cancel',
  })

  if (!confirmed) {
    helpers.respond('Report generation cancelled.')
    return
  }

  // TODO: call your report generation API and trigger download
  helpers.respond(
    `Your ${report_type} report for ${date_range} is being generated. It will download shortly.`,
  )
}

/**
 * Perform a bulk action on selected records.
 * Expected args: { action: string; record_ids: string[] }
 */
const bulkAction: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { action, record_ids = [] } = parseArgs<{
    action: string
    record_ids: string[]
  }>(data)

  const confirmed = await helpers.confirm({
    title: `${action} ${record_ids.length} records?`,
    description: 'This action will be applied to all selected records.',
    acceptLabel: 'Confirm',
    rejectLabel: 'Cancel',
  })

  if (!confirmed) {
    helpers.respond('Bulk action cancelled.')
    return
  }

  // TODO: call your bulk action API here
  helpers.respond(`Done — "${action}" applied to ${record_ids.length} records.`)
}

export const adminHandlers: Record<string, AIActionHandler> = {
  run_report: runReport,
  bulk_action: bulkAction,
}

// ---------------------------------------------------------------------------
// EdTech — Explain What I'm Looking At
// ---------------------------------------------------------------------------

/**
 * Explain a concept in plain language.
 * Expected args: { concept: string; level?: 'beginner' | 'intermediate' | 'advanced' }
 */
const explainConcept: AIActionHandler = (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { concept, level = 'beginner' } = parseArgs<{
    concept: string
    level?: string
  }>(data)

  // TODO: fetch explanation from your content API or pass context to the AI
  helpers.respond(
    `Here's a ${level}-level explanation of "${concept}" — check the panel above for the full breakdown.`,
  )
}

/**
 * Start a quiz on a given topic.
 * Expected args: { topic: string; question_count?: number }
 */
const startQuiz: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { topic, question_count = 5 } = parseArgs<{
    topic: string
    question_count?: number
  }>(data)

  const confirmed = await helpers.confirm({
    title: `Start a quiz on "${topic}"?`,
    description: `${question_count} questions, multiple choice. Ready?`,
    acceptLabel: 'Let\'s go',
    rejectLabel: 'Not now',
  })

  if (!confirmed) {
    helpers.respond('No problem — start the quiz whenever you\'re ready.')
    return
  }

  // TODO: launch your quiz flow
  helpers.respond(`Quiz started! Good luck with "${topic}".`)
}

export const edtechHandlers: Record<string, AIActionHandler> = {
  explain_concept: explainConcept,
  start_quiz: startQuiz,
}

// ---------------------------------------------------------------------------
// All handlers combined (register everything at once if needed)
// ---------------------------------------------------------------------------

export const allHandlers: Record<string, AIActionHandler> = {
  ...saasHandlers,
  ...ecommerceHandlers,
  ...fintechHandlers,
  ...adminHandlers,
  ...edtechHandlers,
}

// ---------------------------------------------------------------------------
// Widget event handlers
// ---------------------------------------------------------------------------

/** Called once the widget finishes loading and is ready. */
export const onWidgetInit = (): void => {
  console.log('[YourGPT] Widget initialized')
}

/** Called when the bot or agent sends a message. */
export const onMessageReceived = (message: MessageData): void => {
  console.log('[YourGPT] Message received:', message)
  // TODO: sync message to your analytics, notification system, etc.
}

/** Called when the conversation is escalated to a human agent. */
export const onEscalatedToHuman = (escalation: EscalationData): void => {
  console.log('[YourGPT] Escalated to human:', escalation)
  // TODO: notify your support team, open a ticket, etc.
}

/** Called when the widget is opened or closed. */
export const onWidgetPopup = (isOpen: boolean): void => {
  console.log('[YourGPT] Widget popup:', isOpen ? 'opened' : 'closed')
  // TODO: pause video/audio, track engagement, etc.
}
