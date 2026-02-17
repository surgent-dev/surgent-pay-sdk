/**
 * Surpay Client
 *
 * Main SDK client for tenant-level operations.
 * Uses grouped method namespaces (Autumn pattern).
 */

import { SurpayClient } from './client.js'
import type {
  SurpayConfig,
  Customer,
  CustomerWithDetails,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  ProductWithPrices,
  CreatePriceRequest,
  CreatePriceResponse,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  CheckRequest,
  CheckResponse,
  Subscription,
  Transaction,
  Project,
  ConnectAccountRequest,
  ConnectAccountResponse,
  ConnectedAccount,
} from './types.js'

export class Surpay extends SurpayClient {
  constructor(options?: SurpayConfig) {
    const envApiKey = typeof process !== 'undefined' ? process.env.SURPAY_API_KEY : undefined
    const envBaseUrl = typeof process !== 'undefined' ? process.env.SURPAY_BASE_URL : undefined
    const apiKey = options?.apiKey || envApiKey || ''
    const baseUrl = options?.baseUrl ?? envBaseUrl

    if (!apiKey) {
      throw new Error('Surpay API key is required. Pass it via options or set SURPAY_API_KEY env var.')
    }

    super({ apiKey, baseUrl, responseCase: options?.responseCase })
  }

  customers = {
    list: () => this.get<Customer[]>('/customers'),

    get: (customerId: string) => this.get<CustomerWithDetails>(`/customers/${customerId}`),
  }

  products = {
    create: (params: CreateProductRequest) => this.post<CreateProductResponse>('/product', params),

    update: (productId: string, params: UpdateProductRequest) =>
      this.put<UpdateProductResponse>(`/product/${productId}`, params),

    listWithPrices: () => this.get<ProductWithPrices[]>('/products'),
  }

  prices = {
    create: (params: CreatePriceRequest) => this.post<CreatePriceResponse>('/product/price', params),
  }

  checkout = {
    create: (params: CreateCheckoutRequest) => this.post<CreateCheckoutResponse>('/checkout', params),
  }

  check = (params: CheckRequest) => this.post<CheckResponse>('/check', params)

  subscriptions = {
    list: () => this.get<Subscription[]>('/subscriptions'),
  }

  transactions = {
    list: () => this.get<Transaction[]>('/transactions'),
  }

  projects = {
    list: async () => {
      const result = await this.get<Project[] | { projects: Project[] }>('/projects')
      if (result.error) {
        return result
      }
      // Normalize wrapped response: { projects: [...] } -> [...]
      const data = Array.isArray(result.data) ? result.data : (result.data as { projects: Project[] }).projects || []
      return { data, error: null, statusCode: result.statusCode }
    },
  }

  accounts = {
    connect: (params: ConnectAccountRequest) => this.post<ConnectAccountResponse>('/accounts/connect/whop', params),

    get: (accountId: string) => this.get<ConnectedAccount>(`/accounts/${accountId}`),

    list: () => this.get<ConnectedAccount[]>('/accounts'),

    delete: (accountId: string) => this.delete<void>(`/accounts/${accountId}`),
  }
}
