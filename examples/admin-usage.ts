import { SurpayAdmin, Surpay, isSurpayError } from '../src/index.js'

async function main() {
  // Admin operations (Surgent backend only)
  const admin = new SurpayAdmin({
    masterKey: 'sp_master_your_master_key',
    baseUrl: 'http://localhost:3000'
  })

  try {
    // Create a new organization
    const org = await admin.organizations.create({
      name: 'Tenant A'
    })
    console.log('Created organization:', org)
    console.log('Organization API key:', org.api_key)

    // Now use the org key for tenant operations
    const surpay = new Surpay({
      apiKey: org.api_key,
      baseUrl: 'http://localhost:3000'
    })

    // Tenant operations...
    const products = await surpay.products.listWithPrices()
    console.log('Products:', products)
  } catch (error) {
    if (isSurpayError(error)) {
      console.error('Surpay error:', error.message, error.code)
    } else {
      throw error
    }
  }
}

main()
