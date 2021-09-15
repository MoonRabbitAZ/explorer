import { ApiPromise, WsProvider } from '@polkadot/api'
import { TypeRegistry } from '@polkadot/types/create'
import { CONFIG } from '@/config'
import { ApiCaller } from '@/js/api/api-caller'

export const provider = new WsProvider(CONFIG.WSS_NODE)
export const registry = new TypeRegistry()
export const api = new ApiPromise({ provider, registry })
export const restApi = new ApiCaller()

export function initApi () {
  restApi.useBaseURL(CONFIG.API_URL)
}
