/**
 * Surpay SDK - Admin Usage Example
 * 
 * Demonstrates organization-level operations with the admin client.
 * Run with: bun examples/admin-usage.ts
 */

import { SurpayAdmin, Surpay } from '../src/index.js';

async function main() {
  // Admin operations (master key required)
  const env = typeof process !== 'undefined' ? process.env : {};
  const admin = new SurpayAdmin({
    masterKey: env.SURPAY_MASTER_KEY ?? 'sp_master_test_key_123',
    baseUrl: env.SURPAY_BASE_URL ?? 'http://localhost:8090',
  });

  // Create a new organization
  const { data: org, error: orgError } = await admin.organizations.create({
    name: 'Tenant A',
    slug: 'tenant-a',
  });

  if (orgError) {
    console.error('Failed to create organization:', orgError.message, orgError.code);
    process.exit(1);
  }

  console.log('Created organization:', org.id);
  console.log('Organization API key:', org.api_key);

  // Now use the org key for tenant operations
  const surpay = new Surpay({
    apiKey: org.api_key,
    baseUrl: env.SURPAY_BASE_URL ?? 'http://localhost:8090',
  });

  // Tenant operations...
  const { data: products, error: productsError } = await surpay.products.listWithPrices();

  if (productsError) {
    console.error('Failed to list products:', productsError.message);
    process.exit(1);
  }

  console.log('Products:', products.length);
}

main();
