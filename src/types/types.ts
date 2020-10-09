import { EnvOptions } from '../config'
import { WorkItemUpdateResults } from '../workitem/types'

export const TYPES = {
  AzureWorkItemService: Symbol.for('AzureWorkItemService'),
  AzureTestRunService: Symbol.for('AzureTestRunService'),
  WorkItemAssociationService: Symbol.for('WorkItemAssociationService'),
  Env: Symbol.for('Env'),
}

export type Optional<T> = T | undefined

export type Env = typeof process.env & {
  ORG_URL: string
  AZURE_PERSONAL_ACCESS_TOKEN: string
  PROJECT: string
  FAIL_ON_STDERR: string
}

export type TaskRunner = (buildId: number, envOptions?: EnvOptions) => Promise<WorkItemUpdateResults>
