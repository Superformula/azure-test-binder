import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api'
import { IBuildApi } from 'azure-devops-node-api/BuildApi'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import { AsyncContainerModule } from 'inversify'

import { Env, TYPES } from '../types/types'
import { AdoWorkItemService, WorkItemService } from './WorkItemService'

type ApiFactory = (env: Env) => Promise<[IBuildApi, IWorkItemTrackingApi, ITestApi]>

/**
 * Wire up ADO API connects
 */
const conn: ApiFactory = async (env: Env) => {
  try {
    const authHandler = getPersonalAccessTokenHandler(env.AZURE_PERSONAL_ACCESS_TOKEN)
    const webApi = new WebApi(env.ORG_URL, authHandler)
    const buildApi = webApi.getBuildApi()
    const workApi = webApi.getWorkItemTrackingApi()
    const testApi = webApi.getTestApi()

    return Promise.all([buildApi, workApi, testApi])
  } catch (err) {
    throw err
  }
}

/**
 * Bind APIs to container.
 */
export const bindings = (env: Env): AsyncContainerModule =>
  new AsyncContainerModule(async (bind) => {
    const [buildApi, workApi, testApi] = await conn(env)

    bind<IBuildApi>(TYPES.AzureBuildService).toConstantValue(buildApi)
    bind<IWorkItemTrackingApi>(TYPES.AzureWorkItemService).toConstantValue(workApi)
    bind<ITestApi>(TYPES.AzureTestRunService).toConstantValue(testApi)
    bind<WorkItemService>(TYPES.WorkItemService).to(AdoWorkItemService)
  })
