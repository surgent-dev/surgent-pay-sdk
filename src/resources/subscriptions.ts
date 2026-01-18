/**
 * Subscriptions Resource
 * 
 * Handles subscription listing and management.
 * Subscriptions are created automatically when customers complete checkout
 * for recurring products.
 */

import type { SurpayClient } from '../client.js';
import type { Subscription } from '../types.js';

export class SubscriptionsResource {
  constructor(private client: SurpayClient) {}

  /**
   * List all subscriptions for a project.
   * 
   * @param projectId - The project UUID
   * @returns Array of subscriptions
   * 
   * @example
   * ```typescript
   * const subscriptions = await surpay.subscriptions.list('project-uuid');
   * 
   * // Filter active subscriptions
   * const active = subscriptions.filter(s => s.status === 'active');
   * console.log(`${active.length} active subscriptions`);
   * ```
   */
  async list(projectId: string): Promise<Subscription[]> {
    return (this.client as any).get(`/project/${projectId}/subscriptions`);
  }
}
