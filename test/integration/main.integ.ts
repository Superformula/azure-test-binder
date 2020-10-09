import * as azTask from 'azure-pipelines-task-lib/task'

import { run } from '../../src/index'
import { TaskRunner } from '../../src/types/types'

describe('integration tests', function () {
  it('reports stderr correctly', async function () {
    const mock: TaskRunner = (_buildId, _envOptions) => {
      return new Promise((resolve, _reject) => {
        azTask.warning('Some warning')
        resolve({ unknownWorkItem: [], success: [] })
      })
    }

    let hasStdout = false
    let hasStderr = false

    process.stdout.on('data', () => {
      hasStdout = true
    })

    process.stderr.on('data', () => {
      hasStderr = true
    })

    await run(mock)

    console.log('hasStdout', hasStdout)
    console.log('hasStderr', hasStderr)
    console.log('process.exitCode', process.exitCode)

    expect(hasStdout).toBe(false)
    expect(hasStderr).toBe(true)
    expect(process.exitCode).toBe(1)
  })
})
