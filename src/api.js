import { ApiPromise, WsProvider } from '@polkadot/api'
import { TypeRegistry } from '@polkadot/types/create'
import { ApiCaller } from '@/js/api/api-caller'
import CONFIG from '@/config'

export const provider = new WsProvider(CONFIG.WSS_NODE)
export const registry = new TypeRegistry()
export const api = new ApiPromise({ provider, registry })

export const bridgeApi = new ApiCaller()
export const stakingApi = new ApiCaller()

export function initApi () {
  bridgeApi.useBaseURL(CONFIG.BRIDGE_API_URL)
  stakingApi.useBaseURL(CONFIG.STAKING_API_URL)
}

export async function getApiByNode (wssNode) {
  const newProvider = new WsProvider(wssNode)
  const newRegistry = new TypeRegistry()
  return await ApiPromise.create({
    provider: newProvider,
    registry: newRegistry,
  })
}
