import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api'
import { ITestApi } from 'azure-devops-node-api/TestApi'
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import { AsyncContainerModule } from 'inversify'

import { Env, TYPES } from '../types/types'
import { DefaultWorkItemAssociationService, WorkItemAssociationService } from './WorkItemAssociationService'

type ApiFactory = (env: Env) => Promise<[IWorkItemTrackingApi, ITestApi]>

/**
 * Wire up ADO API connects
 */
const conn: ApiFactory = async (env: Env) => {
  try {
    const authHandler = getPersonalAccessTokenHandler(env.AZURE_PERSONAL_ACCESS_TOKEN)
    const webApi = new WebApi(env.ORG_URL, authHandler)
    const workApi = webApi.getWorkItemTrackingApi()
    const testApi = webApi.getTestApi()

    return Promise.all([workApi, testApi])
  } catch (err) {
    throw err
  }
}

/**
 * Bind APIs to container.
 */
export const bindings = (env: Env): AsyncContainerModule =>
  new AsyncContainerModule(async (bind) => {
    const [workApi, testApi] = await conn(env)

    bind<IWorkItemTrackingApi>(TYPES.AzureWorkItemService).toConstantValue(workApi)
    bind<ITestApi>(TYPES.AzureTestRunService).toConstantValue(testApi)
    bind<WorkItemAssociationService>(TYPES.WorkItemAssociationService).to(DefaultWorkItemAssociationService)
  })
