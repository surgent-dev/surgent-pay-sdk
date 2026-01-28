/**
 * Case transformation utilities for API response normalization.
 *
 * The Surpay API returns camelCase keys (e.g., `productGroupId`), but the SDK's
 * TypeScript types use snake_case (e.g., `product_group_id`) to match Rust conventions.
 * These utilities transform response data to match the expected types.
 */

/**
 * Converts a single camelCase string to snake_case.
 *
 * @example
 * stringToSnakeCase('productGroupId') // 'product_group_id'
 * stringToSnakeCase('isDefault') // 'is_default'
 */
const stringToSnakeCase = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

/**
 * Recursively transforms all object keys from camelCase to snake_case.
 *
 * Handles:
 * - Nested objects (recursively transforms)
 * - Arrays of objects (transforms each element)
 * - Null/undefined values (passes through unchanged)
 * - Primitive values (passes through unchanged)
 *
 * @example
 * camelToSnake({ productGroupId: 'pg_123', isDefault: true })
 * // { product_group_id: 'pg_123', is_default: true }
 *
 * camelToSnake([{ customerId: 'cus_1' }, { customerId: 'cus_2' }])
 * // [{ customer_id: 'cus_1' }, { customer_id: 'cus_2' }]
 *
 * @param input - The value to transform (object, array, or primitive)
 * @returns The transformed value with snake_case keys
 */
export const camelToSnake = <T>(input: T): T => {
  // Handle null/undefined
  if (input === null || input === undefined) {
    return input
  }

  // Handle arrays - transform each element
  if (Array.isArray(input)) {
    return input.map((item) => camelToSnake(item)) as T
  }

  // Handle objects - transform keys and recurse into values
  if (typeof input === 'object') {
    const result: Record<string, unknown> = {}

    for (const key of Object.keys(input)) {
      const snakeKey = stringToSnakeCase(key)
      result[snakeKey] = camelToSnake((input as Record<string, unknown>)[key])
    }

    return result as T
  }

  // Primitives pass through unchanged
  return input
}
