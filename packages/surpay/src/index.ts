/**
 * Surpay SDK
 *
 * Official TypeScript/JavaScript SDK for the Surpay payment platform.
 *
 * @example
 * ```typescript
 * import { Surpay } from 'surpay'
 *
 * const surpay = new Surpay({ apiKey: 'xKmZqWpNrTsYvBcDfGhJkLmNpQrStUvWxYzAbCdEfGhJkLmNpQrStUvWxYzAbCd' })
 *
 * // Create a checkout session
 * const { data, error } = await surpay.checkout.create({
 *   productId: 'prod_xxx',
 *   priceId: 'price_xxx',
 *   successUrl: 'https://myapp.com/success',
 *   cancelUrl: 'https://myapp.com/cancel',
 * })
 *
 * if (error) {
 *   console.error(error.message, error.code)
 *   return
 * }
 *
 * // Redirect user to checkout
 * console.log(data.checkoutUrl)
 * ```
 */

// Main client
export { Surpay } from './surpay.js'

// Error handling
export { SurpayError, isSurpayError } from './errors.js'

// Utilities
/** @deprecated No longer used by default. Kept for backwards compatibility. */
export { camelToSnake } from './utils/case.js'

// All types
export type {
  // Result pattern
  Result,
  Success,
  Failure,

  // Config
  SurpayConfig,
  ResponseCase,

  // Enums
  SubscriptionStatus,
  RecurringInterval,
  TransactionType,
  CheckoutStatus,
  CheckoutMode,
  PayoutStatus,

  // Project
  Project,

  // Customer
  Customer,
  CustomerWithDetails,
  TransactionSummary,
  SubscriptionSummary,

  // Product
  Product,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  ProductWithPrices,

  // Price
  ProductPrice,
  CreatePriceRequest,
  CreatePriceResponse,

  // Checkout
  CreateCheckoutRequest,
  CreateCheckoutResponse,

  // Check
  CheckRequest,
  CheckResponse,

  // Transaction
  Transaction,

  // Subscription
  Subscription,

  // Accounts
  ConnectAccountRequest,
  ConnectAccountResponse,
  ConnectedAccount,
} from './types.js'
