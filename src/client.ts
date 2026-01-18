/**
 * Base HTTP client for Surpay SDK.
 * 
 * This class handles:
 * - Authentication (Bearer token)
 * - HTTP methods (GET, POST, PUT, DELETE)
 * - Response parsing
 * - Error handling
 * 
 * Resource classes (CustomersResource, ProductsResource, etc.) extend or use this.
 */

import { SurpayError } from './errors.js';
import type { SurpayConfig } from './types.js';

const DEFAULT_BASE_URL = 'https://api.surpay.io';

export class SurpayClient {
  public readonly baseUrl: string;
  public readonly headers: Record<string, string>;

  constructor(config: SurpayConfig) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Makes a GET request to the API.
   * 
   * @param path - API endpoint path (e.g., '/project/123/customers')
   * @returns Parsed JSON response
   */
  public async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a POST request to the API.
   * 
   * @param path - API endpoint path
   * @param body - Request body (will be JSON stringified)
   * @returns Parsed JSON response
   */
  public async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a PUT request to the API.
   * 
   * @param path - API endpoint path
   * @param body - Request body (will be JSON stringified)
   * @returns Parsed JSON response
   */
  public async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Makes a DELETE request to the API.
   * 
   * @param path - API endpoint path
   * @returns Parsed JSON response
   */
  public async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Handles API response, parsing JSON and throwing errors for non-2xx responses.
   * 
   * This is the centralized error handling - all HTTP methods use this.
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Success case: 2xx status codes
    if (response.ok) {
      // Handle empty responses (204 No Content, etc.)
      const text = await response.text();
      if (!text) {
        return {} as T;
      }
      return JSON.parse(text) as T;
    }

    // Error case: Try to parse error body
    let errorBody: { message?: string; code?: string } = {};
    try {
      const text = await response.text();
      if (text) {
        errorBody = JSON.parse(text);
      }
    } catch {
      // If we can't parse the error body, use defaults
    }

    // Map common HTTP status codes to error codes
    const code = errorBody.code ?? this.statusToCode(response.status);
    const message = errorBody.message ?? `Request failed with status ${response.status}`;

    throw new SurpayError({
      message,
      code,
      status: response.status,
    });
  }

  /**
   * Maps HTTP status codes to error codes when the API doesn't provide one.
   */
  private statusToCode(status: number): string {
    switch (status) {
      case 400: return 'bad_request';
      case 401: return 'unauthorized';
      case 403: return 'forbidden';
      case 404: return 'not_found';
      case 409: return 'conflict';
      case 422: return 'validation_error';
      case 429: return 'rate_limit_exceeded';
      case 500: return 'internal_error';
      default: return 'unknown_error';
    }
  }
}
