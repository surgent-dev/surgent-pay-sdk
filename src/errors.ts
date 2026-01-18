/**
 * Custom error class for Surpay API errors.
 * 
 * This gives SDK users structured error information they can handle programmatically.
 * 
 * @example
 * ```typescript
 * try {
 *   await surpay.customers.get(projectId, 'invalid-id');
 * } catch (error) {
 *   if (error instanceof SurpayError) {
 *     if (error.status === 404) {
 *       console.log('Customer not found');
 *     }
 *     console.log('Error code:', error.code);
 *   }
 * }
 * ```
 */
export class SurpayError extends Error {
  /** Machine-readable error code (e.g., 'customer_not_found', 'invalid_api_key') */
  readonly code: string;
  
  /** HTTP status code from the API response */
  readonly status: number;

  constructor(params: { message: string; code: string; status: number }) {
    super(params.message);
    
    // This is important for instanceof checks to work correctly
    // In TypeScript/JS, extending Error requires this
    this.name = 'SurpayError';
    
    this.code = params.code;
    this.status = params.status;

    // Maintains proper stack trace in V8 environments (Node, Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SurpayError);
    }
  }

  /**
   * Returns a formatted string representation of the error.
   */
  toString(): string {
    return `SurpayError: ${this.message} (code: ${this.code}, status: ${this.status})`;
  }
}

/**
 * Type guard to check if an error is a SurpayError.
 * Useful when you want to narrow the type in catch blocks.
 * 
 * @example
 * ```typescript
 * try {
 *   await surpay.checkout.create({ ... });
 * } catch (error) {
 *   if (isSurpayError(error)) {
 *     // TypeScript now knows error is SurpayError
 *     console.log(error.code);
 *   }
 * }
 * ```
 */
export function isSurpayError(error: unknown): error is SurpayError {
  return error instanceof SurpayError;
}
