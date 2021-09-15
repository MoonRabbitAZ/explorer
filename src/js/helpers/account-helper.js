import { keyring } from '@polkadot/ui-keyring'

export const getName = (accountId) => {
  return keyring.getAddress(accountId, null)?.meta?.name || ''
}

export const getAddress = (accountId) => {
  const stringAccountId = accountId.toString()
  const name = getName(stringAccountId)
  const address = name || stringAccountId
  return address
}

export function getAccountPair (signAddress, signPassword) {
  let publicKey

  try {
    publicKey = keyring.decodeAddress(signAddress)
  } catch (error) {
    throw new Error(error)
  }

  const pair = keyring.getPair(publicKey)

  return pair
}

export function unlockAccount (pair, password) {
  if (pair.meta.isTesting) return
  pair.decodePkcs8(password)
}

export function lockAccount (pair) {
  if (pair.meta.isTesting) return
  pair.lock()
}
