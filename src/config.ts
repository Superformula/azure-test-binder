import { Env } from './types/types'

export type EnvOptions = {
  projectName?: string
  orgUrl?: string
  pat?: string
}

export const getEnv = ({ orgUrl, pat, projectName }: EnvOptions = {}): Env => ({
  ...process.env,
  AZURE_PERSONAL_ACCESS_TOKEN: pat ?? process.env.AZURE_PERSONAL_ACCESS_TOKEN,
  ORG_URL: orgUrl ?? process.env.ORG_URL ?? 'http://localhost',
  PROJECT: projectName ?? process.env.PROJECT,
})
