/**
 * Surpay Convex Integration
 *
 * Provides Convex actions that wrap the Surpay SDK with auth context support.
 *
 * @example
 * ```typescript
 * // convex/surpay.ts
 * import { Surpay } from "@surgent/pay-convex";
 *
 * const surpay = new Surpay({
 *   apiKey: process.env.SURGENT_API_KEY!,
 *   identify: async (ctx) => {
 *     const identity = await ctx.auth.getUserIdentity();
 *     if (!identity) return null;
 *     return {
 *       customerId: identity.subject,
 *       customerData: { name: identity.name, email: identity.email },
 *     };
 *   },
 * });
 *
 * export const {
 *   createCheckout,
 *   guestCheckout,
 *   check,
 *   listProducts,
 *   getCustomer,
 *   listCustomers,
 *   listSubscriptions,
 * } = surpay.api();
 * ```
 */
import { actionGeneric, GenericActionCtx } from "convex/server";
import { Surpay as SurpayClient, ResponseCase } from "@surgent/pay";
import {
  CreateCheckoutArgs,
  CheckArgs,
  GetCustomerArgs,
  ListCustomersArgs,
  ListSubscriptionsArgs,
  ListProductsArgs,
  GuestCheckoutArgs,
} from "./types.js";

// ============================================================================
// Types
// ============================================================================

export type IdentifierOpts = {
  customerId: string;
  customerData?: { name?: string; email?: string };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SurpayConfig<Ctx extends GenericActionCtx<any> = GenericActionCtx<any>> = {
  apiKey: string;
  baseUrl?: string;
  /**
   * Response key case format.
   * - 'camel' (default): camelCase keys matching TypeScript types
   * - 'snake': snake_case keys (legacy)
   */
  responseCase?: ResponseCase;
  /**
   * Identify the current user from the action context.
   * Return null if unauthenticated (will fail for auth-required actions).
   *
   * @example
   * ```typescript
   * identify: async (ctx) => {
   *   const identity = await ctx.auth.getUserIdentity();
   *   if (!identity) return null;
   *   return {
   *     customerId: identity.subject,
   *     customerData: { name: identity.name, email: identity.email },
   *   };
   * }
   * ```
   */
  identify: (ctx: Ctx) => Promise<IdentifierOpts | null>;
};

// ============================================================================
// Error Handling
// ============================================================================

// Convex can't serialize class instances - convert errors to plain objects
type PlainError = { message: string; code?: string };

function toPlainError(error: unknown): PlainError {
  if (error instanceof Error) {
    return { message: error.message, code: (error as { code?: string }).code };
  }
  return { message: String(error) };
}

// Wrap SDK calls to ensure errors are plain objects
async function wrapSdkCall<T>(
  fn: () => Promise<{ data: T; error: null } | { data: null; error: unknown }>
): Promise<{ data: T; error: null } | { data: null; error: PlainError }> {
  try {
    const result = await fn();
    if (result.error) {
      return { data: null, error: toPlainError(result.error) };
    }
    return result as { data: T; error: null };
  } catch (e) {
    return { data: null, error: toPlainError(e) };
  }
}

// ============================================================================
// Helpers
// ============================================================================

function resolveProductId(
  args: { productId?: string; productSlug?: string },
  products: Array<{ product: { id: string; slug: string } }>
): string {
  if (args.productId) return args.productId;
  if (args.productSlug) {
    const found = products.find((p) => p.product.slug === args.productSlug);
    if (!found) throw new Error(`Product with slug "${args.productSlug}" not found`);
    return found.product.id;
  }
  throw new Error("Either productId or productSlug is required");
}

// ============================================================================
// Main Class
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Surpay<Ctx extends GenericActionCtx<any> = GenericActionCtx<any>> {
  private client: SurpayClient;
  private options: SurpayConfig<Ctx>;

  constructor(config: SurpayConfig<Ctx>) {
    this.options = config;
    const g = globalThis as { process?: { env: Record<string, string | undefined> } };
    const envBaseUrl = g.process?.env.SURPAY_BASE_URL;
    this.client = new SurpayClient({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl ?? envBaseUrl,
      responseCase: config.responseCase ?? "camel",
    });
  }

  private async getIdentifierOpts(ctx: Ctx): Promise<IdentifierOpts | null> {
    return await this.options.identify(ctx);
  }

  private async requireAuth(ctx: Ctx): Promise<IdentifierOpts> {
    const opts = await this.getIdentifierOpts(ctx);
    if (!opts) {
      throw new Error(
        "Authentication required. Make sure the user is signed in and your identify() function returns their customerId."
      );
    }
    return opts;
  }

  api() {
    const client = this.client;

    return {
      /**
       * Create a checkout session for the authenticated user.
       * Requires user to be signed in (uses identify() for customerId).
       */
      createCheckout: actionGeneric({
        args: CreateCheckoutArgs,
        handler: async (ctx, args) => {
          try {
            const identifierOpts = await this.requireAuth(ctx as Ctx);

            // Resolve productId from slug if needed
            let productId = args.productId;
            if (!productId && args.productSlug) {
              const { data: products, error } = await client.products.listWithPrices();
              if (error) return { data: null, error: toPlainError(error) };
              productId = resolveProductId(args, products);
            }
            if (!productId) {
              return { data: null, error: { message: "Either productId or productSlug is required" } };
            }

            return wrapSdkCall(() =>
              client.checkout.create({
                productId,
                priceId: args.priceId,
                successUrl: args.successUrl,
                customerId: identifierOpts.customerId,
                customerEmail: identifierOpts.customerData?.email,
                customerName: identifierOpts.customerData?.name,
              })
            );
          } catch (e) {
            return { data: null, error: toPlainError(e) };
          }
        },
      }),

      /**
       * Create a checkout session for a guest (anonymous) user.
       * Does NOT require authentication - customerId must be provided explicitly.
       * Use this for anonymous checkout flows.
       */
      guestCheckout: actionGeneric({
        args: GuestCheckoutArgs,
        handler: async (_ctx, args) => {
          try {
            // Resolve productId from slug if needed
            let productId = args.productId;
            if (!productId && args.productSlug) {
              const { data: products, error } = await client.products.listWithPrices();
              if (error) return { data: null, error: toPlainError(error) };
              productId = resolveProductId(args, products);
            }
            if (!productId) {
              return { data: null, error: { message: "Either productId or productSlug is required" } };
            }

            return wrapSdkCall(() =>
              client.checkout.create({
                productId,
                priceId: args.priceId,
                successUrl: args.successUrl,
                customerId: args.customerId,
                customerEmail: args.customerEmail,
                customerName: args.customerName,
              })
            );
          } catch (e) {
            return { data: null, error: toPlainError(e) };
          }
        },
      }),

      /**
       * Check if a user has access to a product.
       * Pass `customerId` explicitly for guest flows, or omit it to resolve from identity.
       */
      check: actionGeneric({
        args: CheckArgs,
        handler: async (ctx, args) => {
          try {
            const customerId =
              args.customerId ?? (await this.requireAuth(ctx as Ctx)).customerId;

            // Resolve productId from slug if needed
            let productId = args.productId;
            if (!productId && args.productSlug) {
              const { data: products, error } = await client.products.listWithPrices();
              if (error) return { data: null, error: toPlainError(error) };
              productId = resolveProductId(args, products);
            }
            if (!productId) {
              return { data: null, error: { message: "Either productId or productSlug is required" } };
            }

            return wrapSdkCall(() =>
              client.check({
                productId,
                customerId,
              })
            );
          } catch (e) {
            return { data: null, error: toPlainError(e) };
          }
        },
      }),

      /**
       * List all products with their prices.
       * Does not require authentication.
       */
      listProducts: actionGeneric({
        args: ListProductsArgs,
        handler: async () => {
          return wrapSdkCall(() => client.products.listWithPrices());
        },
      }),

      /**
       * Get a specific customer by ID.
       * Does not require the caller to be that customer.
       */
      getCustomer: actionGeneric({
        args: GetCustomerArgs,
        handler: async (_ctx, args) => {
          return wrapSdkCall(() => client.customers.get(args.customerId));
        },
      }),

      /**
       * List all customers (admin operation).
       */
      listCustomers: actionGeneric({
        args: ListCustomersArgs,
        handler: async () => {
          return wrapSdkCall(() => client.customers.list());
        },
      }),

      /**
       * List all subscriptions (admin operation).
       */
      listSubscriptions: actionGeneric({
        args: ListSubscriptionsArgs,
        handler: async () => {
          return wrapSdkCall(() => client.subscriptions.list());
        },
      }),
    };
  }
}

// ============================================================================
// Exports
// ============================================================================

export * from "./types.js";
export type { ResponseCase } from "@surgent/pay";

// Re-export useful types from base SDK for convenience
export type {
  Customer,
  CustomerWithDetails,
  Product,
  ProductPrice,
  ProductWithPrices,
  Subscription,
  SubscriptionStatus,
  CreateCheckoutResponse,
  CheckResponse,
} from "@surgent/pay";
