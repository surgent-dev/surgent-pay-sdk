# @surgent/pay-convex

Convex integration for Surgent Pay SDK.

## Install

```bash
bun add @surgent/pay-convex
```

## Setup

### Step 1: Create `convex/pay.ts`

```typescript
import { Surpay } from "@surgent/pay-convex";

const pay = new Surpay({
  apiKey: process.env.SURGENT_API_KEY!,
  identify: async (ctx) => {
    // Use ctx.auth.getUserIdentity() - works in actions!
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return {
      customerId: identity.subject,
      customerData: { name: identity.name, email: identity.email },
    };
  },
});

export const {
  createCheckout,
  guestCheckout,
  check,
  listProducts,
  getCustomer,
  listCustomers,
  listSubscriptions,
} = pay.api();
```

### Step 2: Set environment variable

Add `SURGENT_API_KEY` to your Convex deployment environment variables.

## Usage

### Create Checkout (Authenticated User)

```typescript
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const createCheckout = useAction(api.pay.createCheckout);

const handleCheckout = async () => {
  const { data, error } = await createCheckout({
    // Use productId OR productSlug (not both)
    productSlug: "pro-plan",
    // productId: "prod_123",  // alternative
    successUrl: window.location.origin + "/success",
    cancelUrl: window.location.origin + "/cancel",
  });

  if (error) {
    console.error(error.message);
    return;
  }

  // Redirect to checkout
  window.location.href = data.checkoutUrl;
};
```

### Guest Checkout (Anonymous User)

For anonymous checkout without requiring sign-in:

```typescript
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

// Get or create persistent guest ID
function getGuestId(): string {
  const key = "surgent_guest_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

const guestCheckout = useAction(api.pay.guestCheckout);

const handleGuestCheckout = async (email?: string, name?: string) => {
  const { data, error } = await guestCheckout({
    productSlug: "pro-plan",
    customerId: getGuestId(),
    customerEmail: email,
    customerName: name,
    successUrl: window.location.origin + "/success",
    cancelUrl: window.location.origin + "/cancel",
  });

  if (error) {
    console.error(error.message);
    return;
  }

  window.location.href = data.checkoutUrl;
};
```

### Check Access

```typescript
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const check = useAction(api.pay.check);

const hasAccess = async () => {
  const { data, error } = await check({
    productSlug: "pro-plan", // or productId: "prod_123"
  });

  if (error) {
    console.error(error.message);
    return false;
  }

  return data.allowed;
};
```

### List Products

```typescript
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const listProducts = useAction(api.pay.listProducts);

const products = await listProducts({});
// products.data = [{ product: { id, name, slug }, prices: [...] }, ...]
```

### Get Customer

```typescript
const getCustomer = useAction(api.pay.getCustomer);
const { data, error } = await getCustomer({ customerId: "cust_123" });
```

### List Customers (Admin)

```typescript
const listCustomers = useAction(api.pay.listCustomers);
const { data, error } = await listCustomers({});
```

### List Subscriptions (Admin)

```typescript
const listSubscriptions = useAction(api.pay.listSubscriptions);
const { data, error } = await listSubscriptions({});
```

## API Reference

### Actions Requiring Authentication

These use `identify()` to get the customer ID automatically:

| Action | Args | Returns |
|--------|------|---------|
| `createCheckout` | `productId?`, `productSlug?`, `priceId?`, `successUrl?`, `cancelUrl?` | `{ data: { checkoutUrl, customerId }, error }` |
| `check` | `productId?`, `productSlug?` | `{ data: { allowed }, error }` |

### Actions NOT Requiring Authentication

| Action | Args | Returns |
|--------|------|---------|
| `guestCheckout` | `productId?`, `productSlug?`, `customerId`, `customerEmail?`, `customerName?`, `priceId?`, `successUrl?`, `cancelUrl?` | `{ data: { checkoutUrl, customerId }, error }` |
| `listProducts` | - | `{ data: ProductWithPrices[], error }` |
| `getCustomer` | `customerId` | `{ data: CustomerWithDetails, error }` |
| `listCustomers` | - | `{ data: Customer[], error }` |
| `listSubscriptions` | - | `{ data: Subscription[], error }` |

## Important Notes

### Using `identify()` Correctly

The `identify()` function runs in a Convex **action** context. Actions have:
- ✅ `ctx.auth.getUserIdentity()` - **use this!**
- ✅ `ctx.runQuery()` / `ctx.runMutation()`
- ❌ `ctx.db` - **NOT available in actions!**

```typescript
// ✅ CORRECT - getUserIdentity works in actions
identify: async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return {
    customerId: identity.subject,
    customerData: { name: identity.name, email: identity.email },
  };
}

// ❌ WRONG - ctx.db doesn't exist in actions!
identify: async (ctx) => {
  const userId = await getAuthUserId(ctx);
  const user = await ctx.db.get(userId); // 💥 FAILS
  return { customerId: userId };
}
```

### Product ID vs Slug

All product-related actions accept either `productId` or `productSlug`:

```typescript
// By ID
await createCheckout({ productId: "prod_abc123" });

// By slug (human-readable)
await createCheckout({ productSlug: "pro-plan" });
```

Using slugs is recommended for readability, but IDs are faster (no lookup needed).
