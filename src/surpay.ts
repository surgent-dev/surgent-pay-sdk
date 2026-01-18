/**
 * Surpay SDK Main Client
 * 
 * This is the main entry point for the SDK.
 * It extends SurpayClient (HTTP methods) and exposes resource namespaces.
 * 
 * @example
 * ```typescript
 * import { Surpay } from 'surpay'
 * 
 * const surpay = new Surpay({ apiKey: process.env.SURPAY_API_KEY })
 * 
 * // Use resource namespaces
 * const customers = await surpay.customers.list(projectId)
 * const checkout = await surpay.checkout.create({ ... })
 * ```
 */

import { SurpayClient } from './client.js'
import type { SurpayConfig } from './types.js'

// Import all resource classes
import { CustomersResource } from './resources/customers.js'
import { ProductsResource, PricesResource } from './resources/products.js'
import { CheckoutResource } from './resources/checkout.js'
import { SubscriptionsResource } from './resources/subscriptions.js'
import { TransactionsResource } from './resources/transactions.js'
import { ProjectsResource } from './resources/projects.js'
import { AccountsResource } from './resources/accounts.js'

export class Surpay extends SurpayClient {
  /**
   * Customer operations.
   * Customers are scoped to projects.
   */
  readonly customers: CustomersResource

  /**
   * Product operations.
   * Products are versioned - updates create new versions.
   */
  readonly products: ProductsResource

  /**
   * Price operations.
   * Prices are attached to product groups.
   */
  readonly prices: PricesResource

  /**
   * Checkout session operations.
   * Create hosted checkout pages for payments.
   */
  readonly checkout: CheckoutResource

  /**
   * Subscription operations.
   * Subscriptions are created when customers pay for recurring products.
   */
  readonly subscriptions: SubscriptionsResource

  /**
   * Transaction operations.
   * View payment history and revenue.
   */
  readonly transactions: TransactionsResource

  /**
   * Project operations.
   * Projects contain your products, customers, and transactions.
   */
  readonly projects: ProjectsResource

  /**
   * Connected account operations (Stripe Connect).
   * Set up payouts to your bank account.
   */
  readonly accounts: AccountsResource

  /**
   * Create a new Surpay client.
   * 
   * @param config - SDK configuration
   * @param config.apiKey - Your Surpay API key (format: sp_xxx_yyy)
   * @param config.baseUrl - Optional: Override the API base URL
   * 
   * @example
   * ```typescript
   * // Production
   * const surpay = new Surpay({ apiKey: process.env.SURPAY_API_KEY })
   * 
   * // Local development
   * const surpay = new Surpay({ 
   *   apiKey: 'sp_test_xxx',
   *   baseUrl: 'http://localhost:3000',
   * })
   * ```
   */
  constructor(config: SurpayConfig) {
    if (!config.apiKey?.startsWith('sp_org_')) {
      throw new Error('Invalid API key format. Expected sp_org_... prefix.')
    }

    super(config)

    // Initialize all resource namespaces
    // We pass `this` so resources can access the protected HTTP methods
    this.customers = new CustomersResource(this)
    this.products = new ProductsResource(this)
    this.prices = new PricesResource(this)
    this.checkout = new CheckoutResource(this)
    this.subscriptions = new SubscriptionsResource(this)
    this.transactions = new TransactionsResource(this)
    this.projects = new ProjectsResource(this)
    this.accounts = new AccountsResource(this)
  }
}
