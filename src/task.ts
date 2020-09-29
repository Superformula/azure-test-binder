import * as path from 'path'

import * as azTask from 'azure-pipelines-task-lib/task'

import { EnvOptions } from './config'

import { main } from './index'

const getEnvOptionDefaults = (): EnvOptions => ({
  projectName: azTask.getVariable(`System.TeamProjectId`),
  orgUrl: azTask.getVariable('System.TeamFoundationCollectionUri'),
  pat: azTask.getVariable('System.AccessToken'),
})

const getEnvOptionInputs = (): EnvOptions => ({
  pat: azTask.getInput('PAT'),
})

export async function run(): Promise<void> {
  try {
    azTask.setResourcePath(path.join(__dirname, 'task.json'))
    const buildId = Number(azTask.getVariable(`Build.BuildId`))
    const envOptions = { ...getEnvOptionDefaults(), ...getEnvOptionInputs() }
    const { unknownWorkItem, success } = await main(buildId, envOptions)
    azTask.debug(`${unknownWorkItem.length} - tests with missing work items`)
    const processedWorkItems = success.map((w) => w.workItemId).join('|')
    azTask.setResult(azTask.TaskResult.Succeeded, `Successfully processed work items: ${processedWorkItems}`)
  } catch (O_o) {
    azTask.setResult(azTask.TaskResult.Failed, O_o.message)
  }
}

run()
