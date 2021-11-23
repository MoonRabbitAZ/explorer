import { computed } from 'vue'
import { useStore } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ERC721_ABI } from '@/js/const/erc721-abi.const'
import { ERC20_ABI } from '@/js/const/erc20-abi.const'
import { ETHEREUM_BRIDGE_ABI } from '@/js/const/ethereum-bridge-abi.const'
import { NATIVE_TOKEN_ABI } from '@/js/const/native-abi.const'

import config from '@/config'

const MAIN_CHAIN_ID = '0x1'
const RINKEBY_CHAIN_ID = '0x4'
const MAIN_NETWORK_TYPE = 'main'

export function useWeb3 () {
  const store = useStore()

  const web3 = computed(() => store.getters[vuexTypes.web3])
  const web3Account = computed(() => store.getters[vuexTypes.web3Account])
  const web3ChainId = computed(() => store.getters[vuexTypes.web3ChainId])
  const isMetamaskConnected = computed(() => Boolean(web3Account.value))
  const isMetamaskEnabled = computed(() => Boolean(web3.value.eth))
  const isCorrectNetwork = computed(() =>
    config.ETHEREUM_NETWORK_TYPE === MAIN_NETWORK_TYPE
      ? web3ChainId.value === MAIN_CHAIN_ID
      : web3ChainId.value === RINKEBY_CHAIN_ID,
  )

  async function connectWeb3 () { await store.dispatch(vuexTypes.CONNECT_WEB3) }

  async function initWeb3 () { await store.dispatch(vuexTypes.INIT_WEB3) }

  async function loadWeb3Account () {
    await store.dispatch(vuexTypes.LOAD_WEB3_ACCOUNT)
  }

  async function transferErc721 ({
    contractAddress,
    fromAddress,
    toAddress,
    tokenId,
  }) {
    const contract = new web3.value.eth.Contract(ERC721_ABI, contractAddress)

    return await contract.methods
      .transferFrom(fromAddress, toAddress, tokenId)
      .send({ from: web3Account.value })
  }

  async function transferNative ({ fromAddress, toAddress, value }) {
    return await web3.value.eth.sendTransaction({
      from: fromAddress,
      to: toAddress,
      value: value,
    })
  }

  async function transferErc20 ({
    contractAddress,
    recipientAddress,
    amount,
  }) {
    const contract = new web3.value.eth.Contract(ERC20_ABI, contractAddress)

    return await contract.methods
      .transfer(recipientAddress, amount)
      .send({ from: web3Account.value })
  }

  async function burnErc20 (amount, contractAddress) {
    const contract = new web3.value.eth.Contract(ERC20_ABI, contractAddress)

    return await contract.methods
      .burn(amount)
      .send({ from: web3Account.value })
  }

  async function mintErc20 ({
    contractAddress,
    amount,
    txHash,
    receiverAddress,
    signatureR: r,
    signatureS: s,
    signatureV: v,
  }) {
    const contract = new web3.value.eth.Contract(ERC20_ABI, contractAddress)

    return await contract.methods
      .mint(amount, txHash, receiverAddress, r, s, v)
      .send({ from: web3Account.value })
  }

  async function mintErc721 ({
    contractAddress,
    txHash,
    tokenUrl,
    tokenId,
    signatureR: r,
    signatureS: s,
    signatureV: v,
  }) {
    const contract = new web3.value.eth.Contract(ERC721_ABI, contractAddress)

    return await contract.methods
      .mint(txHash, tokenUrl, tokenId, r, s, v)
      .send({ from: web3Account.value })
  }

  async function withdrawErc20 ({
    contractAddress,
    address,
    txHash,
    amount,
    signatureR: r,
    signatureS: s,
    signatureV: v,
  }) {
    const contract = new web3.value.eth.Contract(
      ETHEREUM_BRIDGE_ABI,
      contractAddress,
    )

    return await contract.methods
      .withdrawERC20(address, txHash, amount, r, s, v)
      .send({ from: web3Account.value })
  }

  async function withdrawErc721 ({
    contractAddress,
    address,
    txHash,
    tokenId,
    signatureR: r,
    signatureS: s,
    signatureV: v,
  }) {
    const contract = new web3.value.eth.Contract(
      ETHEREUM_BRIDGE_ABI,
      contractAddress,
    )

    return await contract.methods
      .withdrawERC721(address, txHash, tokenId, r, s, v)
      .send({ from: web3Account.value })
  }

  async function withdrawWithNativeAbi ({
    contractAddress,
    txHash,
    amount,
    signatureR: r,
    signatureS: s,
    signatureV: v,
  }) {
    const contract = new web3.value.eth.Contract(
      NATIVE_TOKEN_ABI,
      contractAddress,
    )

    return await contract.methods
      .withdraw(txHash, amount, r, s, v)
      .send({ from: web3Account.value })
  }

  async function withdrawNative ({
    contractAddress,
    txHash,
    amount,
    signatureR: r,
    signatureS: s,
    signatureV: v,
  }) {
    const contract = new web3.value.eth.Contract(
      ETHEREUM_BRIDGE_ABI,
      contractAddress,
    )

    return await contract.methods
      .withdrawNative(txHash, amount, r, s, v)
      .send({ from: web3Account.value })
  }

  return {
    web3,
    web3Account,
    web3ChainId,
    isMetamaskConnected,
    isMetamaskEnabled,
    isCorrectNetwork,
    connectWeb3,
    initWeb3,
    loadWeb3Account,

    transferErc721,
    transferNative,
    burnErc20,
    transferErc20,
    mintErc20,
    mintErc721,
    withdrawErc20,
    withdrawWithNativeAbi,
    withdrawNative,
    withdrawErc721,
  }
}
