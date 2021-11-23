import { ApiPromise, WsProvider } from '@polkadot/api'
import { TypeRegistry } from '@polkadot/types/create'
import { ApiCaller } from '@/js/api/api-caller'
import CONFIG from '@/config'

export const provider = new WsProvider(CONFIG.WSS_NODE)
export const registry = new TypeRegistry()
export const api = new ApiPromise({ provider, registry })

export const apiCaller = new ApiCaller()
export const bridgeApi = new ApiCaller()
export const stakingApi = new ApiCaller()
export const bridgeEthereumApi = new ApiCaller()

export function initApi () {
  bridgeApi.useBaseURL(CONFIG.BRIDGE_API_URL)
  stakingApi.useBaseURL(CONFIG.STAKING_API_URL)
  bridgeEthereumApi.useBaseURL(CONFIG.BRIDGE_ETHEREUM_API_URL)
}
