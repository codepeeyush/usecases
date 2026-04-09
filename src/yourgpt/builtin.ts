/**
 * YourGPT Built-in Handlers — Page Awareness
 *
 * Gives the AI chatbot full awareness of the current page without any
 * manual annotation required. Works via two complementary mechanisms:
 *
 * 1. PROACTIVE — syncPageContext(sdk)
 *    Call this on mount and on every route change. It pushes a structured
 *    snapshot of the current page into setSessionData so the AI always has
 *    fresh context before the user even asks.
 *
 * 2. REACTIVE — get_page_context AI action
 *    Register via useAIActions → registerActions(builtinHandlers).
 *    The AI calls this tool when it needs an up-to-date page snapshot mid-
 *    conversation (e.g. after a form changes or a panel loads).
 *
 * 3. AUTOMATIC — startPageObserver(sdk)
 *    Sets up a MutationObserver + history patch to re-sync context whenever
 *    the DOM changes or the SPA navigates. Call once on app mount.
 *
 * ─── Annotation (optional but powerful) ────────────────────────────────────
 * Add data-yourgpt-context to any element and its text will be prioritised:
 *
 *   <div data-yourgpt-context="error-message">Token expired — reconnect.</div>
 *   <section data-yourgpt-context="product-detail">Pro Plan · $49/mo</section>
 *
 * ───────────────────────────────────────────────────────────────────────────
 */

import type { AIActionHandler, YourGPTSDK } from '@yourgpt/widget-web-sdk/react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PageSnapshot {
  url: string
  path: string
  title: string
  /** Search params as a plain object */
  query: Record<string, string>
  /** Text from <h1> or first large heading found */
  heading: string
  /** Meta description or og:description */
  description: string
  /** Visible text capped at MAX_TEXT_CHARS — semantic elements prioritised */
  visibleText: string
  /** Elements annotated with data-yourgpt-context */
  annotated: { label: string; text: string }[]
  /** JSON-LD structured data found on the page */
  structuredData: unknown[]
  /** Active form fields and their current values */
  activeForm: { label: string; value: string; type: string }[]
  /** Visible error/alert messages */
  errors: string[]
  /** Element the user is currently focused on */
  focusedElement: string | null
  capturedAt: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_TEXT_CHARS = 2000
const OBSERVER_DEBOUNCE_MS = 800

// ---------------------------------------------------------------------------
// DOM extraction utilities
// ---------------------------------------------------------------------------

/** Safely read innerText from a selector. */
function getText(selector: string, root: Document | Element = document): string {
  return (root.querySelector(selector) as HTMLElement | null)?.innerText?.trim() ?? ''
}

/** Get all text nodes from semantic containers, capped at MAX_TEXT_CHARS. */
function extractVisibleText(): string {
  // Prefer semantic landmarks; fall back to body
  const containers = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '#content',
    'body',
  ]

  for (const sel of containers) {
    const el = document.querySelector(sel) as HTMLElement | null
    if (el) {
      // Strip script / style / noscript noise
      const clone = el.cloneNode(true) as HTMLElement
      clone.querySelectorAll('script, style, noscript, [aria-hidden="true"]').forEach((n) =>
        n.remove(),
      )
      const text = clone.innerText?.replace(/\s+/g, ' ').trim() ?? ''
      if (text.length > 50) return text.slice(0, MAX_TEXT_CHARS)
    }
  }
  return ''
}

/** Elements explicitly annotated for the AI. */
function extractAnnotated(): PageSnapshot['annotated'] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-yourgpt-context]'),
  ).map((el) => ({
    label: el.dataset.yourgptContext ?? 'context',
    text: el.innerText?.trim() ?? '',
  }))
}

/** Pull JSON-LD blocks from the page. */
function extractStructuredData(): unknown[] {
  return Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
  ).flatMap((el) => {
    try {
      return [JSON.parse(el.textContent ?? '')]
    } catch {
      return []
    }
  })
}

/** Meta description — tries og:description first, then standard. */
function extractDescription(): string {
  return (
    (
      document.querySelector<HTMLMetaElement>('meta[property="og:description"]') ??
      document.querySelector<HTMLMetaElement>('meta[name="description"]')
    )?.content?.trim() ?? ''
  )
}

/** Visible input/select/textarea fields with resolved labels. */
function extractActiveForm(): PageSnapshot['activeForm'] {
  const fields: PageSnapshot['activeForm'] = []

  document
    .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input:not([type="hidden"]):not([type="password"]), select, textarea',
    )
    .forEach((el) => {
      // Skip invisible elements
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) return

      // Resolve label text
      let label =
        (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim()) ||
        el.getAttribute('aria-label')?.trim() ||
        el.getAttribute('placeholder')?.trim() ||
        el.getAttribute('name') ||
        'unknown'

      fields.push({
        label,
        value: 'value' in el ? String(el.value) : '',
        type: el.tagName === 'SELECT' ? 'select' : (el as HTMLInputElement).type ?? 'text',
      })
    })

  return fields
}

/** Visible error / alert messages. */
function extractErrors(): string[] {
  const selectors = [
    '[role="alert"]',
    '[role="status"]',
    '.error',
    '.alert',
    '[data-error]',
    '[aria-live="assertive"]',
    '[aria-live="polite"]',
  ]

  const texts = new Set<string>()
  selectors.forEach((sel) => {
    document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      const t = el.innerText?.trim()
      if (t) texts.add(t)
    })
  })
  return Array.from(texts)
}

/** Describe what element the user is focused on. */
function extractFocusedElement(): string | null {
  const el = document.activeElement
  if (!el || el === document.body) return null

  const tag = el.tagName.toLowerCase()
  const label =
    el.getAttribute('aria-label') ??
    (el.id ? document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim() : null) ??
    el.getAttribute('placeholder') ??
    el.getAttribute('name') ??
    el.getAttribute('data-yourgpt-context') ??
    null

  return label ? `${tag}[${label}]` : tag
}

// ---------------------------------------------------------------------------
// Core snapshot function
// ---------------------------------------------------------------------------

/**
 * Build a full PageSnapshot from the live DOM.
 * Safe to call at any time — never throws.
 */
export function getPageSnapshot(): PageSnapshot {
  try {
    const params: Record<string, string> = {}
    new URLSearchParams(window.location.search).forEach((v, k) => {
      params[k] = v
    })

    return {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      query: params,
      heading:
        getText('h1') ||
        getText('h2') ||
        getText('[role="heading"][aria-level="1"]'),
      description: extractDescription(),
      visibleText: extractVisibleText(),
      annotated: extractAnnotated(),
      structuredData: extractStructuredData(),
      activeForm: extractActiveForm(),
      errors: extractErrors(),
      focusedElement: extractFocusedElement(),
      capturedAt: new Date().toISOString(),
    }
  } catch (err) {
    return {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      query: {},
      heading: '',
      description: '',
      visibleText: '',
      annotated: [],
      structuredData: [],
      activeForm: [],
      errors: [],
      focusedElement: null,
      capturedAt: new Date().toISOString(),
    }
  }
}

/** Serialise a snapshot to a concise string the AI can read. */
function snapshotToString(s: PageSnapshot): string {
  const lines: string[] = [
    `URL: ${s.url}`,
    `Title: ${s.title}`,
    s.heading ? `Heading: ${s.heading}` : '',
    s.description ? `Description: ${s.description}` : '',
    Object.keys(s.query).length
      ? `Query params: ${JSON.stringify(s.query)}`
      : '',
    s.errors.length ? `Visible errors:\n${s.errors.map((e) => `  • ${e}`).join('\n')}` : '',
    s.annotated.length
      ? `Annotated content:\n${s.annotated.map((a) => `  [${a.label}] ${a.text}`).join('\n')}`
      : '',
    s.activeForm.length
      ? `Form fields:\n${s.activeForm.map((f) => `  ${f.label} (${f.type}): ${f.value || '(empty)'}`).join('\n')}`
      : '',
    s.focusedElement ? `User is focused on: ${s.focusedElement}` : '',
    s.visibleText ? `Page content:\n${s.visibleText}` : '',
  ]

  return lines.filter(Boolean).join('\n')
}

// ---------------------------------------------------------------------------
// Proactive sync — push context into setSessionData
// ---------------------------------------------------------------------------

/**
 * Push the current page snapshot into YourGPT session data.
 * Call this:
 *   - on app mount
 *   - inside useEffect watching location.pathname (react-router)
 *
 * Example:
 *   const { sdk } = useYourGPT()
 *   useEffect(() => { if (sdk) syncPageContext(sdk) }, [sdk, location.pathname])
 */
export function syncPageContext(sdk: YourGPTSDK): void {
  const snapshot = getPageSnapshot()
  sdk.setSessionData({
    page_url: snapshot.url,
    page_path: snapshot.path,
    page_title: snapshot.title,
    page_heading: snapshot.heading,
    page_description: snapshot.description,
    page_errors: snapshot.errors,
    page_annotated: snapshot.annotated,
    page_form_fields: snapshot.activeForm,
    page_content_preview: snapshot.visibleText.slice(0, 500),
    page_synced_at: snapshot.capturedAt,
  })
}

// ---------------------------------------------------------------------------
// Automatic observer — re-sync on DOM change or SPA navigation
// ---------------------------------------------------------------------------

let _observerCleanup: (() => void) | null = null

/**
 * Start watching for DOM changes and SPA route transitions.
 * Calls syncPageContext automatically with debouncing.
 * Returns a cleanup function — call it on unmount.
 *
 * Example:
 *   const { sdk } = useYourGPT()
 *   useEffect(() => {
 *     if (!sdk) return
 *     return startPageObserver(sdk)
 *   }, [sdk])
 */
export function startPageObserver(sdk: YourGPTSDK): () => void {
  // Stop any existing observer
  _observerCleanup?.()

  let debounceTimer: ReturnType<typeof setTimeout>

  const sync = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => syncPageContext(sdk), OBSERVER_DEBOUNCE_MS)
  }

  // Watch for DOM mutations in the body
  const observer = new MutationObserver(sync)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: false, // too noisy — skip text node changes
    attributes: true,
    attributeFilter: ['data-yourgpt-context', 'aria-label', 'role'],
  })

  // Patch history API for SPA navigation (pushState / replaceState)
  const originalPush = history.pushState.bind(history)
  const originalReplace = history.replaceState.bind(history)

  history.pushState = (...args) => {
    originalPush(...args)
    sync()
  }
  history.replaceState = (...args) => {
    originalReplace(...args)
    sync()
  }

  window.addEventListener('popstate', sync)

  // Initial sync
  syncPageContext(sdk)

  _observerCleanup = () => {
    observer.disconnect()
    history.pushState = originalPush
    history.replaceState = originalReplace
    window.removeEventListener('popstate', sync)
    clearTimeout(debounceTimer)
  }

  return _observerCleanup
}

// ---------------------------------------------------------------------------
// Reactive AI action — get_page_context
// ---------------------------------------------------------------------------

/**
 * AI action: get_page_context
 *
 * The AI calls this when it needs an up-to-date snapshot mid-conversation.
 * No arguments required.
 *
 * Register in your chatbot AI actions config:
 *   Action name: get_page_context
 *   Description: Get the current page content, URL, heading, form state,
 *                errors, and annotated sections visible to the user.
 */
const getPageContextAction: AIActionHandler = (_data, helpers) => {
  const snapshot = getPageSnapshot()
  helpers.respond(snapshotToString(snapshot))
}

export const builtinHandlers: Record<string, AIActionHandler> = {
  get_page_context: getPageContextAction,
}

// ---------------------------------------------------------------------------
// Usage reference
// ---------------------------------------------------------------------------
//
// In your component:
//
//   import { useEffect } from 'react'
//   import { useLocation } from 'react-router-dom'
//   import { useYourGPT, useAIActions } from '@yourgpt/widget-web-sdk/react'
//   import { builtinHandlers, startPageObserver } from '@/yourgpt/builtin'
//
//   const { sdk } = useYourGPT()
//   const { registerActions } = useAIActions()
//   const location = useLocation()
//
//   // Register AI action so the bot can pull context on demand
//   useEffect(() => {
//     registerActions(builtinHandlers)
//   }, [])
//
//   // Auto-observe DOM + navigation (recommended)
//   useEffect(() => {
//     if (!sdk) return
//     return startPageObserver(sdk)
//   }, [sdk])
//
//   // Or manually sync on route change only
//   useEffect(() => {
//     if (sdk) syncPageContext(sdk)
//   }, [sdk, location.pathname])
