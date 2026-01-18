/**
 * Projects Resource
 * 
 * Handles project creation.
 * Projects are containers for products, customers, and transactions.
 */

import type { SurpayClient } from '../client.js';
import type { CreateProjectRequest, CreateProjectResponse } from '../types.js';

export class ProjectsResource {
  constructor(private client: SurpayClient) {}

  /**
   * Create a new project.
   * 
   * Projects belong to your organization and contain all your payment data.
   * Use separate projects for different apps or environments.
   * 
   * @param params - Project creation parameters
   * @returns The created project's ID
   * 
   * @example
   * ```typescript
   * const project = await surpay.projects.create({
   *   name: 'My SaaS App',
   *   slug: 'my-saas-app',
   * });
   * console.log('Project ID:', project.id);
   * ```
   */
  async create(params: CreateProjectRequest): Promise<CreateProjectResponse> {
    return (this.client as any).post('/project/', params);
  }
}
