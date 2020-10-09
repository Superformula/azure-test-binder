import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import { mock } from 'jest-mock-extended'

import { shallowTestCaseResultFactory } from '../../test/ado-fakes'
import { Env } from '../types/types'
import { TestMethodInfo } from './types'
import { DefaultWorkItemAssociationService } from './WorkItemAssociationService'

describe('WorkItemService Tests', function () {
  const mockWorkItemService = mock<IWorkItemTrackingApi>()
  const mockTestService = mock<ITestApi>()
  const mockEnv = mock<Env>()
  const tested = new DefaultWorkItemAssociationService(mockWorkItemService, mockTestService, mockEnv)
  const [a, b, _c] = shallowTestCaseResultFactory.buildList(3)

  afterEach(() => {
    jest.resetAllMocks()
  })

  beforeEach(() => {
    mockEnv.PROJECT = 'foo'
  })

  it('should return empty for no build found', async function () {
    mockTestService.getTestResultsByBuild.mockImplementation(() => Promise.resolve([]))
    const { success, unknownWorkItem } = await tested.linkTestMethods(0)
    expect(success).toStrictEqual([])
    expect(unknownWorkItem).toStrictEqual([])

    expect(mockWorkItemService.updateWorkItem).toHaveBeenCalledTimes(0)
  })

  it('should return only unknown for test with no work items', async function () {
    const expectedTestMethod: TestMethodInfo = { name: a.automatedTestName, id: a.id, refId: a.refId }
    mockTestService.getTestResultsByBuild.mockImplementation(() => Promise.resolve([a]))
    const { success, unknownWorkItem } = await tested.linkTestMethods(0)
    expect(success).toStrictEqual([])
    expect(unknownWorkItem).toStrictEqual([expectedTestMethod])

    expect(mockWorkItemService.updateWorkItem).toHaveBeenCalledTimes(0)
  })

  it('should return only success for test with only work items', async function () {
    const automatedTestName = `${a.automatedTestName} #12345`
    const testWithWorkItem = { ...a, automatedTestName }
    const expected = { testId: a.id, testName: automatedTestName, testRefId: a.refId, workItemId: 12345 }

    mockTestService.getTestResultsByBuild.mockImplementation(() => Promise.resolve([testWithWorkItem]))

    const { success, unknownWorkItem } = await tested.linkTestMethods(0)
    expect(success).toStrictEqual([expected])
    expect(unknownWorkItem).toStrictEqual([])

    expect(mockWorkItemService.updateWorkItem).toHaveBeenCalledTimes(1)
  })

  it('should return success and unknown for tests with and without work items', async function () {
    const unknownTestMethod = { name: a.automatedTestName, id: a.id, refId: a.refId }
    const automatedTestName = `${b.automatedTestName} #12345`
    const testWithWorkItem = { ...b, automatedTestName }
    const expectedWithWorkItem = { testId: a.id, testName: automatedTestName, testRefId: a.refId, workItemId: 12345 }

    mockTestService.getTestResultsByBuild.mockImplementation(() => Promise.resolve([testWithWorkItem, a]))

    const { success, unknownWorkItem } = await tested.linkTestMethods(0)
    expect(success).toStrictEqual([expectedWithWorkItem])
    expect(unknownWorkItem).toStrictEqual([unknownTestMethod])

    expect(mockWorkItemService.updateWorkItem).toHaveBeenCalledTimes(1)
  })
})
