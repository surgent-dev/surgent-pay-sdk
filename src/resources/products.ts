/**
 * Products Resource
 * 
 * Handles product and price management.
 * Products in Surpay are versioned - updates create new versions.
 */

import type { SurpayClient } from '../client.js';
import type {
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  ProductWithPrices,
  CreatePriceRequest,
  CreatePriceResponse,
} from '../types.js';

export class ProductsResource {
  constructor(private client: SurpayClient) {}

  /**
   * Create a new product.
   * 
   * Products are grouped by `product_group_id` and versioned.
   * The first product in a group gets version 1.
   * 
   * @param params - Product creation parameters
   * @returns The created product's ID, group ID, and version
   * 
   * @example
   * ```typescript
   * const product = await surpay.products.create({
   *   project_id: 'project-uuid',
   *   product_group_id: crypto.randomUUID(), // New group for new product
   *   name: 'Pro Plan',
   *   slug: 'pro-plan',
   *   description: 'Full access to all features',
   * });
   * ```
   */
  async create(params: CreateProductRequest): Promise<CreateProductResponse> {
    return (this.client as any).post('/product/', params);
  }

  /**
   * Update a product.
   * 
   * NOTE: Updates create a NEW version of the product with a new UUID.
   * The old version remains unchanged (append-only versioning).
   * 
   * @param productId - The current product UUID
   * @param params - Fields to update
   * @returns The new product version's ID, group ID, and version number
   * 
   * @example
   * ```typescript
   * const updated = await surpay.products.update('product-uuid', {
   *   name: 'Pro Plan v2',
   *   description: 'Updated description',
   * });
   * console.log(`New version: ${updated.version}`); // e.g., 2
   * ```
   */
  async update(productId: string, params: UpdateProductRequest): Promise<UpdateProductResponse> {
    return (this.client as any).put(`/product/${productId}`, params);
  }

  /**
   * List all products with their prices.
   * 
   * Returns only the latest version of each product group.
   * 
   * @returns Array of products with their associated prices
   * 
   * @example
   * ```typescript
   * const products = await surpay.products.listWithPrices();
   * for (const { product, prices } of products) {
   *   console.log(`${product.name}: ${prices.length} price(s)`);
   * }
   * ```
   */
  async listWithPrices(): Promise<ProductWithPrices[]> {
    return (this.client as any).get('/product/prices');
  }
}

export class PricesResource {
  constructor(private client: SurpayClient) {}

  /**
   * Create a price for a product.
   * 
   * Prices are attached to product groups (not specific versions).
   * This allows prices to persist across product updates.
   * 
   * @param params - Price creation parameters
   * @returns The created price's ID
   * 
   * @example
   * ```typescript
   * // One-time payment
   * const oneTimePrice = await surpay.prices.create({
   *   project_id: 'project-uuid',
   *   product_group_id: 'group-uuid',
   *   price: 4999, // $49.99 in cents
   *   price_currency: 'usd',
   * });
   * 
   * // Recurring subscription
   * const monthlyPrice = await surpay.prices.create({
   *   project_id: 'project-uuid',
   *   product_group_id: 'group-uuid',
   *   price: 999, // $9.99/month
   *   price_currency: 'usd',
   *   recurring_interval: 'month',
   * });
   * ```
   */
  async create(params: CreatePriceRequest): Promise<CreatePriceResponse> {
    return (this.client as any).post('/product/price', params);
  }
}
