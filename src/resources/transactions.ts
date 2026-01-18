/**
 * Transactions Resource
 * 
 * Handles transaction listing.
 * Transactions represent payment events (charges, refunds, etc.).
 */

import type { SurpayClient } from '../client.js'
import type { Transaction } from '../types.js'

export class TransactionsResource {
  constructor(private client: SurpayClient) {}

  /**
   * List all transactions for a project.
   * 
   * Currently returns only payment-type transactions.
   * 
   * @param projectId - The project UUID
   * @returns Array of transactions
   * 
   * @example
   * ```typescript
   * const transactions = await surpay.transactions.list('project-uuid')
   * 
   * // Calculate total revenue
   * const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
   * console.log(`Total revenue: $${(totalRevenue / 100).toFixed(2)}`)
   * ```
   */
  async list(projectId: string): Promise<Transaction[]> {
    return this.client.get(`/project/${projectId}/transactions`)
  }
}
