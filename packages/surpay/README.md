# Surpay SDK for TypeScript

The Surpay SDK provides a simple and type-safe way to interact with the Surpay API.

## Installation

```bash
bun add surpay
# or
npm install surpay
```

## Quick Start

```typescript
import { Surpay } from 'surpay'

const surpay = new Surpay({
  apiKey: 'xKmZqWpNrTsYvBcDfGhJkLmNpQrStUvWxYzAbCdEfGhJkLmNpQrStUvWxYzAbCd',
})

async function example() {
  const { data: projects, error } = await surpay.projects.list()

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log('Projects:', projects)
}
```

## Configuration

The SDK can be configured via the constructor or environment variables.

```typescript
import { Surpay } from 'surpay'

const surpay = new Surpay({
  apiKey: process.env.SURPAY_API_KEY, // Fallback: SURPAY_API_KEY env var
  baseUrl: 'https://pay.surgent.dev', // Optional
})
```

## Result Pattern & Error Handling

All SDK methods return a `Promise<Result<T, SurpayError>>`.

```typescript
const result = await surpay.projects.list()

if (result.error) {
  // Handle error
  console.error(result.error.message)
  console.error(result.error.code)
  console.error(result.statusCode)
} else {
  // Use data
  console.log(result.data)
}
```

### Error Helper

Use `isSurpayError` to check if an error object is a `SurpayError`.

```typescript
import { isSurpayError } from 'surpay'

try {
  // ...
} catch (err) {
  if (isSurpayError(err)) {
    console.error(err.code)
  }
}
```

## API Reference

### Projects

Note: Projects are created via the Surgent dashboard. The SDK provides read-only access to list your projects.

```typescript
// List projects
const { data: projects, error } = await surpay.projects.list()
```

### Products

Manage products within a project.

```typescript
// Create a product
const { data: product, error } = await surpay.products.create({
  productGroup: 'group_456',
  name: 'Pro Plan',
  slug: 'pro-plan',
})

// Update a product
const { data: updated, error: updateError } = await surpay.products.update('prod_123', {
  name: 'Pro Plan v2',
})

// List products with their prices
const { data: products, error: listError } = await surpay.products.listWithPrices()
```

### Prices

Manage pricing for your products.

```typescript
// Create a price
const { data: price, error } = await surpay.prices.create({
  productGroup: 'group_456',
  name: 'Monthly',
  price: 999, // $9.99
  priceCurrency: 'usd',
  recurringInterval: 'month',
})
```

### Checkout

Create hosted checkout sessions.

```typescript
// Create a checkout session
const { data: checkout, error } = await surpay.checkout.create({
  productId: 'prod_123',
  priceId: 'price_456',
  customerId: 'cust_123', // Required
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel',
})

if (checkout) {
  console.log(checkout.checkoutUrl)
}
```

### Check

Verify if a customer has access to a specific product.

```typescript
const { data, error } = await surpay.check({
  customerId: 'cust_123',
  productId: 'prod_123',
})

if (data?.allowed) {
  console.log('Customer has access')
}
```

### Customers

Retrieve customer information.

```typescript
// List customers
const { data: customers, error } = await surpay.customers.list()

// Get customer with details (subscriptions & transactions)
const { data: customer, error: getError } = await surpay.customers.get('cust_123')
```

### Subscriptions

Monitor active subscriptions.

```typescript
// List subscriptions
const { data: subscriptions, error } = await surpay.subscriptions.list()
```

### Transactions

Track payments and revenue.

```typescript
// List transactions
const { data: transactions, error } = await surpay.transactions.list()
```

### Accounts

Manage connected payment processor accounts.

```typescript
// Connect a new account (Stripe)
const { data: account, error } = await surpay.accounts.connect({
  processor: 'stripe',
})

// Get account details
const { data: accountDetails, error: getError } = await surpay.accounts.get('acc_123')

// List connected accounts
const { data: accounts, error: listError } = await surpay.accounts.list()

// Delete/Disconnect an account
const { error: deleteError } = await surpay.accounts.delete('acc_123')
```
