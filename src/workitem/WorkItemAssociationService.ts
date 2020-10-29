import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import * as azTask from 'azure-pipelines-task-lib/task'
import { inject, injectable } from 'inversify'

import { Env, TYPES } from '../types/types'
import { log } from '../utils'
import {
  TestMethodInfo,
  WorkItemTestAssociationInfo,
  WorkItemTestDto,
  WorkItemUpdate,
  WorkItemUpdateResults,
} from './types'
import { asyncForEach, isString, partition, toTestMethodInfo, toWorkItemTestDto, toWorkItemUpdates } from './utils'

export interface WorkItemAssociationService {
  linkTestMethods(buildId: number): Promise<WorkItemUpdateResults>
}

@injectable()
export class DefaultWorkItemAssociationService implements WorkItemAssociationService {
  private static noopErrorMessage = /Relation already exists/gi

  constructor(
    @inject(TYPES.AzureWorkItemService) private readonly workItemService: IWorkItemTrackingApi,
    @inject(TYPES.AzureTestRunService) private readonly testService: ITestApi,
    @inject(TYPES.Env) private readonly environment: Env,
  ) {}

  /**
   *
   * @param buildId - `number` build id
   */
  async linkTestMethods(buildId: number): Promise<WorkItemUpdateResults> {
    const association = await this.getWorkItemTestAssociation(buildId)
    const result = await this.associateWorkItemsToTests(association)

    return Promise.resolve(result)
  }

  /**
   * Get the `WorkItemTestAssociationInfo` for a given build identifier.
   * @param buildId - `number` build identifier to use.
   */
  private async getWorkItemTestAssociation(buildId: number): Promise<WorkItemTestAssociationInfo> {
    const project = this.environment.PROJECT
    const testResults = (await this.testService.getTestResultsByBuild(project, buildId)) ?? []
    const testMethods = testResults.map(toTestMethodInfo)

    return partition(testMethods)
  }

  /**
   * Associate test methods with known work items.
   *
   * @param unknownWorkItem - The array of test methods without a known work item.
   * @param workItemAssociations - Object containing `{ workItemId: number; testMethods: TestMethodInfo[]; }`
   */
  private async associateWorkItemsToTests({
    unknownWorkItem,
    ...workItemAssociations
  }: WorkItemTestAssociationInfo): Promise<WorkItemUpdateResults> {
    const workItemIds = Object.keys(workItemAssociations)
      .map((key) => parseInt(key))
      .filter((num) => !isNaN(num))

    const successBucket: WorkItemTestDto[] = []

    for (const workItem of workItemIds) {
      const testMethods = workItemAssociations[workItem]
      const dtos = await this.handleValidWorkItem(workItem, testMethods)
      successBucket.push(...dtos)
    }

    return {
      success: successBucket,
      unknownWorkItem,
    }
  }

  /**
   * Attempt to associate a collection of {@link TestMethodInfo} with a given work item identifier.
   *
   * @param workItemId - `number` the work item identifier
   * @param testMethods - `TestMethodInfo[]` The test methods to associate with the work item.
   */
  private async handleValidWorkItem(workItemId: number, testMethods: TestMethodInfo[]): Promise<WorkItemTestDto[]> {
    azTask.debug('Associating ' + testMethods.length + ' test methods(s) with work item ID ' + workItemId)

    if (!testMethods.length) {
      throw new Error(`O_o No test methods for work item: ${workItemId}!`)
    }

    const cb = async (t: WorkItemUpdate) => {
      const {
        value: { url },
      } = t

      log('CurrentlyProcessing', workItemId, url)

      try {
        await this.workItemService.updateWorkItem({}, t, workItemId)
      } catch (e: unknown) {
        const errorMsg = typeof e === 'string' ? e : e instanceof Error ? e.message : JSON.stringify(e)
        const message = `Error while processing work item: ${workItemId} for url: ${url}. Error was: ${errorMsg}`
        log('ErrorProcessing', workItemId, message)
        throw new Error(message)
      }
    }

    const errHandler = (O_o: unknown): string | undefined => {
      if (O_o instanceof Error) {
        if (DefaultWorkItemAssociationService.noopErrorMessage.test(O_o.message)) {
          log('ExpectedErrorProcessing', workItemId, O_o.message)

          return undefined
        }
      }

      if (isString(O_o)) {
        return O_o
      }

      return `${JSON.stringify(O_o)}`
    }

    const testCases = toWorkItemUpdates(testMethods)

    const errs = await asyncForEach(testCases, cb, errHandler)

    if (errs.length) {
      const messages = errs.join('|')
      const errMessage = `Unknown Error while processing work items: ${messages}`

      log('ErrorProcessing', workItemId, errMessage)
    }

    return testMethods.map((m) => toWorkItemTestDto(workItemId, m))
  }
}
