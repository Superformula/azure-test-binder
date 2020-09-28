import { initContainer } from './inversify.config'
import { TYPES } from './types/types'
import { WorkItemService } from './workitem/WorkItemService'

describe('integ test', function () {
  it('should test', async () => {
    const container = await initContainer()
    const svc = container.get<WorkItemService>(TYPES.WorkItemService)
    const testMethods = await svc.linkTestMethods(36424)

    expect(testMethods).toBe('hello')
  })
})
