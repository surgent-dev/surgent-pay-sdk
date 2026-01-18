/**
 * Surpay SDK
 * 
 * Official TypeScript/JavaScript SDK for the Surpay payment platform.
 * 
 * @example
 * ```typescript
 * import { Surpay } from 'surpay';
 * 
 * const surpay = new Surpay({ apiKey: process.env.SURPAY_API_KEY });
 * 
 * // Create a checkout session
 * const checkout = await surpay.checkout.create({
 *   product_id: 'prod_xxx',
 *   price_id: 'price_xxx',
 *   success_url: 'https://myapp.com/success',
 *   cancel_url: 'https://myapp.com/cancel',
 * });
 * 
 * // Redirect user to checkout
 * console.log(checkout.checkout_url);
 * ```
 * 
 * @packageDocumentation
 */

// Main client - the primary export
export { Surpay } from './surpay.js';

// Error handling
export { SurpayError, isSurpayError } from './errors.js';

// All types - users can import these for type annotations
export type {
  // Config
  SurpayConfig,
  
  // Enums
  SubscriptionStatus,
  RecurringInterval,
  TransactionType,
  CheckoutStatus,
  CheckoutMode,
  
  // Organization
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  
  // Project
  CreateProjectRequest,
  CreateProjectResponse,
  
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
  
  // Transaction
  Transaction,
  
  // Subscription
  Subscription,
  
  // Accounts
  ConnectAccountRequest,
  ConnectAccountResponse,
  ConnectedAccount,
} from './types.js';
