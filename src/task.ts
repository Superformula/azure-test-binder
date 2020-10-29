import * as path from 'path'

import * as azTask from 'azure-pipelines-task-lib/task'

import { EnvOptions, log } from './utils'

import { main } from './index'

const getEnvOptionDefaults = (): EnvOptions => {
  const pat = azTask.getInput('PAT') ?? azTask.getVariable('System.AccessToken')

  return {
    projectName: azTask.getVariable(`System.TeamProjectId`),
    orgUrl: azTask.getVariable('System.TeamFoundationCollectionUri'),
    pat,
  }
}

export async function run(): Promise<void> {
  try {
    azTask.setResourcePath(path.join(__dirname, 'task.json'))
    const buildIdStr = azTask.getVariable(`Build.BuildId`)
    const buildId = Number(buildIdStr)
    const envOptions = { ...getEnvOptionDefaults() }
    log('StartingTask', buildIdStr)
    const { unknownWorkItem, success } = await main(buildId, envOptions)
    azTask.debug(`${unknownWorkItem.length} - tests with missing work items`)
    const processedWorkItems = success.map((w) => w.workItemId).join('|')
    log('TaskComplete', processedWorkItems)
    azTask.setResult(azTask.TaskResult.Succeeded, `Successfully processed work items: ${processedWorkItems}`)
  } catch (O_o) {
    azTask.setResult(azTask.TaskResult.Failed, O_o.message)
  }
}

run()
