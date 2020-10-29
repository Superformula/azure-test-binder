import * as azTask from 'azure-pipelines-task-lib/task'

import { Messages } from './constants'
import { Env } from './types/types'

/**
 * Task environment configuration values
 */
export type EnvOptions = {
  projectName?: string
  orgUrl?: string
  pat?: string
}

/**
 * Get the current available configuration from `process.env`.
 * @param orgUrl - The project org url
 * @param pat - The personal access token
 * @param projectName - The name of the project
 */
export const getEnv = ({ orgUrl, pat, projectName }: EnvOptions = {}): Env => {
  if (process.env.NODE_ENV === 'local') {
    // eslint-disable-next-line import/no-extraneous-dependencies
    require('dotenv').config()
  }

  return {
    ...process.env,
    AZURE_PERSONAL_ACCESS_TOKEN: pat ?? process.env.AZURE_PERSONAL_ACCESS_TOKEN,
    ORG_URL: orgUrl ?? process.env.ORG_URL ?? 'http://localhost',
    PROJECT: projectName ?? process.env.PROJECT,
  }
}

export const log = (messageKey: Messages, ...values: unknown[]): void => {
  azTask.loc(messageKey, values)
}
