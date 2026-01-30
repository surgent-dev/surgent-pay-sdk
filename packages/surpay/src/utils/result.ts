import { SurpayError } from '../errors.js'
import type { ResponseCase, Result } from '../types.js'
import { camelToSnake } from './case.js'

/**
 * Options for response processing.
 */
export interface ToResultOptions {
  /**
   * Response key case format.
   * - 'camel' (default): Keep original camelCase keys (matches API and TypeScript types)
   * - 'snake': Transform camelCase keys to snake_case (legacy, deprecated)
   */
  responseCase?: ResponseCase
}

/**
 * Converts a fetch Response into a Result container.
 *
 * - Success (2xx): { data: T, error: null, statusCode }
 * - Failure (non-2xx): { data: null, error: SurpayError, statusCode }
 *
 * By default, keeps camelCase keys from the API which match the SDK's TypeScript types.
 * Set responseCase to 'snake' for legacy snake_case transformation (deprecated).
 */
export const toResult = async <T>(
  response: Response,
  options: ToResultOptions = {}
): Promise<Result<T, SurpayError>> => {
  const { responseCase = 'camel' } = options
  const statusCode = response.status

  if (statusCode < 200 || statusCode >= 300) {
    let errorData: { message?: string; code?: string } = {}
    try {
      errorData = await response.json()
    } catch {
      // Failed to parse error body
    }

    return {
      data: null,
      error: new SurpayError({
        message: errorData?.message || `Request failed with status ${statusCode}`,
        code: errorData?.code || statusToCode(statusCode),
        statusCode,
      }),
      statusCode,
    }
  }

  // Handle 204 No Content
  if (statusCode === 204) {
    return { data: {} as T, error: null, statusCode }
  }

  // Parse successful response
  const text = await response.text()
  if (!text) {
    return { data: {} as T, error: null, statusCode }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return {
      data: null,
      error: new SurpayError({
        message: 'Server returned invalid JSON response',
        code: 'invalid_json_response',
        statusCode,
      }),
      statusCode,
    }
  }

  // Transform to snake_case only if explicitly requested (legacy behavior)
  const data = responseCase === 'snake' ? camelToSnake(parsed as T) : (parsed as T)

  return { data, error: null, statusCode }
}

const statusToCode = (status: number): string => {
  switch (status) {
    case 400:
      return 'bad_request'
    case 401:
      return 'unauthorized'
    case 403:
      return 'forbidden'
    case 404:
      return 'not_found'
    case 409:
      return 'conflict'
    case 422:
      return 'validation_error'
    case 429:
      return 'rate_limit_exceeded'
    case 500:
      return 'internal_error'
    default:
      return 'unknown_error'
  }
}
