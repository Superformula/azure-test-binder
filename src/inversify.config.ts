import 'reflect-metadata'

import { Container } from 'inversify'

import { getEnv } from './config'
import { Env, TYPES } from './types/types'
import { bindings } from './workitem'

/**
 * Create and configure a {@link Container}
 */
export const initContainer = async (): Promise<Container> => {
  const env = getEnv()
  const container = new Container()
  container.bind<Env>(TYPES.Env).toConstantValue(env)
  await container.loadAsync(bindings(env))

  return container
}
