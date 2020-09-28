import path = require('path')

import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test'

describe('a test', function () {
  it('should test', async function (done) {
    const testPath = path.join(__dirname, 'run.ts')
    const testRunner = new MockTestRunner(testPath)
    testRunner.run()
    console.log(testRunner.succeeded)
    expect(testRunner.succeeded).toStrictEqual(true)
    expect(testRunner.stdout.indexOf('Hello human') >= 0).toStrictEqual(true)
    done()
  })
})
