import { EVM_TOKEN_TRANSFERS_TYPES } from '@/js/const/evm-transaction-types.const'
import { useI18n } from 'vue-i18n'

export function useTokenTransferType (type) {
  const { t } = useI18n()
  let translation

  switch (type) {
    case EVM_TOKEN_TRANSFERS_TYPES.burning:
      translation = t('evm-explorer-page.evm-token-transfer-full-row.burning-type')
      break
    case EVM_TOKEN_TRANSFERS_TYPES.spawning:
      translation = t('evm-explorer-page.evm-token-transfer-full-row.spawning-type')
      break
    case EVM_TOKEN_TRANSFERS_TYPES.minting:
      translation = t('evm-explorer-page.evm-token-transfer-full-row.minting-type')
      break
    case EVM_TOKEN_TRANSFERS_TYPES.transfer:
      translation = t('evm-explorer-page.evm-token-transfer-full-row.transfer-type')
      break
    default:
      translation = 'undefined'
  }

  return translation
}
