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
});

export const {
  createCheckout,
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

### Get Customer

```typescript
import { api } from "./_generated/api";

const { data, error } = await ctx.runAction(api.surpay.getCustomer, {
  project_id: "proj_123",
  customer_id: "cust_123",
});
```

### List Subscriptions

```typescript
import { api } from "./_generated/api";

const { data, error } = await ctx.runAction(api.surpay.listSubscriptions, {
  project_id: "proj_123",
});
```

## API Reference

| Action | Args | Returns |
|--------|------|---------|
| `createCheckout` | `product_id`, `price_id`, `success_url`, `cancel_url` | `{ checkout_url: string, session_id: string }` |
| `getCustomer` | `project_id`, `customer_id` | `CustomerWithDetails` |
| `listCustomers` | `project_id` | `Customer[]` |
| `listSubscriptions` | `project_id` | `Subscription[]` |
