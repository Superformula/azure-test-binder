import * as path from 'path'

import * as azTask from 'azure-pipelines-task-lib/task'

import { EnvOptions } from './utils'

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
    console.log(`Associating tests for build number: ${buildId}`)
    const { unknownWorkItem, success } = await main(buildId, envOptions)
    azTask.debug(`${unknownWorkItem.length} - tests with missing work items`)
    const processedWorkItems = success.map((w) => w.workItemId).join('|')
    console.log(`Successfully processed work items: ${processedWorkItems}`)
    azTask.setResult(azTask.TaskResult.Succeeded, `Successfully processed work items: ${processedWorkItems}`)
  } catch (e) {
    azTask.setResult(azTask.TaskResult.Failed, e.message)
  }
}

run()
