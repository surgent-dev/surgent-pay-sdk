/**
 * Convex validators for Surpay action arguments
 */
import { v, Infer } from "convex/values";

// CreateCheckoutArgs: product_id required, price_id/URLs optional
// Note: customer_id is NOT here - it's injected by the wrapper via identify()
export const CreateCheckoutArgs = v.object({
  product_id: v.string(),
  price_id: v.optional(v.string()),
  success_url: v.optional(v.string()),
  cancel_url: v.optional(v.string()),
});
export type CreateCheckoutArgs = Infer<typeof CreateCheckoutArgs>;

// CheckArgs: product_id required
// Note: customer_id is NOT here - it's injected by the wrapper via identify()
export const CheckArgs = v.object({
  product_id: v.string(),
});
export type CheckArgs = Infer<typeof CheckArgs>;

// ListSubscriptions: requires project_id
export const ListSubscriptionsArgs = v.object({
  project_id: v.string(),
});
export type ListSubscriptionsArgs = Infer<typeof ListSubscriptionsArgs>;

// GetCustomer: requires project_id and customer_id
export const GetCustomerArgs = v.object({
  project_id: v.string(),
  customer_id: v.string(),
});
export type GetCustomerArgs = Infer<typeof GetCustomerArgs>;

// ListCustomers: requires project_id
export const ListCustomersArgs = v.object({
  project_id: v.string(),
});
export type ListCustomersArgs = Infer<typeof ListCustomersArgs>;
