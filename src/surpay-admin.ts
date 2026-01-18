import { SurpayClient } from './client.js'
import { OrganizationsResource } from './resources/organizations.js'
import type { SurpayAdminConfig } from './types.js'

export class SurpayAdmin extends SurpayClient {
  public readonly organizations: OrganizationsResource

  constructor(config: SurpayAdminConfig) {
    if (!config.masterKey?.startsWith('sp_master_')) {
      throw new Error('Invalid master key format. Expected sp_master_... prefix.')
    }

    super({
      apiKey: config.masterKey,
      baseUrl: config.baseUrl
    })

    this.organizations = new OrganizationsResource(this)
  }
}
