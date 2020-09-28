import { initContainer } from './inversify.config'
import { TYPES } from './types/types'
import { WorkItemAssociationService } from './workitem/WorkItemAssociationService'

describe('integ test', function () {
  it('should test', async () => {
    const container = await initContainer()
    const svc = container.get<WorkItemAssociationService>(TYPES.WorkItemAssociationService)
    const testMethods = await svc.linkTestMethods(36424)

    expect(testMethods).toBe('hello')
  })
})
