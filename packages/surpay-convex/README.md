# @surgent-dev/surpay-convex

Convex integration for Surpay SDK.

## Install

```bash
npm install @surgent-dev/surpay-convex
```

## Setup

Step 1: Create `convex/surpay.ts`

```typescript
import { Surpay } from "@surgent-dev/surpay-convex";

const surpay = new Surpay({
  apiKey: process.env.SURPAY_API_KEY!,
  identify: async (ctx) => {
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
  check,
  getCustomer,
  listCustomers,
  listSubscriptions,
} = surpay.api();
```

Step 2: Set environment variable

Add `SURPAY_API_KEY` to your Convex dashboard environment variables.

## Usage

### Create Checkout

```typescript
import { api } from "./_generated/api";

// Inside a Convex action or from client
const { data, error } = await ctx.runAction(api.surpay.createCheckout, {
  product_id: "prod_123",
  customer_id: "cust_123", // Optional if using identify()
  price_id: "price_123",
  success_url: "https://example.com/success",
  cancel_url: "https://example.com/cancel",
});

if (error) {
  console.error(error.message);
} else {
  console.log(data.checkout_url);
}
```

### Check Access

```typescript
import { api } from "./_generated/api";

const { data, error } = await ctx.runAction(api.surpay.check, {
  product_id: "prod_123",
  customer_id: "cust_123", // Optional if using identify()
});

if (data?.allowed) {
  // Allow access
}
```

### Get Customer

```typescript
import { api } from "./_generated/api";

const { data, error } = await ctx.runAction(api.surpay.getCustomer, {
  customer_id: "cust_123",
});
```

### List Customers

```typescript
import { api } from "./_generated/api";

const { data, error } = await ctx.runAction(api.surpay.listCustomers, {});
```

### List Subscriptions

```typescript
import { api } from "./_generated/api";

const { data, error } = await ctx.runAction(api.surpay.listSubscriptions, {});
```

## API Reference

| Action | Args | Returns |
|--------|------|---------|
| `createCheckout` | `product_id`, `customer_id?`, `price_id?`, `success_url?`, `cancel_url?` | `{ checkout_url: string, customer_id: string }` |
| `check` | `product_id`, `customer_id?` | `{ allowed: boolean }` |
| `getCustomer` | `customer_id` | `CustomerWithDetails` |
| `listCustomers` | - | `Customer[]` |
| `listSubscriptions` | - | `Subscription[]` |
