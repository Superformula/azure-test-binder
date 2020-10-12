import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import * as azTask from 'azure-pipelines-task-lib/task'
import { inject, injectable } from 'inversify'

import { Env, TYPES } from '../types/types'
import { TestMethodInfo, WorkItemTestAssociationInfo, WorkItemTestDto, WorkItemUpdateResults } from './types'
import { partition, toTestMethodInfo, toWorkItemTestDto, toWorkItemUpdates } from './utils'

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

    const workItemTestAssociationDtos = testMethods.map((m) => toWorkItemTestDto(workItemId, m))

    try {
      const testCases = toWorkItemUpdates(testMethods)
      await this.workItemService.updateWorkItem({}, testCases, workItemId)

      return workItemTestAssociationDtos
    } catch (O_o) {
      if (DefaultWorkItemAssociationService.noopErrorMessage.test(O_o.message)) {
        azTask.debug('Error for work item ID ' + workItemId + ': ' + O_o.message)

        return workItemTestAssociationDtos
      }

      throw O_o
    }
  }
}
