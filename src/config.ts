import { Env } from './types/types'

export type EnvOptions = {
  projectName?: string
  orgUrl?: string
  pat?: string
  failOnStderr?: boolean
}

export const getEnv = ({ orgUrl, pat, projectName, failOnStderr }: EnvOptions = {}): Env => {
  if (process.env.NODE_ENV === 'local') {
    // eslint-disable-next-line import/no-extraneous-dependencies
    require('dotenv').config()
  }

  let failOnStderrAsString

  if (typeof failOnStderr === 'boolean') {
    failOnStderrAsString = failOnStderr ? 'true' : 'false'
  } else if (process.env.FAIL_ON_STDERR === 'true' || process.env.FAIL_ON_STDERR === 'false') {
    failOnStderrAsString = process.env.FAIL_ON_STDERR
  } else {
    failOnStderrAsString = 'true'
  }

  return {
    ...process.env,
    AZURE_PERSONAL_ACCESS_TOKEN: pat ?? process.env.AZURE_PERSONAL_ACCESS_TOKEN,
    ORG_URL: orgUrl ?? process.env.ORG_URL ?? 'http://localhost',
    PROJECT: projectName ?? process.env.PROJECT,
    FAIL_ON_STDERR: failOnStderrAsString,
  }
}
