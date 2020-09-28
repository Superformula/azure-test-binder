import { getEnv } from './config'

describe('configuration test', function () {
  it('should have the PAT in the environment', function () {
    const env = getEnv()
    expect(env.AZURE_PERSONAL_ACCESS_TOKEN).toBeTruthy()
    expect(env.ORG_URL).toBeTruthy()
  })
})
