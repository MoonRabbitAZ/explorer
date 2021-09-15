import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util'
import { formatBalance, isTestChain } from '@polkadot/util'
import { keyring } from '@polkadot/ui-keyring'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { registry } from '@api'

const DEFAULT_SS58 = registry.createType('u32', 42)
const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9']
const DEFAULT_DECIMALS = registry.createType('u32', 12)
const ethereumChains = [
  'moonbase',
  'moonbeam',
  'moonriver',
  'moonshadow',
  'origintrail-parachain',
]

export async function loadOnReady (api) {
  const {
    systemChainType,
    injectedAccounts,
    properties,
    systemChain,
    systemName,
    systemVersion,
  } = await retrieve(api)
  const ss58Format = properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber()
  const tokenSymbol = properties.tokenSymbol.unwrapOr(
    [formatBalance.getDefaults().unit, ...DEFAULT_AUX])
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS])
  const isEthereum =
    ethereumChains.includes(api.runtimeVersion.specName.toString())
  const isDevelopment = systemChainType.isDevelopment ||
    systemChainType.isLocal || isTestChain(systemChain)

  // explicitly override the ss58Format as specified
  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }))

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: tokenDecimals.map((b) => b.toNumber()),
    unit: tokenSymbol[0].toString(),
  })

  // finally load the keyring
  isKeyringLoaded() || keyring.loadAll({
    genesisHash: api.genesisHash,
    isDevelopment,
    ss58Format,
    type: isEthereum ? 'ethereum' : 'ed25519',
  }, injectedAccounts)

  const { apiDefaultTx, apiDefaultTxSudo } = getApiTx(api)

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache)

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    isEthereum,
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toString(),
    systemChain,
    systemName,
    systemVersion,
  }
}

function getApiTx (api) {
  const defaultSection = Object.keys(api.tx)[0]
  const defaultMethod = Object.keys(api.tx[defaultSection])[0]
  const apiDefaultTx = api.tx[defaultSection][defaultMethod]
  const apiDefaultTxSudo =
    (api.tx.system && api.tx.system.setCode) || apiDefaultTx

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
  }
}

async function retrieve (api) {
  const [
    systemChainType,
    chainProperties,
    systemChain,
    systemName,
    systemVersion,
    injectedAccounts,
  ] = await Promise.all([
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    getInjectedAccounts(),
  ])

  return {
    systemChainType,
    injectedAccounts,
    properties: registry.createType('ChainProperties', {
      ss58Format:
        api.consts.system?.ss58Prefix || chainProperties.ss58Format,
      tokenDecimals: chainProperties.tokenDecimals,
      tokenSymbol: chainProperties.tokenSymbol,
    }),
    systemChain: (systemChain || '<unknown>').toString(),
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
  }
}

async function getInjectedAccounts () {
  try {
    await web3Enable('polkadot-js/apps')

    const accounts = await web3Accounts()

    return accounts.map(({ address, meta }, whenCreated) => ({
      address,
      meta: {
        ...meta,
        name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
        whenCreated,
      },
    }))
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)

    return []
  }
}

function isKeyringLoaded () {
  try {
    return !!keyring.keyring
  } catch {
    return false
  }
}
