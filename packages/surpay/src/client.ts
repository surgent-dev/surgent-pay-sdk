/**
 * Base HTTP client for Surpay SDK.
 *
 * Provides core HTTP methods with Result pattern error handling.
 */

import { toResult, type ToResultOptions } from './utils/result.js'
import { SurpayError } from './errors.js'
import type { ResponseCase, Result } from './types.js'

const DEFAULT_BASE_URL = 'https://pay.surgent.dev'

export interface SurpayClientOptions {
  apiKey: string
  baseUrl?: string
  responseCase?: ResponseCase
}

export class SurpayClient {
  protected readonly baseUrl: string
  protected readonly headers: Record<string, string>
  protected readonly resultOptions: ToResultOptions

  constructor(options: SurpayClientOptions) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL
    this.headers = {
      Authorization: `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
    }
    this.resultOptions = {
      responseCase: options.responseCase ?? 'snake',
    }
  }

  protected async get<T>(path: string): Promise<Result<T, SurpayError>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.headers,
    })
    return toResult<T>(response, this.resultOptions)
  }

  protected async post<T>(path: string, body?: unknown): Promise<Result<T, SurpayError>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    return toResult<T>(response, this.resultOptions)
  }

  protected async put<T>(path: string, body: unknown): Promise<Result<T, SurpayError>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body),
    })
    return toResult<T>(response, this.resultOptions)
  }

  protected async delete<T>(path: string): Promise<Result<T, SurpayError>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.headers,
    })
    return toResult<T>(response, this.resultOptions)
  }
}
