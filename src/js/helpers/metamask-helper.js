
// This error code indicates that the chain has not been added to MetaMask.
const METAMASK_NOT_CHAIN_ERRORS = [4902, -32603]

export async function switchOrAddEthereumChain (params) {
  try {
    await switchEthereumChain(params.hexId)
  } catch (e) {
    if (METAMASK_NOT_CHAIN_ERRORS.includes(e.code)) {
      try {
        await addEthereumChain(params)
      } catch (e) {
        throw new Error(e.message)
      }
    } else {
      throw new Error(e.message)
    }
  }
}

async function switchEthereumChain (hexId) {
  const { ethereum } = window

  if (!ethereum) return

  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: hexId }],
  })
}

async function addEthereumChain ({
  hexId,
  nativeName,
  rpcUrl,
  blockExplorerUrl,
  nativeSymbol,
  nativeDecimals,
}) {
  const { ethereum } = window

  if (!ethereum) return

  await ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: hexId,
        chainName: nativeName,
        rpcUrls: [rpcUrl],
        blockExplorerUrls: [blockExplorerUrl],
        nativeCurrency: {
          symbol: nativeSymbol,
          decimals: nativeDecimals,
        },
      },
    ],
  })
}
