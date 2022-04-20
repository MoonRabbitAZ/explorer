import { vueRoutes } from '@/vue-router/routes'
import { isHex } from '@polkadot/util'

function evmExplorerBlockGuard (to, from, next) {
  if (to.query?.hash) {
    isHex(to.query.hash, 256)
      ? next()
      : next(vueRoutes.evmExplorerSearchError)
  } else if (to.query?.blockNumber) {
    typeof +to.query.blockNumber === 'number' && !isNaN(+to.query.blockNumber)
      ? next()
      : next(vueRoutes.evmExplorerSearchError)
  } else {
    next(vueRoutes.evmExplorerOverview)
  }
}

function evmExplorerAddressGuard (to, from, next) {
  if (to.query?.hash) {
    isHex(to.query.hash, 160)
      ? next()
      : next(vueRoutes.evmExplorerSearchError)
  } else {
    next(vueRoutes.evmExplorerOverview)
  }
}

function evmExplorerTransactionGuard (to, from, next) {
  if (to.query?.hash) {
    isHex(to.query.hash, 256)
      ? next()
      : next(vueRoutes.evmExplorerSearchError)
  } else {
    next(vueRoutes.evmExplorerOverview)
  }
}

export default {
  evmExplorerBlockGuard,
  evmExplorerAddressGuard,
  evmExplorerTransactionGuard,
}
