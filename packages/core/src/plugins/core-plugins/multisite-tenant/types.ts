export interface MultisiteAlias {
  id: string
  name: string
  domain: string
  isDefault: boolean
}

export interface MultisiteItem {
  id: string
  name: string
  domain: string
  isInitial: boolean
}


export interface MultisiteSettings {
  /** Whether to use aliases for multisite tenants */
  useAliases?: boolean | number | string
}

/**
 * Multisite service response interface
 */
export interface MultisiteServiceResponse<T = any> {
  /** Whether the operation was successful */
  success: boolean
  /** Response data */
  data?: T
  /** Error message if unsuccessful */
  error?: string
  /** Optional message */
  message?: string
}
