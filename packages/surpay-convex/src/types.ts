/**
 * Convex validators for Surpay action arguments
 */
import { v, Infer } from "convex/values";

// CreateCheckoutArgs: productId required, priceId/URLs optional
// Note: customerId is NOT here - it's injected by the wrapper via identify()
export const CreateCheckoutArgs = v.object({
  productId: v.string(),
  priceId: v.optional(v.string()),
  successUrl: v.optional(v.string()),
  cancelUrl: v.optional(v.string()),
});
export type CreateCheckoutArgs = Infer<typeof CreateCheckoutArgs>;

// CheckArgs: productId required
// Note: customerId is NOT here - it's injected by the wrapper via identify()
export const CheckArgs = v.object({
  productId: v.string(),
});
export type CheckArgs = Infer<typeof CheckArgs>;

// ListSubscriptions: no args required (project_id from auth context)
export const ListSubscriptionsArgs = v.object({});
export type ListSubscriptionsArgs = Infer<typeof ListSubscriptionsArgs>;

// GetCustomer: requires customer_id (project_id from auth context)
export const GetCustomerArgs = v.object({
  customer_id: v.string(),
});
export type GetCustomerArgs = Infer<typeof GetCustomerArgs>;

// ListCustomers: no args required (project_id from auth context)
export const ListCustomersArgs = v.object({});
export type ListCustomersArgs = Infer<typeof ListCustomersArgs>;
