import type { SurpayClient } from '../client.js'
import type { CreateOrganizationRequest, CreateOrganizationResponse } from '../types.js'

export class OrganizationsResource {
  constructor(private client: SurpayClient) {}

  async create(params: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    return this.client.post('/organizations', params)
  }
}
