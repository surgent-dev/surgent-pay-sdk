/**
 * Surpay SDK Type Definitions
 * 
 * These types mirror your Rust API's request/response shapes.
 * We use snake_case to match the API directly (simpler than transforming).
 */

// ============================================================================
// Enums (as union types - TypeScript's idiomatic approach)
// ============================================================================

export type SubscriptionStatus = 
  | 'active' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid' 
  | 'trialing' 
  | 'incomplete' 
  | 'incomplete_expired';

export type RecurringInterval = 'day' | 'week' | 'month' | 'year';

export type TransactionType = 
  | 'payment' 
  | 'processor_fee' 
  | 'refund' 
  | 'dispute' 
  | 'balance' 
  | 'payout';

export type CheckoutStatus = 'open' | 'complete' | 'expired';
export type CheckoutMode = 'payment' | 'subscription' | 'setup';

// ============================================================================
// Organization
// ============================================================================

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
}

export interface CreateOrganizationResponse {
  id: string;
  api_key: string;
}

// ============================================================================
// Project
// ============================================================================

export interface CreateProjectRequest {
  name: string;
  slug: string;
  external_id?: string;
}

export interface CreateProjectResponse {
  id: string;
}

// ============================================================================
// Customer
// ============================================================================

export interface Customer {
  id: string;
  project_id?: string;
  email: string;
  name?: string;
  processor_customer_id?: string;
}

export interface TransactionSummary {
  id: string;
  created_at: string;
  type_: TransactionType;
  amount: number;
  currency: string;
}

export interface SubscriptionSummary {
  id: string;
  created_at: string;
  current_period_start?: string;
  current_period_end?: string;
  status: SubscriptionStatus;
  processor_subscription_id?: string;
}

export interface CustomerWithDetails extends Customer {
  transactions: TransactionSummary[];
  subscriptions: SubscriptionSummary[];
}

// ============================================================================
// Product
// ============================================================================

export interface CreateProductRequest {
  project_id: string;
  product_group_id: string;
  name: string;
  description?: string;
  is_default?: boolean;
  slug: string;
}

export interface CreateProductResponse {
  product_id: string;
  product_group_id: string;
  version: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  slug?: string;
  is_default?: boolean;
  is_archived?: boolean;
}

export interface UpdateProductResponse {
  product_id: string;
  product_group_id: string;
  version: number;
}

export interface Product {
  id: string;
  project_id: string;
  product_group_id: string;
  version: number;
  name: string;
  description?: string;
  slug: string;
  is_default: boolean;
  is_archived: boolean;
  processor_product_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Price
// ============================================================================

export interface CreatePriceRequest {
  project_id: string;
  product_group_id: string;
  name?: string;
  description?: string;
  is_default?: boolean;
  price: number;
  price_currency: string;
  recurring_interval?: RecurringInterval;
}

export interface CreatePriceResponse {
  product_price_id: string;
}

export interface ProductPrice {
  id: string;
  product_id: string;
  name?: string;
  description?: string;
  price: number;
  price_currency: string;
  recurring_interval?: RecurringInterval;
  is_default: boolean;
  processor_price_id?: string;
  created_at: string;
}

export interface ProductWithPrices {
  product: Product;
  prices: ProductPrice[];
}

// ============================================================================
// Checkout
// ============================================================================

export interface CreateCheckoutRequest {
  product_id: string;
  price_id: string;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
  session_id: string;
}

// ============================================================================
// Transaction
// ============================================================================

export interface Transaction {
  id: string;
  project_id?: string;
  customer_id?: string;
  subscription_id?: string;
  type_: TransactionType;
  amount: number;
  currency: string;
  processor_transaction_id?: string;
  processor_fee?: number;
  net_amount?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// Subscription
// ============================================================================

export interface Subscription {
  id: string;
  project_id?: string;
  product_id?: string;
  product_price_id?: string;
  customer_id?: string;
  processor_subscription_id?: string;
  processor_customer_id?: string;
  created_at: string;
  deleted_at?: string;
  current_period_start?: string;
  current_period_end?: string;
  canceled_at?: string;
  ended_at?: string;
  status: SubscriptionStatus;
}

// ============================================================================
// Connected Accounts (Stripe Connect)
// ============================================================================

export interface ConnectAccountRequest {
  processor: string;
  account_type?: string;
  country?: string;
  email?: string;
  business_type?: string;
}

export interface ConnectAccountResponse {
  account_id: string;
  oauth_url: string;
}

export interface ConnectedAccount {
  id: string;
  organization_id: string;
  processor: string;
  processor_account_id?: string;
  status: string;
  created_at: string;
}

// ============================================================================
// SDK Configuration
// ============================================================================

export interface SurpayConfig {
  /** Your Surpay API key (format: sp_xxx_yyy) */
  apiKey: string;
  /** Override the base URL (default: https://api.surpay.io) */
  baseUrl?: string;
}

export interface SurpayAdminConfig {
  /** Your Surpay master key (format: sp_master_xxx) */
  masterKey: string;
  /** Override the base URL (default: https://api.surpay.io) */
  baseUrl?: string;
}
