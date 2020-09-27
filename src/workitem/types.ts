import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces'

/**
 * Named tuple containing {@link ShallowTestCaseResult} for any known or and unknown work item ids.
 */
export type WorkItemTestAssociation = {
  unknown: ShallowTestCaseResult[]
  [workItemId: number]: ShallowTestCaseResult[]
}

/**
 * Operation, path, and UpdateValue for updating a work item.
 */
export type WorkItemUpdate = {
  op: Operation
  path: string
  value: UpdateValue
}

/**
 * The value for the {@link WorkItemUpdate}
 */
export type UpdateValue = {
  rel: LinkType
  url: string
  attributes: {
    name: string
  }
}

/**
 * All Operation values
 */
export const operations = ['add'] as const

/**
 * Union of all operation values
 */
export type Operation = typeof operations[number]

/**
 * Guard function for Operation.
 *
 * @param maybeOp - string to test
 */
export const operationGuard = (maybeOp: string): maybeOp is Operation => operations.includes(maybeOp as Operation)

/**
 * All link type values
 */
export const linkTypes = ['ArtifactLink'] as const

/**
 * Union of all link type values
 */
export type LinkType = typeof linkTypes[number]

/**
 * Guard function for link types
 *
 * @param maybeLinkType - string ot test
 */
export const linkTypeGuard = (maybeLinkType: string): maybeLinkType is LinkType =>
  linkTypes.includes(maybeLinkType as LinkType)
