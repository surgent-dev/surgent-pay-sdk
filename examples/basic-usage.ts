/**
 * Surpay SDK - Basic Usage Example
 * 
 * This file demonstrates the main SDK operations.
 * Run with: npx tsx examples/basic-usage.ts
 */

import { Surpay, SurpayError, isSurpayError } from '../src/index.js';

// Initialize the client
const surpay = new Surpay({
  apiKey: process.env.SURPAY_API_KEY ?? 'sp_org_test_key_123',
  baseUrl: process.env.SURPAY_BASE_URL ?? 'http://localhost:3000',
});

async function main() {
  try {
    // =========================================================================
    // 1. Create a Project
    // =========================================================================
    console.log('Creating project...');
    const project = await surpay.projects.create({
      name: 'My SaaS App',
      slug: 'my-saas-app',
    });
    console.log('Project created:', project.id);

    // =========================================================================
    // 2. Create a Product
    // =========================================================================
    console.log('\nCreating product...');
    const productGroupId = crypto.randomUUID();
    const product = await surpay.products.create({
      project_id: project.id,
      product_group_id: productGroupId,
      name: 'Pro Plan',
      slug: 'pro-plan',
      description: 'Full access to all features',
    });
    console.log('Product created:', product.product_id, 'version:', product.version);

    // =========================================================================
    // 3. Create Prices for the Product
    // =========================================================================
    console.log('\nCreating prices...');
    
    // Monthly price
    const monthlyPrice = await surpay.prices.create({
      project_id: project.id,
      product_group_id: productGroupId,
      name: 'Monthly',
      price: 999, // $9.99 in cents
      price_currency: 'usd',
      recurring_interval: 'month',
    });
    console.log('Monthly price created:', monthlyPrice.product_price_id);

    // Yearly price (with discount)
    const yearlyPrice = await surpay.prices.create({
      project_id: project.id,
      product_group_id: productGroupId,
      name: 'Yearly',
      price: 9900, // $99/year (save ~17%)
      price_currency: 'usd',
      recurring_interval: 'year',
    });
    console.log('Yearly price created:', yearlyPrice.product_price_id);

    // =========================================================================
    // 4. List Products with Prices
    // =========================================================================
    console.log('\nListing products with prices...');
    const productsWithPrices = await surpay.products.listWithPrices();
    for (const { product: p, prices } of productsWithPrices) {
      console.log(`- ${p.name} (${prices.length} prices)`);
      for (const price of prices) {
        const interval = price.recurring_interval ? `/${price.recurring_interval}` : ' one-time';
        console.log(`  - $${(price.price / 100).toFixed(2)}${interval}`);
      }
    }

    // =========================================================================
    // 5. Create a Checkout Session
    // =========================================================================
    console.log('\nCreating checkout session...');
    const checkout = await surpay.checkout.create({
      product_id: product.product_id,
      price_id: monthlyPrice.product_price_id,
      success_url: 'https://myapp.com/success',
      cancel_url: 'https://myapp.com/cancel',
    });
    console.log('Checkout URL:', checkout.checkout_url);
    console.log('Session ID:', checkout.session_id);

    // =========================================================================
    // 6. List Customers (after some have signed up)
    // =========================================================================
    console.log('\nListing customers...');
    const customers = await surpay.customers.list(project.id);
    console.log(`Found ${customers.length} customers`);

    if (customers.length > 0) {
      // Get detailed info for first customer
      const customer = await surpay.customers.get(project.id, customers[0].id);
      console.log('Customer:', customer.email);
      console.log('Subscriptions:', customer.subscriptions.length);
      console.log('Transactions:', customer.transactions.length);
    }

    // =========================================================================
    // 7. List Subscriptions
    // =========================================================================
    console.log('\nListing subscriptions...');
    const subscriptions = await surpay.subscriptions.list(project.id);
    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    console.log(`${activeCount} active / ${subscriptions.length} total subscriptions`);

    // =========================================================================
    // 8. List Transactions
    // =========================================================================
    console.log('\nListing transactions...');
    const transactions = await surpay.transactions.list(project.id);
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    console.log(`Total revenue: $${(totalRevenue / 100).toFixed(2)}`);

  } catch (error) {
    // =========================================================================
    // Error Handling
    // =========================================================================
    if (isSurpayError(error)) {
      // Structured error from the API
      console.error('Surpay API Error:');
      console.error('  Message:', error.message);
      console.error('  Code:', error.code);
      console.error('  Status:', error.status);
    } else {
      // Unexpected error (network, etc.)
      console.error('Unexpected error:', error);
    }
    process.exit(1);
  }
}

main();
