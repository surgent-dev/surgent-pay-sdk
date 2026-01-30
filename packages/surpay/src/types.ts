/**
 * Surpay SDK Type Definitions
 *
 * These types mirror your Rust API's request/response shapes.
 * We use camelCase to match the API directly.
 */

// ============================================================================
// Result Pattern Types
// ============================================================================

export type Success<T> = { data: T; error: null; statusCode: number }
export type Failure<E> = { data: null; error: E; statusCode: number }
export type Result<T, E = unknown> = Success<T> | Failure<E>

// ============================================================================
// Enums (as union types)
// ============================================================================

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'trialing'
  | 'incomplete'
  | 'incomplete_expired'

export type RecurringInterval = 'day' | 'week' | 'month' | 'year'

export type TransactionType = 'payment' | 'processor_fee' | 'refund' | 'dispute' | 'balance' | 'payout'

export type CheckoutStatus = 'open' | 'complete' | 'expired'
export type CheckoutMode = 'payment' | 'subscription' | 'setup'

export type PayoutStatus = 'paid' | 'pending' | 'in_transit' | 'canceled' | 'failed'

// ============================================================================
// Project
// ============================================================================

export interface Project {
  id: string
  name: string
  slug: string
  organizationId: string
}

// ============================================================================
// Customer
// ============================================================================

export interface Customer {
  id: string
  email: string | null
  name?: string | null
  processorCustomerId?: string | null
  projectId: string
}

export interface TransactionSummary {
  id: string
  createdAt: string
  type: TransactionType
  amount: number
  currency: string
}

export interface SubscriptionSummary {
  id: string
  createdAt: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  status: SubscriptionStatus
  processorSubscriptionId?: string
}

export interface CustomerWithDetails extends Customer {
  transactions: TransactionSummary[]
  subscriptions: SubscriptionSummary[]
}

// ============================================================================
// Product
// ============================================================================

export interface CreateProductRequest {
  productGroup: string
  name: string
  description?: string
  isDefault?: boolean
  slug: string
}

export interface CreateProductResponse {
  productId: string
  productGroup: string
  version: number
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  slug?: string
  isDefault?: boolean
  isArchived?: boolean
}

export interface UpdateProductResponse {
  productId: string
  productGroup: string
  version: number
}

export interface Product {
  id: string
  productGroup: string
  name: string
  slug: string
  description?: string | null
  isArchived?: boolean | null
  isDefault?: boolean | null
  processorProductId?: string | null
  projectId: string
  version?: number | null
}

// ============================================================================
// Price
// ============================================================================

export interface CreatePriceRequest {
  productGroup: string
  name?: string
  description?: string
  isDefault?: boolean
  price: number
  priceCurrency: string
  recurringInterval?: RecurringInterval
  slug?: string | null
}

export interface CreatePriceResponse {
  productPriceId: string
}

export interface ProductPrice {
  id: string
  name?: string | null
  description?: string | null
  priceAmount: number
  priceCurrency: string
  isDefault?: boolean | null
  recurringInterval?: RecurringInterval | null
}

export interface ProductWithPrices {
  product: Product
  prices: ProductPrice[]
}

// ============================================================================
// Checkout
// ============================================================================

export interface CustomerData {
  email?: string | null
  name?: string | null
}

export interface CreateCheckoutRequest {
  productId: string
  priceId?: string
  successUrl?: string
  cancelUrl?: string
  customerId: string
  customerData?: CustomerData | null
}

export interface CreateCheckoutResponse {
  checkoutUrl: string
  customerId: string
}

// ============================================================================
// Check
// ============================================================================

export interface CheckRequest {
  customerId: string
  productId: string
}

export interface CheckResponse {
  allowed: boolean
}

// ============================================================================
// Transaction
// ============================================================================

export interface Transaction {
  id: string
  createdAt: string
  type: TransactionType
  amount: number
  currency: string
  processor: string

  // Optional fields
  accountId?: string | null
  accountAmount?: number | null
  accountCurrency?: string | null
  chargeId?: string | null
  checkoutSessionId?: string | null
  customerId?: string | null
  incurredByTransactionId?: string | null
  metadata?: Record<string, unknown>
  paymentTransactionId?: string | null
  payoutId?: string | null
  payoutTransactionId?: string | null
  presentmentAmount?: number | null
  presentmentCurrency?: string | null
  presentmentTaxAmount?: number | null
  processorInvoiceId?: string | null
  productId?: string | null
  productPriceId?: string | null
  projectId: string
  refundId?: string | null
  refundedAt?: string | null
  subscriptionId?: string | null
  succeededAt?: string | null
  taxAmount?: number | null
  taxCountry?: string | null
  taxFilingAmount?: number | null
  taxFilingCurrency?: string | null
  taxState?: string | null
  transferId?: string | null
}

// ============================================================================
// Subscription
// ============================================================================

export interface Subscription {
  id: string
  createdAt: string
  status: SubscriptionStatus

  canceledAt?: string | null
  currentPeriodEnd?: string | null
  currentPeriodStart?: string | null
  customerId?: string | null
  deletedAt?: string | null
  endedAt?: string | null
  processorCustomerId?: string | null
  processorSubscriptionId?: string | null
  productId?: string | null
  productPriceId?: string | null
  projectId: string
}

// ============================================================================
// Connected Accounts (Stripe Connect)
// ============================================================================

export interface ConnectAccountRequest {
  processor: string
  accountType?: string
  country?: string
  email?: string
  businessType?: string
}

export interface ConnectAccountResponse {
  accountId: string
  onboardingUrl: string
  processorAccountId: string
}

export interface ConnectedAccount {
  id: string
  processor: string
  status: string
  country: string
  currency: string
  detailsSubmitted: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  businessType?: string | null
  processorAccountId?: string | null
}

// ============================================================================
// SDK Configuration
// ============================================================================

/**
 * Response case format for API responses.
 * - 'camel' (default): Keep original camelCase keys from API (matches TypeScript types)
 * - 'snake': Transform camelCase keys to snake_case (legacy, deprecated)
 */
export type ResponseCase = 'snake' | 'camel'

export interface SurpayConfig {
  /** Your Surpay API key (64 alphabetic characters) */
  apiKey?: string
  /** Override the base URL (default: https://pay.surgent.dev) */
  baseUrl?: string
  /**
   * Response key case format.
   * - 'camel' (default): Keep original camelCase keys from API (matches TypeScript types)
   * - 'snake': Transform to snake_case (legacy, deprecated)
   */
  responseCase?: ResponseCase
}
