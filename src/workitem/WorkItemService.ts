import { IBuildApi } from 'azure-devops-node-api/BuildApi'
import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import { inject, injectable } from 'inversify'

import { Env, TestMethod, TYPES, WorkItemTestAssociation } from '../types/types'
import { partition } from './utils'

export interface WorkItemService {
  linkTestMethods(buildId: number): Promise<unknown>
}

const toTestMethod = ({ automatedTestName, id, refId }: ShallowTestCaseResult): TestMethod => {
  return {
    id: `${id}`,
    testName: automatedTestName,
    testCaseReferenceId: `${refId}`,
  }
}

@injectable()
export class AdoWorkItemService implements WorkItemService {
  private static noopErrorMessage = /Relation already exists/gi

  constructor(
    @inject(TYPES.AzureBuildService) private readonly buildService: IBuildApi,
    @inject(TYPES.AzureWorkItemService) private readonly workItemService: IWorkItemTrackingApi,
    @inject(TYPES.AzureTestRunService) private readonly testService: ITestApi,
    @inject(TYPES.Env) private readonly environment: Env,
  ) {}

  /**
   * get test runs for build id
   * get test result by run id
   * @param buildId
   */
  async linkTestMethods(buildId: number): Promise<unknown> {
    const association = await this.getWorkItemTestAssociation(buildId)
    const result = await this.associateWorkItemsToTests(association)

    return Promise.resolve(result)
  }

  private async getWorkItemTestAssociation(buildId: number): Promise<WorkItemTestAssociation> {
    const project = this.environment.PROJECT
    const testResults = (await this.testService.getTestResultsByBuild(project, buildId)) ?? []
    const testMethods = testResults.map(toTestMethod)

    return partition(testMethods)
  }

  private async associateWorkItemsToTests(association: WorkItemTestAssociation): Promise<boolean> {
    const workItems = Object.keys(association)

    for (const workItem of workItems) {
      const testMethods = association[workItem]

      if (testMethods.length) {
        try {
          const testCases = this.createTestCaseAssociates(testMethods)
          // TODO: Association result actiom
          await this.workItemService.updateWorkItem({}, testCases, Number(workItem))
        } catch (e) {
          if (AdoWorkItemService.noopErrorMessage.test(e.message)) {
            console.warn(e.message)

            return true
          }

          throw e
        }
      }
    }

    return true
  }

  private createTestCaseAssociates(testMethods: TestMethod[]): unknown[] {
    return testMethods.map((test) => createPatchValue(test.testCaseReferenceId))
  }
}

const createPatchValue = (testRefId: string): unknown => ({
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
