import 'reflect-metadata'

import { Container } from 'inversify'

import { EnvOptions, getEnv } from './config'
import { Env, TYPES } from './types/types'
import { bindings } from './workitem'

/**
 * Create and configure a {@link Container}
 */
export const getContainer = async (envOptions: EnvOptions): Promise<Container> => {
  const env = getEnv(envOptions)
  const container = new Container()
  container.bind<Env>(TYPES.Env).toConstantValue(env)
  await container.loadAsync(bindings(env))

  return container
}
