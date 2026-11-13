import { api } from './api'

/**
 * Runtime config for the generated hey-api client.
 *
 * Reuses the shared axios instance so auth and refresh interceptors apply to
 * generated calls. `baseURL` must be set here: the generated client prefixes
 * every request URL itself and passes `baseURL: ''` to axios.
 */
export function createClientConfig<T extends object>(config: T) {
  return { ...config, axios: api, baseURL: api.defaults.baseURL }
}
