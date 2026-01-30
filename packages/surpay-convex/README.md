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
  productId: "prod_123",
  customerId: "cust_123", // Optional if using identify()
  priceId: "price_123",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
});

if (error) {
  console.error(error.message);
} else {
  console.log(data.checkoutUrl);
}
```

### Check Access

```typescript
import { api } from "./_generated/api";

const { data, error } = await ctx.runAction(api.surpay.check, {
  productId: "prod_123",
  customerId: "cust_123", // Optional if using identify()
});

if (data?.allowed) {
  // Allow access
}
```

### Get Customer

```typescript
import { api } from "./_generated/api";

const { data, error } = await ctx.runAction(api.surpay.getCustomer, {
  customerId: "cust_123",
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
| `createCheckout` | `productId`, `customerId?`, `priceId?`, `successUrl?`, `cancelUrl?` | `{ checkoutUrl: string, customerId: string }` |
| `check` | `productId`, `customerId?` | `{ allowed: boolean }` |
| `getCustomer` | `customerId` | `CustomerWithDetails` |
| `listCustomers` | - | `Customer[]` |
| `listSubscriptions` | - | `Subscription[]` |
