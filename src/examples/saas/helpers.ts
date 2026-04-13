/**
 * Generic DOM manipulation utilities + self-registering hook.
 *
 * Two exports:
 *   1. Individual DOM helpers (clickButtonByText, typeIntoField, …)
 *   2. `useDomHandlers()` — call once in your component; registers all DOM
 *      action handlers directly via useAIActions from the YourGPT SDK.
 *
 * Usage:
 *   import { useDomHandlers } from './helpers'
 *   // inside your component:
 *   useDomHandlers()
 */

import { useEffect } from 'react'
import { useAIActions } from '@yourgpt/widget-web-sdk/react'
import type { AIActionHandler, AIActionData } from '@yourgpt/widget-web-sdk/react'

// ─── Arg parser (same pattern used across all examples) ──────────────────────

function parseArgs<T = Record<string, unknown>>(data: AIActionData): T {
  try {
    return JSON.parse(data.action?.tool?.function?.arguments ?? '{}') as T
  } catch {
    return {} as T
  }
}

// Generic DOM manipulation utilities for AI action handlers.
// Pure DOM — no React imports, no example-specific logic.
// All click functions return true if the element was found and clicked, false otherwise.

// ─── Internal ────────────────────────────────────────────────────────────────

function isVisible(el: Element): boolean {
  const style = window.getComputedStyle(el)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    (el as HTMLElement).offsetParent !== null
  )
}

function textMatches(el: Element, text: string): boolean {
  return el.textContent?.trim().toLowerCase() === text.trim().toLowerCase()
}

function dispatchClick(el: Element): boolean {
  ;(el as HTMLElement).focus()
  ;(el as HTMLElement).click()
  return true
}

// ─── Core Click Utilities ─────────────────────────────────────────────────────

/** Click the first element matching a CSS selector. */
export function clickElement(selector: string): boolean {
  const el = document.querySelector(selector)
  if (!el || !isVisible(el)) return false
  return dispatchClick(el)
}

/** Find the first visible element whose full text content matches, optionally filtered by tag name. */
export function findByText(text: string, tag?: string): Element | null {
  const selector = tag ?? '*'
  const candidates = Array.from(document.querySelectorAll(selector))
  return (
    candidates.find(
      (el) =>
        isVisible(el) &&
        textMatches(el, text) &&
        // Prefer leaf-ish nodes: skip elements that contain other matching children
        !Array.from(el.children).some((child) => textMatches(child, text))
    ) ?? null
  )
}

/** Click the first visible element whose text content matches. Optionally restrict to a tag. */
export function clickByText(text: string, tag?: string): boolean {
  const el = findByText(text, tag)
  if (!el) return false
  return dispatchClick(el)
}

/** Click a <button> or [role="button"] whose text matches. */
export function clickButtonByText(text: string): boolean {
  const candidates = [
    ...Array.from(document.querySelectorAll('button')),
    ...Array.from(document.querySelectorAll('[role="button"]')),
  ]
  const el = candidates.find((el) => isVisible(el) && textMatches(el, text))
  if (!el) return false
  return dispatchClick(el)
}

/** Click an <a> whose text matches. */
export function clickLinkByText(text: string): boolean {
  const el = Array.from(document.querySelectorAll('a')).find(
    (el) => isVisible(el) && textMatches(el, text)
  )
  if (!el) return false
  return dispatchClick(el)
}

// ─── Semantic / ARIA Utilities ────────────────────────────────────────────────

/**
 * Click an element by ARIA role.
 * If `name` is provided, filters by aria-label, aria-labelledby text, or text content.
 */
export function clickByRole(role: string, name?: string): boolean {
  const candidates = Array.from(document.querySelectorAll(`[role="${role}"]`))
  const el = candidates.find((el) => {
    if (!isVisible(el)) return false
    if (!name) return true
    const label = el.getAttribute('aria-label') ?? el.textContent?.trim() ?? ''
    return label.toLowerCase().includes(name.toLowerCase())
  })
  if (!el) return false
  return dispatchClick(el)
}

/** Click a tab by its label text. Searches [role="tab"] and common tab button patterns. */
export function clickTab(label: string): boolean {
  const tabs = Array.from(
    document.querySelectorAll('[role="tab"], [data-tab], .tab, [class*="tab"]')
  )
  const el = tabs.find((el) => isVisible(el) && textMatches(el, label))
  if (el) return dispatchClick(el)
  // Fallback: any button inside a tab-list-like container
  return clickButtonByText(label)
}

/** Click a nav item by label. Searches inside <nav> and [role="navigation"] first. */
export function clickNavItem(label: string): boolean {
  const navContainers = [
    ...Array.from(document.querySelectorAll('nav')),
    ...Array.from(document.querySelectorAll('[role="navigation"]')),
  ]
  for (const nav of navContainers) {
    const candidates = Array.from(nav.querySelectorAll('a, button, [role="menuitem"]'))
    const el = candidates.find((el) => isVisible(el) && textMatches(el, label))
    if (el) return dispatchClick(el)
  }
  // Fallback: search globally
  return clickButtonByText(label) || clickLinkByText(label)
}

// ─── List & Form Utilities ────────────────────────────────────────────────────

/** Click a list item containing the given text. Searches [role="listitem"], <li>, <tr>. */
export function clickListItem(text: string): boolean {
  const candidates = Array.from(
    document.querySelectorAll('[role="listitem"], li, tr, [role="option"]')
  )
  const el = candidates.find(
    (el) =>
      isVisible(el) &&
      el.textContent?.toLowerCase().includes(text.trim().toLowerCase())
  )
  if (!el) return false
  // If the item has an inner button or link, prefer clicking that
  const inner = el.querySelector('button, a, [role="button"]') as HTMLElement | null
  return dispatchClick(inner ?? el)
}

/**
 * Type a value into an input or textarea, triggering React's synthetic events.
 * Uses the native value setter so React's onChange fires correctly.
 */
export function typeIntoField(selector: string, value: string): boolean {
  const el = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | null
  if (!el || !isVisible(el)) return false

  const nativeInputSetter =
    Object.getOwnPropertyDescriptor(
      el instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype,
      'value'
    )?.set

  if (nativeInputSetter) {
    nativeInputSetter.call(el, value)
  } else {
    el.value = value
  }

  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

/** Set a <select> element's value and fire the change event. */
export function selectOption(selector: string, value: string): boolean {
  const el = document.querySelector(selector) as HTMLSelectElement | null
  if (!el || !isVisible(el)) return false
  el.value = value
  el.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

/**
 * Fill a form field by finding its <label> text, then targeting the associated input.
 * Supports both `for`/`htmlFor` and wrapper-label patterns.
 */
export function fillField(labelText: string, value: string): boolean {
  const labels = Array.from(document.querySelectorAll('label'))
  const label = labels.find(
    (l) => l.textContent?.trim().toLowerCase().includes(labelText.trim().toLowerCase())
  )
  if (!label) return false

  // Explicit association via `for` attribute
  if (label.htmlFor) {
    return typeIntoField(`#${label.htmlFor}`, value)
  }

  // Implicit association: input nested inside label
  const input = label.querySelector('input, textarea, select')
  if (input) {
    const tag = input.tagName.toLowerCase()
    if (tag === 'select') {
      return selectOption(`#${(input as HTMLElement).id || ''}` || '', value)
    }
    return typeIntoField(
      (input as HTMLElement).id ? `#${(input as HTMLElement).id}` : '',
      value
    ) || (() => {
      // Last resort: use the element reference directly via a temp id
      const tempId = `__helpers_tmp_${Date.now()}`
      ;(input as HTMLElement).id = tempId
      const result = typeIntoField(`#${tempId}`, value)
      ;(input as HTMLElement).removeAttribute('id')
      return result
    })()
  }

  return false
}

// ─── Data Attribute Utilities ─────────────────────────────────────────────────

/**
 * Click an element by data attribute.
 * `clickByDataAttr('nav', 'integrations')` → clicks `[data-nav="integrations"]`
 * `clickByDataAttr('action')` → clicks the first `[data-action]` element
 */
export function clickByDataAttr(attr: string, value?: string): boolean {
  const selector = value ? `[data-${attr}="${value}"]` : `[data-${attr}]`
  return clickElement(selector)
}

// ─── AI Action Handlers ───────────────────────────────────────────────────────

const handlers: Record<string, AIActionHandler> = {
  click_element: (data, helpers) => {
    const { selector } = parseArgs<{ selector: string }>(data)
    const ok = clickElement(selector)
    helpers.respond(ok ? `Clicked element matching \`${selector}\`.` : `No visible element found for selector \`${selector}\`.`)
  },

  click_button: (data, helpers) => {
    const { text } = parseArgs<{ text: string }>(data)
    const ok = clickButtonByText(text)
    helpers.respond(ok ? `Clicked button "${text}".` : `No visible button with text "${text}" found.`)
  },

  click_link: (data, helpers) => {
    const { text } = parseArgs<{ text: string }>(data)
    const ok = clickLinkByText(text)
    helpers.respond(ok ? `Clicked link "${text}".` : `No visible link with text "${text}" found.`)
  },

  click_nav_item: (data, helpers) => {
    const { label } = parseArgs<{ label: string }>(data)
    const ok = clickNavItem(label)
    helpers.respond(ok ? `Navigated to "${label}".` : `Nav item "${label}" not found.`)
  },

  click_tab: (data, helpers) => {
    const { label } = parseArgs<{ label: string }>(data)
    const ok = clickTab(label)
    helpers.respond(ok ? `Switched to tab "${label}".` : `Tab "${label}" not found.`)
  },

  click_list_item: (data, helpers) => {
    const { text } = parseArgs<{ text: string }>(data)
    const ok = clickListItem(text)
    helpers.respond(ok ? `Selected list item containing "${text}".` : `No list item containing "${text}" found.`)
  },

  click_by_text: (data, helpers) => {
    const { text, tag } = parseArgs<{ text: string; tag?: string }>(data)
    const ok = clickByText(text, tag)
    helpers.respond(ok ? `Clicked element with text "${text}".` : `No visible element with text "${text}" found.`)
  },

  click_by_role: (data, helpers) => {
    const { role, name } = parseArgs<{ role: string; name?: string }>(data)
    const ok = clickByRole(role, name)
    helpers.respond(ok ? `Clicked [role="${role}"]${name ? ` named "${name}"` : ''}.` : `No visible element with role "${role}"${name ? ` and name "${name}"` : ''} found.`)
  },

  click_by_data_attr: (data, helpers) => {
    const { attr, value } = parseArgs<{ attr: string; value?: string }>(data)
    const ok = clickByDataAttr(attr, value)
    helpers.respond(ok ? `Clicked [data-${attr}${value ? `="${value}"` : ''}].` : `No element with data-${attr}${value ? `="${value}"` : ''} found.`)
  },

  type_into_field: (data, helpers) => {
    const { selector, value } = parseArgs<{ selector: string; value: string }>(data)
    const ok = typeIntoField(selector, value)
    helpers.respond(ok ? `Typed into \`${selector}\`.` : `Field \`${selector}\` not found or not visible.`)
  },

  fill_field: (data, helpers) => {
    const { label, value } = parseArgs<{ label: string; value: string }>(data)
    const ok = fillField(label, value)
    helpers.respond(ok ? `Filled "${label}" with the provided value.` : `No form field with label "${label}" found.`)
  },

  select_option: (data, helpers) => {
    const { selector, value } = parseArgs<{ selector: string; value: string }>(data)
    const ok = selectOption(selector, value)
    helpers.respond(ok ? `Selected "${value}" in \`${selector}\`.` : `Select element \`${selector}\` not found.`)
  },
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Register all DOM manipulation handlers with the YourGPT SDK.
 * Call once inside any component — no arguments needed.
 *
 *   import { useDomHandlers } from './helpers'
 *   // inside your component:
 *   useDomHandlers()
 */
export function useDomHandlers(): void {
  const { registerActions } = useAIActions()
  useEffect(() => {
    registerActions(handlers)
    return () => {
      registerActions({})
    }
  }, [registerActions])
}
