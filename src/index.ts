import * as azTask from 'azure-pipelines-task-lib/task'

import { EnvOptions } from './config'
import { getContainer } from './inversify.config'
import { TYPES, TaskRunner } from './types/types'
import { WorkItemUpdateResults } from './workitem/types'
import { WorkItemAssociationService } from './workitem/WorkItemAssociationService'

export const main: TaskRunner = async (buildId, envOptions?) => {
  azTask.debug('Running for build ID ' + buildId)

  try {
    const container = await getContainer(envOptions)
    const workItemAssociationService = container.get<WorkItemAssociationService>(TYPES.WorkItemAssociationService)
    const result = await workItemAssociationService.linkTestMethods(buildId)

    return result
  } catch (O_o) {
    throw O_o
  }
}

const getEnvOptionDefaults = (): EnvOptions => ({
  projectName: azTask.getVariable(`System.TeamProjectId`),
  orgUrl: azTask.getVariable('System.TeamFoundationCollectionUri'),
  pat: azTask.getVariable('System.AccessToken'),
})

const getEnvOptionInputs = (): EnvOptions => ({
  pat: azTask.getInput('PAT'),
  failOnStderr: azTask.getBoolInput('failOnStderr'),
})

export async function run(mockTaskRunner?: TaskRunner, mockEnv: EnvOptions = {}): Promise<void> {
  try {
    azTask.setResourcePath(__dirname + '/../task.json')
    const buildId = Number(azTask.getVariable(`Build.BuildId`))
    const envOptions: EnvOptions = { ...getEnvOptionDefaults(), ...getEnvOptionInputs(), ...mockEnv }

    if (!envOptions.failOnStderr) {
      process.stderr.write = process.stdout.write
    }

    let results: WorkItemUpdateResults

    if (mockTaskRunner) {
      results = await mockTaskRunner(buildId, envOptions)
    } else {
      results = await main(buildId, envOptions)
    }

    const { unknownWorkItem, success } = results

    azTask.debug(`${unknownWorkItem.length} - tests with missing work items`)
    const processedWorkItems = success.map((w) => w.workItemId).join('|')
    azTask.setResult(azTask.TaskResult.Succeeded, `Successfully processed work items: ${processedWorkItems}`)
  } catch (O_o) {
    azTask.setResult(azTask.TaskResult.Failed, O_o.message)
  }
}
