/**
 * Convex validators for Surpay action arguments
 */
import { v, Infer } from "convex/values";

// CreateCheckoutRequest: product_id, price_id, success_url, cancel_url (all required)
export const CreateCheckoutArgs = v.object({
  product_id: v.string(),
  price_id: v.string(),
  success_url: v.string(),
  cancel_url: v.string(),
});
export type CreateCheckoutArgs = Infer<typeof CreateCheckoutArgs>;

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
