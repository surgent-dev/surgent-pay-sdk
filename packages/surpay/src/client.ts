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
  /** Request timeout in milliseconds. Default: 30000 (30 seconds) */
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 30000

export class SurpayClient {
  protected readonly baseUrl: string
  protected readonly headers: Record<string, string>
  protected readonly resultOptions: ToResultOptions
  protected readonly timeoutMs: number

  constructor(options: SurpayClientOptions) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
    this.headers = {
      Authorization: `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
    }
    this.resultOptions = {
      responseCase: options.responseCase ?? 'snake',
    }
  }

  protected async get<T>(path: string): Promise<Result<T, SurpayError>> {
    return this.request<T>('GET', path)
  }

  protected async post<T>(path: string, body?: unknown): Promise<Result<T, SurpayError>> {
    return this.request<T>('POST', path, body)
  }

  protected async put<T>(path: string, body: unknown): Promise<Result<T, SurpayError>> {
    return this.request<T>('PUT', path, body)
  }

  protected async delete<T>(path: string): Promise<Result<T, SurpayError>> {
    return this.request<T>('DELETE', path)
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<Result<T, SurpayError>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: this.headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(this.timeoutMs),
      })
      return toResult<T>(response, this.resultOptions)
    } catch (error) {
      return this.handleFetchError<T>(error)
    }
  }

  private handleFetchError<T>(error: unknown): Result<T, SurpayError> {
    // Timeout errors from AbortSignal.timeout()
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return {
        data: null,
        error: new SurpayError({
          message: `Request timed out after ${this.timeoutMs}ms`,
          code: 'timeout_error',
          statusCode: 0,
        }),
        statusCode: 0,
      }
    }

    // Network errors (DNS failure, connection refused, etc.)
    const message = error instanceof Error ? error.message : 'Network request failed'
    return {
      data: null,
      error: new SurpayError({
        message,
        code: 'network_error',
        statusCode: 0,
      }),
      statusCode: 0,
    }
  }
}
