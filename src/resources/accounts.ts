/**
 * Accounts Resource
 * 
 * Handles connected payout accounts (Stripe Connect).
 * Use this to set up payouts to your bank account.
 */

import type { SurpayClient } from '../client.js';
import type { 
  ConnectAccountRequest, 
  ConnectAccountResponse,
  ConnectedAccount,
} from '../types.js';

export class AccountsResource {
  constructor(private client: SurpayClient) {}

  /**
   * Create a connected account and get the OAuth URL.
   * 
   * Redirect the user to the OAuth URL to complete account setup.
   * 
   * @param params - Account creation parameters
   * @returns Account ID and OAuth URL for user authorization
   * 
   * @example
   * ```typescript
   * const account = await surpay.accounts.connect({
   *   processor: 'stripe',
   *   country: 'US',
   *   email: 'business@example.com',
   * });
   * 
   * // Redirect user to complete Stripe onboarding
   * res.redirect(account.oauth_url);
   * ```
   */
  async connect(params: ConnectAccountRequest): Promise<ConnectAccountResponse> {
    return (this.client as any).post('/accounts/connect', params);
  }

  /**
   * Get a connected account by ID.
   * 
   * @param accountId - The account UUID
   * @returns Account details
   */
  async get(accountId: string): Promise<ConnectedAccount> {
    return (this.client as any).get(`/accounts/${accountId}`);
  }

  /**
   * List all connected accounts for your organization.
   * 
   * @returns Array of connected accounts
   */
  async list(): Promise<ConnectedAccount[]> {
    return (this.client as any).get('/accounts/');
  }
}
