import { ShallowTestCaseResult } from 'azure-devops-node-api/interfaces/TestInterfaces'
import * as f from 'factory.ts'
import * as faker from 'faker'

export const shallowTestCaseResultFactory = f.Sync.makeFactory<ShallowTestCaseResult>({
  automatedTestName: faker.company.catchPhrase(),
  refId: faker.random.number({ min: 1_000, max: 2_000 }),
})
