/**
 * Customers Resource
 * 
 * Handles all customer-related API operations.
 * Customers are scoped to projects in Surpay.
 */

import type { SurpayClient } from '../client.js';
import type { Customer, CustomerWithDetails } from '../types.js';

export class CustomersResource {
  constructor(private client: SurpayClient) {}

  /**
   * List all customers for a project.
   * 
   * @param projectId - The project UUID
   * @returns Array of customers
   * 
   * @example
   * ```typescript
   * const customers = await surpay.customers.list('project-uuid');
   * console.log(`Found ${customers.length} customers`);
   * ```
   */
  async list(projectId: string): Promise<Customer[]> {
    return this.client.get(`/project/${projectId}/customers`);
  }

  /**
   * Get a single customer with their transactions and subscriptions.
   * 
   * @param projectId - The project UUID
   * @param customerId - The customer UUID
   * @returns Customer with transaction and subscription details
   * 
   * @example
   * ```typescript
   * const customer = await surpay.customers.get('project-uuid', 'customer-uuid');
   * console.log('Active subscriptions:', customer.subscriptions.filter(s => s.status === 'active'));
   * ```
   */
  async get(projectId: string, customerId: string): Promise<CustomerWithDetails> {
    return this.client.get(`/project/${projectId}/customer/${customerId}`);
  }
}
