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
import { products as allProducts, type StockStatus, type Product } from '@/examples/ecommerce/data'

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
// SaaS / B2B — Tool Chain (get status → diagnose → fix → verify)
// ---------------------------------------------------------------------------
//
// NOTE: Real implementations are registered inside SaasExample (index.tsx)
// via useAIActions() because they need live React state.
// These stubs are kept for documentation and server-side usage patterns.

const getIntegrationStatus: AIActionHandler = (data: AIActionData, helpers: AIActionHelpers) => {
  const { integration_id } = parseArgs<{ integration_id?: string }>(data)
  helpers.respond(`Status check for ${integration_id ?? 'all integrations'} — handled by component-registered action.`)
}

const diagnoseIntegration: AIActionHandler = (data: AIActionData, helpers: AIActionHelpers) => {
  const { integration_id } = parseArgs<{ integration_id: string }>(data)
  helpers.respond(`Diagnosis stub for "${integration_id}" — handled by component-registered action.`)
}

const fixIntegration: AIActionHandler = (data: AIActionData, helpers: AIActionHelpers) => {
  const { integration_id } = parseArgs<{ integration_id: string }>(data)
  helpers.respond(`Fix stub for "${integration_id}" — handled by component-registered action.`)
}

const verifyIntegration: AIActionHandler = (data: AIActionData, helpers: AIActionHelpers) => {
  const { integration_id } = parseArgs<{ integration_id: string }>(data)
  helpers.respond(`Verify stub for "${integration_id}" — handled by component-registered action.`)
}

export const saasHandlers: Record<string, AIActionHandler> = {
  get_integration_status: getIntegrationStatus,
  diagnose_integration:   diagnoseIntegration,
  fix_integration:        fixIntegration,
  verify_integration:     verifyIntegration,
}

// ---------------------------------------------------------------------------
// E-commerce — Help Me Decide & Finish
// ---------------------------------------------------------------------------
// All handlers share a set of internal logic functions so they can chain
// into one another without duplicating code. Each handler uses
// helpers.confirm() at key decision points to keep the user in the loop.
// ---------------------------------------------------------------------------

// Known coupon codes and their discounts (percent)
const COUPONS: Record<string, number> = {
  SAVE10:  10,
  TECH20:  20,
  FIRST15: 15,
}

// ── Shared internal logic ────────────────────────────────────────────────────

/** Look up a product's stock status by id. Returns null if not found. */
function checkStockLogic(productId: string): { product: Product; stock: StockStatus } | null {
  const product = allProducts.find((p) => p.id === productId)
  if (!product) return null
  return { product, stock: product.stock }
}

/**
 * Run the full comparison overlay for a category and return the top-rated
 * available product (or null if none are in stock).
 */
async function compareProductsLogic(
  category: string,
  helpers: AIActionHelpers,
): Promise<Product | null> {
  const items = allProducts.filter((p) => p.category === category)
  if (items.length === 0) {
    helpers.respond(`No products found for category "${category}".`)
    return null
  }

  YourGPT.getInstance()?.close()

  window.dispatchEvent(new CustomEvent('ygpt:compare', {
    detail: { products: items, phase: 'start' },
  }))

  await new Promise<void>((r) => setTimeout(r, 4500))

  const available = [...items]
    .filter((p) => p.stock !== 'out_of_stock')
    .sort((a, b) => b.rating - a.rating)
  const top = available[0] ?? null

  const lines: string[] = [
    `Here's my comparison of the **${items.length} ${category}** currently in the store:\n`,
  ]
  for (const p of items) {
    const discountNote = p.originalPrice
      ? ` — ~~$${p.originalPrice}~~ **${Math.round((1 - p.price / p.originalPrice) * 100)}% off**`
      : ''
    const stockNote =
      p.stock === 'out_of_stock' ? ' *(out of stock)*'
      : p.stock === 'low_stock'  ? ' *(low stock — hurry!)*'
      : ''
    lines.push(
      `**${p.name}** by ${p.brand} — **$${p.price}**${discountNote}${stockNote}\n` +
      `⭐ ${p.rating}/5 · ${p.description.split('.')[0]}.`,
    )
  }
  if (top) {
    const savingsNote = top.originalPrice
      ? `, currently **${Math.round((1 - top.price / top.originalPrice) * 100)}% off** (was $${top.originalPrice})`
      : ''
    lines.push(
      `\n✅ **My recommendation: ${top.name}**\n` +
      `Best overall rating (${top.rating}/5) at **$${top.price}**${savingsNote}. ` +
      `${available.length < items.length ? 'Some options are currently out of stock.' : 'All options are available to order now.'}`,
    )
  }

  helpers.respond(lines.join('\n\n'))

  window.dispatchEvent(new CustomEvent('ygpt:compare', {
    detail: { products: items, phase: 'done' },
  }))

  YourGPT.getInstance()?.open()
  return top
}

/** Find the best applicable coupon for a product. Returns null if none apply. */
function applyBestCouponLogic(product: Product): { code: string; discount: number; savings: number } | null {
  const best = Object.entries(COUPONS).sort((a, b) => b[1] - a[1])[0]
  if (!best) return null
  const savings = Math.round(product.price * (best[1] / 100) * 100) / 100
  return { code: best[0], discount: best[1], savings }
}

/** Filter and rank products — used by get_recommendations and find_best_deal. */
function getRecommendationsLogic(category: string, maxPrice?: number): Product[] {
  return allProducts
    .filter((p) => p.category === category && p.stock !== 'out_of_stock')
    .filter((p) => maxPrice === undefined || p.price <= maxPrice)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
}

/**
 * Core add-to-cart logic reused by multiple handlers.
 * Dispatches ygpt:cart events and handles the final confirm gate.
 */
async function smartAddToCartLogic(
  productId: string,
  quantity: number,
  helpers: AIActionHelpers,
): Promise<boolean> {
  const result = checkStockLogic(productId)

  if (!result) {
    helpers.respond(`I couldn't find that product. Please check the product ID.`)
    return false
  }

  const { product, stock } = result

  // Step 1 — announce stock check
  window.dispatchEvent(new CustomEvent('ygpt:cart', {
    detail: { phase: 'checking', productName: product.name },
  }))
  await new Promise<void>((r) => setTimeout(r, 800))

  // Step 2 — handle stock states
  if (stock === 'out_of_stock') {
    window.dispatchEvent(new CustomEvent('ygpt:cart', {
      detail: { phase: 'out_of_stock', productName: product.name },
    }))
    const findAlt = await helpers.confirm({
      title: `${product.name} is out of stock`,
      description: `This item isn't available right now. Want me to find the best alternative in ${product.category}?`,
      acceptLabel: 'Find alternatives',
      rejectLabel: 'Never mind',
    })
    if (findAlt) {
      YourGPT.getInstance()?.open()
      const alt = await compareProductsLogic(product.category, helpers)
      if (alt) {
        const addAlt = await helpers.confirm({
          title: `Add ${alt.name}?`,
          description: `Top-rated alternative at $${alt.price}. Add ${quantity}× to your cart?`,
          acceptLabel: 'Add to cart',
          rejectLabel: 'Skip',
        })
        if (addAlt) {
          window.dispatchEvent(new CustomEvent('ygpt:cart', {
            detail: { phase: 'adding', productName: alt.name },
          }))
          await new Promise<void>((r) => setTimeout(r, 700))
          window.dispatchEvent(new CustomEvent('ygpt:cart', {
            detail: { phase: 'done', productName: alt.name },
          }))
          helpers.respond(`Done! Added ${quantity}× **${alt.name}** to your cart.`)
          return true
        }
      }
    } else {
      window.dispatchEvent(new CustomEvent('ygpt:cart', {
        detail: { phase: 'failed', productName: product.name },
      }))
      helpers.respond(`No worries — nothing was added to your cart.`)
    }
    return false
  }

  if (stock === 'low_stock') {
    const proceed = await helpers.confirm({
      title: 'Low stock warning',
      description: `Only a few ${product.name} units are left. Reserve one now?`,
      acceptLabel: 'Yes, add it',
      rejectLabel: 'Skip',
    })
    if (!proceed) {
      helpers.respond(`No problem — I'll leave it for now.`)
      return false
    }
  }

  // Step 3 — final confirm gate
  window.dispatchEvent(new CustomEvent('ygpt:cart', {
    detail: { phase: 'adding', productName: product.name },
  }))
  const confirmed = await helpers.confirm({
    title: 'Add to cart?',
    description: `Add ${quantity}× ${product.name} at $${product.price} each?`,
    acceptLabel: 'Add',
    rejectLabel: 'Cancel',
  })

  if (!confirmed) {
    window.dispatchEvent(new CustomEvent('ygpt:cart', {
      detail: { phase: 'cancelled', productName: product.name },
    }))
    helpers.respond(`Cancelled — nothing was added to your cart.`)
    return false
  }

  await new Promise<void>((r) => setTimeout(r, 600))
  window.dispatchEvent(new CustomEvent('ygpt:cart', {
    detail: { phase: 'done', productName: product.name },
  }))
  helpers.respond(`Added ${quantity}× **${product.name}** to your cart! 🛒`)
  return true
}

// ── Handlers ─────────────────────────────────────────────────────────────────

/**
 * Check stock status for a product and report back.
 * If low stock, asks the user whether to reserve one.
 * Expected args: { product_id: string }
 */
const checkStock: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { product_id } = parseArgs<{ product_id: string }>(data)
  const result = checkStockLogic(product_id)

  if (!result) {
    helpers.respond(`Product "${product_id}" was not found in the store.`)
    return
  }

  const { product, stock } = result

  window.dispatchEvent(new CustomEvent('ygpt:cart', {
    detail: { phase: 'checking', productName: product.name },
  }))
  await new Promise<void>((r) => setTimeout(r, 700))

  if (stock === 'in_stock') {
    helpers.respond(`✅ **${product.name}** is in stock at $${product.price}. Ready to add it?`)
  } else if (stock === 'low_stock') {
    const reserve = await helpers.confirm({
      title: 'Low stock!',
      description: `Only a few ${product.name} units remain at $${product.price}. Reserve one now before it sells out?`,
      acceptLabel: 'Add to cart',
      rejectLabel: 'Not yet',
    })
    if (reserve) {
      await smartAddToCartLogic(product_id, 1, helpers)
    } else {
      helpers.respond(`Got it — I'll hold off. Let me know if you change your mind!`)
    }
  } else {
    helpers.respond(`❌ **${product.name}** is currently out of stock. Want me to find an alternative?`)
  }
}

/**
 * Add a product to the cart with full stock-checking and user confirmation.
 * Chains into compare_products if the item is out of stock.
 * Expected args: { product_id: string; quantity?: number }
 */
const smartAddToCart: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { product_id, quantity = 1 } = parseArgs<{
    product_id: string
    quantity?: number
  }>(data)
  await smartAddToCartLogic(product_id, quantity, helpers)
}

/**
 * Compare all products in a category and recommend the best one.
 * After the comparison, asks the user if they'd like to add the top pick.
 * Expected args: { category?: string }
 */
const compareProducts: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { category = 'Headphones' } = parseArgs<{ category?: string }>(data)
  const top = await compareProductsLogic(category, helpers)

  if (top) {
    YourGPT.getInstance()?.open()
    const addTop = await helpers.confirm({
      title: `Add top pick to cart?`,
      description: `${top.name} is the highest-rated available option at $${top.price}. Want to add it?`,
      acceptLabel: 'Add to cart',
      rejectLabel: 'Just browsing',
    })
    if (addTop) {
      await smartAddToCartLogic(top.id, 1, helpers)
    }
  }
}

/**
 * Validate and apply a coupon code. If invalid, offers to try a known good code.
 * Expected args: { code: string }
 */
const applyCoupon: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { code } = parseArgs<{ code: string }>(data)
  const upperCode = code.toUpperCase()
  const discount = COUPONS[upperCode]

  if (!discount) {
    window.dispatchEvent(new CustomEvent('ygpt:cart', {
      detail: { phase: 'coupon_failed', couponCode: code },
    }))
    const tryDefault = await helpers.confirm({
      title: `"${code}" isn't valid`,
      description: `That coupon code wasn't recognised. Want to try SAVE10 for 10% off instead?`,
      acceptLabel: 'Use SAVE10',
      rejectLabel: 'Skip discount',
    })
    if (tryDefault) {
      window.dispatchEvent(new CustomEvent('ygpt:cart', {
        detail: { phase: 'coupon_applied', couponCode: 'SAVE10', savings: null },
      }))
      helpers.respond(`Coupon **SAVE10** applied — you'll save 10% on your order! 🎉`)
    } else {
      helpers.respond(`No coupon applied. Your order total stays the same.`)
    }
    return
  }

  window.dispatchEvent(new CustomEvent('ygpt:cart', {
    detail: { phase: 'coupon_applied', couponCode: upperCode, discount },
  }))
  helpers.respond(`Coupon **${upperCode}** applied — ${discount}% off your order! 🎉`)
}

/**
 * Full shopping assistant: compare products → apply best coupon → add to cart.
 * Chains compareProductsLogic → applyBestCouponLogic → smartAddToCartLogic.
 * Expected args: { category?: string }
 */
const findBestDeal: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { category = 'Headphones' } = parseArgs<{ category?: string }>(data)

  // Step 1 — compare
  const top = await compareProductsLogic(category, helpers)
  if (!top) return

  YourGPT.getInstance()?.open()

  // Step 2 — offer best coupon
  const coupon = applyBestCouponLogic(top)
  if (coupon) {
    const applyCouponConfirm = await helpers.confirm({
      title: 'Apply coupon?',
      description: `I found code ${coupon.code} — saves you ${coupon.discount}% ($${coupon.savings}) on ${top.name}. Apply it?`,
      acceptLabel: 'Apply',
      rejectLabel: 'Skip',
    })
    if (applyCouponConfirm) {
      window.dispatchEvent(new CustomEvent('ygpt:cart', {
        detail: { phase: 'coupon_applied', couponCode: coupon.code, discount: coupon.discount },
      }))
      helpers.respond(`Coupon **${coupon.code}** locked in — $${coupon.savings} off your total.`)
    }
  }

  // Step 3 — offer to add
  const addIt = await helpers.confirm({
    title: `Add ${top.name} to cart?`,
    description: `Want me to add the top pick${coupon ? ` at the discounted price` : ''} to your cart now?`,
    acceptLabel: 'Add to cart',
    rejectLabel: 'Not now',
  })
  if (addIt) {
    await smartAddToCartLogic(top.id, 1, helpers)
  }
}

/**
 * Recommend top products in a category with an optional price ceiling.
 * After listing them, asks the user if they want the top pick added to cart.
 * Expected args: { category?: string; max_price?: number }
 */
const getRecommendations: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { category = 'Headphones', max_price } = parseArgs<{
    category?: string
    max_price?: number
  }>(data)

  const picks = getRecommendationsLogic(category, max_price)

  if (picks.length === 0) {
    helpers.respond(
      max_price
        ? `No ${category} found under $${max_price} that are currently in stock.`
        : `No ${category} are currently in stock.`,
    )
    return
  }

  const header = max_price
    ? `Here are the top ${picks.length} **${category}** under **$${max_price}**:\n`
    : `Here are my top **${category}** picks:\n`

  const lines = picks.map((p, i) => {
    const discountNote = p.originalPrice
      ? ` ~~$${p.originalPrice}~~ → **$${p.price}**`
      : ` **$${p.price}**`
    const stockNote = p.stock === 'low_stock' ? ' *(low stock)*' : ''
    return `${i + 1}. **${p.name}** by ${p.brand}${discountNote}${stockNote} — ⭐ ${p.rating}/5`
  })

  helpers.respond([header, ...lines].join('\n'))

  // Offer to add the top pick
  const top = picks[0]
  const addTop = await helpers.confirm({
    title: 'Add top recommendation?',
    description: `Want me to add ${top.name} ($${top.price}) to your cart?`,
    acceptLabel: 'Add to cart',
    rejectLabel: 'Just looking',
  })
  if (addTop) {
    await smartAddToCartLogic(top.id, 1, helpers)
  }
}

/**
 * Alert the user to an active price drop on a specific product.
 * Checks stock first, then offers to add at the discounted price.
 * Expected args: { product_id: string }
 */
const priceDropAlert: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { product_id } = parseArgs<{ product_id: string }>(data)
  const result = checkStockLogic(product_id)

  if (!result) {
    helpers.respond(`Product not found.`)
    return
  }

  const { product } = result

  if (!product.originalPrice || product.price >= product.originalPrice) {
    helpers.respond(`**${product.name}** is currently at its regular price of $${product.price} — no active sale.`)
    return
  }

  const pct = Math.round((1 - product.price / product.originalPrice) * 100)
  const savings = (product.originalPrice - product.price).toFixed(2)

  const grab = await helpers.confirm({
    title: `${pct}% off — limited time!`,
    description: `${product.name} dropped from $${product.originalPrice} to $${product.price} — save $${savings} right now. Add it to your cart?`,
    acceptLabel: 'Grab the deal',
    rejectLabel: 'Pass',
  })

  if (grab) {
    // checkStockLogic already called — pass straight to smartAddToCartLogic
    await smartAddToCartLogic(product.id, 1, helpers)
  } else {
    helpers.respond(`No problem — the deal is still live if you change your mind!`)
  }
}

/**
 * Orchestrate a full checkout: apply the best coupon across the cart,
 * confirm savings, then confirm the final order.
 * Expected args: { product_ids?: string[] }
 */
const checkoutAssist: AIActionHandler = async (
  data: AIActionData,
  helpers: AIActionHelpers,
) => {
  const { product_ids = [] } = parseArgs<{ product_ids?: string[] }>(data)

  const cartProducts = product_ids
    .map((id) => checkStockLogic(id)?.product)
    .filter(Boolean) as Product[]

  if (cartProducts.length === 0) {
    helpers.respond(`Your cart appears to be empty. Add some products first!`)
    return
  }

  // Step 1 — kick things off
  const proceed = await helpers.confirm({
    title: 'Ready to checkout?',
    description: `You have ${cartProducts.length} item${cartProducts.length > 1 ? 's' : ''} in your cart. Want me to find the best coupon before you pay?`,
    acceptLabel: 'Yes, find a coupon',
    rejectLabel: 'Skip — checkout now',
  })

  // Step 2 — apply coupon
  let totalSavings = 0
  let appliedCode = ''

  if (proceed) {
    const highestPriced = [...cartProducts].sort((a, b) => b.price - a.price)[0]
    const coupon = applyBestCouponLogic(highestPriced)

    if (coupon) {
      window.dispatchEvent(new CustomEvent('ygpt:cart', {
        detail: { phase: 'applying_coupon', couponCode: coupon.code },
      }))
      await new Promise<void>((r) => setTimeout(r, 700))

      const confirmCoupon = await helpers.confirm({
        title: 'Coupon found!',
        description: `${coupon.code} saves you ${coupon.discount}% ($${coupon.savings}) on your largest item. Apply it?`,
        acceptLabel: 'Apply & save',
        rejectLabel: 'Skip coupon',
      })

      if (confirmCoupon) {
        totalSavings = coupon.savings
        appliedCode = coupon.code
        window.dispatchEvent(new CustomEvent('ygpt:cart', {
          detail: { phase: 'coupon_applied', couponCode: coupon.code, discount: coupon.discount },
        }))
      }
    } else {
      helpers.respond(`No coupons found for your cart items, but let's proceed!`)
    }
  }

  // Step 3 — final confirm
  const orderTotal = cartProducts.reduce((sum, p) => sum + p.price, 0)
  const finalTotal = (orderTotal - totalSavings).toFixed(2)

  const confirm = await helpers.confirm({
    title: 'Confirm your order',
    description: `${cartProducts.length} item${cartProducts.length > 1 ? 's' : ''}${appliedCode ? ` · Coupon ${appliedCode} applied` : ''} · Total: $${finalTotal}${totalSavings > 0 ? ` (you saved $${totalSavings})` : ''}. Place the order?`,
    acceptLabel: 'Place order',
    rejectLabel: 'Go back',
  })

  if (confirm) {
    window.dispatchEvent(new CustomEvent('ygpt:cart', {
      detail: { phase: 'done', productName: 'order' },
    }))
    helpers.respond(
      `🎉 Order placed!\n\n` +
      cartProducts.map((p) => `- **${p.name}** — $${p.price}`).join('\n') +
      (totalSavings > 0 ? `\n\n**Coupon ${appliedCode}**: −$${totalSavings}` : '') +
      `\n\n**Total charged: $${finalTotal}**`,
    )
  } else {
    const skipCouponCheckout = totalSavings > 0
      ? await helpers.confirm({
          title: 'Checkout without coupon?',
          description: `You'll pay the full $${orderTotal.toFixed(2)} without the ${appliedCode} discount. Continue?`,
          acceptLabel: 'Checkout at full price',
          rejectLabel: 'Keep browsing',
        })
      : false

    if (skipCouponCheckout) {
      window.dispatchEvent(new CustomEvent('ygpt:cart', {
        detail: { phase: 'done', productName: 'order' },
      }))
      helpers.respond(`Order placed at full price — $${orderTotal.toFixed(2)}. Thanks for shopping!`)
    } else {
      helpers.respond(`No problem — your cart is saved. Come back when you're ready!`)
    }
  }
}

export const ecommerceHandlers: Record<string, AIActionHandler> = {
  check_stock:         checkStock,
  smart_add_to_cart:   smartAddToCart,
  compare_products:    compareProducts,
  apply_coupon:        applyCoupon,
  find_best_deal:      findBestDeal,
  get_recommendations: getRecommendations,
  price_drop_alert:    priceDropAlert,
  checkout_assist:     checkoutAssist,
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
