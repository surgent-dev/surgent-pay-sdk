/**
 * Surpay Convex Integration
 *
 * Provides Convex actions that wrap the Surpay SDK with auth context support.
 *
 * @example
 * ```typescript
 * // convex/surpay.ts
 * import { Surpay } from "@surgent-dev/surpay-convex";
 *
 * const surpay = new Surpay({
 *   apiKey: process.env.SURPAY_API_KEY!,
 *   identify: async (ctx) => {
 *     const identity = await ctx.auth.getUserIdentity();
 *     if (!identity) return null;
 *     return {
 *       customerId: identity.subject,
 *       customerData: { name: identity.name, email: identity.email },
 *     };
 *   },
 * });
 * export const { createCheckout, getCustomer, listCustomers, listSubscriptions } = surpay.api();
 * ```
 */
import { actionGeneric } from "convex/server";
import { Surpay as SurpayClient } from "@surgent-dev/surpay";
import {
  CreateCheckoutArgs,
  GetCustomerArgs,
  ListCustomersArgs,
  ListSubscriptionsArgs,
} from "./types.js";

export type IdentifierOpts = {
  customerId: string;
  customerData?: { name?: string; email?: string };
};

export type SurpayConfig = {
  apiKey: string;
  baseUrl?: string;
  identify: (ctx: any) => Promise<IdentifierOpts | null>;
};

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

export class Surpay {
  private client: SurpayClient;
  private options: SurpayConfig;

  constructor(config: SurpayConfig) {
    this.options = config;
    this.client = new SurpayClient({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    });
  }

  async getIdentifierOpts(ctx: any): Promise<IdentifierOpts | null> {
    return await this.options.identify(ctx);
  }

  async getAuthParams({
    ctx,
    requireAuth = true,
  }: {
    ctx: any;
    requireAuth?: boolean;
  }): Promise<{ client: SurpayClient; identifierOpts: IdentifierOpts | null }> {
    const identifierOpts = await this.getIdentifierOpts(ctx);
    if (requireAuth && !identifierOpts) {
      throw new Error("No customer identifier found");
    }
    return { client: this.client, identifierOpts };
  }

  api() {
    return {
      createCheckout: actionGeneric({
        args: CreateCheckoutArgs,
        handler: async (ctx, args) => {
          const { client, identifierOpts } = await this.getAuthParams({ ctx });
          // Merge customer info from auth context with checkout args
          const checkoutParams = {
            ...args,
            customer_id: identifierOpts!.customerId,
            customer_name: identifierOpts!.customerData?.name,
            customer_email: identifierOpts!.customerData?.email,
          };
          return wrapSdkCall(() =>
            client.checkout.create(checkoutParams as Parameters<typeof client.checkout.create>[0])
          );
        },
      }),

      getCustomer: actionGeneric({
        args: GetCustomerArgs,
        handler: async (ctx, args) => {
          const { client, identifierOpts } = await this.getAuthParams({ ctx });
          const customerId = args.customer_id || identifierOpts!.customerId;
          return wrapSdkCall(() =>
            client.customers.get(args.project_id, customerId)
          );
        },
      }),

      listCustomers: actionGeneric({
        args: ListCustomersArgs,
        handler: async (ctx, args) => {
          const { client } = await this.getAuthParams({ ctx });
          return wrapSdkCall(() => client.customers.list(args.project_id));
        },
      }),

      listSubscriptions: actionGeneric({
        args: ListSubscriptionsArgs,
        handler: async (ctx, args) => {
          const { client } = await this.getAuthParams({ ctx });
          return wrapSdkCall(() => client.subscriptions.list(args.project_id));
        },
      }),
    };
  }
}

export * from "./types.js";
