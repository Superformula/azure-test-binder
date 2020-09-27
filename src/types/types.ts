export const TYPES = {
  AzureBuildService: Symbol.for('AzureBuildService'),
  AzureWorkItemService: Symbol.for('AzureWorkItemService'),
  AzureTestRunService: Symbol.for('AzureTestRunService'),
  WorkItemService: Symbol.for('AzureSearchService'),
  Env: Symbol.for('Env'),
}

export type Optional<T> = T | undefined

export type TestMethod = { testName: string; id: string; testCaseReferenceId: string }

export type WorkItemTestAssociation = {
  unknown: TestMethod[]
  [workItem: string]: TestMethod[]
}

export type Env = typeof process.env & {
  ORG_URL: string
  AZURE_PERSONAL_ACCESS_TOKEN: string
  PROJECT: string
}
