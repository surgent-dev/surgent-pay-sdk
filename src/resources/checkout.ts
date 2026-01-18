/**
 * Checkout Resource
 * 
 * Handles checkout session creation.
 * Checkout sessions redirect users to a hosted payment page.
 */

import type { SurpayClient } from '../client.js';
import type { CreateCheckoutRequest, CreateCheckoutResponse } from '../types.js';

export class CheckoutResource {
  constructor(private client: SurpayClient) {}

  /**
   * Create a checkout session.
   * 
   * Returns a URL to redirect the user to for payment.
   * After payment, the user is redirected to your success_url.
   * 
   * @param params - Checkout session parameters
   * @returns Checkout URL and session ID
   * 
   * @example
   * ```typescript
   * const checkout = await surpay.checkout.create({
   *   product_id: 'product-uuid',
   *   price_id: 'price-uuid',
   *   success_url: 'https://myapp.com/success?session={session_id}',
   *   cancel_url: 'https://myapp.com/pricing',
   * });
   * 
   * // Redirect user to checkout
   * res.redirect(checkout.checkout_url);
   * ```
   */
  async create(params: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    return (this.client as any).post('/checkout/', params);
  }
}
