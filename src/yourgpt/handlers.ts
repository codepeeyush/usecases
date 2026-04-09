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

export const ecommerceHandlers: Record<string, AIActionHandler> = {
  add_to_cart: addToCart,
  apply_coupon: applyCoupon,
}

// ---------------------------------------------------------------------------
// Fintech / KYC — Help Me Complete This Safely
// ---------------------------------------------------------------------------

/**
 * Trigger the identity verification flow.
 * Expected args: { document_type: string }
 */
const verifyIdentity: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { document_type } = parseArgs<{ document_type: string }>(data)

  const confirmed = await helpers.confirm({
    title: 'Start identity verification?',
    description: `You'll be guided through uploading your ${document_type}. This is encrypted and secure.`,
    acceptLabel: 'Start',
    rejectLabel: 'Not now',
  })

  if (!confirmed) {
    helpers.respond('No problem — you can start verification whenever you\'re ready.')
    return
  }

  // TODO: open your KYC flow / redirect
  helpers.respond('Identity verification started. Follow the steps in the panel to complete.')
}

/**
 * Submit a document for KYC review.
 * Expected args: { document_type: string; document_url?: string }
 */
const submitDocument: AIActionHandler = (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { document_type } = parseArgs<{ document_type: string; document_url?: string }>(data)

  // TODO: trigger document submission to your backend
  helpers.respond(
    `Your ${document_type} has been submitted for review. We'll notify you within 1–2 business days.`,
  )
}

export const fintechHandlers: Record<string, AIActionHandler> = {
  verify_identity: verifyIdentity,
  submit_document: submitDocument,
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
