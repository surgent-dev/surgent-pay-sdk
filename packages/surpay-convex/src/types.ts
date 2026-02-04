/**
 * Convex validators for Surpay action arguments
 */
import { v, Infer } from "convex/values";

// CreateCheckoutArgs: product identifier required (id OR slug), priceId/URLs optional
// Note: customerId is NOT here - it's injected by the wrapper via identify()
export const CreateCheckoutArgs = v.object({
  productId: v.optional(v.string()),
  productSlug: v.optional(v.string()),
  priceId: v.optional(v.string()),
  successUrl: v.optional(v.string()),
  cancelUrl: v.optional(v.string()),
});
export type CreateCheckoutArgs = Infer<typeof CreateCheckoutArgs>;

// CheckArgs: product identifier required (id OR slug)
// Note: customerId is NOT here - it's injected by the wrapper via identify()
export const CheckArgs = v.object({
  productId: v.optional(v.string()),
  productSlug: v.optional(v.string()),
});
export type CheckArgs = Infer<typeof CheckArgs>;

// ListSubscriptions: no args required (uses authenticated user's customerId)
export const ListSubscriptionsArgs = v.object({});
export type ListSubscriptionsArgs = Infer<typeof ListSubscriptionsArgs>;

// GetCustomer: requires customerId
export const GetCustomerArgs = v.object({
  customerId: v.string(),
});
export type GetCustomerArgs = Infer<typeof GetCustomerArgs>;

// ListCustomers: no args required (admin operation)
export const ListCustomersArgs = v.object({});
export type ListCustomersArgs = Infer<typeof ListCustomersArgs>;

// ListProducts: no args required
export const ListProductsArgs = v.object({});
export type ListProductsArgs = Infer<typeof ListProductsArgs>;

// GuestCheckoutArgs: for anonymous checkout - requires customerId explicitly
export const GuestCheckoutArgs = v.object({
  productId: v.optional(v.string()),
  productSlug: v.optional(v.string()),
  priceId: v.optional(v.string()),
  successUrl: v.optional(v.string()),
  cancelUrl: v.optional(v.string()),
  customerId: v.string(),
  customerEmail: v.optional(v.string()),
  customerName: v.optional(v.string()),
});
export type GuestCheckoutArgs = Infer<typeof GuestCheckoutArgs>;
