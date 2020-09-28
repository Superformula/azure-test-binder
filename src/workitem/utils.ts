import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces'

import { Optional } from '../types/types'
import { TestMethodInfo, WorkItemTestAssociationInfo, WorkItemTestDto, WorkItemUpdate } from './types'

const defaultWorkItemIdPattern = /(#?\d{5})/g

/**
 * Extract a work item id from a text string.
 * ```ts
 *  const aStringWithAWorkItemId = 'I have a work item id #12345'
 *  const id = extractWorkItemId(aStringWithAWorkItemId) // id === 12345
 * ```
 * @param text - `string` text to search
 */
export const extractWorkItemId = (text: string): Optional<string> => {
  const strings = text.match(defaultWorkItemIdPattern) ?? []
  const id = strings[0]
  const result = id ? id.replace(/\D/g, '') : undefined

  return result
}

/**
 * Partition an array of {@link ShallowTestCaseResult} into a {@link WorkItemTestAssociationInfo}
 *
 * @param testResults - {@link ShallowTestCaseResult} array to partition.
 */
export const partition = (testResults: TestMethodInfo[]): WorkItemTestAssociationInfo => {
  return testResults.reduce<WorkItemTestAssociationInfo>(
    (workItemAssoc, testResult) => {
      const workItemId = extractWorkItemId(testResult.name)

      if (workItemId) {
        const prev = workItemAssoc[workItemId]
        const updated = prev ? [testResult, ...prev] : [testResult]
        workItemAssoc[workItemId] = updated
      } else {
        workItemAssoc.unknownWorkItem.push(testResult)
      }

      return workItemAssoc
    },
    { unknownWorkItem: [] },
  )
}

/**
 * Create a {@link WorkItemUpdate} for a test reference id
 *
 * @param testRefId - `number` test reference id
 */
export const toWorkItemUpdate = (testRefId: number): WorkItemUpdate => ({
  op: 'add',
  path: '/relations/-',
  value: {
    rel: 'ArtifactLink',
    url: `vstfs:///TestManagement/TcmTest/tcm.${testRefId}`,
    attributes: {
      name: 'Test',
    },
  },
})

/**
 * Transform an array of {@link ShallowTestCaseResult} to an array of {@link WorkItemUpdate}
 * @param testCaseResults - the {@link ShallowTestCaseResult} array to transform
 */
export const toWorkItemUpdates = (testCaseResults: ShallowTestCaseResult[]): WorkItemUpdate[] =>
  testCaseResults.map((test) => toWorkItemUpdate(test.refId))

/**
 * Transform a {@link ShallowTestCaseResult} to a {@link TestMethodInfo}
 *
 * @param name - `string` {@link ShallowTestCaseResult.automatedTestName | automatedTestName} alias
 * @param id - `string` {@link ShallowTestCaseResult.id | id} alias
 * @param refId - `string` {@link ShallowTestCaseResult.refId | refId} alias
 */
export const toTestMethod = ({ automatedTestName: name, id, refId }: ShallowTestCaseResult): TestMethodInfo => ({
  id,
  name,
  refId,
})

/**
 * Construct a {@link WorkItemTestDto} object from a work item id and a {@link TestMethodInfo}.
 *
 * @param workItemId - `number` work item identifier
 * @param testId - `number` {@link TestMethodInfo.id | id} alias
 * @param testRefId - `number` {@link TestMethodInfo.refId | refId} alias
 * @param testName - `string` {@link TestMethodInfo.name | name} alias
 */
export const toWorkItemTestAssociationDto = (
  workItemId: number,
  { id: testId, refId: testRefId, name: testName }: TestMethodInfo,
): WorkItemTestDto => ({
  testId,
  testName,
  testRefId,
  workItemId,
})
