import { Env } from './types/types'

export const getEnv = (): Env => ({
  ...process.env,
  AZURE_PERSONAL_ACCESS_TOKEN: process.env.AZURE_PERSONAL_ACCESS_TOKEN ?? 'UNKNOWN',
  ORG_URL: process.env.ORG_URL ?? 'http://localhost',
  PROJECT: process.env.PROJECT,
})
// System.TeamProject
// Build.BuildId
