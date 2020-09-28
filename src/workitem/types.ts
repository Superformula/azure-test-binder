/**
 * DTO containing test method info
 */
export type TestMethodInfo = {
  name: string
  refId: number
  id: number
}

/**
 * Named tuple for bucketizing {@link TestMethodInfo} for any known or and unknown work item ids.
 */
export type WorkItemTestAssociationInfo = {
  unknownWorkItem: TestMethodInfo[]
  [workItemId: number]: TestMethodInfo[]
}

/**
 * DTO with work item and test data.
 */
export type WorkItemTestDto = {
  workItemId: number
  testId: number
  testRefId: number
  testName: string
}

/**
 * Results of running the association call.
 */
export type WorkItemUpdateResults = {
  success: WorkItemTestDto[]
  unknownWorkItem: TestMethodInfo[]
}

/**
 * Union of all work item association status values
 */
export type WorkItemAssociationStatus = keyof WorkItemUpdateResults

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
  rel: RelationType
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
 * All relation type values
 */
export const relationTypes = ['ArtifactLink'] as const

/**
 * Union of all relation type values
 */
export type RelationType = typeof relationTypes[number]
