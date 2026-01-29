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
import { actionGeneric, GenericActionCtx } from "convex/server";
import { Surpay as SurpayClient, ResponseCase, camelToSnake } from "@surgent-dev/surpay";
import {
  CreateCheckoutArgs,
  CheckArgs,
  GetCustomerArgs,
  ListCustomersArgs,
  ListSubscriptionsArgs,
} from "./types.js";

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
   * - 'snake' (default): snake_case keys to match Convex validators
   * - 'camel': camelCase keys from API responses
   *
   * Defaults to 'snake' for Convex validator compatibility.
   */
  responseCase?: ResponseCase;
  identify: (ctx: Ctx) => Promise<IdentifierOpts | null>;
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
      // Default to snake_case for Convex validator compatibility
      responseCase: config.responseCase ?? "snake",
    });
  }

  async getIdentifierOpts(ctx: Ctx): Promise<IdentifierOpts | null> {
    return await this.options.identify(ctx);
  }

  async getAuthParams({
    ctx,
    requireAuth = true,
  }: {
    ctx: Ctx;
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
          const { client, identifierOpts } = await this.getAuthParams({ ctx: ctx as Ctx });
          // Transform camelCase user args to snake_case for API
          const snakeCaseArgs = camelToSnake(args) as unknown as {
            product_id: string;
            price_id?: string;
            success_url?: string;
            cancel_url?: string;
          };
          return wrapSdkCall(() =>
            client.checkout.create({
              ...snakeCaseArgs,
              customer_id: identifierOpts!.customerId,
              customer_data: identifierOpts!.customerData,
            })
          );
        },
      }),

      check: actionGeneric({
        args: CheckArgs,
        handler: async (ctx, args) => {
          const { client, identifierOpts } = await this.getAuthParams({ ctx: ctx as Ctx });
          return wrapSdkCall(() =>
            client.check({
              product_id: args.productId,
              customer_id: identifierOpts!.customerId,
            })
          );
        },
      }),

      getCustomer: actionGeneric({
        args: GetCustomerArgs,
        handler: async (ctx, args) => {
          const { client } = await this.getAuthParams({ ctx: ctx as Ctx, requireAuth: false });
          return wrapSdkCall(() => client.customers.get(args.customer_id));
        },
      }),

      listCustomers: actionGeneric({
        args: ListCustomersArgs,
        handler: async (ctx) => {
          const { client } = await this.getAuthParams({ ctx: ctx as Ctx });
          return wrapSdkCall(() => client.customers.list());
        },
      }),

      listSubscriptions: actionGeneric({
        args: ListSubscriptionsArgs,
        handler: async (ctx) => {
          const { client } = await this.getAuthParams({ ctx: ctx as Ctx });
          return wrapSdkCall(() => client.subscriptions.list());
        },
      }),
    };
  }
}

export * from "./types.js";
export type { ResponseCase } from "@surgent-dev/surpay";
