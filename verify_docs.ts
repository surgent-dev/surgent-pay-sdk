import { Surpay, isSurpayError } from './src/index.js'

async function test() {
  const surpay = new Surpay({
    apiKey: 'xKmZqWpNrTsYvBcDfGhJkLmNpQrStUvWxYzAbCdEfGhJkLmNpQrStUvWxYzAbCd',
  })

  // Projects
  await surpay.projects.list()

  // Products
  await surpay.products.create({
    product_group_id: '456',
    name: 'test',
    slug: 'test',
  })
  await surpay.products.update('123', { name: 'test' })
  await surpay.products.listWithPrices()

  // Prices
  await surpay.prices.create({
    product_group_id: '456',
    price: 100,
    price_currency: 'usd',
  })

  // Checkout
  await surpay.checkout.create({
    product_id: '123',
    price_id: '456',
    success_url: 'http://test.com',
    cancel_url: 'http://test.com',
  })

  // Customers
  await surpay.customers.list()
  await surpay.customers.get('456')

  // Subscriptions
  await surpay.subscriptions.list()

  // Transactions
  await surpay.transactions.list()

  // Accounts
  await surpay.accounts.connect({ processor: 'stripe' })
  await surpay.accounts.get('123')
  await surpay.accounts.list()

  // Error handling
  try {
  } catch (err) {
    if (isSurpayError(err)) {
      console.log(err.code)
    }
  }
}
