import { EVM_TRANSACTION_TYPES } from '@/js/const/evm-types.const'
import { useI18n } from 'vue-i18n'

export function useTransactionType (type) {
  const { t } = useI18n()
  let translation

  switch (type) {
    case EVM_TRANSACTION_TYPES.tokenBurning:
      translation = t('evm-explorer-page.use-transaction-type.token-burning-type')
      break
    case EVM_TRANSACTION_TYPES.tokenCreation:
      translation = t('evm-explorer-page.use-transaction-type.token-creation-type')
      break
    case EVM_TRANSACTION_TYPES.tokenMinting:
      translation = t('evm-explorer-page.use-transaction-type.token-minting-type')
      break
    case EVM_TRANSACTION_TYPES.tokenTransfer:
      translation = t('evm-explorer-page.use-transaction-type.token-transfer-type')
      break
    case EVM_TRANSACTION_TYPES.contractCreation:
      translation = t('evm-explorer-page.use-transaction-type.contract-creation-type')
      break
    case EVM_TRANSACTION_TYPES.contractCall:
      translation = t('evm-explorer-page.use-transaction-type.contract-call-type')
      break
    case EVM_TRANSACTION_TYPES.transaction:
      translation = t('evm-explorer-page.use-transaction-type.transaction-type')
      break
    default:
      translation = 'Unknown type'
  }

  return translation
}
