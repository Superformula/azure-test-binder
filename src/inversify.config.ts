import 'reflect-metadata'

import { Container } from 'inversify'

import { Env, TYPES } from './types/types'
import { EnvOptions, getEnv } from './utils'
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
