import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces'
import * as f from 'factory.ts'
import * as faker from 'faker'

import { TestMethodInfo } from '../src/workitem/types'

export const shallowTestCaseResultFactory = f.Sync.makeFactory<ShallowTestCaseResult>({
  automatedTestName: faker.company.catchPhrase(),
  refId: faker.random.number({ min: 1_000, max: 2_000 }),
})

export const testMethodInfoFactory = f.Sync.makeFactory<TestMethodInfo>({
  id: faker.random.number({ min: 100, max: 200 }),
  name: faker.company.catchPhrase(),
  refId: faker.random.number({ min: 1000, max: 2000 }),
})
