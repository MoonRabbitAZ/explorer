/**
 * General runtime error
 */
export class RuntimeError extends Error { }

/**
  * Metamask plugin doesn't installed
  */
export class MetamaskNotFoundError extends RuntimeError {}

/**
  * Network error
  */
export class NetworkError extends Error {
  constructor (message, ...params) {
    super(...params)
    this.name = 'NetworkError'
    this.message = message
  }
}

/**
  * Transaction error
  */
export class TransactionError extends Error {
  constructor (message, ...params) {
    super(...params)
    this.name = 'TransactionError'
    this.message = message
  }
}
