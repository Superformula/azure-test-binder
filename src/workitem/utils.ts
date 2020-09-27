import { Optional, TestMethod, WorkItemTestAssociation } from '../types/types'

const defaultWorkItemIdPattern = /(#?\d{5})/g

/**
 * Extract a work item id from a string.
 * {@code
 *  const aStringWithAWorkItemId = 'I have a work item id #12345'
 *  const id = extractWorkItemId(aStringWithAWorkItemId) // id === 12345
 * }
 * @param text string text to search
 */
export const extractWorkItemId = (text: string): Optional<string> => {
  const strings = text.match(defaultWorkItemIdPattern) ?? []
  const id = strings[0]
  const result = id ? id.replace(/\D/g, '') : undefined

  return result
}

/**
 * Partition an array of TestMethod into a WorkItemTestAssociation
 * @param testMethods TestMethod array to partition.
 */
export const partition = (testMethods: TestMethod[]): WorkItemTestAssociation => {
  return testMethods.reduce<WorkItemTestAssociation>(
    (workItemAssoc, testResult) => {
      const workItemId = extractWorkItemId(testResult.testName)

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
