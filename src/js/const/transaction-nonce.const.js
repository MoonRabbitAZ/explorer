/**
 * @description The system.account query will always contain the current state,
 * i.e. it will reflect the nonce for the last known block. As a convenience
 * function, the accountNextIndex can be omitted by specifying a nonce of -1,
 * allow the API to do the lookup.
 *
 * @example
 * for (let i = 0; i < 10; i++) {
 *    const txhash = await api.tx.balances
 *      .transfer(recipient, 123)
 *      .signAndSend(sender, { nonce: -1 });
 *  }
 */

export const DEFAULT_TRANSACTION_NONCE = -1
