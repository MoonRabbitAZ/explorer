import { EVM_TOKEN_TRANSFERS_TYPES } from '@/js/const/evm-transaction-types.const'
import { useI18n } from 'vue-i18n'

export function useTokenTransferType (type) {
  const { t } = useI18n()
  let translation

  switch (type) {
    case EVM_TOKEN_TRANSFERS_TYPES.burning:
      translation = t('evm-explorer-page.use-token-transfer-type.burning-type')
      break
    case EVM_TOKEN_TRANSFERS_TYPES.spawning:
      translation = t('evm-explorer-page.use-token-transfer-type.spawning-type')
      break
    case EVM_TOKEN_TRANSFERS_TYPES.minting:
      translation = t('evm-explorer-page.use-token-transfer-type.minting-type')
      break
    case EVM_TOKEN_TRANSFERS_TYPES.transfer:
      translation = t('evm-explorer-page.use-token-transfer-type.transfer-type')
      break
    default:
      translation = 'Unknown type'
  }

  return translation
}
