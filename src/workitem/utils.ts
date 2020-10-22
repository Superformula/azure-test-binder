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
export const toTestMethodInfo = ({ automatedTestName: name, id, refId }: ShallowTestCaseResult): TestMethodInfo => ({
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
export const toWorkItemTestDto = (
  workItemId: number,
  { id: testId, refId: testRefId, name: testName }: TestMethodInfo,
): WorkItemTestDto => ({
  testId,
  testName,
  testRefId,
  workItemId,
})

type ErrorHandler<E> = (err: unknown) => E | undefined
type AsyncForEachResult<R, E> = [R[], E[]]
type AsyncForEachCallback<T> = (element: T, index?: number, array?: T[]) => Promise<void>

/**
 * Perform an async operation over the items in a collection.
 *
 * @param array - The collection of `T` to operate on
 * @param callback - The async operation
 * @param errorHandler - The error
 */
export const asyncForEach = async <T, R, E>(
  array: T[],
  callback: AsyncForEachCallback<T>,
  errorHandler: ErrorHandler<E>,
): Promise<E[]> => {
  let index = 0
  const errors: E[] = []

  for (const item of array) {
    try {
      await callback(item, index++, array)
    } catch (O_o: unknown) {
      const items = errorHandler(O_o)

      if (items) {
        errors.push(items)
      }
    }
  }

  return errors
}

/**
 * Guard function to check if a value is a `string`
 * @param s - the value to check.
 */
export const isString = (s: unknown): s is string => {
  return typeof s === 'string'
}

/**
 * Guard function to check if a value is an {@link Error}
 * @param e - the value to check.
 */
export const isError = (e: unknown): e is Error => {
  return e instanceof Error
}
