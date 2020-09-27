import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces'

import { Optional } from '../types/types'
import { WorkItemTestAssociation, WorkItemUpdate } from './types'

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
 * Partition an array of {@link ShallowTestCaseResult} into a {@link WorkItemTestAssociation}
 *
 * @param testResults - {@link ShallowTestCaseResult} array to partition.
 */
export const partition = (testResults: ShallowTestCaseResult[]): WorkItemTestAssociation => {
  return testResults.reduce<WorkItemTestAssociation>(
    (workItemAssoc, testResult) => {
      const workItemId = extractWorkItemId(testResult.automatedTestName)

      if (workItemId) {
        const prev = workItemAssoc[workItemId]
        const updated = prev ? [testResult, ...prev] : [testResult]
        workItemAssoc[workItemId] = updated
      } else {
        workItemAssoc.unknown.push(testResult)
      }

      return workItemAssoc
    },
    { unknown: [] },
  )
}

/**
 * Create a {@link WorkItemUpdate} for a test reference id
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
