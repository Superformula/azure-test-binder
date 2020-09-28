import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import { mock } from 'jest-mock-extended'

import { shallowTestCaseResultFactory } from '../../test/ado-fakes'
import { Env } from '../types/types'
import { AdoWorkItemService } from './WorkItemService'

describe('WorkItemService Tests', function () {
  const mockWorkItemService = mock<IWorkItemTrackingApi>()
  const mockTestService = mock<ITestApi>()
  const mockEnv = mock<Env>()
  const tested = new AdoWorkItemService(mockWorkItemService, mockTestService, mockEnv)
  const fakeTestResults = shallowTestCaseResultFactory.buildList(3)

  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    mockEnv.PROJECT = 'foo'
  })

  it('should return empty for no build found', async function () {
    mockTestService.getTestResultsByBuild.mockImplementation(() => Promise.resolve([]))
    expect(mockWorkItemService.updateWorkItem).toHaveBeenCalledTimes(0)
    const methods = await tested.linkTestMethods(0)
  })
})
